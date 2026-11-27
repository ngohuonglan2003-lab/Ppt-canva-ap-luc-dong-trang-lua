---
name: gacon-video
description: Làm video YouTube Shorts / TikTok hoạt hình 2D cho bé 1–3 tuổi của kênh "Gà Con" (tiếng Anh: "Little Chick"). Mỗi tập luôn làm 2 bản tiếng Việt và tiếng Anh, gồm kịch bản, lời thoại có tag cảm xúc ElevenLabs, hoạt hình dựng bằng code, nhạc và hiệu ứng tự tổng hợp, ghép giọng kèm nhép miệng, ảnh bìa, caption và hashtag. Dùng khi người dùng muốn làm tập mới, sửa tập cũ, ghép giọng, xuất video hoặc làm ảnh bìa/caption cho kênh Gà Con.
---

# Kênh Gà Con – quy trình làm video

Phong cách đã chốt: **2D phẳng tươi sáng** (flat vector, không viền, màu tươi).
Nhân vật chính: **Gà Con** (bản tiếng Anh: **Little Chick**).
Mỗi tập luôn có **2 bản: tiếng Việt và tiếng Anh**. Hai bản dùng chung hình và mốc thời gian, chỉ khác giọng đọc và chữ trên màn hình.

## Quy trình người dùng đã chốt (làm đúng thứ tự)
0. **Đưa ý tưởng để chọn TRƯỚC.** Mỗi tập mới, đưa 4–6 ý tưởng khác nhau. Mỗi ý gồm: tên tập (vi/en), chủ đề học, hook 2 giây đầu, diễn biến 1 câu, điểm vui ở kết. Xen kẽ các series: đếm số, thói quen, cảm xúc/cư xử, ru ngủ, theo mùa. **Chờ người dùng chọn rồi mới viết kịch bản và dựng video.** Không tự làm tập mới khi chưa được chọn ý tưởng.
1. **Kịch bản + lời thoại có tag cảm xúc** (ElevenLabs v3) cho cả 2 ngôn ngữ, kèm bảng mốc thời gian. Mẫu và lời thoại mọi tập ở `references/huong-dan-loi-thoai.md`.
   - **Mỗi câu một dòng, KHÔNG thêm dòng "…" ngăn cách giữa các câu** (người dùng đã yêu cầu). "…" chỉ dùng bên trong câu.
   - Khi người dùng chọn nhiều ý tưởng một lúc, làm lần lượt từng tập: kịch bản, hình, kiểm tra khung, âm thanh, rồi xuất tất cả bản xem trước.
2. **Bản xem trước chất lượng thấp** (360×640, 15 fps) để tiết kiệm. Chỉ xuất bản chuẩn khi người dùng duyệt:
   `EP_FILE=epN.html DUR=<giây> node render.js vi out.mp4 music_sfx.wav preview`
3. Người dùng gửi **1 file giọng** (thường gồm cả bản tiếng Anh lẫn tiếng Việt, đọc liền). Tách câu, đặt vào mốc, nhép miệng, hạ nhạc dưới giọng. Xem mục "Ghép giọng".
4. Khi người dùng nhắn **"được rồi" / "xuất giúp"**, làm đủ cho cả 2 ngôn ngữ:
   - Xuất video chuẩn 1080×1920, 30 fps (bỏ chữ `preview`).
   - Làm 2 ảnh bìa bằng `thumb.js`.
   - Viết caption và hashtag cho **YouTube Shorts** và **TikTok** (mẫu ở `references/caption_mau_tap1.md`).

