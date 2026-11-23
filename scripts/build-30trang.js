const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const React = require('react');
const RDS = require('react-dom/server');
const L = require('react-icons/lu');
const path = require('path');

const MEDIA = path.join(__dirname, '..', 'docx', 'word', 'media');
const OUT = path.join(__dirname, 'Ap-luc-30.pptx');
const NEW = path.join(__dirname, 'newimg');
const mp = (f) => path.isAbsolute(f) ? f : (f.startsWith('n') ? path.join(NEW, f) : path.join(MEDIA, f));

const W = 13.333, H = 7.5, M = 0.56;
const C = {
  bg: 'F7F9F7', dark: '0F3D2E', darker: '061A15', ink: '16352A', white: 'FFFFFF',
  gold: 'F4C542', green: '148054', coral: 'FF6A4D', muted: '5B6F66', track: 'E3EAE5',
  soft: 'C9D6CF', mint: 'E7F2EC',
};
const F = 'Arial';
const FA = 'Georgia';

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Áp lực đồng trang lứa ở học sinh khối 10 THPT Lương Thế Vinh';
pres.author = 'Nguyễn Văn Hào, Nguyễn Thị Hạnh Nguyên';
pres.theme = { headFontFace: F, bodyFontFace: F };

// ---------- assets ----------
const iconCache = {};
async function icon(name, color) {
  const key = name + color;
  if (iconCache[key]) return iconCache[key];
  const svg = RDS.renderToStaticMarkup(React.createElement(L[name], { size: 256, color: '#' + color, strokeWidth: 2.5 }));
  const buf = await sharp(Buffer.from(svg)).resize(160, 160).png().toBuffer();
  return (iconCache[key] = 'image/png;base64,' + buf.toString('base64'));
}
async function photo(file, wIn, hIn) {
  const wpx = Math.round(wIn * 160), hpx = Math.round(hIn * 160);
  const buf = await sharp(mp(file)).resize(wpx, hpx, { fit: 'cover', position: 'attention' }).jpeg({ quality: 82 }).toBuffer();
  return 'image/jpeg;base64,' + buf.toString('base64');
}
function dotsSvg(x0, y0, cols, rows, gap, r, color, op) {
  let o = '';
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) o += `<circle cx="${x0 + i * gap}" cy="${y0 + j * gap}" r="${r}" fill="${color}" fill-opacity="${op}"/>`;
  return o;
}
const DECOR = `
  <circle cx="1780" cy="160" r="300" fill="none" stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="2"/>
  <circle cx="1780" cy="160" r="420" fill="none" stroke="#FFFFFF" stroke-opacity="0.045" stroke-width="2"/>
  <circle cx="1780" cy="160" r="540" fill="none" stroke="#F4C542" stroke-opacity="0.09" stroke-width="2" stroke-dasharray="6 10"/>
  <circle cx="120" cy="1000" r="220" fill="none" stroke="#FFFFFF" stroke-opacity="0.05" stroke-width="2"/>`;
const GLOW = `<radialGradient id="glow" cx="0.92" cy="0.08" r="0.55"><stop offset="0" stop-color="#F4C542" stop-opacity="0.16"/><stop offset="1" stop-color="#F4C542" stop-opacity="0"/></radialGradient>
  <radialGradient id="glow2" cx="0.05" cy="0.95" r="0.45"><stop offset="0" stop-color="#1F8A5E" stop-opacity="0.35"/><stop offset="1" stop-color="#1F8A5E" stop-opacity="0"/></radialGradient>`;
async function sectionBg(photoFile) {
  const base = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0F3D2E"/><stop offset="1" stop-color="#061A15"/></linearGradient>${GLOW}</defs>
  <rect width="1920" height="1080" fill="url(#g)"/><rect width="1920" height="1080" fill="url(#glow2)"/></svg>`;
  const pw = 820, ph = 1080, px = 1920 - pw;
  const photoBuf = await sharp(mp(photoFile)).resize(pw, ph, { fit: 'cover', position: 'attention' })
    .grayscale().tint({ r: 70, g: 170, b: 125 }).modulate({ brightness: 0.85 }).toBuffer();
  const fade = `<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}"><defs>
    <linearGradient id="f" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0C3527" stop-opacity="1"/><stop offset="0.45" stop-color="#0C3527" stop-opacity="0.55"/><stop offset="1" stop-color="#0C3527" stop-opacity="0.15"/></linearGradient>
    <linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0.6" stop-color="#061A15" stop-opacity="0"/><stop offset="1" stop-color="#061A15" stop-opacity="0.75"/></linearGradient></defs>
    <rect width="${pw}" height="${ph}" fill="url(#f)"/><rect width="${pw}" height="${ph}" fill="url(#v)"/></svg>`;
  const photo = await sharp(photoBuf).composite([{ input: Buffer.from(fade) }]).toBuffer();
  const over = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs>${GLOW}</defs>
  <rect width="1920" height="1080" fill="url(#glow)"/>
  <circle cx="1500" cy="540" r="380" fill="none" stroke="#F4C542" stroke-opacity="0.35" stroke-width="3"/>
  <circle cx="1500" cy="540" r="440" fill="none" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="2" stroke-dasharray="4 12"/>
  ${dotsSvg(80, 60, 10, 4, 26, 3, '#FFFFFF', 0.10)}
  </svg>`;
  const full = await sharp(Buffer.from(base)).composite([{ input: photo, left: px, top: 0 }, { input: Buffer.from(over) }]).png().toBuffer();
  const buf = await sharp(full).resize(1600, 900).jpeg({ quality: 84 }).toBuffer();
  return 'image/jpeg;base64,' + buf.toString('base64');
}
async function dotGrid(color, op) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120">${dotsSvg(10, 10, 12, 5, 25, 3.2, color, op)}</svg>`;
  return 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
}
async function bgDark() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0F3D2E"/><stop offset="1" stop-color="#061A15"/></linearGradient>${GLOW}</defs>
  <rect width="1920" height="1080" fill="url(#g)"/><rect width="1920" height="1080" fill="url(#glow)"/><rect width="1920" height="1080" fill="url(#glow2)"/>
  ${DECOR}
  ${dotsSvg(1500, 900, 12, 4, 26, 3, '#FFFFFF', 0.08)}
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).resize(1600, 900).jpeg({ quality: 82 }).toBuffer();
  return 'image/jpeg;base64,' + buf.toString('base64');
}
async function donut(pct, color) {
  const r = 230, c = 2 * Math.PI * r, len = c * pct / 100;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
  <circle cx="300" cy="300" r="${r}" fill="none" stroke="#E3EAE5" stroke-width="60"/>
  <circle cx="300" cy="300" r="${r}" fill="none" stroke="#${color}" stroke-width="60" stroke-dasharray="${len} ${c}" transform="rotate(-90 300 300)" stroke-linecap="butt"/>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}

