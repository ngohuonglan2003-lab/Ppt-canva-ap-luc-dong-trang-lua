"""Add slide transitions and staggered entrance animations to a pptxgenjs deck."""
import sys, re, zipfile, shutil
from lxml import etree

EMU = 914400
NS = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
SW, SH = 13.333, 7.5
STAGGER = 220   # ms between groups
DUR = 550

def q(tag):
    pre, t = tag.split(':')
    return '{%s}%s' % (NS[pre], t)

def info(el):
    c = el.find('.//p:cNvPr', NS)
    off = el.find('.//a:xfrm/a:off', NS); ext = el.find('.//a:xfrm/a:ext', NS)
    if c is None or off is None or ext is None:
        return None
    x, y = int(off.get('x')) / EMU, int(off.get('y')) / EMU
    w, h = int(ext.get('cx')) / EMU, int(ext.get('cy')) / EMU
    geom = el.find('.//a:prstGeom', NS)
    fill = el.find('./p:spPr/a:solidFill/a:srgbClr', NS)
    txt = ''.join(t.text or '' for t in el.findall('.//a:t', NS))
    sz = [int(r.get('sz')) for r in el.findall('.//a:rPr', NS) if r.get('sz')]
    return dict(el=el, id=c.get('id'), x=x, y=y, w=w, h=h, tag=etree.QName(el).localname,
                geom=geom.get('prst') if geom is not None else None,
                fill=fill.get('val').upper() if fill is not None else None,
                text=txt.strip(), size=max(sz) / 100 if sz else 0,
                hasTx=el.find('./p:txBody', NS) is not None)

def is_container(e):
    if e['tag'] != 'sp' or e['text']:
        return False
    if e['geom'] in ('roundRect', 'rect') and e['w'] >= 1.0 and e['h'] >= 0.6 and e['w'] * e['h'] < 60:
        return True
    if e['geom'] == 'ellipse' and e['w'] >= 0.5 and e['w'] < 1.7:
        return True
    return False

def effect_kind(e):
    if e['tag'] == 'sp' and not e['text'] and e['geom'] in ('roundRect', 'rect') and e['fill'] in ('148054', 'F4C542', 'FF6A4D'):
        if e['h'] <= 0.45 and e['w'] > 0.3:
            return 'wipeL'
        if e['h'] > e['w'] * 1.2 and e['w'] < 2:
            return 'wipeU'
    if e['tag'] == 'sp' and e['text'] and e['size'] >= 100:
        return 'flyL'
    return 'fade'

class Ids:
    def __init__(self): self.n = 2
    def next(self):
        self.n += 1; return self.n

def eff_xml(ids, e, kind, delay, first):
    node = 'afterEffect' if first else 'withEffect'
    sp = e['id']
    preset = {'fade': ('10', '0'), 'wipeL': ('22', '8'), 'wipeU': ('22', '4'), 'flyL': ('2', '8')}[kind]
    a, b2 = ids.next(), ids.next()
    out = (f'<p:par><p:cTn id="{a}" presetID="{preset[0]}" presetClass="entr" presetSubtype="{preset[1]}" fill="hold" '
           f'{"grpId=\"0\" " if e["hasTx"] else ""}nodeType="{node}"><p:stCondLst><p:cond delay="{delay}"/></p:stCondLst><p:childTnLst>'
           f'<p:set><p:cBhvr><p:cTn id="{b2}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
           f'<p:tgtEl><p:spTgt spid="{sp}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
           f'<p:to><p:strVal val="visible"/></p:to></p:set>')
    if kind == 'fade':
        out += (f'<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="{ids.next()}" dur="{DUR}"/>'
                f'<p:tgtEl><p:spTgt spid="{sp}"/></p:tgtEl></p:cBhvr></p:animEffect>')
    elif kind in ('wipeL', 'wipeU'):
        f = 'wipe(left)' if kind == 'wipeL' else 'wipe(down)'
        out += (f'<p:animEffect transition="in" filter="{f}"><p:cBhvr><p:cTn id="{ids.next()}" dur="800"/>'
                f'<p:tgtEl><p:spTgt spid="{sp}"/></p:tgtEl></p:cBhvr></p:animEffect>')
    elif kind == 'flyL':
        for attr, frm, to in (('ppt_x', '0-#ppt_w/2', '#ppt_x'), ('ppt_y', '#ppt_y', '#ppt_y')):
            out += (f'<p:anim calcmode="lin" valueType="num"><p:cBhvr additive="base"><p:cTn id="{ids.next()}" dur="700" fill="hold"/>'
                    f'<p:tgtEl><p:spTgt spid="{sp}"/></p:tgtEl><p:attrNameLst><p:attrName>{attr}</p:attrName></p:attrNameLst></p:cBhvr>'
                    f'<p:tavLst><p:tav tm="0"><p:val><p:strVal val="{frm}"/></p:val></p:tav>'
                    f'<p:tav tm="100000"><p:val><p:strVal val="{to}"/></p:val></p:tav></p:tavLst></p:anim>')
    out += '</p:childTnLst></p:cTn></p:par>'
    return out