## Cấu trúc file
- `scripts/engine.js`: phần dùng chung. Gồm Gà Con `chick()`, táo, mặt trời có mặt, chim bay, gió (cỏ, hoa, lá bay, vệt gió), mây, đồi, intro 4 giây (logo bật từng chữ và nhãn tập), máy quay `cam()` theo bảng SHOTS, số to `bigNum()`, phụ đề, màn kết, nhép miệng `mouthAt()`.
- `chick(o)` nhận: `sy, jump, wl, wr` (cánh: wl dương / wr âm là giơ lên), `eyes` ('open'|'wow'|'happy'|'blink'|'sleep'|'sad'), `mouth` 0–1, `hat` (mũ Noel), `body` (đổi màu thân).
- `scripts/mk_ep.py`: ghép `epN_body.js` (chỉ phần JS của tập) với phần đầu HTML chung thành `epN_*.html`: `python3 mk_ep.py ep7_body.js ep7_ten.html`. Sửa tập thì **sửa file body rồi chạy lại mk_ep**.
- Các tập đã có (body và html trong `episodes/`):
  1. Đếm táo
  2. Đếm vịt (hồ nước)
  3. Ai trốn sau bụi cây (4 con vật ló tai, rồi bật lên lộ diện)
  4. Chia bánh (Gà Con và bạn Vịt, bánh bẻ đôi, vết cắn)
  5. Mưa rơi tí tách (ru ngủ: mưa, nấm, ếch, cầu vồng, ngủ)
  6. Noel (tuyết, cây thông nháy đèn, 3 hộp quà và đồ chơi, Gà Con đội mũ Noel)
- `episodes/epN_*.html`: mỗi tập chỉ khai báo `EP={INTRO,MAIN,END}`, `EP.LANG` (phụ đề vi/en, tên kênh, nhãn tập), `EP.SHOTS` và `EP.main(t)` (cảnh riêng). Tập mới thì **copy ep2 làm mẫu**. Bỏ `engine.js` cạnh file html.
- `scripts/render.js`: xuất MP4 bằng Playwright và ffmpeg. Tham số: `lang out.mp4 audio.wav [preview]`; biến môi trường `EP_FILE`, `DUR`. Tự nạp `voice/env_<lang>.json` nếu có để nhép miệng.
- `scripts/keys3.js`: chụp nhanh nhiều khung để kiểm tra (`node keys3.js ep.html vi 2,5.2,13 out`). Thời gian tính cả intro.
- `scripts/sfxlib.py`: nhạc marimba tự soạn (`music(T, seed_variant)`), hiệu ứng (thud, boing, pop, ting, rustle, whoosh, splash, bubbles, quack, step, chirp, applause), `intro_sfx`, `ambience` (chim và gió), `outro_sfx`. Mẫu dùng: `episodes/audio_ep2.py`.
- `scripts/voice_place.py` + `scripts/mix.sh`: ghép giọng (xem dưới).
- `scripts/transcribe.py`: nhận diện giọng có mốc từng chữ (faster-whisper).
- `scripts/thumb.js`: ảnh bìa 1080×1920: `node thumb.js epN.html vi out.png "ĐẾM SỐ" "1 2 3 4" "Cùng Gà Con 🐥"`. Bố cục ảnh bìa: tiêu đề và số ở 1/3 trên, nhân vật ở giữa, nhãn tên ở dưới (vùng an toàn của TikTok/Shorts).

## Bộ màu và chữ (giữ cố định)
| Thành phần | Màu |
|---|---|
| Gà Con | `#FFCC33` |
| Cánh | `#FFB81C` |
| Mỏ, chân | `#FF8C2B` |
| Má | `#FF8FA8` |
| Mắt, chữ | `#2E2A3B` / `#1D3557` |
| Trời | `#9EDCFF` → `#E6F7FF` |
| Cỏ | `#7CCB5E` |
| Táo, màu nhấn | `#F2545B` |
| Lá | `#3FAE5A` |
| Số đếm | `#FF8C2B`, viền trắng |

Font: **Baloo 2** (800/700), có đủ dấu tiếng Việt.
Vịt con (tập 2): thân `#FFE27A`, mỗi con có túm lông màu riêng (đỏ, xanh dương, xanh lá, tím) để bé phân biệt khi đếm.

