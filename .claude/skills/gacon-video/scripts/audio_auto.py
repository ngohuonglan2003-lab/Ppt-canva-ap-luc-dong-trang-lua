"""Âm thanh tự động từ meta: python3 audio_auto.py ep_meta.json out.wav
Nhạc nền + intro + chim/gió (trừ tập có "indoor"/"night" trong EP.SFX tên 'noambience') + hiệu ứng EP.SFX + vỗ tay + outro."""
import sys,json; sys.path.insert(0,'.')
from sfxlib import *
m=json.load(open(sys.argv[1])); T=Track(m['dur']); names=[n for _,n,_ in m['sfx']]
music(T,seed_variant=len(m['caps'])%2, bpm=72 if 'lullaby' in names else 110); T.mus*=0.85
intro_sfx(T)
if 'noambience' not in names: ambience(T)
LIB={'pop':pop,'ting':ting,'boing':boing,'thud':thud,'whoosh':whoosh,'splash':splash,'bubbles':bubbles,'quack':quack,'step':step,'chirp':chirp,
     'rustle':rustle,'crack':crack,'munch':munch,'bells':bells,'clap':clap,'tick':tick,'boom':boom,'crackle':crackle,'inflate':inflate,'deflate':deflate,'gong':gong,'ribbit':ribbit,'drip':drip}
for t,n,g in m['sfx']:
    if n in ('noambience','lullaby'): continue
    if n=='applause': applause(T,t,2.4); continue
    if n.startswith('ting'): T.add('sfx',t,ting(float(n[4:] or 1568)),g); continue
    T.add('sfx',t,LIB[n](),g)
outro_sfx(T,m['END']+m['INTRO']); T.write(sys.argv[2],mus_gain=0.28 if 'lullaby' in names else 0.33); print('ok',sys.argv[2])