def process(xml, slide_no):
    root = etree.fromstring(xml)
    bg = root.find('.//p:bg//a:srgbClr', NS)
    lightbg = bg is not None and bg.get('val').upper() == 'F7F9F7'
    has_photo_bg = root.find('.//p:bg//a:blip', NS) is not None
    tree = root.find('.//p:spTree', NS)
    els = [info(c) for c in tree if etree.QName(c).localname in ('sp', 'pic', 'cxnSp')]
    els = [e for e in els if e]

    def static(e):
        if e['y'] >= 6.9 and e['h'] < 0.5:            # page number, source
            return True
        if lightbg and e['y'] < 1.65:                 # kicker, title, chip, dot grid
            return True
        if lightbg and e['x'] > 12 and e['y'] > 6:    # corner decoration
            return True
        return False

    groups = []          # list of (key_y, key_x, [els])
    containers = []      # (e, group)
    rows = []
    for e in els:
        if static(e):
            continue
        cx, cy = e['x'] + e['w'] / 2, e['y'] + e['h'] / 2
        host = None
        for c, g in containers:
            if c['x'] - 0.02 <= cx <= c['x'] + c['w'] + 0.02 and c['y'] - 0.02 <= cy <= c['y'] + c['h'] + 0.02:
                host = g
                break   # first = outermost (earlier in z-order)
        if host is not None:
            host[2].append(e)
            continue
        if is_container(e):
            g = [e['y'], e['x'], [e]]
            groups.append(g); containers.append((e, g))
            continue
        # loose element: cluster by row
        placed = False
        for g in rows:
            if abs(g[3] - cy) < 0.22 and e['h'] < 1.2 and g[4] < 1.2:
                g[2].append(e); placed = True; break
        if not placed:
            g = [e['y'], e['x'], [e], cy, e['h']]
            groups.append(g); rows.append(g)
    if not groups:
        return None
    groups.sort(key=lambda g: (round(g[0] * 4) / 4, g[1]))

    ids = Ids()
    steps = ''
    first = True
    for i, g in enumerate(groups):
        delay = i * STAGGER
        for e in g[2]:
            steps += eff_xml(ids, e, effect_kind(e), delay, first)
            first = False
    timing = ('<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
              '<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
              f'<p:par><p:cTn id="{ids.next()}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/>'
              '<p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst>'
              f'<p:par><p:cTn id="{ids.next()}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
              + steps +
              '</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>'
              '</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
              '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
              '</p:childTnLst></p:cTn></p:par></p:tnLst>')
    bld = ''.join(f'<p:bldP spid="{e["id"]}" grpId="0" animBg="1"/>' for g in groups for e in g[2] if e['hasTx'])
    if bld:
        timing += f'<p:bldLst>{bld}</p:bldLst>'
    timing += '</p:timing>'
    if has_photo_bg or not lightbg:
        trans = '<p:transition spd="slow"><p:fade/></p:transition>' if slide_no in (1,) else '<p:transition spd="med"><p:push dir="u"/></p:transition>'
        if not has_photo_bg:
            trans = '<p:transition spd="med"><p:fade/></p:transition>'
    else:
        trans = '<p:transition spd="med"><p:fade/></p:transition>'
    return trans, timing, len(groups)

def main(src, dst):
    tmp = dst + '.tmp'
    zin = zipfile.ZipFile(src)
    zout = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED)
    for item in zin.infolist():
        data = zin.read(item.filename)
        m = re.match(r'ppt/slides/slide(\d+)\.xml$', item.filename)
        if m:
            s = data.decode('utf8')
            s = re.sub(r'<p:transition.*?</p:transition>|<p:timing>.*?</p:timing>', '', s, flags=re.S)
            r = process(s.encode('utf8'), int(m.group(1)))
            if r:
                trans, timing, ng = r
                ins = trans + timing
                if '<p:extLst>' in s.split('</p:clrMapOvr>')[-1]:
                    s = s.replace('</p:clrMapOvr>', '</p:clrMapOvr>' + ins, 1)
                else:
                    s = s.replace('</p:sld>', ins + '</p:sld>')
                print(f'slide {m.group(1)}: {ng} groups')
            data = s.encode('utf8')
        zout.writestr(item.filename, data, compress_type=zipfile.ZIP_DEFLATED)
    zout.close()
    shutil.move(tmp, dst)

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