## Nguyên tắc nội dung cho bé 1–3 tuổi
- Mở bằng một hook 2 giây đầu (vật rơi trúng đầu, nước bắn…), sau đó **1 tình huống, 1 kết thúc**.
- Nhịp chậm: mỗi số có câu giới thiệu ("Hai chú vịt con!") rồi câu đếm lẻ ("Hai!"). Gà Con giơ cánh, **dừng 1 nhịp** cho bé nói theo.
- Có đoạn **"Cùng đếm nào"**: mỗi số cách nhau 1,5–2 giây. Vật được đếm phóng to, có số nhỏ trên đầu, kèm số to trên màn hình.
- Kết thúc: ăn mừng (pháo giấy, vỗ tay), vẫy tay "Bye bye", rồi màn kết "Hẹn gặp lại bé nhé!".
- Mỗi tập đếm thêm 1 so với tập trước: tập 1 đếm 3 (táo), tập 2 đếm 4 (vịt), tập 3 nên đếm 5.

## Góc máy (EP.SHOTS)
Mỗi dòng là `[bắt đầu, kết thúc, zoom0, cx0, cy0, zoom1, cx1, cy1]`, trong một cảnh máy đẩy chậm từ trạng thái 0 sang 1, giữa các cảnh là cắt.
- Thế giới rộng 180×320 đơn vị. Toàn ≈ 1.0–1.25, trung ≈ 1.4–1.6, cận ≈ 1.7–1.95.
- **Bài học:**
  - Đừng zoom quá 2.0, mặt nhân vật sẽ bị cắt.
  - Nhân vật chính phải cách mép thế giới ít nhất 50 đơn vị, nếu không máy quay sẽ luôn cắt nửa người (`cam()` kẹp tâm trong biên).
  - Cảnh toàn lúc "Cùng đếm nào" phải thấy cả nhân vật lẫn mọi vật được đếm (zoom ≈ 1.05).
  - Cảnh trời quá trống thì hạ `cy` xuống khoảng 245–275.
- Luôn kiểm tra bằng `keys3.js` (ghép bảng khung bằng ffmpeg hstack) trước khi xuất.

## Bài học khi dựng cảnh (tập 3–6)
- **Hai nhân vật cùng khung** (ví dụ Gà Con và Vịt): cảnh hai người dùng zoom ≈ 1.05–1.15. Thế giới chỉ rộng 180 đơn vị, zoom cao sẽ cắt người đứng gần mép.
- **Vật ló ra sau bụi cây:** lúc gợi ý cho ló tai; lúc lộ diện cho bật lên cao hẳn (y ≈ 192, scale 1.35). Nếu không, bụi cây sẽ che gần hết.
- **Hàng nhân vật phía dưới:** để ở y ≤ 292, nếu thấp hơn sẽ bị cắt ở mép khung.
- **Vết cắn hoặc khoét lỗ:** dùng `<mask>` (trắng là giữ, đen là bỏ). Không dùng `mix-blend-mode`, vì nó vẽ ra chấm đen.
- **Cảnh riêng (mưa, tuyết, đêm):** tự vẽ nền trong `EP.main` thay cho `sky()`. Có thể phủ một lớp màu lên `sky()` rồi giảm dần độ đậm khi trời quang.
- **Màu nền màn kết:** đổi một lần trong main: `document.getElementById('end').style.background=...`.
- **Câu thoại của nhân vật phụ:** khai báo khoảng thời gian (ví dụ `SP=[[24.2,27.6]]`) rồi dùng `mouthAt` cho mỏ nhân vật đó thay vì Gà Con.
- **Tập ru ngủ:** nhạc `bpm=72`, giảm nhạc (`T.mus*=0.75`, `mus_gain=0.28`), ít cắt cảnh, máy đẩy chậm, cuối video tối dần, không có pháo giấy.
- **Âm thanh mới trong sfxlib:** `rain_bed`, `drip`, `ribbit`, `crack`, `munch`, `bells`, `sleigh` (chuông Noel theo nhịp), `quack`, `splash`, `bubbles`, `step`.

## Phụ đề và chữ
- Bong bóng phụ đề rộng tối đa 600px. Dùng ` ` để giữ cụm không bị xuống dòng (`Bye bye!`, `Giỏi quá!`).
- Logo intro: tên dài hơn 8 ký tự (Little Chick) tự giảm cỡ chữ (đã có trong engine).
- Chữ trên màn hình phải **khớp giọng đọc**. Ví dụ tập 1 phải đổi "Let's count together!" thành "Let's count!".