// ---------- helpers ----------
let pageNo = 0;
let BG, DOTS, SECBG = {}, curSec = null;
const SECTIONS = ['Mở đầu', 'Tổng quan', 'Phương pháp', 'Thực trạng', 'Ảnh hưởng', 'Giải pháp', 'Đánh giá'];
function txt(s, text, x, y, w, h, o = {}) {
  s.addText(text, Object.assign({ x, y, w, h, fontFace: F, fontSize: 18, color: C.ink, margin: 0, valign: 'top', isTextBox: true, paraSpaceAfter: 0 }, o));
}
function shadow() { return { type: 'outer', blur: 14, offset: 4, angle: 90, color: '000000', opacity: 0.12 }; }
function card(s, x, y, w, h, fill = C.white) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.22, fill: { color: fill }, line: { color: 'E1E8E4', width: 0.75 }, shadow: shadow() });
}
function dpanel(s, x, y, w, h) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.25, fill: { color: C.dark }, line: { color: C.white, width: 1, transparency: 84 }, shadow: { type: 'outer', blur: 18, offset: 5, angle: 90, color: '000000', opacity: 0.25 } });
}
async function iconCircle(s, name, x, y, d, bg, fg) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: bg }, line: { type: 'none' } });
  const p = d * 0.25;
  s.addImage({ data: await icon(name, fg), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
}
function numCircle(s, n, x, y, d, bg, fg, size = 20) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: bg }, line: { type: 'none' } });
  txt(s, String(n), x, y, d, d, { align: 'center', valign: 'middle', fontSize: size, bold: true, color: fg });
}
function pageNum(s, dark) {
  txt(s, String(pageNo), W - M - 0.6, H - 0.48, 0.6, 0.3, { align: 'right', fontSize: 12, color: dark ? C.soft : C.muted });
}
function source(s, t, dark) {
  txt(s, t, M, H - 0.48, 9, 0.3, { fontSize: 12, color: dark ? C.soft : C.muted, italic: true });
}
function light(kicker, title, notes) {
  pageNo++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  s.addImage({ data: DOTS, x: W - 2.25, y: 0.12, w: 2.0, h: 0.8 });
  s.addShape(pres.shapes.OVAL, { x: W - 0.9, y: H - 1.1, w: 1.8, h: 1.8, fill: { color: C.mint }, line: { type: 'none' } });
  if (curSec) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: W - M - 2.35, y: 0.36, w: 2.35, h: 0.36, rectRadius: 0.18, fill: { color: C.dark }, line: { type: 'none' } });
    txt(s, [b(curSec[0] + '  ', { color: C.gold }), n(curSec[1].toUpperCase(), { color: C.white })], W - M - 2.35, 0.36, 2.35, 0.36, { fontSize: 11, bold: true, align: 'center', valign: 'middle' });
  }
  txt(s, kicker.toUpperCase(), M, 0.42, 9.5, 0.3, { fontSize: 13, bold: true, color: C.green });
  txt(s, title, M, 0.74, W - 2 * M, 0.85, { fontSize: 32, bold: true, color: C.ink, valign: 'middle', fit: 'shrink' });
  pageNum(s, false);
  if (notes) s.addNotes(notes);
  return s;
}
function dark(notes) {
  pageNo++;
  const s = pres.addSlide();
  s.background = { data: BG };
  pageNum(s, true);
  if (notes) s.addNotes(notes);
  return s;
}
function section(num, name, sub, notes) {
  pageNo++;
  const s = pres.addSlide();
  s.background = { data: SECBG[num] };
  pageNum(s, true);
  if (notes) s.addNotes(notes);
  const idx = parseInt(num, 10) - 1;
  curSec = ['Phần ' + num, SECTIONS[idx]];
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 0.75, w: 1.55, h: 0.42, rectRadius: 0.21, fill: { color: C.gold }, line: { type: 'none' } });
  txt(s, 'PHẦN ' + num + ' / 07', M, 0.75, 1.55, 0.42, { fontSize: 12, bold: true, color: C.darker, align: 'center', valign: 'middle' });
  txt(s, num, M - 0.05, 1.3, 4.5, 1.9, { fontSize: 140, bold: true, color: C.gold, valign: 'middle' });
  txt(s, name, M, 3.25, 7.3, 1.6, { fontSize: 42, bold: true, color: C.white, valign: 'top' });
  txt(s, sub, M, 4.95, 7.2, 0.8, { fontSize: 18, color: C.soft });
  // progress tracker
  const tx = M, tw = 7.4, step = tw / 6, ty = 6.15;
  s.addShape(pres.shapes.LINE, { x: tx + 0.14, y: ty + 0.14, w: tw, h: 0, line: { color: C.white, width: 1, transparency: 70 } });
  for (let i = 0; i < 7; i++) {
    const cx = tx + i * step;
    const on = i === idx, done = i < idx;
    s.addShape(pres.shapes.OVAL, { x: cx, y: ty, w: 0.28, h: 0.28, fill: { color: on ? C.gold : (done ? C.green : C.dark) }, line: { color: on ? C.gold : C.soft, width: 1 } });
    txt(s, SECTIONS[i], cx - 0.45, ty + 0.36, 1.2, 0.3, { fontSize: 11, bold: on, color: on ? C.gold : C.soft, align: 'center' });
  }
  return s;
}
function bullets(s, items, x, y, w, h, o = {}) {
  const arr = items.map((t, i) => ({ text: t, options: { bullet: { indent: 18 }, breakLine: i < items.length - 1, paraSpaceAfter: o.gap || 10 } }));
  txt(s, arr, x, y, w, h, Object.assign({ fontSize: 18 }, o));
}
// rich text run helpers
const b = (t, o = {}) => ({ text: t, options: Object.assign({ bold: true }, o) });
const n = (t, o = {}) => ({ text: t, options: o });

const VH = 'Người trình bày: Nguyễn Văn Hào.\n';
const HN = 'Người trình bày: Nguyễn Thị Hạnh Nguyên.\n';


async function pic(s, file, x, y, w, h, cap, onDark) {
  s.addShape(pres.shapes.RECTANGLE, { x: x - 0.06, y: y - 0.06, w: w + 0.12, h: h + 0.12, fill: { color: C.white }, line: { type: 'none' }, shadow: shadow() });
  s.addImage({ data: await photo(file, w, h), x, y, w, h });
  if (cap) txt(s, cap, x, y + h + 0.1, w, 0.32, { fontSize: 12, italic: true, align: 'center', color: onDark ? C.soft : C.muted });
}
async function contain(file, wIn, hIn, extract) {
  let img = sharp(mp(file));
  if (extract) img = img.extract(extract);
  const buf = await img.resize(Math.round(wIn * 160), Math.round(hIn * 160), { fit: 'cover', position: 'top' }).jpeg({ quality: 85 }).toBuffer();
  return 'image/jpeg;base64,' + buf.toString('base64');
}
function chip(sec, name) { curSec = ['Phần ' + sec, name]; }

