import sys, copy, os
from PIL import Image
import docx
from docx.shared import Cm, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
SP = sys.argv[1]
NEW = os.path.join(SP, 'build', 'newimg'); MED = os.path.join(SP, 'docx', 'word', 'media'); OUT = os.path.join(SP, 'report', 'img')
def prep(name):
    src = os.path.join(NEW, name) if name.startswith('n') else os.path.join(MED, name)
    im = Image.open(src); im = im.convert('RGB')
    if name == 'n2.jpg': im = im.crop((0, 120, 850, 1710))
    im.thumbnail((1400, 1400))
    dst = os.path.join(OUT, name.split('.')[0] + '.jpg'); im.save(dst, quality=80)
    return dst, im.width / im.height
plan = {
 '[Chèn hình ảnh: Hình ảnh phát phiếu điều tra': (['n9.jpg'], 9.5, 'Phát phiếu điều tra tại các lớp khối 10 Trường THPT Lương Thế Vinh'),
 '[Chèn hình ảnh: Hình ảnh phỏng vấn': (['n3.jpg', 'n4.jpg'], 6.0, 'Phỏng vấn các bạn học sinh khối 10 Trường THPT Lương Thế Vinh'),
 '[Chèn hình ảnh: Hình ảnh hộp thư': (['n1.jpg', 'n6.jpg', 'n5.jpg'], 4.0, 'Hộp thư “Điều em muốn nói” tại Trường THPT Lương Thế Vinh'),
 '[Chèn hình ảnh: Hình ảnh tuyên truyền của nhóm': (['n7.jpg', 'n8.jpg'], 6.0, 'Nhóm tuyên truyền, thảo luận tình huống cùng học sinh khối 10'),
 '[Chèn hình ảnh: Fanpage': (['n2.jpg'], 10.0, 'Fanpage “Trạm Sạc Tâm Hồn”'),
 '[Chèn biểu đồ / hình ảnh: Kết quả hai đợt': (['image21.png', 'image22.png'], 6.0, 'Kết quả hai đợt khảo sát về cảm giác mệt mỏi, căng thẳng (Đợt 1: 88% có; Đợt 2: 14% có)'),
 '[Chèn biểu đồ / hình ảnh: Cách học sinh ứng phó': (['image23.png', 'image24.png'], 6.5, 'Cách học sinh ứng phó khi cảm thấy mệt mỏi, khó chịu, stress (Đợt 1 và Đợt 2)'),
}
d = docx.Document(sys.argv[2])
order = []
for p in d.paragraphs:
    for k in plan:
        if p.text.strip().startswith(k): order.append((p, k))
fig = 0
for p, k in order:
    files, h, cap = plan[k]
    imgs = [prep(f) for f in files]
    total = sum(h * a for _, a in imgs) + 0.3 * (len(imgs) - 1)
    scale = min(1.0, 14.5 / total)
    for r in list(p.runs): r._element.getparent().remove(r._element)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for i, (path, a) in enumerate(imgs):
        run = p.add_run()
        run.add_picture(path, height=Cm(h * scale))
        if i < len(imgs) - 1: p.add_run('  ')
    fig += 1
    newp = copy.deepcopy(p._element)
    for child in list(newp):
        if child.tag.endswith('}r'): newp.remove(child)
    p._element.addnext(newp)
    cp = docx.text.paragraph.Paragraph(newp, p._parent)
    rr = cp.add_run('Hình %d. %s' % (fig, cap)); rr.italic = True; rr.font.size = Pt(12)
    cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    print('inserted', fig, k, files)
d.save(sys.argv[3])