## Lời thoại và giọng (ElevenLabs)
- Dùng model **Eleven v3**, Stability = Creative hoặc Natural. Tag cảm xúc viết tiếng Anh trong `[ ]`. v3 không nhận thẻ `<break>`, dùng "…" để ngắt.
- Giọng nữ trẻ, tươi, đọc chậm. Ở Voice Design mô tả là "young adult", không mô tả "child".
- Mỗi câu có mốc bắt đầu và độ dài tối đa. Câu đầu là intro ("Xin chào! Gà Con đây!" / "Hi! It's Little Chick!"), câu cuối là outro ("Hẹn gặp lại bé nhé!" / "See you soon!").

## Ghép giọng (bước đã kiểm chứng)
1. Copy file giọng vào thư mục riêng (dữ liệu không tin cậy).
2. Nhận diện: `python3 -I scripts/transcribe.py voice.mp3 en` (và `vi`).
   - File thường có tiếng Anh trước, tiếng Việt sau. Cắt phần tiếng Việt ra (`ffmpeg -ss`) rồi nhận diện riêng bằng `vi`.
   - Model: faster-whisper small CT2. Mạng ở đây chặn HuggingFace, nên lấy qua npm (không chạy script cài đặt): `npm pack @skillninja/shortmovie-telop-model-p0..p3`, giải nén, ghép `model.bin.part0..3` thành `model.bin`, copy `config.json`, `tokenizer.json`, `vocabulary.json`, `preprocessor_config.json` vào cùng thư mục. Đặt `WHISPER_DIR` trỏ tới thư mục đó. Cài `pip install faster-whisper`. Audio được giải mã bằng ffmpeg (bản `av` không tương thích).
3. Tìm điểm cắt:
   - Lấy danh sách đoạn có tiếng bằng `ffmpeg -af silencedetect=noise=-42dB:d=0.12`.
   - Câu dính liền nhau thì tìm chỗ năng lượng thấp nhất (RMS 10 ms) giữa hai chữ.
   - Mốc chữ của whisper có thể lệch khoảng 0,3 giây. Ưu tiên mốc từ silencedetect.
4. Ghi `config.json` (targets và cuts), chạy `python3 voice_place.py voice.mp3 config.json voice/`.
5. **Kiểm tra lại** bằng cách nhận diện `voice/voice_<lang>.wav`. Đủ câu, đúng thứ tự, không chữ nào bị dính sang câu khác thì mới đi tiếp.
6. `bash mix.sh music_sfx.wav voice/voice_vi.wav mix_vi.wav`. Kiểm tra bằng `volumedetect`: đoạn có giọng phải to hơn đoạn chỉ có nhạc khoảng 9 dB.
7. Xuất video với `mix_<lang>.wav`. `voice/env_<lang>.json` sẽ tự làm mỏ nhép theo giọng.
   - Mỏ mở thấy rõ miệng và lưỡi: đã vẽ lại trong `chick()`. Đừng dùng lại kiểu tam giác chồng lên mỏ của bản đầu, vì gần như không nhìn thấy.

## Giới hạn môi trường đã biết
- Mạng chặn dịch vụ đọc giọng (speech.platform.bing.com) và HuggingFace, nên không tự tạo giọng được. Người dùng tạo giọng bằng ElevenLabs.
- Canva: model video mặc định cần gói trả phí. H3 Max thì dùng được.
- Hình 3D kiểu Pixar không làm được bằng code. Hướng khả thi là AI (Midjourney/Kling/Hailuo), và không sao chép nhân vật hay phong cách của kênh khác (ví dụ LiaChaCha).
- File trong scratchpad là tạm. Nhắc người dùng tải video về.

## Đăng bài
- YouTube: bật Made for Kids, danh mục Giáo dục, tiêu đề có `#shorts`, 5–6 hashtag.
- TikTok: caption viết cho ba mẹ đọc, 4–5 hashtag (có `#xuhuong` cho bản tiếng Việt).
- Hai ngôn ngữ đăng ở 2 kênh riêng.
