# QUY TRÌNH MẶC ĐỊNH – làm tập mới Little Chick (nhanh, đúng ngay lần đầu)

**Áp dụng cho mọi tập từ tập 22 trở đi. Chỉ làm tiếng Anh.**

## 0. Chuẩn bị (một lần mỗi phiên)
- Copy `scripts/*` vào một thư mục làm việc trong scratchpad. Copy thêm `episodes/ep1_dem_tao.html`, vì `mk_ep.py` lấy phần đầu HTML từ file này.
- Model whisper (chỉ cần khi ghép giọng): xem mục "Ghép giọng" trong SKILL.md. Đặt `WHISPER_DIR`.

## 1. Ý tưởng
- Đưa 8–10 ý tưởng để người dùng chọn. Ưu tiên chuỗi **SEL / nỗi lo của ba mẹ**, vì tập Chia bánh từng đạt 1.000 lượt xem.
- **Chờ người dùng chọn** rồi mới làm.

## 2. Viết tập (copy `episodes/_template_body.js` hoặc một tập gần giống)
Mỗi tập chỉ cần 4 phần:
1. `LINES`: 9–11 câu `[tag, text, speaker?]`.
   - **Tag luôn vui tươi:** cheerfully, excited, delighted, playfully, happily, joyful, sweetly, curious, surprised.
   - Câu ngắn, 3–8 chữ, tiếng Anh đơn giản.
   - `speaker` là một trong 'mom', 'duck', 'frog', 'owl'. Bỏ trống nếu Gà Con nói.
   - **Không viết câu chào và câu kết.** "Hi! It's Little Chick!" và "See you soon!" được tự thêm vào lời thoại.
2. `EP.init`:
   - Gọi `B=setupEpisode(LINES,{ep:'Tên ngắn ≤ 22 ký tự'})`.
   - Viết `EP.SHOTS=shotsAt(B,[[câu, z0,cx0,cy0, z1,cx1,cy1],...])`. Câu −1 nghĩa là bắt đầu từ giây 0.
   - Viết `EP.SFX=[[B.at[i]+δ,'tên',âm lượng],...]`. Thêm `'noambience'` cho cảnh trong nhà, `'lullaby'` cho tập ru ngủ.
3. `EP.main(t)`: vẽ cảnh. **Mọi mốc thời gian lấy theo `B.at[i]` hoặc `lineOn(B,t,i)`, không dùng giây cứng.**
   - Miệng nhân vật: `mouthFor(B,t,'chick'|'mom'|'duck'...)`.
4. Hàm dùng chung có sẵn (KHÔNG viết lại):
   - Cảnh: `meadow`, `bedroom`.
   - Nhân vật: `selChick`, `momHen`, `duckStand`, `frog`, `owl`, `animal`, `teddy`.
   - Hiệu ứng: `fxTears`, `fxSteam`, `fxHearts`, `fxBulb`, `fxSparkle`, `fxQ`, `bigWord`, `bigNum`, `confetti`, `speech`, `partyNotes`, `waveWR`.
   - Đạo cụ: `ballProp`, `towerProp`, `slideProp`, `iceCream`, `easel`, `toyCar`, `toyBox`, `cupProp`, `shoe`, `bed`, `nightLamp`, `maskFace`.

## 3. Quy tắc bố cục (vùng an toàn Shorts/TikTok, đơn vị thế giới 180×320)
- Nhân vật chính đứng ở x 40–130. Gà Con thường ở y 236–244, scale 0.44–0.56. Bạn bè cao ngang nhau.
- **Không đặt gì quan trọng ở x > 150** (cột nút bên phải), và không đặt mặt hay đạo cụ thấp hơn y ≈ 290.
- Zoom: cảnh hai nhân vật 1.0–1.2, cận 1.4–1.7. **Không dùng zoom quá 1.9.**
- `bigWord` ở y 118 (tự co cỡ chữ, tối đa 11 ký tự là đẹp). Không đặt chữ trùng với hàng đạo cụ.
- Vật cùng màu vàng với Gà Con phải có viền trắng, và vẽ SAU Gà Con nếu nằm phía trước.

## 4. Lệnh (`scripts/pipeline.sh`)
```
bash pipeline.sh build ep32_body.js:ep32_ten ep33_body.js:ep33_ten ...
```
Tạo html, bảng kiểm tra `qa_epN.png` (chụp giữa mỗi câu, vùng đỏ là chỗ bị giao diện che), meta và âm thanh.
- **XEM qa_epN.png.** Sửa nếu có chữ hoặc mặt nằm trong vùng đỏ, vật bị che, hay chữ tràn.

```
bash pipeline.sh preview ep32_ten ...
```
Xuất bản xem trước chất lượng thấp. Bỏ qua bước này nếu người dùng bảo "xuất luôn".

```
bash pipeline.sh script Voice_Ep32-41 ep32_ten ...
```
Tạo lời thoại 1 đoạn liền (`*_voice.md`) và spec tách câu. **Gửi người dùng nội dung `_voice.md`.**

```
bash pipeline.sh cut voice.mp3 Voice_Ep32-41_spec.json
```
- Nếu tổng số chữ lệch: script in danh sách chữ kèm chỉ số. Sửa `words` trong spec (whisper tách "Bye-bye" thành 2 chữ, gộp "Uh-oh"...).
- Đọc bảng kiểm tra từng câu, sửa các câu dính chữ trong `cuts/cfg_en_epN.json` (xem mục Ghép giọng trong SKILL.md).

```
bash pipeline.sh final voice.mp3 ep32_ten ...
```
Ghép giọng, nhép miệng, hạ nhạc dưới giọng, xuất bản chuẩn 1080×1920.

## 5. Bàn giao
- Video bản chuẩn và file caption tiếng Anh (YouTube + TikTok). Mẫu: `references/caption_ep12-21_en.md`.
- **Không làm ảnh bìa.**
- Nhắc người dùng tải file về (scratchpad là thư mục tạm).
- Lưu `epN_body.js`, `epN_*.html` và cfg giọng vào skill, rồi commit và push.
