const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const React = require('react');
const RDS = require('react-dom/server');
const L = require('react-icons/lu');
const path = require('path');

const MEDIA = path.join(__dirname, '..', 'docx', 'word', 'media');
const OUT = path.join(__dirname, 'Ap-luc-dong-trang-lua.pptx');

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
  const buf = await sharp(path.join(MEDIA, file)).resize(wpx, hpx, { fit: 'cover', position: 'attention' }).jpeg({ quality: 82 }).toBuffer();
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
  const photoBuf = await sharp(path.join(MEDIA, photoFile)).resize(pw, ph, { fit: 'cover', position: 'attention' })
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

(async () => {
  BG = await bgDark();
  DOTS = await dotGrid('#148054', 0.28);
  const SP = { '01': 'image3.jpeg', '02': 'image19.jpeg', '03': 'image4.jpeg', '04': 'image7.jpeg', '05': 'image8.jpeg', '06': 'image12.jpeg', '07': 'image20.jpeg', end: 'image2.jpeg' };
  for (const k of Object.keys(SP)) SECBG[k] = await sectionBg(SP[k]);

  // ================= 1. TITLE =================
  {
    const s = dark(VH + 'Kính thưa ban giám khảo, quý thầy cô và các bạn. Chúng em là Nguyễn Văn Hào và Nguyễn Thị Hạnh Nguyên, học sinh lớp 10A11 Trường THPT Lương Thế Vinh, dưới sự hướng dẫn của cô Ngô Hải Yến. Hôm nay chúng em xin trình bày dự án nghiên cứu: "Áp lực đồng trang lứa ở học sinh khối 10 THPT Lương Thế Vinh", thuộc lĩnh vực Khoa học xã hội và hành vi.');
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 0.62, w: 6.9, h: 0.46, rectRadius: 0.23, fill: { color: C.gold }, line: { type: 'none' } });
    txt(s, 'CUỘC THI NGHIÊN CỨU KHOA HỌC KỸ THUẬT · NĂM HỌC 2026–2027', M, 0.62, 6.9, 0.46, { fontSize: 13, bold: true, color: C.darker, align: 'center', valign: 'middle' });
    txt(s, 'BÁO CÁO DỰ ÁN · LĨNH VỰC KHOA HỌC XÃ HỘI VÀ HÀNH VI', M, 1.42, 8, 0.35, { fontSize: 14, bold: true, color: C.soft });
    txt(s, 'Áp lực đồng trang lứa', M, 1.85, 8.2, 1.15, { fontSize: 50, bold: true, color: C.white, valign: 'middle' });
    txt(s, 'ở học sinh khối 10 THPT Lương Thế Vinh', M, 2.95, 7.9, 0.8, { fontSize: 27, bold: true, color: C.white, valign: 'middle' });
    txt(s, 'peer pressure', M, 3.8, 6, 0.7, { fontFace: FA, italic: true, fontSize: 34, color: C.gold, valign: 'middle' });
    txt(s, [b('Giáo viên hướng dẫn: ', { color: C.soft }), n('Cô Ngô Hải Yến', { color: C.white })], M, 5.35, 7.5, 0.4, { fontSize: 18 });
    txt(s, 'Trường THPT Lương Thế Vinh · Quảng Trị, tháng 11/2026', M, 5.85, 7.5, 0.4, { fontSize: 16, color: C.soft });
    // portrait placeholders
    const xs = [8.55, 11.0];
    const names = ['Nguyễn Văn Hào', 'Nguyễn Thị Hạnh Nguyên'];
    for (let i = 0; i < 2; i++) {
      s.addShape(pres.shapes.OVAL, { x: xs[i], y: 2.0, w: 1.95, h: 1.95, fill: { color: C.white, transparency: 92 }, line: { color: C.gold, width: 2, dashType: 'dash' } });
      txt(s, 'Ảnh chân dung', xs[i], 2.0, 1.95, 1.95, { fontSize: 12, color: C.soft, align: 'center', valign: 'middle' });
      txt(s, names[i], xs[i] - 0.25, 4.1, 2.45, 0.7, { fontSize: 17, bold: true, color: C.white, align: 'center', valign: 'middle' });
      txt(s, 'Lớp 10A11', xs[i] - 0.25, 4.82, 2.45, 0.35, { fontSize: 14, bold: true, color: C.gold, align: 'center' });
    }
  }

  // ================= 2. AGENDA =================
  {
    const s = light('Nội dung trình bày', 'Cấu trúc báo cáo', VH + 'Bài trình bày gồm 7 phần: mở đầu, tổng quan, đối tượng và phương pháp, thực trạng và nguyên nhân, ảnh hưởng, hệ thống giải pháp, và cuối cùng là đánh giá hiệu quả, kết luận, đề xuất.');
    const items = [
      ['Mở đầu', 'Lý do chọn đề tài, mục tiêu'],
      ['Tổng quan', 'Cơ sở lý luận, câu hỏi nghiên cứu'],
      ['Đối tượng và phương pháp', 'Khách thể, tiến trình, 5 phương pháp'],
      ['Thực trạng và nguyên nhân', 'Góc nhìn học sinh và phụ huynh'],
      ['Ảnh hưởng', 'Tác động tích cực và tiêu cực'],
      ['Hệ thống giải pháp', 'Học sinh, gia đình, nhà trường, truyền thông'],
      ['Đánh giá và kết luận', 'Hiệu quả sau thực nghiệm, đề xuất'],
    ];
    const colW = 5.85, rowH = 1.02;
    items.forEach((it, i) => {
      const col = i < 4 ? 0 : 1, row = i < 4 ? i : i - 4;
      const x = M + col * (colW + 0.5), y = 1.95 + row * (rowH + 0.18);
      card(s, x, y, colW, rowH);
      numCircle(s, String(i + 1).padStart(2, '0'), x + 0.22, y + 0.17, 0.68, i === 0 ? C.gold : C.dark, i === 0 ? C.darker : C.white, 17);
      txt(s, it[0], x + 1.1, y + 0.16, colW - 1.25, 0.4, { fontSize: 19, bold: true });
      txt(s, it[1], x + 1.1, y + 0.55, colW - 1.25, 0.35, { fontSize: 15, color: C.muted });
    });
  }

  // ================= 3. VIDEO =================
  {
    const s = dark(VH + 'Trước khi đi vào nội dung, mời quý thầy cô và các bạn cùng xem một video ngắn về áp lực đồng trang lứa. (Chiếu video.) Sau video: Có lẽ ai trong chúng ta cũng từng ít nhất một lần cảm thấy mệt mỏi khi so sánh mình với bạn bè. Đó chính là vấn đề chúng em muốn tìm hiểu.');
    txt(s, 'VIDEO MỞ ĐẦU', M, 0.7, 5, 0.35, { fontSize: 14, bold: true, color: C.gold });
    txt(s, 'Bạn đã bao giờ thấy mệt mỏi khi so sánh mình với bạn bè?', M, 1.2, 4.6, 2.4, { fontSize: 32, bold: true, color: C.white });
    txt(s, 'Video giới thiệu về áp lực đồng trang lứa giúp dẫn dắt vào vấn đề nghiên cứu.', M, 3.85, 4.4, 1.0, { fontSize: 17, color: C.soft });
    txt(s, [n('Nguồn video: '), n('youtu.be/M0eFKH_FUDI', { hyperlink: { url: 'https://youtu.be/M0eFKH_FUDI' }, color: C.gold })], M, 5.1, 4.6, 0.35, { fontSize: 14, color: C.soft });
    dpanel(s, 5.55, 1.05, 7.2, 4.95);
    s.addShape(pres.shapes.OVAL, { x: 5.55 + 3.6 - 0.6, y: 1.05 + 2.475 - 0.6, w: 1.2, h: 1.2, fill: { color: C.gold }, line: { type: 'none' } });
    s.addImage({ data: await icon('LuPlay', C.darker), x: 5.55 + 3.6 - 0.3, y: 1.05 + 2.475 - 0.3, w: 0.6, h: 0.6 });
    txt(s, 'Chèn video tại đây (Chèn → Video)', 5.55, 5.35, 7.2, 0.4, { fontSize: 13, color: C.soft, align: 'center' });
  }

  // ================= 4. SECTION 01 =================
  section('01', 'Mở đầu', 'Lý do chọn đề tài · Mục tiêu của đề tài', VH + 'Phần thứ nhất: Mở đầu, gồm lý do chọn đề tài và mục tiêu nghiên cứu.');

  // ================= 5. LÝ DO – BỐI CẢNH =================
  {
    const s = light('Lý do chọn đề tài · 1/3', 'Bối cảnh: nhịp sống hiện đại và sức ép tinh thần', VH + 'Sự bùng nổ khoa học công nghệ và đổi mới giáo dục đặt ra yêu cầu phát triển toàn diện cho học sinh. Song song đó là thách thức về tinh thần: phụ huynh bận rộn, ít thời gian lắng nghe con; nhiều bạn tìm đến Facebook, TikTok, trò chơi trực tuyến; tương tác trực tiếp với bạn bè giảm đi. Giữa những sức ép đan xen ấy, áp lực đồng trang lứa nổi lên như một hiện tượng đáng quan tâm.');
    const rows = [
      ['LuGraduationCap', 'Giáo dục đổi mới', 'Yêu cầu bồi dưỡng toàn diện năng lực cá nhân'],
      ['LuHouse', 'Gia đình bận rộn', 'Phụ huynh ít thời gian đồng hành, lắng nghe con'],
      ['LuSmartphone', 'Không gian mạng', 'Học sinh tìm đến Facebook, TikTok, game trực tuyến'],
      ['LuHeartPulse', 'Sức khỏe tinh thần', 'Lo ngại rối loạn tâm lý, hội chứng Tic ở lứa tuổi học đường'],
    ];
    for (let i = 0; i < rows.length; i++) { const r = rows[i];
      const x = M + (i % 2) * 6.2, y = 2.0 + Math.floor(i / 2) * 2.05;
      card(s, x, y, 5.95, 1.8);
      await iconCircle(s, r[0], x + 0.3, y + 0.42, 0.95, C.mint, C.green);
      txt(s, r[1], x + 1.5, y + 0.38, 4.2, 0.45, { fontSize: 20, bold: true });
      txt(s, r[2], x + 1.5, y + 0.85, 4.2, 0.75, { fontSize: 16, color: C.muted });
    }
    txt(s, [n('Giữa nhiều sức ép đan xen, '), b('áp lực đồng trang lứa', { color: C.green }), n(' nổi lên như một hiện tượng đáng quan tâm.')], M, 6.25, W - 2 * M, 0.45, { fontSize: 18 });
  }

  // ================= 6. LÝ DO – LỚP 10 =================
  {
    const s = light('Lý do chọn đề tài · 2/3', 'Lớp 10: cột mốc chuyển tiếp dễ bị chi phối', VH + 'Lớp 10 là cột mốc chuyển tiếp quan trọng: các bạn định hình bản sắc cá nhân, muốn khẳng định giá trị bản thân và dễ bị chi phối bởi chuẩn mực của nhóm bạn. Qua quan sát tại khối 10 trường mình, chúng em thấy nhiều bạn đang chạy đua về học tập, ngoại hình, năng khiếu; cố gắng thích nghi để được nhóm công nhận; chạy theo trào lưu mạng xã hội; thậm chí làm theo hành vi thiếu tích cực vì sợ bị tách khỏi tập thể.');
    dpanel(s, M, 1.95, 4.6, 4.55);
    txt(s, 'Tuổi 15–16', M + 0.4, 2.3, 3.9, 0.5, { fontSize: 16, bold: true, color: C.gold });
    txt(s, 'Định hình bản sắc, muốn khẳng định giá trị bản thân và được nhóm bạn công nhận', M + 0.4, 2.85, 3.9, 2.2, { fontSize: 22, bold: true, color: C.white });
    txt(s, 'Dễ bị chi phối bởi chuẩn mực, kỳ vọng từ nhóm bạn xung quanh', M + 0.4, 5.15, 3.9, 1.0, { fontSize: 16, color: C.soft });
    txt(s, 'Quan sát thực tế tại khối 10', 5.6, 1.95, 7, 0.4, { fontSize: 18, bold: true, color: C.green });
    const obs = [
      ['LuChartBar', 'Chạy đua kết quả học tập, vóc dáng, năng khiếu'],
      ['LuUsers', 'Cố thích nghi để được nhóm bạn công nhận'],
      ['LuSmartphone', 'Chạy theo trào lưu mạng xã hội khi chưa đủ hiểu biết'],
      ['LuUserX', 'Làm theo hành vi thiếu tích cực vì sợ bị tách biệt'],
    ];
    for (let i = 0; i < obs.length; i++) {
      const y = 2.5 + i * 1.0;
      await iconCircle(s, obs[i][0], 5.6, y, 0.72, C.mint, C.green);
      txt(s, obs[i][1], 6.55, y, 6.2, 0.72, { fontSize: 18, valign: 'middle' });
    }
  }

  // ================= 7. LÝ DO – HỆ LỤY =================
  {
    const s = light('Lý do chọn đề tài · 3/3', 'Nếu không được nhận diện và hỗ trợ kịp thời', VH + 'Nếu không được nhận diện và hỗ trợ kịp thời, những áp lực này có thể gây căng thẳng kéo dài, giảm tự tin, xung đột trong quan hệ bạn bè, ảnh hưởng xấu đến học tập và tiềm ẩn nguy cơ bất ổn tâm lý. Vì vậy nhóm chọn đề tài này để làm rõ thực trạng và đề xuất hướng hỗ trợ thiết thực cho học sinh.');
    const risks = [
      ['LuActivity', 'Căng thẳng kéo dài'],
      ['LuFrown', 'Suy giảm sự tự tin'],
      ['LuMessagesSquare', 'Xung đột quan hệ bạn bè'],
      ['LuTrendingDown', 'Kết quả học tập sa sút'],
      ['LuTriangleAlert', 'Nguy cơ bất ổn tâm lý'],
    ];
    const cw = 2.25, gap = 0.17;
    for (let i = 0; i < risks.length; i++) {
      const x = M + i * (cw + gap);
      card(s, x, 2.05, cw, 2.35);
      await iconCircle(s, risks[i][0], x + cw / 2 - 0.5, 2.35, 1.0, 'FFE6E0', C.coral);
      txt(s, risks[i][1], x + 0.15, 3.5, cw - 0.3, 0.8, { fontSize: 17, bold: true, align: 'center' });
    }
    dpanel(s, M, 4.75, W - 2 * M, 1.55);
    txt(s, 'Đề tài', M + 0.4, 4.95, 2, 0.35, { fontSize: 14, bold: true, color: C.gold });
    txt(s, '“Áp lực đồng trang lứa ở học sinh khối 10 THPT Lương Thế Vinh” nhằm làm rõ thực trạng và đề xuất định hướng hỗ trợ thiết thực cho học sinh.', M + 0.4, 5.3, W - 2 * M - 0.8, 0.9, { fontSize: 19, color: C.white });
  }

  // ================= 8. MỤC TIÊU =================
  {
    const s = light('Mục tiêu của đề tài', 'Ba mục tiêu nghiên cứu', VH + 'Đề tài có 3 mục tiêu. Thứ nhất, xác định mức độ xuất hiện, dạng biểu hiện và nguyên nhân của áp lực đồng trang lứa. Thứ hai, mô hình hóa mối quan hệ giữa áp lực đồng trang lứa với sức khỏe tâm lý và hành vi học tập. Thứ ba, đề xuất bộ giải pháp hỗ trợ cho nhà trường, giáo viên và phụ huynh.');
    const goals = [
      ['LuSearch', 'Nhận diện', 'Xác định mức độ xuất hiện, dạng biểu hiện và nguyên nhân của áp lực đồng trang lứa'],
      ['LuLink', 'Mô hình hóa', 'Làm rõ mối quan hệ giữa áp lực đồng trang lứa với sức khỏe tâm lý và hành vi học tập'],
      ['LuHandshake', 'Giải pháp', 'Đề xuất bộ giải pháp hỗ trợ nhà trường, giáo viên và phụ huynh'],
    ];
    const cw = 3.85, gap = 0.3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + gap);
      card(s, x, 2.0, cw, 4.35);
      txt(s, String(i + 1).padStart(2, '0'), x + 0.35, 2.25, 1.5, 0.8, { fontSize: 40, bold: true, color: i === 0 ? C.gold : C.green });
      await iconCircle(s, goals[i][0], x + cw - 1.15, 2.3, 0.8, C.mint, C.green);
      txt(s, goals[i][1], x + 0.35, 3.3, cw - 0.7, 0.5, { fontSize: 22, bold: true });
      txt(s, goals[i][2], x + 0.35, 3.9, cw - 0.7, 2.2, { fontSize: 17, color: C.muted });
    }
  }

  // ================= 9. SECTION 02 =================
  section('02', 'Tổng quan', 'Cơ sở lý luận · Câu hỏi nghiên cứu · Kết quả mong đợi', VH + 'Phần thứ hai: Tổng quan, gồm cơ sở lý luận, câu hỏi nghiên cứu và kết quả mong đợi.');

  // ================= 10. KHÁI NIỆM ÁP LỰC TÂM LÝ =================
  {
    const s = light('Cơ sở lý luận · Khái niệm 1', 'Áp lực tâm lý là gì?', VH + 'Theo Lazarus và Folkman năm 1984, áp lực tâm lý là một dạng căng thẳng xảy ra do cách cảm nhận các sự kiện trong môi trường bên ngoài hoặc bên trong của một người, dẫn đến tâm lý lo lắng và đau khổ. Điểm quan trọng: áp lực phụ thuộc vào cách mỗi người cảm nhận sự việc.');
    dpanel(s, M, 1.95, W - 2 * M, 4.35);
    txt(s, 'Áp lực tâm lý', M + 0.6, 2.3, 8, 0.9, { fontFace: FA, italic: true, fontSize: 44, color: C.gold });
    txt(s, 'là một dạng căng thẳng xảy ra do cách cảm nhận các sự kiện trong môi trường bên ngoài hoặc bên trong của một người, dẫn đến tâm lý lo lắng và đau khổ.', M + 0.6, 3.35, W - 2 * M - 1.2, 1.8, { fontSize: 26, color: C.white });
    txt(s, 'Lazarus & Folkman (1984)', M + 0.6, 5.45, 8, 0.4, { fontSize: 16, bold: true, color: C.soft });
    source(s, 'Nguồn: Lazarus, R. S. & Folkman, S. (1984). Stress, Appraisal, and Coping.');
  }

  // ================= 11. KHÁI NIỆM ALĐTL =================
  {
    const s = light('Cơ sở lý luận · Khái niệm 2', 'Áp lực đồng trang lứa là gì?', VH + 'Áp lực đồng trang lứa, hay peer pressure, là áp lực tâm lý xuất hiện ở một cá nhân khi chịu tác động trực tiếp hoặc gián tiếp từ những người cùng lứa tuổi hoặc cùng nhóm xã hội được cho là thành công hơn. Áp lực này ảnh hưởng đáng kể đến sức khỏe tâm lý và hành vi học tập của học sinh lớp 10, và mức độ khác nhau tùy nhóm học sinh: giới tính, học lực, môi trường lớp học.');
    dpanel(s, M, 1.95, 7.6, 4.35);
    txt(s, 'Peer pressure', M + 0.5, 2.25, 6.6, 0.85, { fontFace: FA, italic: true, fontSize: 42, color: C.gold });
    txt(s, 'Áp lực tâm lý xuất hiện ở một cá nhân khi chịu tác động trực tiếp hoặc gián tiếp từ những người cùng lứa tuổi, cùng nhóm xã hội được cho là thành công hơn.', M + 0.5, 3.25, 6.6, 2.6, { fontSize: 22, color: C.white });
    const pts = [
      ['LuBrain', 'Ảnh hưởng đáng kể', 'đến sức khỏe tâm lý và hành vi học tập'],
      ['LuScale', 'Mức độ khác nhau', 'theo giới tính, học lực, môi trường lớp học'],
    ];
    for (let i = 0; i < 2; i++) {
      const y = 1.95 + i * 2.25;
      card(s, 8.5, y, 4.27, 2.1);
      await iconCircle(s, pts[i][0], 8.8, y + 0.3, 0.75, C.mint, C.green);
      txt(s, pts[i][1], 8.8, y + 1.15, 3.7, 0.4, { fontSize: 19, bold: true });
      txt(s, pts[i][2], 8.8, y + 1.52, 3.7, 0.5, { fontSize: 15, color: C.muted });
    }
  }

  // ================= 12. ĐẶC ĐIỂM LỚP 10 =================
  {
    const s = light('Cơ sở lý luận · Đối tượng lứa tuổi', 'Đặc điểm học sinh lớp 10 (15–16 tuổi)', VH + 'Học sinh lớp 10 ở độ tuổi 15 đến 16, bước vào năm đầu tiên ở THPT: lớp mới, cách học mới, môn học lựa chọn, nên chú ý nhiều hơn đến thành tích và cách ứng xử của bạn bè. Về sinh lý, tốc độ phát triển thể chất khác nhau, nên những nhận xét về chiều cao, vóc dáng, ngoại hình dễ gây áp lực. Về tâm lý, mong muốn được tôn trọng và được thuộc về một nhóm xuất hiện đồng thời. Ví dụ: một bạn muốn đăng ký câu lạc bộ theo sở thích riêng nhưng lại ngại là người duy nhất trong nhóm chọn hoạt động đó.');
    const cols = [
      ['LuActivity', 'Đặc điểm sinh lý', ['Tốc độ phát triển thể chất khác nhau', 'Nhận xét về chiều cao, vóc dáng, ngoại hình trong nhóm bạn dễ gây áp lực']],
      ['LuBrain', 'Đặc điểm tâm lý', ['Thêm cơ hội tự chọn bạn, hoạt động, cách học', 'Muốn được tôn trọng và được thuộc về một nhóm cùng lúc']],
    ];
    for (let i = 0; i < 2; i++) {
      const x = M + i * 6.2;
      dpanel(s, x, 1.95, 5.95, 3.15);
      await iconCircle(s, cols[i][0], x + 0.4, 2.25, 0.8, '1D5A45', C.gold);
      txt(s, cols[i][1], x + 1.4, 2.35, 4.3, 0.6, { fontSize: 24, bold: true, color: C.white, valign: 'middle' });
      bullets(s, cols[i][2], x + 0.45, 3.35, 5.1, 1.6, { fontSize: 18, color: C.white });
    }
    card(s, M, 5.35, W - 2 * M, 1.0);
    await iconCircle(s, 'LuLightbulb', M + 0.25, 5.5, 0.7, C.gold, C.darker);
    txt(s, [b('Ví dụ: '), n('muốn đăng ký câu lạc bộ theo sở thích nhưng ngại là người duy nhất trong nhóm chọn hoạt động đó.')], M + 1.15, 5.35, W - 2 * M - 1.4, 1.0, { fontSize: 17, valign: 'middle' });
  }

  // ================= 13. CÂU HỎI NGHIÊN CỨU =================
  {
    const s = light('Câu hỏi nghiên cứu', 'Bốn câu hỏi định hướng nghiên cứu', VH + 'Nhóm tập trung trả lời 4 câu hỏi. Một: những tác động của áp lực đồng trang lứa với học sinh lớp 10? Hai: học sinh khối 10 trường mình có hành động, suy nghĩ thế nào trước áp lực này? Ba: áp lực đồng trang lứa là gì, nguyên nhân, biểu hiện và ảnh hưởng ra sao? Bốn: giải pháp nào giúp học sinh có tư duy đúng đắn với áp lực đồng trang lứa?');
    const qs = [
      'Áp lực đồng trang lứa tác động như thế nào đến học sinh lớp 10?',
      'Học sinh khối 10 THPT Lương Thế Vinh hành động, suy nghĩ ra sao trước áp lực này?',
      'Áp lực đồng trang lứa là gì; nguyên nhân, biểu hiện, ảnh hưởng thế nào?',
      'Giải pháp nào giúp học sinh có tư duy đúng đắn với áp lực đồng trang lứa?',
    ];
    qs.forEach((q, i) => {
      const x = M + (i % 2) * 6.2, y = 1.95 + Math.floor(i / 2) * 2.25;
      card(s, x, y, 5.95, 2.0);
      txt(s, 'CH' + (i + 1), x + 0.35, y + 0.3, 1.3, 0.6, { fontSize: 28, bold: true, color: i === 0 ? C.gold : C.green });
      txt(s, q, x + 1.6, y + 0.3, 4.05, 1.45, { fontSize: 18 });
    });
  }

  // ================= 14. GIẢ THUYẾT & KẾT QUẢ MONG ĐỢI =================
  {
    const s = light('Giả thuyết khoa học · Kết quả mong đợi', 'Giả thuyết và kết quả mong đợi', VH + 'Giả thuyết khoa học của nhóm: áp lực đồng trang lứa có ảnh hưởng đáng kể đến sức khỏe tâm lý và hành vi học tập của học sinh lớp 10, và mức độ ảnh hưởng khác nhau tùy theo nhóm học sinh như giới tính, học lực, môi trường lớp học. Kết quả mong đợi: xác định mức độ và dạng biểu hiện; mô hình hóa mối quan hệ; đề xuất bộ giải pháp.');
    dpanel(s, M, 1.95, 5.6, 4.4);
    txt(s, 'Giả thuyết', M + 0.45, 2.25, 4.8, 0.8, { fontFace: FA, italic: true, fontSize: 36, color: C.gold });
    txt(s, 'Áp lực đồng trang lứa ảnh hưởng đáng kể đến sức khỏe tâm lý và hành vi học tập của học sinh lớp 10; mức độ khác nhau tùy nhóm học sinh (giới tính, học lực, môi trường lớp học).', M + 0.45, 3.15, 4.75, 3.0, { fontSize: 19, color: C.white });
    txt(s, 'Kết quả mong đợi', 6.55, 1.95, 6, 0.45, { fontSize: 20, bold: true, color: C.green });
    const ex = ['Xác định được mức độ và dạng biểu hiện của áp lực đồng trang lứa', 'Mô hình hóa mối quan hệ giữa áp lực với sức khỏe tâm lý, hành vi học tập', 'Đề xuất bộ giải pháp hỗ trợ nhà trường, giáo viên, phụ huynh'];
    for (let i = 0; i < 3; i++) {
      const y = 2.55 + i * 1.3;
      card(s, 6.55, y, 6.22, 1.12);
      await iconCircle(s, 'LuCheck', 6.75, y + 0.24, 0.64, C.mint, C.green);
      txt(s, ex[i], 7.6, y, 5.0, 1.12, { fontSize: 17, valign: 'middle' });
    }
  }

  // ================= 15. SECTION 03 =================
  section('03', 'Đối tượng, tiến trình và phương pháp', 'Khách thể khảo sát · Tiến trình 3 giai đoạn · 5 phương pháp nghiên cứu', VH + 'Phần thứ ba: đối tượng, tiến trình và phương pháp nghiên cứu.');

  // ================= 16. ĐỐI TƯỢNG =================
  {
    const s = light('Đối tượng nghiên cứu', 'Đối tượng và khách thể khảo sát', VH + 'Đối tượng nghiên cứu là biểu hiện, nguyên nhân và ảnh hưởng của áp lực đồng trang lứa đối với học sinh khối 10 Trường THPT Lương Thế Vinh. Người tham gia gồm: 230 học sinh khối 10 trả lời phiếu khảo sát; 100 học sinh được phỏng vấn nhanh về nguyên nhân; và 45 phụ huynh có con đang học khối 10.');
    dpanel(s, M, 1.95, 5.1, 4.4);
    await iconCircle(s, 'LuTarget', M + 0.45, 2.3, 0.9, '1D5A45', C.gold);
    txt(s, 'Đối tượng nghiên cứu', M + 0.45, 3.4, 4.3, 0.5, { fontSize: 22, bold: true, color: C.white });
    txt(s, 'Biểu hiện, nguyên nhân và ảnh hưởng của áp lực đồng trang lứa đối với học sinh khối 10 Trường THPT Lương Thế Vinh.', M + 0.45, 4.0, 4.25, 2.1, { fontSize: 18, color: C.soft });
    const st = [['230', 'học sinh khối 10', 'Khảo sát bảng hỏi về biểu hiện', true], ['100', 'học sinh khối 10', 'Phỏng vấn nhanh về nguyên nhân'], ['45', 'phụ huynh khối 10', 'Khảo sát về cách đồng hành cùng con']];
    for (let i = 0; i < 3; i++) {
      const y = 1.95 + i * 1.5;
      card(s, 6.05, y, 6.72, 1.3);
      txt(s, st[i][0], 6.3, y, 1.9, 1.3, { fontSize: 46, bold: true, color: st[i][3] ? C.gold : C.green, valign: 'middle' });
      txt(s, st[i][1], 8.3, y + 0.25, 4.3, 0.42, { fontSize: 19, bold: true });
      txt(s, st[i][2], 8.3, y + 0.68, 4.3, 0.4, { fontSize: 15, color: C.muted });
    }
  }

  // ================= 17. TIẾN TRÌNH =================
  {
    const s = light('Tiến trình nghiên cứu', 'Ba giai đoạn từ tháng 9 đến tháng 11/2026', VH + 'Tháng 9/2026: nhóm tìm hiểu tài liệu về áp lực đồng trang lứa ở học sinh lớp 10, xây dựng cơ sở lý luận và hoàn thành đề cương. Tháng 10/2026: lập phiếu và đường link khảo sát, điều tra, phỏng vấn học sinh với mẫu dự kiến 230 học sinh khối 10, sau đó phân tích số liệu. Tháng 11/2026: triển khai thực nghiệm các giải pháp và hoàn thành đề tài. Người thực hiện: Nguyễn Văn Hào và Nguyễn Thị Hạnh Nguyên, lớp 10A11.');
    const steps = [
      ['Tháng 9/2026', 'Nghiên cứu tài liệu', ['Xây dựng cơ sở lý luận', 'Lập và hoàn thành đề cương']],
      ['Tháng 10/2026', 'Khảo sát, phân tích', ['Lập phiếu, link khảo sát', 'Điều tra, phỏng vấn 230 học sinh', 'Phân tích số liệu, nhận xét']],
      ['Tháng 11/2026', 'Thực nghiệm', ['Triển khai các giải pháp', 'Khảo sát lần 2, đánh giá', 'Hoàn thành đề tài']],
    ];
    const cx = [M + 1.7, W / 2, W - M - 1.7];
    s.addShape(pres.shapes.LINE, { x: cx[0], y: 2.55, w: cx[2] - cx[0], h: 0, line: { color: C.green, width: 2.5 } });
    for (let i = 0; i < 3; i++) {
      numCircle(s, i + 1, cx[i] - 0.45, 2.1, 0.9, i === 2 ? C.gold : C.green, i === 2 ? C.darker : C.white, 26);
      card(s, cx[i] - 1.85, 3.25, 3.7, 3.05);
      txt(s, steps[i][0], cx[i] - 1.6, 3.45, 3.2, 0.4, { fontSize: 15, bold: true, color: C.green });
      txt(s, steps[i][1], cx[i] - 1.6, 3.85, 3.2, 0.5, { fontSize: 21, bold: true });
      bullets(s, steps[i][2], cx[i] - 1.6, 4.45, 3.25, 1.75, { fontSize: 16, color: C.muted, gap: 6 });
    }
    source(s, 'Người thực hiện: Nguyễn Văn Hào, Nguyễn Thị Hạnh Nguyên (lớp 10A11)');
  }

  // ================= 18. PHƯƠNG PHÁP – TỔNG QUAN =================
  {
    const s = light('Phương pháp nghiên cứu', 'Năm phương pháp phối hợp', VH + 'Nhóm phối hợp 5 phương pháp: nghiên cứu tài liệu để xây dựng cơ sở lý luận; điều tra bằng bảng hỏi; phỏng vấn sâu; thống kê toán học để xử lý số liệu; và thực nghiệm các giải pháp. Các phương pháp nối tiếp nhau, từ lý luận đến thực tiễn rồi đến kiểm chứng.');
    const m = [['LuBookOpen', 'Nghiên cứu tài liệu'], ['LuClipboardList', 'Điều tra bảng hỏi'], ['LuMessageCircle', 'Phỏng vấn sâu'], ['LuCalculator', 'Thống kê toán học'], ['LuFlaskConical', 'Thực nghiệm']];
    const step = (W - 2 * M) / 5;
    s.addShape(pres.shapes.LINE, { x: M + step / 2, y: 3.15, w: step * 4, h: 0, line: { color: C.track, width: 3 } });
    for (let i = 0; i < 5; i++) {
      const cx = M + step * i + step / 2;
      await iconCircle(s, m[i][0], cx - 0.7, 2.45, 1.4, i === 4 ? C.gold : C.dark, i === 4 ? C.darker : C.gold);
      txt(s, String(i + 1).padStart(2, '0'), cx - 1, 4.05, 2, 0.4, { fontSize: 16, bold: true, color: C.green, align: 'center' });
      txt(s, m[i][1], cx - 1.1, 4.45, 2.2, 0.8, { fontSize: 18, bold: true, align: 'center' });
    }
    txt(s, 'Từ lý luận → thu thập dữ liệu → xử lý → kiểm chứng bằng thực nghiệm', M, 5.75, W - 2 * M, 0.5, { fontSize: 18, color: C.muted, align: 'center', italic: true });
  }

  // ================= 19. PHƯƠNG PHÁP 1–2 =================
  {
    const s = light('Phương pháp nghiên cứu · 1/2', 'Nghiên cứu tài liệu và điều tra bằng bảng hỏi', VH + 'Phương pháp nghiên cứu tài liệu: tìm tài liệu trong và ngoài nước, phân loại, tóm tắt, trích dẫn để định nghĩa khái niệm, nêu đặc điểm tâm sinh lý lớp 10 và tổng hợp các kết quả về biểu hiện, nguyên nhân, ảnh hưởng. Phương pháp điều tra bằng bảng hỏi: dựa vào cơ sở lý luận để xây dựng bảng hỏi trên Google Forms nhằm tìm hiểu thực trạng, mức độ, biểu hiện, nguyên nhân, ảnh hưởng và giải pháp. Đây là hình ảnh nhóm phát phiếu điều tra tại các lớp.');
    const P = [
      ['LuBookOpen', 'Nghiên cứu tài liệu', 'Mục đích: xây dựng cơ sở lý luận', ['Định nghĩa khái niệm áp lực đồng trang lứa', 'Đặc điểm tâm sinh lý học sinh lớp 10', 'Tổng hợp biểu hiện, nguyên nhân, ảnh hưởng']],
      ['LuClipboardList', 'Điều tra bằng bảng hỏi', 'Mục đích: tìm hiểu thực trạng', ['Bảng hỏi xây dựng từ cơ sở lý luận', 'Khảo sát mức độ, biểu hiện, nguyên nhân', 'Ảnh hưởng và giải pháp của áp lực']],
    ];
    for (let i = 0; i < 2; i++) {
      const x = M + i * 4.05;
      card(s, x, 1.95, 3.85, 4.4);
      await iconCircle(s, P[i][0], x + 0.3, 2.2, 0.75, C.mint, C.green);
      txt(s, P[i][1], x + 0.3, 3.05, 3.3, 0.5, { fontSize: 20, bold: true });
      txt(s, P[i][2], x + 0.3, 3.55, 3.3, 0.4, { fontSize: 14, bold: true, color: C.green });
      bullets(s, P[i][3], x + 0.3, 4.05, 3.35, 2.2, { fontSize: 15, color: C.muted, gap: 6 });
    }
    const ph = await photo('image2.jpeg', 4.3, 3.9);
    s.addImage({ data: ph, x: 8.65, y: 1.95, w: 4.12, h: 3.9 });
    txt(s, 'Phát phiếu điều tra tại các lớp khối 10', 8.55, 5.95, 4.3, 0.35, { fontSize: 13, color: C.muted, italic: true, align: 'center' });
  }

  // ================= 20. PHƯƠNG PHÁP 3–5 =================
  {
    const s = light('Phương pháp nghiên cứu · 2/2', 'Phỏng vấn sâu, thống kê và thực nghiệm', VH + 'Phỏng vấn sâu với 6 câu hỏi để thu thông tin cụ thể từ học sinh. Thống kê toán học: xử lý số liệu bằng Excel và SPSS; thực trạng tính qua tần suất, tỷ lệ phần trăm; sự khác biệt về giới được phân tích từ dữ liệu; nguyên nhân chính xác định qua tần suất các nguyên nhân học sinh khai báo trong phiếu và phỏng vấn. Thực nghiệm: thành lập câu lạc bộ, cuộc thi tạo môi trường cạnh tranh lành mạnh và tuyên truyền để học sinh nhận thức đúng, biến áp lực thành động lực.');
    const P = [
      ['LuMessageCircle', 'Phỏng vấn sâu', ['6 câu hỏi phỏng vấn học sinh', 'Thu thông tin cụ thể, động cơ phía sau lựa chọn']],
      ['LuCalculator', 'Thống kê toán học', ['Excel, SPSS: tần suất, tỷ lệ %', 'So sánh khác biệt theo giới tính', 'Xếp hạng nhóm nguyên nhân']],
      ['LuFlaskConical', 'Thực nghiệm', ['Câu lạc bộ, cuộc thi lành mạnh', 'Tuyên truyền nâng cao nhận thức', 'Khảo sát trước và sau']],
    ];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 2.9;
      card(s, x, 1.95, 2.72, 4.4);
      await iconCircle(s, P[i][0], x + 0.25, 2.2, 0.72, i === 2 ? C.gold : C.mint, i === 2 ? C.darker : C.green);
      txt(s, P[i][1], x + 0.25, 3.05, 2.35, 0.75, { fontSize: 19, bold: true });
      bullets(s, P[i][2], x + 0.25, 3.85, 2.4, 2.4, { fontSize: 15, color: C.muted, gap: 6 });
    }
    const ph = await photo('image5.jpeg', 3.6, 3.9);
    s.addImage({ data: ph, x: 9.3, y: 1.95, w: 3.47, h: 3.9 });
    txt(s, 'Phỏng vấn học sinh khối 10', 9.3, 5.95, 3.47, 0.35, { fontSize: 13, color: C.muted, italic: true, align: 'center' });
  }

  // ================= 21. SECTION 04 =================
  section('04', 'Thực trạng, biểu hiện và nguyên nhân', 'Kết quả khảo sát 230 học sinh · 100 học sinh · 45 phụ huynh', HN + 'Phần thứ tư: thực trạng, biểu hiện và nguyên nhân của áp lực đồng trang lứa, với kết quả khảo sát học sinh và phụ huynh.');

  // ================= 22. HỒI CHUÔNG CẢNH BÁO =================
  {
    const s = dark(HN + 'Nhiều học sinh phải gánh sức ép tâm lý từ kết quả học tập chưa đạt kỳ vọng, kỳ vọng cao từ gia đình và áp lực thành tích. Thực tế đã ghi nhận nhiều sự việc thương tâm: tháng 4/2018 một nam sinh lớp 10 tại TP.HCM; tháng 10/2020 một nữ sinh lớp 12 vì áp lực thi đại học; tháng 4/2022 một nam sinh lớp 10 tại Hà Đông, Hà Nội; tháng 3/2023 một thiếu niên 13 tuổi ở Long An nhập viện cấp cứu vì áp lực học tập. Đến năm 2026, khi cạnh tranh trong học tập và đời sống số tiếp tục tăng, chăm sóc sức khỏe tinh thần học sinh càng cấp thiết.');
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

  // ================= 23. QUAN SÁT TẠI TRƯỜNG =================
  {
    const s = light('Thực trạng tại THPT Lương Thế Vinh', 'Quan sát bước đầu tại khối 10 năm 2026', HN + 'Tại trường mình năm 2026, qua quan sát bước đầu, nhiều bạn căng thẳng khi so sánh năng lực học tập với bạn cùng lớp; lo lắng về làn da, chiều cao, vóc dáng; muốn có trang phục, điện thoại, vật dụng như bạn bè; sợ bị tách khỏi nhóm; chạy theo trào lưu TikTok và liên tục đối chiếu thành tích. Một số trường hợp xuất hiện cảm giác tự ti và nguy cơ trầm cảm nếu thiếu sự thấu hiểu, đồng hành kịp thời.');
    const o = [['LuChartBar', 'Học tập', 'So sánh năng lực với bạn cùng lớp'], ['LuEye', 'Ngoại hình', 'Lo lắng về làn da, chiều cao, vóc dáng'], ['LuSmartphone', 'Vật chất', 'Muốn có trang phục, điện thoại như bạn'], ['LuUsers', 'Hòa nhập', 'Sợ bị tách khỏi nhóm bạn'], ['LuShare2', 'Mạng xã hội', 'Chạy theo trào lưu TikTok, đối chiếu thành tích']];
    const cw = 2.25, gap = 0.17;
    for (let i = 0; i < 5; i++) {
      const x = M + i * (cw + gap);
      card(s, x, 1.95, cw, 3.3);
      await iconCircle(s, o[i][0], x + cw / 2 - 0.48, 2.25, 0.96, C.mint, C.green);
      txt(s, o[i][1], x + 0.15, 3.4, cw - 0.3, 0.45, { fontSize: 20, bold: true, align: 'center' });
      txt(s, o[i][2], x + 0.2, 3.9, cw - 0.4, 1.2, { fontSize: 15, color: C.muted, align: 'center' });
    }
    dpanel(s, M, 5.55, W - 2 * M, 0.9);
    await iconCircle(s, 'LuTriangleAlert', M + 0.25, 5.68, 0.64, C.coral, C.white);
    txt(s, 'Đã có trường hợp xuất hiện cảm giác tự ti và nguy cơ trầm cảm nếu thiếu sự thấu hiểu, đồng hành kịp thời.', M + 1.1, 5.55, W - 2 * M - 1.4, 0.9, { fontSize: 18, color: C.white, valign: 'middle' });
  }

  // ================= 24. BIỂU HIỆN CHUNG =================
  {
    const s = light('Biểu hiện · Cơ sở lý luận', 'Ba nhóm biểu hiện của áp lực đồng trang lứa', HN + 'Áp lực đồng trang lứa biểu hiện rõ nhất ở người chưa phát triển ổn định về nhân cách, dễ bị tác động bởi bạn bè. Luôn căng thẳng vì phải cố gắng hơn, cho rằng mình thua kém, dù cố bao nhiêu cũng không bằng bạn. Có ba nhóm biểu hiện: về cơ thể, về cảm xúc suy nghĩ, và về hành vi.');
    const g = [
      ['LuHeartPulse', 'Cơ thể', ['Mệt mỏi, tim đập nhanh', 'Đau đầu, trí nhớ giảm', 'Khó tập trung']],
      ['LuBrain', 'Cảm xúc, suy nghĩ', ['Lo lắng, sợ hãi, bồn chồn', 'Tự ti, mặc cảm, vô vọng', 'Tự đổ lỗi, hay so sánh']],
      ['LuActivity', 'Hành vi', ['Khó ngủ, ăn không ngon', 'Dễ cáu giận, ngại tiếp xúc', 'Rượu bia, hút thuốc để thể hiện']],
    ];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 4.15;
      card(s, x, 1.95, 3.9, 4.4);
      await iconCircle(s, g[i][0], x + 0.35, 2.25, 0.9, i === 1 ? C.gold : C.mint, i === 1 ? C.darker : C.green);
      txt(s, g[i][1], x + 0.35, 3.35, 3.2, 0.5, { fontSize: 22, bold: true });
      bullets(s, g[i][2], x + 0.35, 3.95, 3.3, 2.2, { fontSize: 17, color: C.muted, gap: 8 });
    }
    source(s, 'Nguồn: tổng hợp tài liệu tham khảo của nhóm nghiên cứu');
  }

  // ================= 25. BIỂU HIỆN – KHẢO SÁT 230 =================
  {
    const s = light('Biểu hiện · Kết quả khảo sát', 'Biểu hiện áp lực ở học sinh khối 10', HN + 'Đây là kết quả khảo sát 230 học sinh khối 10, sắp xếp theo tỷ lệ trả lời "Có". Cao nhất là nỗi sợ tụt lại phía sau, thua kém bạn bè: 211 bạn, chiếm 91,74%. Tiếp theo là cảm thấy mình thật tệ mỗi lần bị điểm kém: 200 bạn, 86,96%. Vui cho thành công của bạn nhưng ngay sau đó buồn cho bản thân: 196 bạn, 85,22%. Thói quen tự so sánh: 188 bạn, 81,74%. Căng thẳng khi xung quanh ai cũng học giỏi và mất ngủ khi điểm thấp hơn bạn cùng nhóm: đều 80,43%.');
    const d = [
      ['Sợ tụt lại phía sau, thua kém bạn bè', 91.74, '91,74%', 211],
      ['Thấy mình thật tệ mỗi lần bị điểm kém', 86.96, '86,96%', 200],
      ['Vui cho bạn nhưng ngay sau đó buồn cho mình', 85.22, '85,22%', 196],
      ['Có thói quen tự so sánh với bạn cùng lứa', 81.74, '81,74%', 188],
      ['Căng thẳng khi quanh mình ai cũng học giỏi', 80.43, '80,43%', 185],
      ['Suy nghĩ nhiều, mất ngủ khi điểm thấp hơn bạn', 80.43, '80,43%', 185],
    ];
    const lx = M, lw = 4.9, bx = M + 5.05, bw = 5.9, rowH = 0.72;
    d.forEach((r, i) => {
      const y = 2.0 + i * rowH;
      txt(s, r[0], lx, y, lw, 0.5, { fontSize: 16, valign: 'middle' });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: y + 0.1, w: bw, h: 0.3, rectRadius: 0.15, fill: { color: C.track }, line: { type: 'none' } });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y: y + 0.1, w: bw * r[1] / 100, h: 0.3, rectRadius: 0.15, fill: { color: i === 0 ? C.gold : C.green }, line: { type: 'none' } });
      txt(s, r[2], bx + bw + 0.15, y, 1.2, 0.5, { fontSize: 18, bold: true, valign: 'middle', color: i === 0 ? C.ink : C.green });
    });
    txt(s, 'Tỷ lệ học sinh trả lời “Có”', bx, 1.62, 5, 0.3, { fontSize: 13, color: C.muted });
    source(s, 'Nguồn: khảo sát học sinh khối 10 THPT Lương Thế Vinh của nhóm nghiên cứu, n = 230, năm 2026');
  }

  // ================= 26. STAT 80–92 =================
  {
    const s = light('Biểu hiện · Nhận định', 'Áp lực đồng trang lứa phổ biến ở khối 10', HN + 'Tổng hợp lại: tỷ lệ học sinh 15, 16 tuổi đang chịu ảnh hưởng của áp lực đồng trang lứa chiếm từ 80,43% đến 91,74% tùy từng biểu hiện. Biểu hiện nổi bật nhất là nỗi sợ thua kém bạn bè. Điều đáng chú ý là áp lực không chỉ dừng ở suy nghĩ mà còn ảnh hưởng đến cả giấc ngủ và ăn uống.');
    txt(s, '80,43–91,74%', M, 2.0, 7, 2.0, { fontSize: 60, bold: true, color: C.gold, valign: 'middle' });
    txt(s, 'học sinh khối 10 có biểu hiện áp lực đồng trang lứa, tùy theo từng khía cạnh', M, 4.05, 6.4, 1.0, { fontSize: 22, bold: true });
    const k = [['LuTrendingDown', '91,74%', 'sợ tụt lại phía sau là biểu hiện phổ biến nhất'], ['LuMoon', '80,43%', 'mất ngủ, ăn không ngon khi điểm thấp hơn bạn']];
    for (let i = 0; i < 2; i++) {
      const y = 2.0 + i * 2.2;
      card(s, 7.6, y, 5.17, 1.95);
      await iconCircle(s, L[k[i][0]] ? k[i][0] : 'LuActivity', 7.9, y + 0.55, 0.85, C.mint, C.green);
      txt(s, k[i][1], 9.0, y + 0.3, 3.5, 0.65, { fontSize: 32, bold: true, color: C.green });
      txt(s, k[i][2], 9.0, y + 0.95, 3.55, 0.8, { fontSize: 16, color: C.muted });
    }
    source(s, 'Nguồn: khảo sát học sinh khối 10 của nhóm nghiên cứu, n = 230, năm 2026');
  }

  // ================= 27. NGUYÊN NHÂN – PHÂN TÍCH =================
  {
    const s = light('Nguyên nhân · Phân tích', 'Ba lớp nguyên nhân hình thành áp lực', HN + 'Nguyên nhân hình thành áp lực có ba lớp. Thứ nhất, văn hóa "nhìn con nhà người ta mà xem": thói quen so sánh được gieo từ nhỏ. Thứ hai, đặc điểm lớp 10: chuyển biến tâm sinh lý, khát khao hòa nhập; các bạn ngầm đối chiếu điểm thi tuyển sinh, kết quả kiểm tra đầu năm; ngay cả chọn tổ hợp môn, lớp học thêm, câu lạc bộ cũng chịu tác động từ nhóm bạn mới. Thứ ba, mạng xã hội là con dao hai lưỡi: phụ huynh khoe thành tích của con, bạn bè đăng hình ảnh trau chuốt khiến học sinh tự cho rằng mình thua kém.');
    const c = [
      ['LuHouse', 'Gia đình', '“Nhìn con nhà người ta mà xem”', 'Thói quen so sánh, đề cao thứ hạng được gieo từ nhỏ'],
      ['LuSchool', 'Lứa tuổi, trường học', 'Khát khao hòa nhập', 'So điểm tuyển sinh; chọn tổ hợp, học thêm, CLB theo nhóm bạn'],
      ['LuSmartphone', 'Mạng xã hội', '“Con dao hai lưỡi”', 'Phụ huynh khoe thành tích; bạn bè đăng hình ảnh trau chuốt'],
    ];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 4.15;
      dpanel(s, x, 1.95, 3.9, 4.4);
      await iconCircle(s, c[i][0], x + 0.35, 2.25, 0.85, '1D5A45', C.gold);
      txt(s, c[i][1], x + 0.35, 3.25, 3.2, 0.5, { fontSize: 21, bold: true, color: C.white });
      txt(s, c[i][2], x + 0.35, 3.8, 3.3, 0.55, { fontFace: FA, italic: true, fontSize: 19, color: C.gold });
      txt(s, c[i][3], x + 0.35, 4.6, 3.25, 1.6, { fontSize: 16, color: C.soft });
    }
  }

  // ================= 28. NGUYÊN NHÂN – HỌC SINH =================
  {
    const s = light('Nguyên nhân · Góc nhìn học sinh', 'Học sinh nhận diện nguyên nhân áp lực', HN + 'Nhóm khảo sát lần 1 qua Google Forms và phỏng vấn nhanh 100 học sinh khối 10 về nguyên nhân. Từ 75% đến 90% học sinh đồng tình với các nhóm nguyên nhân. Cao nhất là so sánh trên mạng xã hội: 90%. Bị gia đình, thầy cô so sánh: 88%. Môi trường lớp học, nhóm bạn: 85%. Kỳ vọng cao từ phụ huynh và thầy cô: 77%. Tâm lý tự ti, nhút nhát, sợ bị tẩy chay: 75%.');
    const d = [['So sánh trên mạng xã hội', 90], ['Bị gia đình, thầy cô so sánh', 88], ['Môi trường lớp học, nhóm bạn', 85], ['Kỳ vọng cao từ phụ huynh và thầy cô', 77], ['Tự ti, nhút nhát, sợ bị tẩy chay, bỏ rơi', 75]];
    // vertical columns
    const baseY = 5.75, maxH = 3.3, cw = 1.55, gap = (W - 2 * M - 5 * cw) / 4;
    d.forEach((r, i) => {
      const x = M + i * (cw + gap), h = maxH * r[1] / 100;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: baseY - h, w: cw, h, rectRadius: 0.12, fill: { color: i === 0 ? C.gold : C.green }, line: { type: 'none' } });
      txt(s, r[1] + '%', x - 0.2, baseY - h - 0.55, cw + 0.4, 0.5, { fontSize: 24, bold: true, align: 'center', color: i === 0 ? C.ink : C.green });
      txt(s, r[0], x - 0.35, baseY + 0.1, cw + 0.7, 0.75, { fontSize: 14, align: 'center', color: C.ink });
    });
    s.addShape(pres.shapes.LINE, { x: M, y: baseY, w: W - 2 * M, h: 0, line: { color: C.soft, width: 1 } });
    source(s, 'Nguồn: khảo sát lần 1 và phỏng vấn nhanh 100 học sinh khối 10 của nhóm nghiên cứu, năm 2026');
  }

  // ================= 29. QUOTE HIẾU =================
  {
    const s = dark(HN + 'Chia sẻ về điều này, bạn Ngô Quốc Hiếu cho biết: "Nguyên nhân chính là do mình thôi, mình bị điểm thấp hay mình có nhiều điều chưa tốt so với bạn bè, tự ti, mình lại rất muốn hòa nhập giống bạn bè." Từ kết quả khảo sát, nhóm nhận thấy các bạn có nhận thức đúng về nguyên nhân, và nguyên nhân chính đến từ yếu tố chủ quan của chính học sinh.');
    await iconCircle(s, 'LuQuote', M, 0.9, 0.9, C.gold, C.darker);
    txt(s, '“Nguyên nhân chính là do mình thôi, mình bị điểm thấp hay có nhiều điều chưa tốt so với bạn bè, tự ti, mình lại rất muốn hòa nhập giống bạn bè.”', M, 2.0, 7.6, 3.0, { fontSize: 28, bold: true, color: C.white });
    txt(s, 'Ngô Quốc Hiếu · học sinh khối 10, phỏng vấn của nhóm', M, 5.15, 7.5, 0.4, { fontSize: 16, color: C.soft });
    const ph = await photo('image6.jpeg', 3.6, 4.6);
    s.addImage({ data: ph, x: 9.0, y: 1.1, w: 3.6, h: 4.6 });
    txt(s, 'Phỏng vấn các bạn học sinh', 9.0, 5.8, 3.6, 0.35, { fontSize: 13, color: C.soft, italic: true, align: 'center' });
    txt(s, [b('Nhận định: ', { color: C.gold }), n('nguyên nhân chính của áp lực đến từ yếu tố chủ quan của học sinh.', { color: C.white })], M, 5.8, 8, 0.5, { fontSize: 18 });
  }

  // ================= 30. PHỤ HUYNH 1/2 =================
  function stackBar(s, x, y, w, segs, colors) {
    let cx = x;
    segs.forEach((sg, i) => {
      const sw = w * sg[1] / 100;
      if (sw <= 0) return;
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y, w: sw, h: 0.55, fill: { color: colors[i] }, line: { color: C.bg, width: 1.5 } });
      if (sw > 0.75) txt(s, sg[2], cx, y, sw, 0.55, { fontSize: 15, bold: true, align: 'center', valign: 'middle', color: colors[i] === C.gold || colors[i] === C.track || colors[i] === 'B9D9C8' ? C.ink : C.white });
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
  {
    const s = light('Nguyên nhân · Góc nhìn phụ huynh · 1/2', 'Phụ huynh ít chia sẻ nhưng vẫn hay so sánh', HN + 'Gia đình cũng là một nguyên nhân, nên nhóm khảo sát 45 phụ huynh khối 10 qua 2 đợt. Câu 1: phụ huynh có chia sẻ với con về áp lực không? Chưa bao giờ 31,1%, hiếm khi 46,7%, thường xuyên chỉ 22,2%. Câu 2: có so sánh con với "con nhà người ta" không? Chưa bao giờ chỉ 6,7%, có nhưng ít 71,1%, thường xuyên vì thấy cần thiết 22,2%.');
    const cols = [C.coral, C.gold, C.green];
    card(s, M, 1.95, W - 2 * M, 2.05);
    txt(s, 'Phụ huynh có bao giờ chia sẻ với con về những áp lực của con?', M + 0.35, 2.12, 11.5, 0.45, { fontSize: 19, bold: true });
    stackBar(s, M + 0.35, 2.7, W - 2 * M - 0.7, [['Chưa bao giờ', 31.1, '31,1%'], ['Hiếm khi', 46.7, '46,7%'], ['Thường xuyên', 22.2, '22,2%']], cols);
    legend(s, M + 0.35, 3.4, ['Chưa bao giờ: 31,1% (14)', 'Hiếm khi: 46,7% (21)', 'Thường xuyên: 22,2% (10)'], cols);
    card(s, M, 4.25, W - 2 * M, 2.05);
    txt(s, 'Phụ huynh có hay so sánh con mình với “con nhà người ta”?', M + 0.35, 4.42, 11.5, 0.45, { fontSize: 19, bold: true });
    const cols2 = [C.green, C.gold, C.coral];
    stackBar(s, M + 0.35, 5.0, W - 2 * M - 0.7, [['Chưa bao giờ', 6.7, '6,7%'], ['Có nhưng ít', 71.1, '71,1%'], ['Thường xuyên', 22.2, '22,2%']], cols2);
    legend(s, M + 0.35, 5.7, ['Chưa bao giờ: 6,7% (3)', 'Có nhưng ít: 71,1% (32)', 'Thường xuyên, vì thấy cần thiết: 22,2% (10)'], cols2);
    source(s, 'Nguồn: khảo sát 45 phụ huynh học sinh khối 10 của nhóm nghiên cứu, năm 2026');
  }

  // ================= 31. PHỤ HUYNH 2/2 =================
  {
    const s = light('Nguyên nhân · Góc nhìn phụ huynh · 2/2', 'Kỳ vọng cao, chưa hiểu rõ con, khoe thành tích', HN + 'Câu 3: phụ huynh có tìm hiểu sở thích, điểm mạnh của con không? Chưa tìm hiểu 2,2%, có nhưng không rõ 71,1%, hiểu rõ chỉ 26,7%. Câu 4: có đặt kỳ vọng quá khả năng của con không? 46,7% trả lời có. Câu 5: có khoe thành tích của con lên mạng xã hội không? 57,8% trả lời có.');
    const cols = [C.coral, C.gold, C.green];
    card(s, M, 1.95, W - 2 * M, 2.05);
    txt(s, 'Phụ huynh có tìm hiểu về sở thích và điểm mạnh của con?', M + 0.35, 2.12, 11.5, 0.45, { fontSize: 19, bold: true });
    stackBar(s, M + 0.35, 2.7, W - 2 * M - 0.7, [['Chưa', 2.2, '2,2%'], ['Không rõ', 71.1, '71,1%'], ['Hiểu rõ', 26.7, '26,7%']], cols);
    legend(s, M + 0.35, 3.4, ['Chưa tìm hiểu: 2,2% (1)', 'Có nhưng không rõ: 71,1% (32)', 'Hiểu rõ: 26,7% (12)'], cols);
    const k = [['46,7%', 'đặt tiêu chuẩn, kỳ vọng vượt quá khả năng của con', '21/45 phụ huynh'], ['57,8%', 'khoe thành tích của con lên mạng xã hội', '26/45 phụ huynh']];
    for (let i = 0; i < 2; i++) {
      const x = M + i * 6.2;
      card(s, x, 4.25, 5.95, 2.05);
      txt(s, k[i][0], x + 0.35, 4.4, 2.6, 1.0, { fontSize: 44, bold: true, color: i === 1 ? C.gold : C.coral, valign: 'middle' });
      txt(s, k[i][1], x + 2.95, 4.5, 2.8, 1.1, { fontSize: 17, bold: true, valign: 'middle' });
      txt(s, k[i][2], x + 0.35, 5.55, 5.2, 0.4, { fontSize: 14, color: C.muted });
    }
    source(s, 'Nguồn: khảo sát 45 phụ huynh học sinh khối 10 của nhóm nghiên cứu, năm 2026');
  }

  // ================= 32. PHỤ HUYNH – TỔNG HỢP =================
  {
    const s = light('Nguyên nhân · Nhận định', 'Gia đình: nguồn áp lực vô hình', HN + 'Tổng hợp: 93,3% phụ huynh ở các mức độ khác nhau vẫn so sánh con với "con nhà người ta". 77,8%, tức 35 trên 45 phụ huynh, chưa bao giờ hoặc hiếm khi chia sẻ với con. 73,3%, tức 33 trên 45, chưa tìm hiểu hoặc chưa hiểu rõ sở thích, điểm mạnh của con. Khi kỳ vọng không đạt, gánh nặng tâm lý của các em càng lớn, dễ chuyển biến tiêu cực, thậm chí nảy sinh suy nghĩ cực đoan như bỏ học hoặc tự làm hại bản thân.');
    const k = [['93,3%', 'vẫn so sánh con với “con nhà người ta”', '42/45 phụ huynh'], ['77,8%', 'chưa bao giờ hoặc hiếm khi chia sẻ với con', '35/45 phụ huynh'], ['73,3%', 'chưa hiểu rõ sở thích, điểm mạnh của con', '33/45 phụ huynh']];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 4.15;
      card(s, x, 1.95, 3.9, 2.85);
      txt(s, k[i][0], x + 0.35, 2.15, 3.3, 1.1, { fontSize: 56, bold: true, color: i === 0 ? C.gold : C.green, valign: 'middle' });
      txt(s, k[i][1], x + 0.35, 3.3, 3.25, 0.85, { fontSize: 18, bold: true });
      txt(s, k[i][2], x + 0.35, 4.2, 3.2, 0.4, { fontSize: 14, color: C.muted });
    }
    dpanel(s, M, 5.05, W - 2 * M, 1.3);
    await iconCircle(s, 'LuTriangleAlert', M + 0.3, 5.33, 0.74, C.coral, C.white);
    txt(s, 'Kỳ vọng không đạt → gánh nặng tâm lý lớn dần → nguy cơ suy nghĩ cực đoan như bỏ học, tự làm hại bản thân.', M + 1.3, 5.05, W - 2 * M - 1.6, 1.3, { fontSize: 19, color: C.white, valign: 'middle' });
    source(s, 'Nguồn: khảo sát 45 phụ huynh học sinh khối 10 của nhóm nghiên cứu, năm 2026');
  }

  // ================= 33. SECTION 05 =================
  section('05', 'Ảnh hưởng của áp lực đồng trang lứa', 'Ảnh hưởng tích cực · Ảnh hưởng tiêu cực · Mô hình tác động', HN + 'Phần thứ năm: ảnh hưởng của áp lực đồng trang lứa đối với học sinh khối 10.');

  // ================= 34. TÍCH CỰC =================
  {
    const s = light('Ảnh hưởng · Tích cực', 'Khi bạn bè là tấm gương tốt', HN + 'Ông bà ta dạy "Gần mực thì đen, gần đèn thì rạng". Áp lực đồng trang lứa có ảnh hưởng tích cực khi bạn bè có hành vi tích cực như tình nguyện làm từ thiện, xuất sắc trong học tập, tham gia dự án. Một số nghiên cứu còn quan sát thấy áp lực bạn bè có thể là yếu tố bảo vệ chống lại việc sử dụng chất gây nghiện.');
    dpanel(s, M, 1.95, 5.3, 4.4);
    txt(s, '“Gần mực thì đen, gần đèn thì rạng”', M + 0.45, 2.4, 4.4, 2.2, { fontFace: FA, italic: true, fontSize: 34, color: C.gold });
    txt(s, 'Tục ngữ Việt Nam', M + 0.45, 4.85, 4.4, 0.4, { fontSize: 16, color: C.soft });
    const p = [['LuHeart', 'Lan tỏa hành vi tích cực', 'Tình nguyện, làm từ thiện cùng bạn bè'], ['LuGraduationCap', 'Động lực học tập', 'Học hỏi bạn xuất sắc, tham gia dự án'], ['LuShieldAlert', 'Yếu tố bảo vệ', 'Có thể giúp chống lại chất gây nghiện']];
    for (let i = 0; i < 3; i++) {
      const y = 1.95 + i * 1.5;
      card(s, 6.2, y, 6.57, 1.32);
      await iconCircle(s, p[i][0], 6.45, y + 0.26, 0.8, C.mint, C.green);
      txt(s, p[i][1], 7.5, y + 0.2, 5, 0.45, { fontSize: 19, bold: true });
      txt(s, p[i][2], 7.5, y + 0.68, 5, 0.45, { fontSize: 16, color: C.muted });
    }
  }

  // ================= 35. TIÊU CỰC =================
  {
    const s = light('Ảnh hưởng · Tiêu cực', 'Bốn nhóm ảnh hưởng tiêu cực', HN + 'Áp lực đồng trang lứa có nhiều ảnh hưởng tiêu cực. Một, làm mất tự tin, lệ thuộc người khác, muốn thành công nhanh nên làm vội vàng và dễ thất bại. Hai, trở nên đố kị: sự ghen tị là hậu quả của so sánh; xa rời các mối quan hệ, nóng nảy, dễ tranh cãi với người thân. Ba, sức khỏe suy giảm, tinh thần sa sút do làm việc quá sức, thiếu ngủ, ăn uống kém. Bốn, bị cuốn theo cám dỗ: đua đòi, a dua, tệ nạn xã hội.');
    const g = [['LuFrown', 'Mất tự tin', 'Lệ thuộc người khác; nóng vội muốn thành công nhanh nên dễ thất bại'], ['LuMessagesSquare', 'Đố kị với bạn bè', 'Ghen tị vì so sánh; xa rời quan hệ, nóng nảy, dễ tranh cãi'], ['LuHeartPulse', 'Sức khỏe suy giảm', 'Quá sức, thiếu ngủ, ăn uống kém, tinh thần sa sút'], ['LuTriangleAlert', 'Bị cuốn theo cám dỗ', 'Đua đòi, a dua theo bạn xấu, nguy cơ tệ nạn xã hội']];
    for (let i = 0; i < 4; i++) {
      const x = M + (i % 2) * 6.2, y = 1.95 + Math.floor(i / 2) * 2.25;
      card(s, x, y, 5.95, 2.05);
      await iconCircle(s, g[i][0], x + 0.3, y + 0.35, 0.9, 'FFE6E0', C.coral);
      txt(s, g[i][1], x + 1.45, y + 0.3, 4.3, 0.5, { fontSize: 21, bold: true });
      txt(s, g[i][2], x + 1.45, y + 0.85, 4.25, 1.05, { fontSize: 16, color: C.muted });
    }
  }

  // ================= 36. MÔ HÌNH TÁC ĐỘNG =================
  {
    const s = light('Ảnh hưởng · Mô hình hóa', 'Mô hình tác động của áp lực đồng trang lứa', HN + 'Từ kết quả nghiên cứu, nhóm mô hình hóa mối quan hệ như sau. Các nguồn tác động gồm gia đình, nhóm bạn và lớp học, mạng xã hội, cùng đặc điểm tâm lý cá nhân. Chúng tạo nên áp lực đồng trang lứa, biểu hiện qua cơ thể, cảm xúc và hành vi. Hệ quả tác động lên hai mặt: sức khỏe tâm lý và hành vi học tập. Các giải pháp của nhóm tác động vào từng mắt xích của mô hình này.');
    const colX = [M, 3.85, 6.95, 10.05], cw = 2.72;
    const heads = ['Nguồn tác động', 'Áp lực', 'Biểu hiện', 'Hệ quả'];
    const boxes = [
      ['Gia đình: so sánh, kỳ vọng', 'Nhóm bạn, lớp học', 'Mạng xã hội', 'Tâm lý cá nhân: tự ti'],
      [],
      ['Cơ thể: mệt mỏi, mất ngủ', 'Cảm xúc: lo âu, tự ti', 'Hành vi: né tránh, đua đòi'],
      ['Sức khỏe tâm lý', 'Hành vi học tập'],
    ];
    heads.forEach((h, i) => txt(s, h.toUpperCase(), colX[i], 1.85, cw, 0.35, { fontSize: 13, bold: true, color: C.green, align: 'center' }));
    // col0
    boxes[0].forEach((t, j) => { card(s, colX[0], 2.3 + j * 0.92, cw, 0.76); txt(s, t, colX[0] + 0.15, 2.3 + j * 0.92, cw - 0.3, 0.76, { fontSize: 15, bold: true, align: 'center', valign: 'middle' }); });
    // col1 center
    dpanel(s, colX[1], 3.05, cw, 2.1);
    txt(s, 'Áp lực đồng trang lứa', colX[1] + 0.2, 3.05, cw - 0.4, 2.1, { fontSize: 22, bold: true, color: C.gold, align: 'center', valign: 'middle' });
    boxes[2].forEach((t, j) => { card(s, colX[2], 2.55 + j * 1.1, cw, 0.9); txt(s, t, colX[2] + 0.15, 2.55 + j * 1.1, cw - 0.3, 0.9, { fontSize: 15, bold: true, align: 'center', valign: 'middle' }); });
    boxes[3].forEach((t, j) => { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: colX[3], y: 2.75 + j * 1.45, w: cw, h: 1.15, rectRadius: 0.2, fill: { color: 'FFE6E0' }, line: { color: C.coral, width: 1 } }); txt(s, t, colX[3] + 0.15, 2.75 + j * 1.45, cw - 0.3, 1.15, { fontSize: 17, bold: true, align: 'center', valign: 'middle' }); });
    for (let i = 0; i < 3; i++) {
      const x1 = colX[i] + cw + 0.05, x2 = colX[i + 1] - 0.05;
      s.addShape(pres.shapes.LINE, { x: x1, y: 4.1, w: x2 - x1, h: 0, line: { color: C.green, width: 2.5, endArrowType: 'triangle' } });
    }
    card(s, M, 6.45 - 0.35, W - 2 * M, 0.6);
    txt(s, [b('Giải pháp ', { color: C.green }), n('tác động vào từng mắt xích: nguồn tác động, nhận thức, kỹ năng ứng phó và mạng lưới hỗ trợ.')], M + 0.3, 6.1, W - 2 * M - 0.6, 0.6, { fontSize: 16, valign: 'middle' });
    source(s, 'Sơ đồ do nhóm tổng hợp từ kết quả khảo sát và cơ sở lý luận (mục tiêu 2: mô hình hóa)');
  }

  // ================= 37. SECTION 06 =================
  {
    const s = section('06', 'Hệ thống giải pháp', 'Phần 1: học sinh và gia đình · Phần 2: nhà trường · Truyền thông và kết nối', VH + 'Phần thứ sáu: hệ thống giải pháp, chia làm hai phần. Phần 1 dành cho học sinh và gia đình. Phần 2 dành cho nhà trường, kèm hoạt động truyền thông và kết nối.');
  }

  // ================= 38. HỌC SINH – NHẬN THỨC =================
  {
    const s = light('Giải pháp phần 1 · Học sinh', 'Nâng cao nhận thức, chủ động hòa nhập', VH + 'Đối với chính học sinh: trước hết cần hiểu rõ bản chất hai mặt của áp lực đồng trang lứa để chuyển hóa áp lực thành động lực, thay vì tự ti hay chạy theo chuẩn mực lệch lạc. Bên cạnh đó, tích cực tham gia câu lạc bộ, hoạt động ngoại khóa để có môi trường lành mạnh, mở rộng giao lưu và học hỏi giá trị tích cực từ bạn bè.');
    dpanel(s, M, 1.95, 5.6, 4.4);
    txt(s, 'Áp lực', M + 0.5, 2.4, 4.6, 0.8, { fontSize: 36, bold: true, color: C.white });
    await iconCircle(s, 'LuArrowDown', M + 0.5, 3.35, 0.7, '1D5A45', C.gold);
    txt(s, 'chuyển hóa thành', M + 1.35, 3.35, 3.5, 0.7, { fontSize: 18, color: C.soft, valign: 'middle' });
    txt(s, 'Động lực', M + 0.5, 4.2, 4.6, 0.9, { fontFace: FA, italic: true, fontSize: 44, color: C.gold });
    const it = [['LuLightbulb', 'Hiểu bản chất hai mặt', 'Áp lực có mặt tích cực và tiêu cực'], ['LuTarget', 'Biến áp lực thành động lực', 'Không tự ti, không chạy theo chuẩn mực lệch lạc'], ['LuUsers', 'Chủ động hòa nhập', 'Tham gia CLB, ngoại khóa lành mạnh, học hỏi bạn bè']];
    for (let i = 0; i < 3; i++) {
      const y = 1.95 + i * 1.5;
      card(s, 6.5, y, 6.27, 1.32);
      await iconCircle(s, it[i][0], 6.75, y + 0.26, 0.8, C.mint, C.green);
      txt(s, it[i][1], 7.8, y + 0.2, 4.8, 0.45, { fontSize: 19, bold: true });
      txt(s, it[i][2], 7.8, y + 0.68, 4.8, 0.45, { fontSize: 16, color: C.muted });
    }
  }

  // ================= 39. NEO CẢM XÚC =================
  {
    const s = light('Giải pháp phần 1 · Học sinh', 'Thực hành “Neo cảm xúc”: 6 kỹ năng', VH + 'Kỹ năng thứ hai là "Neo cảm xúc" với 6 bước. Một, tách cảm xúc khỏi hành động: khi xúc động mạnh, tạm dừng, không quyết định vội. Hai, duy trì sự bình tĩnh để nhìn nhận thấu đáo. Ba, kiểm soát bốc đồng: dành một khoảng lặng trước khi phản ứng, có thể tạm lùi lại. Bốn, ghi chép cảm xúc để giải tỏa và sắp xếp vấn đề khách quan. Năm, điều tiết cảm xúc qua ngôn từ: "Lời nói chẳng mất tiền mua, lựa lời mà nói cho vừa lòng nhau". Sáu, nuôi dưỡng tinh thần lạc quan, là lá chắn trước tác động tiêu cực.');
    const k = [['LuPause', 'Tách cảm xúc khỏi hành động', 'Tạm dừng, không quyết định vội'], ['LuWind', 'Duy trì sự bình tĩnh', 'Nhìn nhận vấn đề thấu đáo'], ['LuShieldAlert', 'Kiểm soát bốc đồng', 'Dành khoảng lặng trước khi phản ứng'], ['LuNotebookPen', 'Viết ra cảm xúc', 'Giải tỏa, sắp xếp vấn đề khách quan'], ['LuMessageCircle', 'Điều tiết qua ngôn từ', '“Lựa lời mà nói cho vừa lòng nhau”'], ['LuSmile', 'Nuôi dưỡng lạc quan', 'Lá chắn trước tác động tiêu cực']];
    for (let i = 0; i < 6; i++) {
      const x = M + (i % 3) * 4.15, y = 1.95 + Math.floor(i / 3) * 2.25;
      card(s, x, y, 3.9, 2.05);
      numCircle(s, i + 1, x + 0.3, y + 0.3, 0.62, i === 0 ? C.gold : C.dark, i === 0 ? C.darker : C.white, 18);
      const ic = L[k[i][0]] ? k[i][0] : 'LuCircleHelp';
      await iconCircle(s, ic, x + 3.0, y + 0.28, 0.62, C.mint, C.green);
      txt(s, k[i][1], x + 0.3, y + 1.0, 3.4, 0.45, { fontSize: 17, bold: true });
      txt(s, k[i][2], x + 0.3, y + 1.55, 3.4, 0.45, { fontSize: 14, color: C.muted });
    }
  }

  // ================= 40. TIẾNG NÓI HỌC SINH =================
  {
    const s = light('Giải pháp phần 1 · Học sinh', 'Học sinh chủ động tìm cách vượt qua', VH + 'Kết quả khảo sát câu hỏi "Bạn có giải pháp nào giúp hạn chế áp lực đồng trang lứa cho bản thân?" cho thấy 46% học sinh chủ động đề xuất được biện pháp thiết thực. Bạn Nguyễn Khánh Chi, lớp 10A11 chia sẻ: "Bình tĩnh giải quyết vấn đề, cố gắng học tập tốt, suy nghĩ tích cực". Bạn Phạm Thái Tường Vy, lớp 10A9: "Không tự so sánh mình với người khác, rèn luyện thể dục thể thao, nghe nhạc khi cảm thấy bị áp lực".');
    txt(s, '46%', M, 2.0, 4.5, 1.6, { fontSize: 96, bold: true, color: C.gold, valign: 'middle' });
    txt(s, 'học sinh chủ động đề xuất được biện pháp tự điều chỉnh tâm lý', M, 3.7, 4.3, 1.2, { fontSize: 20, bold: true });
    txt(s, 'Câu hỏi: “Bạn có giải pháp nào giúp hạn chế áp lực đồng trang lứa cho bản thân?”', M, 5.0, 4.3, 1.0, { fontSize: 15, color: C.muted, italic: true });
    const q = [['“Bình tĩnh giải quyết vấn đề, cố gắng học tập tốt, suy nghĩ tích cực.”', 'Nguyễn Khánh Chi · lớp 10A11'], ['“Không tự so sánh mình với người khác, rèn luyện thể dục thể thao, nghe nhạc khi cảm thấy bị áp lực.”', 'Phạm Thái Tường Vy · lớp 10A9']];
    for (let i = 0; i < 2; i++) {
      const y = 1.95 + i * 2.25;
      dpanel(s, 5.3, y, 7.47, 2.05);
      await iconCircle(s, 'LuQuote', 5.6, y + 0.3, 0.6, C.gold, C.darker);
      txt(s, q[i][0], 6.4, y + 0.25, 6.1, 1.2, { fontSize: 19, bold: true, color: C.white });
      txt(s, q[i][1], 6.4, y + 1.5, 6.1, 0.4, { fontSize: 14, color: C.soft });
    }
    source(s, 'Nguồn: khảo sát học sinh khối 10 THPT Lương Thế Vinh của nhóm nghiên cứu, năm 2026');
  }

  // ================= 41. GIA ĐÌNH =================
  {
    const s = light('Giải pháp phần 1 · Gia đình', 'Cha mẹ là điểm tựa tinh thần của con', VH + 'Đối với gia đình: cha mẹ cần trở thành điểm tựa tinh thần vững chắc và tấm gương tích cực cho con, tránh đặt con lên bàn cân so sánh với bạn bè. Phụ huynh nên dành thời gian trò chuyện cởi mở về đời sống học đường và bạn bè để hiểu khó khăn của con. Thay vì áp đặt kỳ vọng một chiều, hãy kiên nhẫn lắng nghe, đồng hành và kịp thời khích lệ, động viên.');
    const g = [['LuScale', 'Không so sánh', 'Tránh đặt con lên bàn cân với bạn bè'], ['LuMessagesSquare', 'Trò chuyện cởi mở', 'Về học đường và các mối quan hệ bạn bè'], ['LuEar', 'Lắng nghe, đồng hành', 'Thay vì áp đặt kỳ vọng một chiều'], ['LuHeart', 'Khích lệ kịp thời', 'Giúp con tự tin, vững vàng hơn']];
    for (let i = 0; i < 4; i++) {
      const x = M + i * 3.1;
      card(s, x, 1.95, 2.9, 3.35);
      const ic = L[g[i][0]] ? g[i][0] : 'LuUsers';
      await iconCircle(s, ic, x + 0.3, 2.25, 0.85, i === 0 ? C.gold : C.mint, i === 0 ? C.darker : C.green);
      txt(s, g[i][1], x + 0.3, 3.3, 2.4, 0.65, { fontSize: 18, bold: true });
      txt(s, g[i][2], x + 0.3, 4.05, 2.35, 1.1, { fontSize: 16, color: C.muted });
    }
    dpanel(s, M, 5.55, W - 2 * M, 0.85);
    txt(s, [b('Đối chiếu khảo sát: ', { color: C.gold }), n('77,8% phụ huynh chưa bao giờ hoặc hiếm khi chia sẻ với con; 93,3% vẫn so sánh con.', { color: C.white })], M + 0.4, 5.55, W - 2 * M - 0.8, 0.85, { fontSize: 17, valign: 'middle' });
  }

  // ================= 42. NHÀ TRƯỜNG – MÔI TRƯỜNG & CLB =================
  {
    const s = light('Giải pháp phần 2 · Nhà trường', 'Môi trường tôn trọng khác biệt, đa dạng CLB', VH + 'Đối với nhà trường: xây dựng môi trường sư phạm tôn trọng sự khác biệt. Thầy cô khích lệ tiến bộ của từng cá nhân, tránh so sánh trực tiếp học sinh với nhau. Đồng thời đa dạng hóa câu lạc bộ học thuật, văn nghệ, thể thao, kỹ năng sống để học sinh khối 10 mở rộng kết nối ngoài lớp học, giao lưu, hòa nhập. Đây là một số hình ảnh hoạt động câu lạc bộ.');
    const it = [['LuSchool', 'Môi trường sư phạm tôn trọng khác biệt', 'Thầy cô khích lệ tiến bộ cá nhân, tránh so sánh trực tiếp học sinh'], ['LuUsers', 'Đa dạng câu lạc bộ, ngoại khóa', 'Học thuật, văn nghệ, thể thao, kỹ năng sống; mở rộng kết nối ngoài lớp']];
    for (let i = 0; i < 2; i++) {
      const y = 1.95 + i * 2.25;
      card(s, M, y, 5.6, 2.05);
      await iconCircle(s, it[i][0], M + 0.3, y + 0.3, 0.8, C.mint, C.green);
      txt(s, it[i][1], M + 1.3, y + 0.25, 4.1, 0.85, { fontSize: 18, bold: true });
      txt(s, it[i][2], M + 1.3, y + 1.1, 4.1, 0.85, { fontSize: 15, color: C.muted });
    }
    const imgs = ['image8.jpeg', 'image9.jpeg', 'image10.jpeg'];
    const pw = 2.08;
    for (let i = 0; i < 3; i++) {
      s.addImage({ data: await photo(imgs[i], pw, 3.9), x: 6.4 + i * (pw + 0.07), y: 1.95, w: pw, h: 3.9 });
    }
    txt(s, 'Hoạt động của các câu lạc bộ', 6.4, 5.95, 6.4, 0.35, { fontSize: 13, color: C.muted, italic: true, align: 'center' });
  }

  // ================= 43. HỘP THƯ =================
  {
    const s = light('Giải pháp phần 2 · Nhà trường', 'Hộp thư “Điều em muốn nói”', VH + 'Nhà trường duy trì kênh lắng nghe ẩn danh qua hộp thư "Điều em muốn nói", kết hợp hộp thư trực tiếp và trực tuyến. Mỗi khối bố trí một hộp thư; học sinh gửi thư có thể dùng mã số ký hiệu riêng để bảo mật danh tính, giúp các em mạnh dạn chia sẻ những khúc mắc khó nói.');
    const it = [['LuMail', 'Trực tiếp và trực tuyến', 'Mỗi khối lớp có một hộp thư góp ý, chia sẻ'], ['LuShieldAlert', 'Bảo mật danh tính', 'Học sinh dùng mã số ký hiệu riêng'], ['LuMessageCircle', 'Mạnh dạn chia sẻ', 'Bộc lộ những khúc mắc khó nói']];
    for (let i = 0; i < 3; i++) {
      const y = 1.95 + i * 1.5;
      card(s, M, y, 5.6, 1.32);
      await iconCircle(s, it[i][0], M + 0.25, y + 0.26, 0.8, i === 0 ? C.gold : C.mint, i === 0 ? C.darker : C.green);
      txt(s, it[i][1], M + 1.3, y + 0.2, 4.1, 0.45, { fontSize: 19, bold: true });
      txt(s, it[i][2], M + 1.3, y + 0.68, 4.1, 0.45, { fontSize: 15, color: C.muted });
    }
    const imgs = ['image11.jpeg', 'image12.jpeg', 'image13.jpeg'];
    const pw = 2.08;
    for (let i = 0; i < 3; i++) s.addImage({ data: await photo(imgs[i], pw, 3.9), x: 6.4 + i * (pw + 0.07), y: 1.95, w: pw, h: 3.9 });
    txt(s, 'Hộp thư “Điều em muốn nói” tại trường', 6.4, 5.95, 6.4, 0.35, { fontSize: 13, color: C.muted, italic: true, align: 'center' });
  }

  // ================= 44. TỔ TƯ VẤN =================
  {
    const s = light('Giải pháp phần 2 · Nhà trường', 'Tổ tư vấn tâm lý học đường', VH + 'Phát huy Tổ tư vấn tâm lý học đường với mạng lưới cộng tác viên học sinh: mỗi lớp cử ít nhất một bạn năng nổ, biết lắng nghe. Tư vấn định kỳ chiều thứ Tư và thứ Sáu hằng tuần, qua phản hồi thư hoặc trao đổi trực tiếp, dưới định hướng của giáo viên tư vấn tâm lý, giáo viên chủ nhiệm và Đoàn Thanh niên. Tại đây khoảng cách thầy trò và phân biệt thành tích được xóa nhòa.');
    const imgs = ['image14.jpeg', 'image15.jpeg', 'image16.jpeg'];
    const pw = 2.15;
    for (let i = 0; i < 3; i++) s.addImage({ data: await photo(imgs[i], pw, 3.9), x: M + i * (pw + 0.07), y: 1.95, w: pw, h: 3.9 });
    txt(s, 'Hoạt động của tổ tư vấn tâm lý', M, 5.95, 6.6, 0.35, { fontSize: 13, color: C.muted, italic: true, align: 'center' });
    const it = [['LuUsers', 'Cộng tác viên học sinh', 'Mỗi lớp ít nhất một bạn biết lắng nghe'], ['LuCalendar', 'Chiều thứ Tư và thứ Sáu', 'Phản hồi thư hoặc trao đổi trực tiếp'], ['LuGraduationCap', 'Phối hợp chuyên môn', 'GV tư vấn, GVCN, Đoàn Thanh niên']];
    for (let i = 0; i < 3; i++) {
      const y = 1.95 + i * 1.5;
      card(s, 7.2, y, 5.57, 1.32);
      await iconCircle(s, it[i][0], 7.45, y + 0.26, 0.8, C.mint, C.green);
      txt(s, it[i][1], 8.5, y + 0.2, 4.1, 0.45, { fontSize: 19, bold: true });
      txt(s, it[i][2], 8.5, y + 0.68, 4.1, 0.45, { fontSize: 15, color: C.muted });
    }
  }

  // ================= 45. TRUYỀN THÔNG =================
  {
    const s = light('Giải pháp · Truyền thông', 'Truyền thông đa kênh về áp lực đồng trang lứa', VH + 'Nhóm tổng hợp tài liệu từ sách báo và nguồn chính thống để truyền thông đa kênh. Thứ nhất, phát tờ rơi, cẩm nang ngắn về khái niệm, biểu hiện, cách ứng phó. Thứ hai, chia sẻ bài viết, infographic qua nhóm lớp trực tuyến. Thứ ba, lồng ghép vào sinh hoạt dưới cờ, sinh hoạt lớp và môn Hoạt động trải nghiệm, hướng nghiệp với các chủ đề khám phá bản thân, quan hệ bạn bè, kỹ năng từ chối, quản lý cảm xúc.');
    const st = [['LuNotebookPen', 'Tờ rơi, cẩm nang', 'Khái niệm, biểu hiện, cách ứng phó; dễ đọc, dễ lưu giữ'], ['LuShare2', 'Nhóm lớp trực tuyến', 'Bài viết, infographic, tài liệu tóm tắt tra cứu mọi lúc'], ['LuMegaphone', 'Sinh hoạt và HĐTN-HN', 'Lồng ghép sinh hoạt dưới cờ, sinh hoạt lớp, kỹ năng từ chối']];
    for (let i = 0; i < 3; i++) {
      const y = 1.95 + i * 1.5;
      card(s, M, y, 7.0, 1.32);
      numCircle(s, i + 1, M + 0.25, y + 0.3, 0.72, i === 0 ? C.gold : C.dark, i === 0 ? C.darker : C.white, 20);
      txt(s, st[i][1], M + 1.2, y + 0.18, 5.6, 0.45, { fontSize: 19, bold: true });
      txt(s, st[i][2], M + 1.2, y + 0.66, 5.6, 0.5, { fontSize: 15, color: C.muted });
    }
    const imgs = ['image18.jpeg', 'image20.jpeg'];
    for (let i = 0; i < 2; i++) s.addImage({ data: await photo(imgs[i], 2.48, 3.9), x: 7.8 + i * 2.52, y: 1.95, w: 2.45, h: 3.9 });
    txt(s, 'Nhóm tuyên truyền tại các lớp khối 10', 7.8, 5.95, 4.97, 0.35, { fontSize: 13, color: C.muted, italic: true, align: 'center' });
  }

  // ================= 46. TÌNH HUỐNG ĐÓNG VAI =================
  {
    const s = dark(VH + 'Trong tiết sinh hoạt tại các lớp 10 tham gia khảo sát ban đầu, nhóm đưa ra tình huống: "Các bạn thân rủ em đăng ký cùng một lớp học thêm, nhưng em đã có kế hoạch tự học. Em sẽ nói gì để các bạn hiểu quyết định của mình?" Các nhóm nhỏ đóng vai, thử ít nhất hai cách phản hồi và phân tích cảm xúc của cả người rủ lẫn người từ chối. Kết quả: đa số học sinh hào hứng, chủ động trao đổi. Nhóm đề xuất nhân rộng mô hình này.');
    txt(s, 'THỰC NGHIỆM · THẢO LUẬN TÌNH HUỐNG VÀ ĐÓNG VAI', M, 0.7, 10, 0.35, { fontSize: 14, bold: true, color: C.gold });
    txt(s, '“Các bạn thân rủ em đăng ký cùng một lớp học thêm, nhưng em đã có kế hoạch tự học. Em sẽ nói gì để các bạn hiểu quyết định của mình?”', M, 1.3, 7.4, 2.9, { fontSize: 27, bold: true, color: C.white });
    const st = ['Nhóm nhỏ đóng vai tình huống', 'Thử ít nhất hai cách phản hồi', 'Phân tích cảm xúc người rủ và người từ chối'];
    st.forEach((t, i) => {
      numCircle(s, i + 1, M, 4.45 + i * 0.68, 0.5, C.gold, C.darker, 15);
      txt(s, t, M + 0.7, 4.45 + i * 0.68, 6.6, 0.5, { fontSize: 17, color: C.white, valign: 'middle' });
    });
    s.addImage({ data: await photo('image19.jpeg', 3.7, 4.6), x: 8.9, y: 1.1, w: 3.7, h: 4.6 });
    txt(s, 'Kết quả: học sinh hào hứng, chủ động trao đổi', 8.9, 5.85, 3.7, 0.6, { fontSize: 14, color: C.gold, align: 'center', bold: true });
  }

  // ================= 47. KẾT NỐI =================
  {
    const s = light('Giải pháp · Kết nối', 'Kết nối đa chiều cùng học sinh', VH + 'Sự kết nối chân thành giúp mỗi người được lắng nghe và hỗ trợ kịp thời. Nhóm triển khai ba hình thức. Một, Fanpage "Trạm Sạc Tâm Hồn" đăng bài viết, góc nhìn tâm lý và cách giải tỏa áp lực; các bạn có thể nhắn tin trò chuyện. Hai, nhóm Zalo phụ huynh và giáo viên chủ nhiệm để chia sẻ dấu hiệu nhận biết và cách đồng hành cùng con. Ba, học nhóm và hoạt động nhóm trực tiếp. Kết quả: học sinh hòa đồng, cởi mở và tự tin hơn.');
    const k = [['LuBatteryCharging', 'Fanpage “Trạm Sạc Tâm Hồn”', 'Bài viết, góc nhìn tâm lý, cách giải tỏa áp lực; nơi nhắn tin trò chuyện'], ['LuMessagesSquare', 'Zalo phụ huynh và GVCN', 'Liên lạc thường xuyên; chia sẻ dấu hiệu nhận biết, cách đồng hành cùng con'], ['LuUsers', 'Học nhóm, hoạt động nhóm', 'Tương tác trực tiếp, hỗ trợ nhau, nhận ra điểm mạnh của từng bạn']];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 4.15;
      card(s, x, 1.95, 3.9, 3.35);
      const ic = L[k[i][0]] ? k[i][0] : 'LuHeart';
      await iconCircle(s, ic, x + 0.3, 2.25, 0.85, i === 0 ? C.gold : C.mint, i === 0 ? C.darker : C.green);
      txt(s, k[i][1], x + 0.3, 3.25, 3.3, 0.75, { fontSize: 19, bold: true });
      txt(s, k[i][2], x + 0.3, 4.0, 3.3, 1.2, { fontSize: 15, color: C.muted });
    }
    dpanel(s, M, 5.55, W - 2 * M, 0.85);
    await iconCircle(s, 'LuCheck', M + 0.3, 5.68, 0.6, C.green, C.white);
    txt(s, 'Kết quả ghi nhận: học sinh hòa đồng, cởi mở, thân thiện hơn và tự tin hơn trong giao tiếp, học tập.', M + 1.15, 5.55, W - 2 * M - 1.5, 0.85, { fontSize: 18, color: C.white, valign: 'middle' });
  }

  // ================= 48. SECTION 07 =================
  section('07', 'Đánh giá hiệu quả, kết luận và đề xuất', 'So sánh khảo sát lần 1 và lần 2 · Kết luận · Đề xuất', HN + 'Phần cuối: đánh giá hiệu quả sau khi áp dụng giải pháp, kết luận và đề xuất.');

  // ================= 49. 88 → 14 =================
  {
    const s = light('Đánh giá hiệu quả · Cảm giác mệt mỏi, căng thẳng', 'Cảm giác mệt mỏi, căng thẳng giảm rõ rệt', HN + 'Kết quả khảo sát lần 2 cho thấy rõ sự thay đổi. Với câu hỏi "Bạn có đang cảm thấy mệt mỏi, căng thẳng hay không?", đợt 1 có 88% trả lời có, sau khi áp dụng giải pháp, đợt 2 chỉ còn 14%.');
    const d1 = await donut(88, C.coral), d2 = await donut(14, C.green);
    const pos = [[M + 0.5, 'Đợt 1 · trước thực nghiệm', '88%', d1, C.coral], [7.4, 'Đợt 2 · sau thực nghiệm', '14%', d2, C.green]];
    for (const [x, lab, v, img, col] of pos) {
      s.addImage({ data: img, x, y: 2.0, w: 3.4, h: 3.4 });
      txt(s, v, x, 2.0, 3.4, 3.4, { fontSize: 48, bold: true, align: 'center', valign: 'middle', color: col });
      txt(s, lab, x - 0.3, 5.55, 4.0, 0.4, { fontSize: 18, bold: true, align: 'center' });
    }
    s.addImage({ data: await icon('LuArrowRight', C.gold), x: 5.4, y: 3.25, w: 1.0, h: 1.0 });
    card(s, 11.0, 2.4, 1.77, 2.6);
    txt(s, '−74', 11.0, 2.65, 1.77, 0.9, { fontSize: 34, bold: true, color: C.gold, align: 'center', valign: 'middle' });
    txt(s, 'điểm phần trăm học sinh thấy mệt mỏi, căng thẳng', 11.1, 3.55, 1.57, 1.35, { fontSize: 13, align: 'center', color: C.muted });
    txt(s, 'Câu hỏi: “Bạn có đang cảm thấy mệt mỏi, căng thẳng hay không?” · tỷ lệ trả lời “Có”', M, 6.1, W - 2 * M, 0.35, { fontSize: 14, color: C.muted, italic: true });
    source(s, 'Nguồn: khảo sát học sinh khối 10 lần 1 và lần 2 (sau thực nghiệm) của nhóm nghiên cứu, năm 2026');
  }

  // ================= 50. CÁCH ỨNG PHÓ =================
  {
    const s = light('Đánh giá hiệu quả · Cách ứng phó với căng thẳng', 'Học sinh chuyển từ giữ trong lòng sang chia sẻ', HN + 'Với câu hỏi "Khi cảm thấy mệt mỏi, khó chịu, stress bạn sẽ làm gì?" Ở đợt 1, phần lớn học sinh chọn giữ trong lòng. Ở đợt 2, phần lớn chọn tâm sự với người thân hoặc bạn bè, và tỷ lệ viết nhật ký cũng tăng rõ rệt. Đây là tín hiệu tốt cho thấy các bạn đã có cách ứng phó lành mạnh hơn.');
    const sh = async (f) => 'image/png;base64,' + (await sharp(path.join(MEDIA, f)).png().toBuffer()).toString('base64');
    card(s, M, 1.95, 5.0, 4.0);
    s.addImage({ data: await sh('image23.png'), x: M + 0.45, y: 2.05, w: 4.1, h: 3.8 });
    card(s, 5.75, 1.95, 5.0 + 0.15, 4.0);
    s.addImage({ data: await sh('image24.png'), x: 5.75 + 0.2, y: 2.15, w: 4.75, h: 3.1 });
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

  // ================= 51. PHỤ HUYNH SAU =================
  {
    const s = light('Đánh giá hiệu quả · Phụ huynh', 'Phụ huynh thay đổi theo hướng tích cực', HN + 'Sau khi tuyên truyền đến phụ huynh, dù thời gian không nhiều, hầu hết phụ huynh đã thay đổi: quan tâm con nhiều hơn, luôn động viên, chia sẻ khó khăn cùng con, trở thành chỗ dựa tinh thần vững chắc. Nhiều phụ huynh cũng hạn chế việc so sánh hay khoe thành tích học tập của con trên mạng xã hội, giúp giảm áp lực cho học sinh và cho chính phụ huynh.');
    const it = [['LuHeart', 'Quan tâm, động viên con nhiều hơn', 'Chia sẻ khó khăn, tạo động lực học tập'], ['LuHouse', 'Trở thành chỗ dựa tinh thần', 'Đồng hành thay vì so sánh, áp đặt'], ['LuSmartphone', 'Hạn chế so sánh, khoe thành tích', 'Hạn chế so sánh hay khoe thành tích của con trên mạng xã hội']];
    for (let i = 0; i < 3; i++) {
      const y = 1.95 + i * 1.5;
      card(s, M, y, 7.4, 1.32);
      await iconCircle(s, 'LuCheck', M + 0.3, y + 0.31, 0.7, C.mint, C.green);
      txt(s, it[i][1], M + 1.25, y + 0.2, 5.9, 0.45, { fontSize: 19, bold: true });
      txt(s, it[i][2], M + 1.25, y + 0.68, 5.9, 0.45, { fontSize: 16, color: C.muted });
    }
    dpanel(s, 8.3, 1.95, 4.47, 4.32);
    txt(s, 'Trước thực nghiệm', 8.65, 2.25, 3.8, 0.4, { fontSize: 15, bold: true, color: C.soft });
    txt(s, '57,8%', 8.65, 2.65, 3.8, 0.9, { fontSize: 44, bold: true, color: C.gold });
    txt(s, 'phụ huynh khoe thành tích của con lên mạng xã hội', 8.65, 3.55, 3.75, 0.9, { fontSize: 16, color: C.white });
    txt(s, 'Sau tuyên truyền: nhiều phụ huynh hạn chế việc so sánh hay khoe thành tích của con trên mạng xã hội.', 8.65, 4.6, 3.75, 1.3, { fontSize: 16, color: C.soft, italic: true });
    source(s, 'Nguồn: khảo sát và ghi nhận của nhóm nghiên cứu, năm 2026');
  }

  // ================= 52. KẾT LUẬN =================
  {
    const s = light('Kết luận', 'Ba kết luận chính của đề tài', HN + 'Kết luận. Thứ nhất, áp lực đồng trang lứa ở học sinh khối 10 trường mình khá phổ biến, từ 80,43% đến 91,74% tùy khía cạnh; học sinh rất cần sự quan tâm, đồng hành của gia đình và nhà trường. Thứ hai, áp lực hình thành do tâm sinh lý chưa ổn định và nhu cầu hòa nhập cao; tác động tiêu cực rõ nét hơn tích cực; học sinh nữ có xu hướng chịu tác động nhiều hơn học sinh nam. Thứ ba, sau thực nghiệm, học sinh nhận thức đúng hơn, biết điều chỉnh cảm xúc và hành vi, từng bước biến áp lực thành động lực.');
    const k = [['LuChartBar', 'Phổ biến', 'Áp lực đồng trang lứa ở khối 10 chiếm 80,43–91,74% tùy khía cạnh; học sinh cần sự đồng hành của gia đình, nhà trường'], ['LuBrain', 'Nguyên nhân và tác động', 'Tâm sinh lý chưa ổn định, nhu cầu hòa nhập cao; tiêu cực rõ hơn tích cực; nữ chịu tác động nhiều hơn nam'], ['LuTrendingUp', 'Hiệu quả giải pháp', 'Học sinh nhận thức đúng hơn, biết điều chỉnh cảm xúc, biến áp lực thành động lực']];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 4.15;
      card(s, x, 1.95, 3.9, 4.4);
      txt(s, String(i + 1).padStart(2, '0'), x + 0.35, 2.2, 1.5, 0.8, { fontSize: 40, bold: true, color: i === 0 ? C.gold : C.green });
      const ic = L[k[i][0]] ? k[i][0] : 'LuCheck';
      await iconCircle(s, ic, x + 2.85, 2.25, 0.75, C.mint, C.green);
      txt(s, k[i][1], x + 0.35, 3.2, 3.2, 0.75, { fontSize: 20, bold: true });
      txt(s, k[i][2], x + 0.35, 4.05, 3.25, 2.2, { fontSize: 16, color: C.muted });
    }
  }

  // ================= 53. ĐỀ XUẤT =================
  {
    const s = light('Đề xuất', 'Đề xuất và hướng phát triển', HN + 'Nhóm có hai đề xuất. Một, dành thời lượng trong các buổi sinh hoạt lớp đầu năm để học sinh khối 10 trao đổi cởi mở về áp lực khi vào môi trường mới, đồng thời tăng phối hợp giữa nhà trường và gia đình. Hai, mở rộng nghiên cứu sang khối 11 và khối 12 để so sánh mức độ, biểu hiện và đặc điểm áp lực theo độ tuổi. Đây là lần đầu nhóm thực hiện đề tài nghiên cứu khoa học nên còn nhiều hạn chế, chúng em rất mong nhận được góp ý của quý thầy cô.');
    const p = [['LuCalendar', 'Sinh hoạt đầu năm và phối hợp gia đình', ['Dành thời lượng sinh hoạt lớp đầu năm để khối 10 chia sẻ áp lực', 'Tăng phối hợp nhà trường và gia đình', 'Tạo không gian an toàn, bớt lo bị so sánh']], ['LuSearch', 'Mở rộng phạm vi nghiên cứu', ['Khảo sát thêm khối 11 và khối 12', 'So sánh mức độ, biểu hiện theo độ tuổi', 'Làm rõ đặc điểm áp lực từng cấp lớp']]];
    for (let i = 0; i < 2; i++) {
      const x = M + i * 6.2;
      dpanel(s, x, 1.95, 5.95, 3.6);
      await iconCircle(s, p[i][0], x + 0.4, 2.25, 0.8, i === 0 ? C.gold : '1D5A45', i === 0 ? C.darker : C.gold);
      txt(s, p[i][1], x + 1.4, 2.25, 4.3, 0.8, { fontSize: 20, bold: true, color: C.white, valign: 'middle' });
      bullets(s, p[i][2], x + 0.45, 3.35, 5.1, 2.0, { fontSize: 17, color: C.white, gap: 8 });
    }
    card(s, M, 5.8, W - 2 * M, 0.6);
    txt(s, 'Đây là lần đầu nhóm thực hiện đề tài nghiên cứu khoa học, rất mong nhận được góp ý của quý thầy cô.', M + 0.3, 5.8, W - 2 * M - 0.6, 0.6, { fontSize: 16, italic: true, color: C.muted, valign: 'middle' });
  }

  // ================= 54. TÀI LIỆU THAM KHẢO =================
  {
    const s = light('Tài liệu tham khảo', 'Tài liệu tham khảo', HN + '(Slide tham khảo, không cần trình bày chi tiết.)');
    const refs = [
      'Lazarus, R. S., & Folkman, S. (1984). Stress, Appraisal, and Coping. New York: Springer.',
      'Bộ Giáo dục và Đào tạo. Chương trình Giáo dục phổ thông 2018, Mô đun 5.',
      'Tạp chí Tâm lý học. Áp lực đồng trang lứa. tapchitamlyhoc.com/ap-luc-dong-trang-lua-6325.html',
      'Hoa Học Trò, Báo Tiền Phong. Vì sao các bạn trẻ thường bị ảnh hưởng bởi peer pressure (áp lực đồng trang lứa). hoahoctro.tienphong.vn',
      'Giáo dục và Thời đại. Rèn kỹ năng kiểm soát cảm xúc cho học sinh THCS. giaoducthoidai.vn',
      'Báo Thanh Niên. Vì sao học sinh ngày nay có quá nhiều áp lực. thanhnien.vn',
      'Sống Trẻ. Peer pressure: áp lực của giới trẻ. songtre.com.vn',
      'Video tham khảo: youtu.be/M0eFKH_FUDI',
    ];
    const arr = refs.map((r, i) => ({ text: r, options: { bullet: { type: 'number' }, breakLine: i < refs.length - 1, paraSpaceAfter: 8 } }));
    card(s, M, 1.9, W - 2 * M, 4.6);
    txt(s, arr, M + 0.4, 2.15, W - 2 * M - 0.8, 4.2, { fontSize: 15 });
  }

  // ================= 55. CẢM ƠN =================
  {
    const s = dark(VH + 'Phần trình bày của chúng em đến đây là kết thúc. Chúng em xin chân thành cảm ơn quý thầy cô và ban giám khảo đã lắng nghe, và rất mong nhận được câu hỏi, góp ý để đề tài hoàn thiện hơn.');
    s.background = { data: SECBG.end };
    txt(s, 'Trân trọng', M, 1.6, 10, 1.0, { fontSize: 40, bold: true, color: C.white });
    txt(s, 'cảm ơn', M, 2.5, 10, 1.4, { fontFace: FA, italic: true, fontSize: 80, color: C.gold });
    txt(s, 'quý thầy cô và ban giám khảo đã lắng nghe', M, 4.05, 10, 0.6, { fontSize: 24, color: C.white });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 4.95, w: 3.6, h: 0.62, rectRadius: 0.31, fill: { color: C.gold }, line: { type: 'none' } });
    txt(s, 'Hỏi và đáp', M, 4.95, 3.6, 0.62, { fontSize: 20, bold: true, color: C.darker, align: 'center', valign: 'middle' });
    txt(s, 'Mỗi người hôm nay có thể làm gì để bớt so sánh và thêm lắng nghe?', M, 5.8, 9, 0.5, { fontSize: 18, color: C.soft, italic: true });
    txt(s, 'Nguyễn Văn Hào · Nguyễn Thị Hạnh Nguyên · Lớp 10A11 · THPT Lương Thế Vinh · GVHD: cô Ngô Hải Yến', M, 6.55, 11.5, 0.35, { fontSize: 14, color: C.soft });
  }

  await pres.writeFile({ fileName: OUT });
  console.log('written', OUT, pageNo);
})();