(async () => {
  BG = await bgDark();
  DOTS = await dotGrid('#148054', 0.28);
  SECBG.video = await sectionBg('n7.jpg');
  SECBG.end = await sectionBg('n4.jpg');
  const SP = { '01': 'n4.jpg', '02': 'n8.jpg', '03': 'n9.jpg', '04': 'n3.jpg', '05': 'n7.jpg', '06': 'n6.jpg', '07': 'n5.jpg' };
  for (const k of Object.keys(SP)) SECBG[k] = await sectionBg(SP[k]);
  function stackBar(s, x, y, w, segs, colors) {
    let cx = x;
    segs.forEach((sg, i) => {
      const sw = w * sg[1] / 100;
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y, w: sw, h: 0.5, fill: { color: colors[i] }, line: { color: C.bg, width: 1.5 } });
      if (sw > 0.75) txt(s, sg[0], cx, y, sw, 0.5, { fontSize: 14, bold: true, align: 'center', valign: 'middle', color: colors[i] === C.gold ? C.ink : C.white });
      cx += sw;
    });
  }
  function legend(s, x, y, items, colors) {
    let cx = x;
    items.forEach((t, i) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: y + 0.08, w: 0.22, h: 0.22, rectRadius: 0.05, fill: { color: colors[i] }, line: { type: 'none' } });
      txt(s, t, cx + 0.3, y, 4.2, 0.38, { fontSize: 13, color: C.muted, valign: 'middle' });
      cx += 0.7 + t.length * 0.095;
    });
  }

  // 1. TITLE
  {
    const s = dark(VH + 'Kính thưa ban giám khảo, quý thầy cô. Chúng em là Nguyễn Văn Hào và Nguyễn Thị Hạnh Nguyên, lớp 10A11 Trường THPT Lương Thế Vinh, dưới sự hướng dẫn của cô Ngô Hải Yến. Chúng em xin trình bày dự án "Áp lực đồng trang lứa ở học sinh khối 10 THPT Lương Thế Vinh", lĩnh vực Khoa học xã hội và hành vi.');
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 0.62, w: 6.9, h: 0.46, rectRadius: 0.23, fill: { color: C.gold }, line: { type: 'none' } });
    txt(s, 'CUỘC THI NGHIÊN CỨU KHOA HỌC KỸ THUẬT · NĂM HỌC 2026–2027', M, 0.62, 6.9, 0.46, { fontSize: 13, bold: true, color: C.darker, align: 'center', valign: 'middle' });
    txt(s, 'BÁO CÁO DỰ ÁN · LĨNH VỰC KHOA HỌC XÃ HỘI VÀ HÀNH VI', M, 1.42, 8, 0.35, { fontSize: 14, bold: true, color: C.soft });
    txt(s, 'Áp lực đồng trang lứa', M, 1.85, 7.9, 1.15, { fontSize: 50, bold: true, color: C.white, valign: 'middle' });
    txt(s, 'ở học sinh khối 10 THPT Lương Thế Vinh', M, 2.95, 7.6, 0.8, { fontSize: 27, bold: true, color: C.white, valign: 'middle' });
    txt(s, 'peer pressure', M, 3.8, 6, 0.7, { fontFace: FA, italic: true, fontSize: 34, color: C.gold, valign: 'middle' });
    txt(s, [b('Giáo viên hướng dẫn: ', { color: C.soft }), n('Cô Ngô Hải Yến', { color: C.white })], M, 5.35, 7.5, 0.4, { fontSize: 18 });
    txt(s, 'Trường THPT Lương Thế Vinh · Quảng Trị, tháng 11/2026', M, 5.85, 7.5, 0.4, { fontSize: 16, color: C.soft });
    const xs = [8.55, 11.0], names = ['Nguyễn Văn Hào', 'Nguyễn Thị Hạnh Nguyên'];
    for (let i = 0; i < 2; i++) {
      s.addShape(pres.shapes.OVAL, { x: xs[i], y: 2.0, w: 1.95, h: 1.95, fill: { color: C.white, transparency: 92 }, line: { color: C.gold, width: 2, dashType: 'dash' } });
      txt(s, 'Ảnh chân dung', xs[i], 2.0, 1.95, 1.95, { fontSize: 12, color: C.soft, align: 'center', valign: 'middle' });
      txt(s, names[i], xs[i] - 0.25, 4.1, 2.45, 0.7, { fontSize: 17, bold: true, color: C.white, align: 'center', valign: 'middle' });
      txt(s, 'Lớp 10A11', xs[i] - 0.25, 4.82, 2.45, 0.35, { fontSize: 14, bold: true, color: C.gold, align: 'center' });
    }
  }

  // 2. VIDEO
  {
    pageNo++;
    const s = pres.addSlide();
    s.background = { data: SECBG.video };
    pageNum(s, true);
    s.addNotes(VH + 'Mời quý thầy cô cùng xem một video ngắn về áp lực đồng trang lứa. (Chiếu video.) Có lẽ ai trong chúng ta cũng từng mệt mỏi khi so sánh mình với bạn bè. Đó chính là vấn đề nhóm muốn tìm hiểu.');
    txt(s, 'VIDEO MỞ ĐẦU', M, 0.75, 5, 0.35, { fontSize: 14, bold: true, color: C.gold });
    txt(s, 'Bạn đã bao giờ thấy mệt mỏi khi so sánh mình với bạn bè?', M, 1.25, 4.6, 2.4, { fontSize: 32, bold: true, color: C.white });
    txt(s, [n('Nguồn video: '), n('youtu.be/M0eFKH_FUDI', { hyperlink: { url: 'https://youtu.be/M0eFKH_FUDI' }, color: C.gold })], M, 4.0, 4.6, 0.35, { fontSize: 14, color: C.soft });
    dpanel(s, 5.55, 1.05, 7.2, 4.95);
    s.addShape(pres.shapes.OVAL, { x: 8.55, y: 2.92, w: 1.2, h: 1.2, fill: { color: C.gold }, line: { type: 'none' } });
    s.addImage({ data: await icon('LuPlay', C.darker), x: 8.85, y: 3.22, w: 0.6, h: 0.6 });
    txt(s, 'Chèn video tại đây (Chèn → Video)', 5.55, 5.35, 7.2, 0.4, { fontSize: 13, color: C.soft, align: 'center' });
  }

  // 3. LÝ DO + MỤC TIÊU
  section('01', 'Mở đầu', 'Lý do chọn đề tài · Mục tiêu nghiên cứu', VH + 'Phần thứ nhất: mở đầu.');
  {
    const s = light('Mở đầu', 'Lý do chọn đề tài và mục tiêu nghiên cứu', VH + 'Lớp 10 là cột mốc chuyển tiếp: các bạn định hình bản thân, muốn được nhóm bạn công nhận nên dễ bị chi phối. Tại khối 10 trường mình, nhiều bạn chạy đua học tập, ngoại hình, chạy theo trào lưu mạng xã hội; trong khi phụ huynh bận rộn, ít lắng nghe. Nếu không hỗ trợ kịp thời, áp lực dễ gây căng thẳng, tự ti, sa sút học tập. Vì vậy đề tài có 3 mục tiêu: nhận diện thực trạng và nguyên nhân, mô hình hóa tác động, và đề xuất giải pháp.');
    const r = [['LuGraduationCap', 'Lớp 10 là cột mốc chuyển tiếp, dễ bị nhóm bạn chi phối'], ['LuChartBar', 'Chạy đua học tập, ngoại hình; theo trào lưu mạng xã hội'], ['LuHouse', 'Phụ huynh bận rộn, ít thời gian lắng nghe con'], ['LuTriangleAlert', 'Nguy cơ: căng thẳng kéo dài, tự ti, học tập sa sút']];
    txt(s, 'Lý do chọn đề tài', M, 1.9, 6, 0.4, { fontSize: 18, bold: true, color: C.green });
    for (let i = 0; i < 4; i++) {
      const y = 2.45 + i * 1.0;
      card(s, M, y, 6.2, 0.85);
      await iconCircle(s, r[i][0], M + 0.18, y + 0.13, 0.6, i === 3 ? 'FFE6E0' : C.mint, i === 3 ? C.coral : C.green);
      txt(s, r[i][1], M + 0.95, y, 5.1, 0.85, { fontSize: 16, valign: 'middle' });
    }
    dpanel(s, 7.2, 1.9, 5.57, 4.5);
    txt(s, 'Mục tiêu', 7.6, 2.15, 4.8, 0.7, { fontFace: FA, italic: true, fontSize: 32, color: C.gold });
    const g = [['Nhận diện', 'mức độ, biểu hiện, nguyên nhân của áp lực'], ['Mô hình hóa', 'tác động đến sức khỏe tâm lý, học tập'], ['Đề xuất', 'giải pháp cho nhà trường, giáo viên, phụ huynh']];
    for (let i = 0; i < 3; i++) {
      const y = 3.05 + i * 1.08;
      numCircle(s, i + 1, 7.6, y, 0.62, i === 0 ? C.gold : '1D5A45', i === 0 ? C.darker : C.white, 18);
      txt(s, g[i][0], 8.4, y - 0.05, 4.1, 0.4, { fontSize: 19, bold: true, color: C.white });
      txt(s, g[i][1], 8.4, y + 0.35, 4.1, 0.4, { fontSize: 15, color: C.soft });
    }
  }

  // 4. CƠ SỞ LÝ LUẬN + CÂU HỎI
  section('02', 'Tổng quan', 'Cơ sở lý luận · Câu hỏi nghiên cứu', VH + 'Phần thứ hai: tổng quan.');
  {
    const s = light('Tổng quan', 'Cơ sở lý luận và câu hỏi nghiên cứu', VH + 'Áp lực đồng trang lứa là áp lực tâm lý xuất hiện khi một người chịu tác động từ những người cùng lứa tuổi, cùng nhóm được cho là thành công hơn. Học sinh lớp 10, 15 đến 16 tuổi, vừa muốn được tôn trọng vừa muốn thuộc về một nhóm, nên rất dễ chịu áp lực này. Nhóm đặt ra 4 câu hỏi nghiên cứu như trên màn hình.');
    dpanel(s, M, 1.9, 5.9, 3.0);
    txt(s, 'Peer pressure', M + 0.4, 2.1, 5, 0.7, { fontFace: FA, italic: true, fontSize: 32, color: C.gold });
    txt(s, 'Áp lực tâm lý xuất hiện khi một người chịu tác động trực tiếp hoặc gián tiếp từ những người cùng lứa tuổi, cùng nhóm xã hội được cho là thành công hơn.', M + 0.4, 2.85, 5.1, 1.9, { fontSize: 17, color: C.white });
    card(s, M, 5.1, 5.9, 1.3);
    await iconCircle(s, 'LuUsers', M + 0.25, 5.38, 0.75, C.mint, C.green);
    txt(s, [b('Học sinh lớp 10 (15–16 tuổi): '), n('vừa muốn được tôn trọng, vừa muốn thuộc về một nhóm.')], M + 1.2, 5.1, 4.5, 1.3, { fontSize: 15, valign: 'middle' });
    source(s, 'Khái niệm áp lực tâm lý: Lazarus & Folkman (1984)');
    const q = ['Áp lực đồng trang lứa tác động thế nào đến học sinh lớp 10?', 'Học sinh khối 10 suy nghĩ, hành động ra sao trước áp lực?', 'Nguyên nhân, biểu hiện và ảnh hưởng của áp lực là gì?', 'Giải pháp nào giúp học sinh có tư duy đúng đắn?'];
    for (let i = 0; i < 4; i++) {
      const y = 1.9 + i * 1.15;
      card(s, 6.75, y, 6.02, 1.0);
      txt(s, 'CH' + (i + 1), 6.95, y, 0.9, 1.0, { fontSize: 22, bold: true, color: i === 0 ? C.gold : C.green, valign: 'middle' });
      txt(s, q[i], 7.85, y, 4.75, 1.0, { fontSize: 15, valign: 'middle' });
    }
  }

  // 5. ĐỐI TƯỢNG + PHƯƠNG PHÁP
  section('03', 'Đối tượng và phương pháp', 'Khách thể khảo sát · 5 phương pháp · Tiến trình', VH + 'Phần thứ ba: đối tượng và phương pháp nghiên cứu.');
  {
    const s = light('Đối tượng và phương pháp', 'Khảo sát 375 người, phối hợp 5 phương pháp', VH + 'Nhóm khảo sát 230 học sinh khối 10 bằng bảng hỏi về biểu hiện, phỏng vấn nhanh 100 học sinh về nguyên nhân và khảo sát 45 phụ huynh. Nhóm phối hợp 5 phương pháp: nghiên cứu tài liệu, điều tra bảng hỏi, phỏng vấn sâu, thống kê bằng Excel và SPSS, và thực nghiệm giải pháp. Tiến trình kéo dài từ tháng 9 đến tháng 11 năm 2026.');
    const st = [['230', 'học sinh khối 10', 'bảng hỏi về biểu hiện'], ['100', 'học sinh khối 10', 'phỏng vấn về nguyên nhân'], ['45', 'phụ huynh', 'khảo sát cách đồng hành']];
    for (let i = 0; i < 3; i++) {
      const y = 1.9 + i * 1.18;
      card(s, M, y, 3.7, 1.03);
      txt(s, st[i][0], M + 0.2, y, 1.3, 1.03, { fontSize: 34, bold: true, color: i === 0 ? C.gold : C.green, valign: 'middle' });
      txt(s, st[i][1], M + 1.5, y + 0.17, 2.1, 0.35, { fontSize: 15, bold: true });
      txt(s, st[i][2], M + 1.5, y + 0.53, 2.1, 0.35, { fontSize: 13, color: C.muted });
    }
    const m = [['LuBookOpen', 'Nghiên cứu tài liệu'], ['LuClipboardList', 'Điều tra bảng hỏi'], ['LuMessageCircle', 'Phỏng vấn sâu'], ['LuCalculator', 'Thống kê (Excel, SPSS)'], ['LuFlaskConical', 'Thực nghiệm giải pháp']];
    for (let i = 0; i < 5; i++) {
      const y = 1.9 + i * 0.7;
      await iconCircle(s, m[i][0], 4.55, y, 0.56, i === 4 ? C.gold : C.dark, i === 4 ? C.darker : C.gold);
      txt(s, m[i][1], 5.25, y, 3.3, 0.56, { fontSize: 16, bold: true, valign: 'middle' });
    }
    dpanel(s, M, 5.55, 8.0, 0.85);
    txt(s, [b('Tiến trình: ', { color: C.gold }), n('9/2026 tài liệu → 10/2026 khảo sát, phân tích → 11/2026 thực nghiệm', { color: C.white })], M + 0.3, 5.55, 7.5, 0.85, { fontSize: 15, valign: 'middle' });
    await pic(s, 'n9.jpg', 9.0, 1.9, 3.77, 4.15, 'Phát phiếu khảo sát tại lớp khối 10');
  }

  // 6. BIỂU HIỆN
  // TIẾN TRÌNH
  {
    const s = light('Đối tượng và phương pháp · Tiến trình', 'Ba giai đoạn từ tháng 9 đến tháng 11/2026', VH + 'Tháng 9: nghiên cứu tài liệu, hoàn thành đề cương. Tháng 10: lập phiếu, khảo sát và phỏng vấn, phân tích số liệu. Tháng 11: triển khai thực nghiệm, khảo sát lần 2 và hoàn thành đề tài.');
    const steps = [['Tháng 9/2026', 'Nghiên cứu tài liệu', ['Xây dựng cơ sở lý luận', 'Hoàn thành đề cương']], ['Tháng 10/2026', 'Khảo sát, phân tích', ['Lập phiếu, link khảo sát', 'Khảo sát, phỏng vấn học sinh, phụ huynh', 'Phân tích số liệu']], ['Tháng 11/2026', 'Thực nghiệm', ['Triển khai giải pháp', 'Khảo sát lần 2, đánh giá', 'Hoàn thành đề tài']]];
    const cx = [M + 1.7, W / 2, W - M - 1.7];
    s.addShape(pres.shapes.LINE, { x: cx[0], y: 2.45, w: cx[2] - cx[0], h: 0, line: { color: C.green, width: 2.5 } });
    for (let i = 0; i < 3; i++) {
      numCircle(s, i + 1, cx[i] - 0.45, 2.0, 0.9, i === 2 ? C.gold : C.green, i === 2 ? C.darker : C.white, 26);
      card(s, cx[i] - 1.85, 3.15, 3.7, 3.15);
      txt(s, steps[i][0], cx[i] - 1.6, 3.35, 3.2, 0.4, { fontSize: 15, bold: true, color: C.green });
      txt(s, steps[i][1], cx[i] - 1.6, 3.75, 3.2, 0.5, { fontSize: 21, bold: true });
      bullets(s, steps[i][2], cx[i] - 1.6, 4.35, 3.25, 1.85, { fontSize: 16, color: C.muted, gap: 6 });
    }
    source(s, 'Người thực hiện: Nguyễn Văn Hào, Nguyễn Thị Hạnh Nguyên (lớp 10A11)');
  }

  section('04', 'Thực trạng, biểu hiện và nguyên nhân', 'Khảo sát 230 học sinh · 100 học sinh · 45 phụ huynh', HN + 'Phần thứ tư: thực trạng, biểu hiện và nguyên nhân.');

  // HỒI CHUÔNG
  {
    const s = dark(HN + 'Thực tế đã có nhiều sự việc thương tâm liên quan đến áp lực học tập, như các trường hợp năm 2018, 2020, 2022 và 2023 trên màn hình. Đến năm 2026, khi cạnh tranh và nhịp sống số tăng lên, nhận diện áp lực tâm lý ở học sinh càng cấp thiết.');
    txt(s, 'THỰC TRẠNG CHUNG', M, 0.7, 6, 0.35, { fontSize: 14, bold: true, color: C.gold });
    txt(s, 'Hồi chuông cảnh báo về sức khỏe tinh thần học đường', M, 1.1, W - 2 * M, 0.9, { fontSize: 30, bold: true, color: C.white });
    const ev = [['04/2018', 'Nam sinh lớp 10 tại TP.HCM tử vong do sức ép tâm lý'], ['10/2020', 'Nữ sinh lớp 12 tự tử vì áp lực thi đại học'], ['04/2022', 'Nam sinh lớp 10 tại Hà Đông, Hà Nội tử vong do sức ép tâm lý'], ['03/2023', 'Thiếu niên 13 tuổi ở Long An nhập viện vì áp lực học tập']];
    const step = (W - 2 * M) / 4;
    s.addShape(pres.shapes.LINE, { x: M + step / 2, y: 2.95, w: step * 3, h: 0, line: { color: C.coral, width: 2 } });
    for (let i = 0; i < 4; i++) {
      const cx = M + step * i + step / 2;
      s.addShape(pres.shapes.OVAL, { x: cx - 0.17, y: 2.78, w: 0.34, h: 0.34, fill: { color: C.coral }, line: { type: 'none' } });
      dpanel(s, cx - step / 2 + 0.1, 3.4, step - 0.2, 2.35);
      txt(s, ev[i][0], cx - step / 2 + 0.35, 3.6, step - 0.7, 0.5, { fontSize: 24, bold: true, color: C.coral });
      txt(s, ev[i][1], cx - step / 2 + 0.35, 4.2, step - 0.7, 1.4, { fontSize: 16, color: C.white });
    }
    txt(s, 'Năm 2026: nhịp sống số và cạnh tranh tăng → nhận diện áp lực tâm lý ở học sinh càng cấp thiết.', M, 6.05, W - 2 * M, 0.45, { fontSize: 17, color: C.gold });
    source(s, 'Nguồn: các vụ việc được báo chí ghi nhận, tổng hợp trong báo cáo của nhóm', true);
  }
  {
    const s = light('Thực trạng · Biểu hiện', 'Áp lực đồng trang lứa phổ biến ở khối 10', HN + 'Kết quả khảo sát 230 học sinh cho thấy 80,43% đến 91,74% học sinh có biểu hiện áp lực đồng trang lứa. Cao nhất là sợ tụt lại phía sau, thua kém bạn bè: 211 bạn, 91,74%. Tiếp theo: thấy mình thật tệ khi bị điểm kém 86,96%; vui cho bạn nhưng buồn cho mình 85,22%; thói quen tự so sánh 81,74%. Đáng chú ý, áp lực còn ảnh hưởng cả giấc ngủ và ăn uống.');
    const d = [['Sợ tụt lại phía sau, thua kém bạn bè', 91.74, '91,74%'], ['Thấy mình thật tệ khi bị điểm kém', 86.96, '86,96%'], ['Vui cho bạn nhưng buồn cho mình', 85.22, '85,22%'], ['Thói quen tự so sánh với bạn cùng lứa', 81.74, '81,74%'], ['Căng thẳng khi quanh mình ai cũng giỏi', 80.43, '80,43%'], ['Mất ngủ, ăn không ngon khi điểm thấp hơn bạn', 80.43, '80,43%']];
    const lx = M, lw = 3.9, bx = M + 4.0, bw = 3.3;
    txt(s, 'Tỷ lệ học sinh trả lời “Có” (n = 230)', bx, 1.75, 4, 0.3, { fontSize: 13, color: C.muted });
    d.forEach((r, i) => {
      const y = 2.15 + i * 0.7;
      txt(s, r[0], lx, y, lw, 0.5, { fontSize: 15, valign: 'middle' });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: y + 0.1, w: bw, h: 0.3, rectRadius: 0.15, fill: { color: C.track }, line: { type: 'none' } });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: y + 0.1, w: bw * r[1] / 100, h: 0.3, rectRadius: 0.15, fill: { color: i === 0 ? C.gold : C.green }, line: { type: 'none' } });
      txt(s, r[2], bx + bw + 0.12, y, 1.1, 0.5, { fontSize: 16, bold: true, valign: 'middle', color: i === 0 ? C.ink : C.green });
    });
    dpanel(s, 9.25, 1.9, 3.52, 4.4);
    txt(s, 'Dao động', 9.55, 2.15, 3, 0.35, { fontSize: 15, bold: true, color: C.soft });
    txt(s, '80,43–91,74%', 9.55, 2.5, 3.05, 0.8, { fontSize: 30, bold: true, color: C.gold, valign: 'middle' });
    txt(s, 'học sinh khối 10 có biểu hiện áp lực, tùy từng khía cạnh', 9.55, 3.35, 2.95, 1.0, { fontSize: 15, color: C.white });
    txt(s, '211/230', 9.55, 4.55, 3, 0.55, { fontSize: 26, bold: true, color: C.white });
    txt(s, 'bạn sợ tụt lại phía sau, thua kém bạn bè', 9.55, 5.1, 2.95, 0.9, { fontSize: 14, color: C.soft });
    source(s, 'Nguồn: khảo sát học sinh khối 10 THPT Lương Thế Vinh của nhóm nghiên cứu, n = 230, năm 2026');
  }

  // 7. NGUYÊN NHÂN – HỌC SINH
  {
    const s = light('Thực trạng · Nguyên nhân', 'Học sinh nhận diện nguyên nhân áp lực', HN + 'Phỏng vấn nhanh 100 học sinh, 75% đến 90% đồng tình với các nhóm nguyên nhân. Cao nhất là so sánh trên mạng xã hội 90%, bị gia đình, thầy cô so sánh 88%, môi trường lớp học 85%, kỳ vọng cao 77% và tâm lý tự ti 75%. Bạn Ngô Quốc Hiếu chia sẻ: "Nguyên nhân chính là do mình thôi… mình lại rất muốn hòa nhập giống bạn bè".');
    const d = [['Mạng xã hội', 90], ['Gia đình, thầy cô so sánh', 88], ['Lớp học, nhóm bạn', 85], ['Kỳ vọng cao', 77], ['Tự ti, sợ bị bỏ rơi', 75]];
    const baseY = 5.65, maxH = 3.1, cw = 1.0, gap = (7.3 - 5 * cw) / 4;
    d.forEach((r, i) => {
      const x = M + i * (cw + gap), h = maxH * r[1] / 100;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: baseY - h, w: cw, h, rectRadius: 0.1, fill: { color: i === 0 ? C.gold : C.green }, line: { type: 'none' } });
      txt(s, r[1] + '%', x - 0.2, baseY - h - 0.5, cw + 0.4, 0.45, { fontSize: 20, bold: true, align: 'center', color: i === 0 ? C.ink : C.green });
      txt(s, r[0], x - 0.3, baseY + 0.08, cw + 0.6, 0.6, { fontSize: 12, align: 'center' });
    });
    s.addShape(pres.shapes.LINE, { x: M, y: baseY, w: 7.3, h: 0, line: { color: C.soft, width: 1 } });
    await pic(s, 'n3.jpg', 8.3, 1.9, 4.47, 2.5);
    dpanel(s, 8.24, 4.6, 4.59, 1.8);
    txt(s, '“Nguyên nhân chính là do mình thôi… mình lại rất muốn hòa nhập giống bạn bè.”', 8.5, 4.75, 4.1, 1.05, { fontSize: 15, bold: true, color: C.white });
    txt(s, 'Ngô Quốc Hiếu · học sinh khối 10', 8.5, 5.85, 4.1, 0.35, { fontSize: 12, color: C.gold });
    source(s, 'Nguồn: phỏng vấn nhanh 100 học sinh khối 10 của nhóm nghiên cứu, năm 2026');
  }

  // 8. NGUYÊN NHÂN – PHỤ HUYNH
  {
    const s = light('Thực trạng · Nguyên nhân', 'Gia đình: nguồn áp lực vô hình', HN + 'Khảo sát 45 phụ huynh: 93,3% vẫn so sánh con với "con nhà người ta"; 77,8% chưa bao giờ hoặc hiếm khi chia sẻ với con; 73,3% chưa tìm hiểu hoặc chưa hiểu rõ sở thích, điểm mạnh của con. Ngoài ra 46,7% đặt kỳ vọng vượt khả năng của con và 57,8% khoe thành tích của con lên mạng xã hội. Đây là những sức ép vô hình đè lên học sinh.');
    const k = [['93,3%', 'vẫn so sánh con với “con nhà người ta”', 'Có nhưng ít 71,1% · thường xuyên 22,2% (42/45)'], ['77,8%', 'chưa bao giờ hoặc hiếm khi chia sẻ với con', 'Chưa bao giờ 31,1% · hiếm khi 46,7% (35/45)'], ['73,3%', 'chưa hiểu rõ sở thích, điểm mạnh của con', 'Chưa tìm hiểu 2,2% · có nhưng không rõ 71,1% (33/45)']];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 4.15;
      card(s, x, 1.9, 3.9, 2.75);
      txt(s, k[i][0], x + 0.3, 2.05, 3.3, 0.95, { fontSize: 46, bold: true, color: i === 0 ? C.gold : C.green, valign: 'middle' });
      txt(s, k[i][1], x + 0.3, 3.05, 3.3, 0.75, { fontSize: 16, bold: true });
      txt(s, k[i][2], x + 0.3, 3.85, 3.35, 0.65, { fontSize: 12, color: C.muted });
    }
    const k2 = [['46,7%', 'đặt tiêu chuẩn, kỳ vọng vượt quá khả năng của con (21/45)'], ['57,8%', 'khoe thành tích của con lên mạng xã hội (26/45)']];
    for (let i = 0; i < 2; i++) {
      const x = M + i * 6.2;
      dpanel(s, x, 4.9, 5.95, 1.45);
      txt(s, k2[i][0], x + 0.3, 4.9, 2.1, 1.45, { fontSize: 34, bold: true, color: C.coral, valign: 'middle' });
      txt(s, k2[i][1], x + 2.4, 4.9, 3.3, 1.45, { fontSize: 15, color: C.white, valign: 'middle' });
    }
    source(s, 'Nguồn: khảo sát 45 phụ huynh học sinh khối 10 của nhóm nghiên cứu, năm 2026');
  }

  // 9. ẢNH HƯỞNG
  // PHỤ HUYNH CHI TIẾT
  {
    const s = light('Thực trạng · Nguyên nhân từ phụ huynh', 'Chi tiết khảo sát 45 phụ huynh', HN + 'Chi tiết từng câu hỏi: 31,1% phụ huynh chưa bao giờ và 46,7% hiếm khi chia sẻ với con; 71,1% có so sánh nhưng ít, 22,2% thường xuyên so sánh; về sở thích, điểm mạnh của con, 2,2% chưa tìm hiểu, 71,1% có nhưng không rõ, chỉ 26,7% hiểu rõ.');
    const qs = [['Phụ huynh có bao giờ chia sẻ với con về những áp lực của con?', [['31,1%', 31.1], ['46,7%', 46.7], ['22,2%', 22.2]], [C.coral, C.gold, C.green], ['Chưa bao giờ: 31,1% (14)', 'Hiếm khi: 46,7% (21)', 'Thường xuyên: 22,2% (10)']],
      ['Phụ huynh có hay so sánh con mình với “con nhà người ta”?', [['6,7%', 6.7], ['71,1%', 71.1], ['22,2%', 22.2]], [C.green, C.gold, C.coral], ['Chưa bao giờ: 6,7% (3)', 'Có nhưng ít: 71,1% (32)', 'Thường xuyên: 22,2% (10)']],
      ['Phụ huynh có tìm hiểu về sở thích và điểm mạnh của con?', [['2,2%', 2.2], ['71,1%', 71.1], ['26,7%', 26.7]], [C.coral, C.gold, C.green], ['Chưa tìm hiểu: 2,2% (1)', 'Có nhưng không rõ: 71,1% (32)', 'Hiểu rõ: 26,7% (12)']]];
    for (let i = 0; i < 3; i++) {
      const y = 1.9 + i * 1.55;
      card(s, M, y, W - 2 * M, 1.4);
      txt(s, qs[i][0], M + 0.3, y + 0.1, 11.5, 0.4, { fontSize: 16, bold: true });
      stackBar(s, M + 0.3, y + 0.52, W - 2 * M - 0.6, qs[i][1], qs[i][2]);
      legend(s, M + 0.3, y + 1.02, qs[i][3], qs[i][2]);
    }
    source(s, 'Nguồn: khảo sát 45 phụ huynh học sinh khối 10 của nhóm nghiên cứu, năm 2026');
  }

  section('05', 'Ảnh hưởng của áp lực đồng trang lứa', 'Tích cực · Tiêu cực · Mô hình tác động', HN + 'Phần thứ năm: ảnh hưởng.');
  {
    const s = light('Ảnh hưởng', 'Ảnh hưởng tích cực và tiêu cực', HN + '"Gần mực thì đen, gần đèn thì rạng": khi bạn bè tích cực, áp lực có thể thành động lực học tập, lan tỏa hành vi tốt. Nhưng trên thực tế, ảnh hưởng tiêu cực rõ hơn: mất tự tin, đố kị với bạn bè, sức khỏe suy giảm và dễ bị cuốn theo cám dỗ, đua đòi.');
    dpanel(s, M, 1.9, 4.6, 4.5);
    txt(s, 'Tích cực', M + 0.4, 2.1, 3.8, 0.4, { fontSize: 15, bold: true, color: C.soft });
    txt(s, '“Gần mực thì đen, gần đèn thì rạng”', M + 0.4, 2.5, 3.9, 1.3, { fontFace: FA, italic: true, fontSize: 24, color: C.gold });
    bullets(s, ['Biến áp lực thành động lực học tập', 'Lan tỏa hành vi tích cực, tình nguyện', 'Có thể giúp tránh chất gây nghiện'], M + 0.4, 4.0, 3.9, 2.2, { fontSize: 15, color: C.white, gap: 8 });
    const g = [['LuFrown', 'Mất tự tin', 'Lệ thuộc người khác, nóng vội nên dễ thất bại'], ['LuMessagesSquare', 'Đố kị với bạn bè', 'Ghen tị vì so sánh, dễ tranh cãi, xa cách'], ['LuHeartPulse', 'Sức khỏe suy giảm', 'Thiếu ngủ, ăn uống kém, tinh thần sa sút'], ['LuTriangleAlert', 'Cuốn theo cám dỗ', 'Đua đòi, a dua, nguy cơ tệ nạn xã hội']];
    for (let i = 0; i < 4; i++) {
      const x = 5.45 + (i % 2) * 3.7, y = 1.9 + Math.floor(i / 2) * 2.3;
      card(s, x, y, 3.47, 2.15);
      await iconCircle(s, g[i][0], x + 0.25, y + 0.25, 0.7, 'FFE6E0', C.coral);
      txt(s, g[i][1], x + 0.25, y + 1.05, 3.0, 0.4, { fontSize: 17, bold: true });
      txt(s, g[i][2], x + 0.25, y + 1.45, 3.0, 0.6, { fontSize: 13, color: C.muted });
    }
  }

  // 10. MÔ HÌNH
  {
    const s = light('Ảnh hưởng · Mô hình hóa', 'Mô hình tác động của áp lực đồng trang lứa', HN + 'Tổng hợp lại, nhóm mô hình hóa như sau: gia đình, nhóm bạn, mạng xã hội và tâm lý tự ti tạo nên áp lực đồng trang lứa; áp lực biểu hiện qua cơ thể, cảm xúc, hành vi; hệ quả là ảnh hưởng đến sức khỏe tâm lý và hành vi học tập. Giải pháp của nhóm tác động vào từng mắt xích này.');
    const colX = [M, 3.85, 6.95, 10.05], cw = 2.72;
    ['NGUỒN TÁC ĐỘNG', 'ÁP LỰC', 'BIỂU HIỆN', 'HỆ QUẢ'].forEach((h, i) => txt(s, h, colX[i], 1.85, cw, 0.35, { fontSize: 13, bold: true, color: C.green, align: 'center' }));
    ['Gia đình: so sánh, kỳ vọng', 'Nhóm bạn, lớp học', 'Mạng xã hội', 'Tâm lý cá nhân: tự ti'].forEach((t, j) => { card(s, colX[0], 2.3 + j * 0.92, cw, 0.76); txt(s, t, colX[0] + 0.15, 2.3 + j * 0.92, cw - 0.3, 0.76, { fontSize: 15, bold: true, align: 'center', valign: 'middle' }); });
    dpanel(s, colX[1], 3.05, cw, 2.1);
    txt(s, 'Áp lực đồng trang lứa', colX[1] + 0.2, 3.05, cw - 0.4, 2.1, { fontSize: 22, bold: true, color: C.gold, align: 'center', valign: 'middle' });
    ['Cơ thể: mệt mỏi, mất ngủ', 'Cảm xúc: lo âu, tự ti', 'Hành vi: né tránh, đua đòi'].forEach((t, j) => { card(s, colX[2], 2.55 + j * 1.1, cw, 0.9); txt(s, t, colX[2] + 0.15, 2.55 + j * 1.1, cw - 0.3, 0.9, { fontSize: 15, bold: true, align: 'center', valign: 'middle' }); });
    ['Sức khỏe tâm lý', 'Hành vi học tập'].forEach((t, j) => { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: colX[3], y: 2.75 + j * 1.45, w: cw, h: 1.15, rectRadius: 0.2, fill: { color: 'FFE6E0' }, line: { color: C.coral, width: 1 } }); txt(s, t, colX[3] + 0.15, 2.75 + j * 1.45, cw - 0.3, 1.15, { fontSize: 17, bold: true, align: 'center', valign: 'middle' }); });
    for (let i = 0; i < 3; i++) { const x1 = colX[i] + cw + 0.05, x2 = colX[i + 1] - 0.05; s.addShape(pres.shapes.LINE, { x: x1, y: 4.1, w: x2 - x1, h: 0, line: { color: C.green, width: 2.5, endArrowType: 'triangle' } }); }
    card(s, M, 6.1, W - 2 * M, 0.6);
    txt(s, [b('Giải pháp ', { color: C.green }), n('tác động vào từng mắt xích: nguồn tác động, nhận thức, kỹ năng ứng phó và mạng lưới hỗ trợ.')], M + 0.3, 6.1, W - 2 * M - 0.6, 0.6, { fontSize: 16, valign: 'middle' });
    source(s, 'Sơ đồ do nhóm tổng hợp từ kết quả khảo sát và cơ sở lý luận (mục tiêu 2: mô hình hóa)');
  }

  // 11. GIẢI PHÁP HỌC SINH
  section('06', 'Hệ thống giải pháp', 'Học sinh · Gia đình · Nhà trường · Truyền thông và kết nối', VH + 'Phần thứ sáu: hệ thống giải pháp.');
  {
    const s = light('Giải pháp · Học sinh', 'Học sinh: hiểu đúng áp lực và “Neo cảm xúc”', VH + 'Với học sinh: hiểu bản chất hai mặt của áp lực để biến nó thành động lực, tích cực tham gia câu lạc bộ, và thực hành "Neo cảm xúc" gồm 6 kỹ năng trên màn hình. Khảo sát cho thấy 46% học sinh đã tự đề xuất được cách tự điều chỉnh, như bạn Nguyễn Khánh Chi lớp 10A11: "Bình tĩnh giải quyết vấn đề, cố gắng học tập tốt, suy nghĩ tích cực".');
    const k = [['LuPause', 'Tách cảm xúc khỏi hành động'], ['LuWind', 'Duy trì sự bình tĩnh'], ['LuShieldAlert', 'Kiểm soát bốc đồng'], ['LuNotebookPen', 'Viết ra cảm xúc'], ['LuMessageCircle', 'Lựa lời mà nói'], ['LuSmile', 'Nuôi dưỡng lạc quan']];
    txt(s, 'Neo cảm xúc: 6 kỹ năng', M, 1.85, 7, 0.4, { fontSize: 18, bold: true, color: C.green });
    for (let i = 0; i < 6; i++) {
      const x = M + (i % 2) * 3.8, y = 2.35 + Math.floor(i / 2) * 1.05;
      card(s, x, y, 3.6, 0.88);
      numCircle(s, i + 1, x + 0.18, y + 0.17, 0.54, i === 0 ? C.gold : C.dark, i === 0 ? C.darker : C.white, 15);
      txt(s, k[i][1], x + 0.9, y, 2.6, 0.88, { fontSize: 15, bold: true, valign: 'middle' });
    }
    card(s, M, 5.6, 7.4, 0.8);
    txt(s, [b('Nhận thức: ', { color: C.green }), n('hiểu hai mặt của áp lực, biến áp lực thành động lực, tham gia CLB lành mạnh.')], M + 0.25, 5.6, 7.0, 0.8, { fontSize: 14, valign: 'middle' });
    dpanel(s, 8.4, 1.9, 4.37, 4.5);
    txt(s, '46%', 8.75, 2.05, 3.6, 1.1, { fontSize: 60, bold: true, color: C.gold, valign: 'middle' });
    txt(s, 'học sinh tự đề xuất được cách tự điều chỉnh tâm lý', 8.75, 3.15, 3.7, 0.8, { fontSize: 15, color: C.white });
    txt(s, '“Bình tĩnh giải quyết vấn đề, cố gắng học tập tốt, suy nghĩ tích cực.”', 8.75, 4.1, 3.7, 1.2, { fontSize: 15, bold: true, color: C.white, italic: true });
    txt(s, 'Nguyễn Khánh Chi · lớp 10A11', 8.75, 5.4, 3.7, 0.35, { fontSize: 12, color: C.gold });
  }

  // 12. GIA ĐÌNH + NHÀ TRƯỜNG
  {
    const s = light('Giải pháp · Gia đình và nhà trường', 'Gia đình đồng hành, nhà trường tôn trọng khác biệt', VH + 'Với gia đình: cha mẹ không so sánh con với bạn bè, dành thời gian trò chuyện, lắng nghe thay vì áp đặt và kịp thời động viên. Với nhà trường: thầy cô khích lệ sự tiến bộ của từng bạn, tránh so sánh trực tiếp; đa dạng câu lạc bộ, hoạt động nhóm để học sinh giao lưu, hòa nhập.');
    const cols = [['LuHouse', 'Gia đình', ['Không đặt con lên bàn cân so sánh', 'Trò chuyện cởi mở về học đường', 'Lắng nghe thay vì áp đặt kỳ vọng', 'Kịp thời khích lệ, động viên']], ['LuSchool', 'Nhà trường', ['Khích lệ tiến bộ từng cá nhân', 'Tránh so sánh trực tiếp học sinh', 'Đa dạng CLB, hoạt động nhóm', 'Hộp thư và tổ tư vấn tâm lý']]];
    for (let i = 0; i < 2; i++) {
      const x = M + i * 4.1;
      card(s, x, 1.9, 3.9, 4.5);
      await iconCircle(s, cols[i][0], x + 0.3, 2.15, 0.8, i === 0 ? C.gold : C.mint, i === 0 ? C.darker : C.green);
      txt(s, cols[i][1], x + 1.25, 2.15, 2.5, 0.8, { fontSize: 22, bold: true, valign: 'middle' });
      bullets(s, cols[i][2], x + 0.3, 3.25, 3.4, 3.0, { fontSize: 16, color: C.ink, gap: 16 });
    }
    await pic(s, 'n7.jpg', 8.9, 1.9, 3.87, 4.15, 'Học sinh trao đổi, hỗ trợ nhau');
  }

  // 13. HỘP THƯ + TƯ VẤN
  {
    const s = light('Giải pháp · Lắng nghe học sinh', 'Hộp thư “Điều em muốn nói” và Tổ tư vấn', VH + 'Nhóm triển khai hộp thư "Điều em muốn nói", cả trực tiếp và trực tuyến; học sinh dùng mã số riêng để bảo mật danh tính nên mạnh dạn chia sẻ. Cùng với đó là Tổ tư vấn tâm lý với cộng tác viên học sinh mỗi lớp, tư vấn chiều thứ Tư và thứ Sáu, phối hợp giáo viên tư vấn, giáo viên chủ nhiệm và Đoàn Thanh niên.');
    s.addShape(pres.shapes.RECTANGLE, { x: M - 0.06, y: 1.84, w: 4.62, h: 3.2, fill: { color: C.white }, line: { type: 'none' }, shadow: shadow() });
    s.addImage({ data: await contain('n1.jpg', 4.5, 3.0), x: M, y: 1.9, w: 4.5, h: 3.0 });
    await pic(s, 'n6.jpg', 5.3, 1.9, 4.0, 3.0);
    await pic(s, 'n5.jpg', 9.55, 1.9, 3.22, 3.0);
    const it = [['LuMail', 'Hộp thư bảo mật', 'Trực tiếp và trực tuyến, dùng mã số riêng'], ['LuUsers', 'Tổ tư vấn tâm lý', 'Chiều thứ Tư và thứ Sáu hằng tuần'], ['LuHandshake', 'Cộng tác viên học sinh', 'Mỗi lớp ít nhất một bạn biết lắng nghe']];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 4.15;
      card(s, x, 5.25, 3.9, 1.15);
      await iconCircle(s, it[i][0], x + 0.2, 5.45, 0.72, i === 0 ? C.gold : C.mint, i === 0 ? C.darker : C.green);
      txt(s, it[i][1], x + 1.05, 5.33, 2.75, 0.45, { fontSize: 15, bold: true });
      txt(s, it[i][2], x + 1.05, 5.78, 2.75, 0.5, { fontSize: 13, color: C.muted });
    }
  }

  // 14. TRUYỀN THÔNG + KẾT NỐI
  {
    const s = light('Giải pháp · Truyền thông và kết nối', 'Fanpage “Trạm Sạc Tâm Hồn” và thảo luận tình huống', VH + 'Nhóm truyền thông qua tờ rơi, nhóm lớp và các tiết sinh hoạt, Hoạt động trải nghiệm. Fanpage "Trạm Sạc Tâm Hồn" là góc nhỏ an toàn để các bạn trút bỏ gánh nặng đồng trang lứa, hiện có 200 người theo dõi. Trong tiết sinh hoạt, các bạn thảo luận và đóng vai tình huống bị rủ đi học thêm khi đã có kế hoạch tự học. Học sinh rất hào hứng, cởi mở và tự tin hơn.');
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.85, w: 2.55, h: 4.6, rectRadius: 0.25, fill: { color: C.darker }, line: { type: 'none' }, shadow: shadow() });
    s.addImage({ data: await contain('n2.jpg', 2.35, 4.4, { left: 0, top: 120, width: 850, height: 1590 }), x: M + 0.1, y: 1.95, w: 2.35, h: 4.4 });
    const g = [['LuBatteryCharging', 'Fanpage “Trạm Sạc Tâm Hồn”', 'Góc nhỏ an toàn để trút bỏ gánh nặng đồng trang lứa · 200 người theo dõi'], ['LuMegaphone', 'Truyền thông đa kênh', 'Tờ rơi, nhóm lớp trực tuyến, sinh hoạt lớp, HĐTN-HN'], ['LuMessagesSquare', 'Kết nối gia đình, nhà trường', 'Nhóm Zalo phụ huynh và GVCN, học nhóm']];
    for (let i = 0; i < 3; i++) {
      const y = 1.9 + i * 1.5;
      card(s, 3.35, y, 4.75, 1.33);
      await iconCircle(s, g[i][0], 3.55, y + 0.28, 0.75, i === 0 ? C.gold : C.mint, i === 0 ? C.darker : C.green);
      txt(s, g[i][1], 4.45, y + 0.15, 3.5, 0.45, { fontSize: 15, bold: true });
      txt(s, g[i][2], 4.45, y + 0.58, 3.5, 0.7, { fontSize: 12, color: C.muted });
    }
    await pic(s, 'n8.jpg', 8.45, 1.9, 4.32, 2.75);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.39, y: 4.85, w: 4.44, h: 1.55, rectRadius: 0.2, fill: { color: C.mint }, line: { type: 'none' } });
    txt(s, [b('Đóng vai: ', { color: C.green }), n('“Bạn rủ đi học thêm, nhưng em đã có kế hoạch tự học. Em sẽ nói gì?”', { italic: true })], 8.6, 4.85, 4.05, 1.55, { fontSize: 14, valign: 'middle' });
  }

  // 15. ĐÁNH GIÁ
  section('07', 'Đánh giá hiệu quả, kết luận và đề xuất', 'So sánh khảo sát lần 1 và lần 2 · Kết luận · Đề xuất', HN + 'Phần cuối: đánh giá hiệu quả, kết luận và đề xuất.');
  {
    const s = light('Đánh giá hiệu quả', 'Sau thực nghiệm: căng thẳng giảm từ 88% xuống 14%', HN + 'Sau khi áp dụng giải pháp, khảo sát lần 2 cho thấy tỷ lệ học sinh thấy mệt mỏi, căng thẳng giảm từ 88% xuống còn 14%. Khi stress, phần lớn các bạn đã chuyển từ giữ trong lòng sang tâm sự với người thân, bạn bè, và viết nhật ký nhiều hơn. Về phía phụ huynh, nhiều người quan tâm, động viên con hơn và hạn chế so sánh hay khoe thành tích của con trên mạng xã hội.');
    const d1 = await donut(88, C.coral), d2 = await donut(14, C.green);
    const pos = [[M + 0.2, 'Đợt 1 · trước', '88%', d1, C.coral], [4.3, 'Đợt 2 · sau', '14%', d2, C.green]];
    for (const [x, lab, v, img, col] of pos) {
      s.addImage({ data: img, x, y: 2.05, w: 3.0, h: 3.0 });
      txt(s, v, x, 2.05, 3.0, 3.0, { fontSize: 42, bold: true, align: 'center', valign: 'middle', color: col });
      txt(s, lab, x, 5.15, 3.0, 0.4, { fontSize: 17, bold: true, align: 'center' });
    }
    s.addImage({ data: await icon('LuArrowRight', C.gold), x: 3.55, y: 3.2, w: 0.7, h: 0.7 });
    txt(s, '“Bạn có đang cảm thấy mệt mỏi, căng thẳng không?” · tỷ lệ trả lời “Có”', M, 5.7, 7.4, 0.5, { fontSize: 13, italic: true, color: C.muted });
    const it = [['LuMessagesSquare', 'Cách ứng phó', 'Từ “giữ trong lòng” sang tâm sự với người thân, bạn bè; viết nhật ký tăng'], ['LuHeart', 'Phụ huynh', 'Quan tâm, động viên con hơn; hạn chế so sánh, khoe thành tích của con']];
    for (let i = 0; i < 2; i++) {
      const y = 1.9 + i * 2.25;
      dpanel(s, 8.0, y, 4.77, 2.05);
      await iconCircle(s, it[i][0], 8.3, y + 0.3, 0.7, '1D5A45', C.gold);
      txt(s, it[i][1], 9.2, y + 0.3, 3.4, 0.7, { fontSize: 19, bold: true, color: C.white, valign: 'middle' });
      txt(s, it[i][2], 8.3, y + 1.1, 4.2, 0.85, { fontSize: 14, color: C.soft });
    }
    source(s, 'Nguồn: khảo sát học sinh khối 10 lần 1 và lần 2 của nhóm nghiên cứu, năm 2026');
  }

  // CÁCH ỨNG PHÓ
  {
    const s = light('Đánh giá hiệu quả · Cách ứng phó', 'Học sinh chuyển từ giữ trong lòng sang chia sẻ', HN + 'Với câu hỏi "Khi cảm thấy mệt mỏi, khó chịu, stress bạn sẽ làm gì?", đợt 1 phần lớn học sinh giữ trong lòng; đợt 2 phần lớn đã tâm sự với người thân, bạn bè và viết nhật ký nhiều hơn.');
    const sh = async (f) => 'image/png;base64,' + (await sharp(mp(f)).png().toBuffer()).toString('base64');
    card(s, M, 1.95, 5.0, 4.0);
    s.addImage({ data: await sh('image23.png'), x: M + 0.45, y: 2.05, w: 4.1, h: 3.8 });
    card(s, 5.75, 1.95, 5.15, 4.0);
    s.addImage({ data: await sh('image24.png'), x: 5.95, y: 2.15, w: 4.75, h: 3.1 });
    const pts = [['Đợt 1', 'Đa số giữ trong lòng'], ['Đợt 2', 'Đa số tâm sự với người thân, bạn bè'], ['Tăng', 'Viết nhật ký để giải tỏa']];
    for (let i = 0; i < 3; i++) {
      const y = 1.95 + i * 1.37;
      dpanel(s, 11.1, y, 1.67, 1.22);
      txt(s, pts[i][0], 11.15, y + 0.12, 1.57, 0.35, { fontSize: 14, bold: true, color: C.gold, align: 'center' });
      txt(s, pts[i][1], 11.15, y + 0.45, 1.57, 0.7, { fontSize: 12, color: C.white, align: 'center' });
    }
    txt(s, 'Câu hỏi: “Khi cảm thấy mệt mỏi, khó chịu, stress bạn sẽ làm gì?”', M, 6.1, W - 2 * M, 0.35, { fontSize: 14, color: C.muted, italic: true });
    source(s, 'Nguồn: biểu đồ khảo sát lần 1 và lần 2 trong báo cáo của nhóm nghiên cứu, năm 2026');
  }

  // KẾT LUẬN
  {
    const s = light('Kết luận', 'Ba kết luận chính của đề tài', HN + 'Kết luận: áp lực đồng trang lứa ở khối 10 khá phổ biến, từ 80,43% đến 91,74%; nguyên nhân chính là tâm sinh lý chưa ổn định và nhu cầu hòa nhập cao, tác động tiêu cực rõ hơn tích cực, học sinh nữ chịu tác động nhiều hơn nam; sau thực nghiệm, học sinh nhận thức đúng hơn và biết điều chỉnh cảm xúc.');
    const k = [['LuChartBar', 'Phổ biến', '80,43–91,74% học sinh khối 10 có biểu hiện áp lực đồng trang lứa; các em cần sự đồng hành của gia đình, nhà trường'], ['LuBrain', 'Nguyên nhân và tác động', 'Tâm sinh lý chưa ổn định, nhu cầu hòa nhập cao; tác động tiêu cực rõ hơn tích cực; học sinh nữ chịu tác động nhiều hơn nam'], ['LuTrendingUp', 'Hiệu quả giải pháp', 'Căng thẳng giảm từ 88% xuống 14%; học sinh nhận thức đúng hơn, biết điều chỉnh cảm xúc, biến áp lực thành động lực']];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 4.15;
      card(s, x, 1.9, 3.9, 4.45);
      txt(s, String(i + 1).padStart(2, '0'), x + 0.35, 2.15, 1.5, 0.8, { fontSize: 40, bold: true, color: i === 0 ? C.gold : C.green });
      await iconCircle(s, k[i][0], x + 2.85, 2.2, 0.75, C.mint, C.green);
      txt(s, k[i][1], x + 0.35, 3.15, 3.2, 0.75, { fontSize: 20, bold: true });
      txt(s, k[i][2], x + 0.35, 3.95, 3.25, 2.2, { fontSize: 16, color: C.muted });
    }
  }

  // ĐỀ XUẤT
  {
    const s = light('Đề xuất', 'Đề xuất và hướng phát triển', HN + 'Nhóm đề xuất dành thời lượng sinh hoạt lớp đầu năm để học sinh khối 10 chia sẻ áp lực, tăng phối hợp gia đình và nhà trường; đồng thời mở rộng nghiên cứu sang khối 11 và 12. Đây là lần đầu nhóm làm nghiên cứu khoa học nên còn hạn chế, rất mong nhận được góp ý của quý thầy cô.');
    const p = [['LuCalendar', 'Sinh hoạt đầu năm và phối hợp gia đình', ['Dành thời lượng sinh hoạt lớp đầu năm để khối 10 chia sẻ áp lực', 'Tăng phối hợp nhà trường và gia đình', 'Tạo không gian an toàn, bớt lo bị so sánh']], ['LuSearch', 'Mở rộng phạm vi nghiên cứu', ['Khảo sát thêm khối 11 và khối 12', 'So sánh mức độ, biểu hiện theo độ tuổi', 'Làm rõ đặc điểm áp lực từng cấp lớp']]];
    for (let i = 0; i < 2; i++) {
      const x = M + i * 6.2;
      dpanel(s, x, 1.9, 5.95, 3.7);
      await iconCircle(s, p[i][0], x + 0.4, 2.2, 0.8, i === 0 ? C.gold : '1D5A45', i === 0 ? C.darker : C.gold);
      txt(s, p[i][1], x + 1.4, 2.2, 4.3, 0.8, { fontSize: 20, bold: true, color: C.white, valign: 'middle' });
      bullets(s, p[i][2], x + 0.45, 3.3, 5.1, 2.1, { fontSize: 17, color: C.white, gap: 10 });
    }
    card(s, M, 5.85, W - 2 * M, 0.6);
    txt(s, 'Đây là lần đầu nhóm thực hiện đề tài nghiên cứu khoa học, rất mong nhận được góp ý của quý thầy cô.', M + 0.3, 5.85, W - 2 * M - 0.6, 0.6, { fontSize: 16, italic: true, color: C.muted, valign: 'middle' });
  }

  // 17. TÀI LIỆU THAM KHẢO
  {
    const s = light('Tài liệu tham khảo', 'Tài liệu tham khảo', HN + '(Không cần trình bày chi tiết.)');
    const refs = ['Lazarus, R. S., & Folkman, S. (1984). Stress, Appraisal, and Coping. New York: Springer.', 'Bộ Giáo dục và Đào tạo. Chương trình Giáo dục phổ thông 2018, Mô đun 5.', 'Tạp chí Tâm lý học. Áp lực đồng trang lứa. tapchitamlyhoc.com/ap-luc-dong-trang-lua-6325.html', 'Hoa Học Trò, Báo Tiền Phong. Vì sao các bạn trẻ thường bị ảnh hưởng bởi peer pressure. hoahoctro.tienphong.vn', 'Giáo dục và Thời đại. Rèn kỹ năng kiểm soát cảm xúc cho học sinh THCS. giaoducthoidai.vn', 'Báo Thanh Niên. Vì sao học sinh ngày nay có quá nhiều áp lực. thanhnien.vn', 'Sống Trẻ. Peer pressure: áp lực của giới trẻ. songtre.com.vn', 'Video tham khảo: youtu.be/M0eFKH_FUDI'];
    card(s, M, 1.9, W - 2 * M, 4.6);
    txt(s, refs.map((r, i) => ({ text: r, options: { bullet: { type: 'number' }, breakLine: i < refs.length - 1, paraSpaceAfter: 8 } })), M + 0.4, 2.15, W - 2 * M - 0.8, 4.2, { fontSize: 15 });
  }

  // 18. CẢM ƠN
  {
    pageNo++;
    const s = pres.addSlide();
    s.background = { data: SECBG.end };
    pageNum(s, true);
    s.addNotes(HN + 'Phần trình bày của chúng em đến đây là kết thúc. Chúng em xin chân thành cảm ơn quý thầy cô và ban giám khảo đã lắng nghe, và rất mong nhận được câu hỏi, góp ý để đề tài hoàn thiện hơn.');
    txt(s, 'Trân trọng', M, 1.6, 10, 1.0, { fontSize: 40, bold: true, color: C.white });
    txt(s, 'cảm ơn', M, 2.5, 10, 1.4, { fontFace: FA, italic: true, fontSize: 80, color: C.gold });
    txt(s, 'quý thầy cô và ban giám khảo đã lắng nghe', M, 4.05, 10, 0.6, { fontSize: 24, color: C.white });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 4.95, w: 3.6, h: 0.62, rectRadius: 0.31, fill: { color: C.gold }, line: { type: 'none' } });
    txt(s, 'Hỏi và đáp', M, 4.95, 3.6, 0.62, { fontSize: 20, bold: true, color: C.darker, align: 'center', valign: 'middle' });
    txt(s, 'Nguyễn Văn Hào · Nguyễn Thị Hạnh Nguyên · Lớp 10A11 · GVHD: cô Ngô Hải Yến', M, 6.2, 11.5, 0.35, { fontSize: 14, color: C.soft });
  }

  await pres.writeFile({ fileName: OUT });
  console.log('written', OUT, pageNo);
})();
