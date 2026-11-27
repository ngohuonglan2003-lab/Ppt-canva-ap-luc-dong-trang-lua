# Lời thoại có tag cảm xúc (ElevenLabs v3)

## Định dạng (người dùng đã chốt, mới nhất)
- **Viết liền thành một đoạn.** Hết câu thì chấm (hoặc ! ?) rồi viết luôn câu sau. **Không xuống dòng giữa các câu**, vì xuống dòng nhiều làm tốn credit ElevenLabs.
- **Giọng luôn vui vẻ, tươi tắn, hợp với em bé**, không bao giờ đọc bình bình.
  - Tag nên dùng: `[excited]` `[cheerfully]` `[delighted]` `[playfully]` `[giggles]` `[laughs]` `[joyful]` `[happily]` `[sweetly]` `[surprised]` `[singing]`.
  - Không dùng `[slowly]` `[whispers]` `[sad]` `[softly]` hay các tag làm giọng đều đều. Câu đếm số cũng đọc reo vui ("One! Two! Three!").
  - Tập ru ngủ dùng `[sweetly]` và `[happily]`: dịu nhưng vẫn tươi.
- Tag viết bằng tiếng Anh trong `[ ]`, đặt trước câu hoặc cụm từ cần đổi cảm xúc.
- **Tách 2 bản: English và Tiếng Việt.** Khi làm nhiều tập một lúc, **gộp tất cả các tập vào 1 đoạn cho mỗi ngôn ngữ**, theo thứ tự tập. Câu "Xin chào! Gà Con đây!" / "Hi! It's Little Chick!" ở đầu mỗi tập sẽ là mốc để tách tập.
- Hạn chế dấu "…" (đọc ra dễ thành giọng ngập ngừng, bình bình). Thay bằng "!" hoặc ",".
- Mốc thời gian (targets) tính cả 4 giây intro, dùng cho `voice_place.py`. Chữ trên màn hình (`EP.LANG.caps`) phải khớp lời thoại.

---

## Tập 3–6 (bản gộp, gửi người dùng tạo giọng)

### English
```
[excited] Hi! [giggles] It's Little Chick! [surprised] Hey! [playfully] Who is hiding? [playfully] Meow meow! [curious] Who is it? [delighted] It's Kitty! [playfully] Woof woof! [curious] Who is it? [delighted] It's Puppy! [playfully] Moo moo! [curious] Who is it? [delighted] It's Cow! [playfully] Baa baa! [curious] Who is it? [delighted] It's Sheep! [excited] Let's all sing! [singing] Meow! Woof! Moo! Baa! [cheerfully] Well done! Bye-bye! [happily] See you soon! [excited] Hi! [giggles] It's Little Chick! [playfully] My cookie! [giggles] Uh-oh! We both want it! [excited] I have an idea! [cheerfully] Let's break it in two! [happily] Half for you! And half for me! [delighted] Yum yum! So yummy! [sweetly] Thank you, friend! [joyful] Sharing is fun! [cheerfully] Let's share too! Bye-bye! [happily] See you soon! [sweetly] Hi! It's Little Chick! [surprised] Plip! It's raining! [playfully] Hide under the mushroom! [happily] Pitter patter, pitter patter! [sweetly] Froggy hears the rain too! [giggles] Yaaawn! So sleepy! [delighted] Look, a rainbow! [sweetly] Sweet dreams, little one! [sweetly] Good night! [excited] Hi! [giggles] It's Little Chick! [surprised] Whoa! The present is hopping! [delighted] One present! A ball! [cheerfully] Ooone! [excited] Two presents! A duckie! [cheerfully] Twooo! [delighted] Three presents! A teddy! [cheerfully] Threee! [excited] Let's count! One! Two! Three! [joyful] Three presents! Merry Christmas! [cheerfully] Great counting! Bye-bye! [happily] See you soon!
```

### Tiếng Việt
```
[excited] Xin chào! [giggles] Gà Con đây! [surprised] Ơ! [playfully] Ai trốn đó? [playfully] Meo meo! [curious] Ai đây nhỉ? [delighted] Là bạn Mèo! [playfully] Gâu gâu! [curious] Ai đây nhỉ? [delighted] Là bạn Chó! [playfully] Ủm bò! [curious] Ai đây nhỉ? [delighted] Là bạn Bò! [playfully] Be be! [curious] Ai đây nhỉ? [delighted] Là bạn Cừu! [excited] Cùng kêu nào! [singing] Meo meo! Gâu gâu! Ủm bò! Be be! [cheerfully] Bé giỏi quá! Bye bye! [happily] Hẹn gặp lại bé nhé! [excited] Xin chào! [giggles] Gà Con đây! [playfully] Bánh của tớ! [giggles] Ơ! Ai cũng muốn ăn! [excited] A! Tớ có cách rồi! [cheerfully] Bẻ đôi nào! [happily] Một nửa cho bạn! Một nửa cho tớ! [delighted] Măm măm! Ngon quá! [sweetly] Cảm ơn cậu nhé! [joyful] Chia nhau thật vui! [cheerfully] Bé cũng chia sẻ nhé! Bye bye! [happily] Hẹn gặp lại bé nhé! [sweetly] Xin chào! Gà Con đây! [surprised] Tách! Mưa rồi! [playfully] Trốn dưới nấm thôi! [happily] Tí tách, tí tách! [sweetly] Bạn Ếch cũng nghe mưa! [giggles] Oáp! Buồn ngủ quá! [delighted] Cầu vồng kìa! [sweetly] Ngủ ngon nhé, bé yêu! [sweetly] Chúc bé ngủ ngon! [excited] Xin chào! [giggles] Gà Con đây! [surprised] Ơ! Hộp quà nhảy kìa! [delighted] Một món quà! Quả bóng! [cheerfully] Mộộột! [excited] Hai món quà! Vịt con! [cheerfully] Haaai! [delighted] Ba món quà! Gấu bông! [cheerfully] Baaa! [excited] Cùng đếm nào! Một! Hai! Ba! [joyful] Ba món quà! Giáng sinh vui vẻ! [cheerfully] Bé đếm giỏi lắm! Bye bye! [happily] Hẹn gặp lại bé nhé!
```

### Mốc đặt câu (targets) cho từng tập
| Tập | Số câu | targets (giây, tính cả intro) |
|---|---|---|
| 3 · Ai trốn | 18 | `[1.2,5.2,7.6,9.6,10.8,14.0,16.0,17.2,20.4,22.6,23.8,27.0,29.0,30.4,33.6,35.0,39.4,43.2]` |
| 4 · Chia bánh | 12 | `[1.2,5.2,7.4,11.0,14.8,19.0,21.5,24.4,28.2,32.0,37.0,41.4]` (câu 9 do bạn Vịt nói) |
| 5 · Mưa rơi | 9 | `[1.2,5.2,7.6,12.0,18.0,24.0,30.2,36.0,42.2]` |
| 6 · Noel | 15 | `[1.2,5.2,7.4,11.0,13.4,18.0,20.4,25.0,27.2,28.5,30.0,31.5,33.5,38.0,41.7]` |

Cách tách câu khi đọc liền:
- Tập 3: "Hey! Who is hiding?" là **1 câu** (mốc 5.2). "Meow! Woof! Moo! Baa!" là 1 câu (mốc 35.0). "Well done! Bye-bye!" là 1 câu.
- Tập 4: "Half for you!" (19.0) và "And half for me!" (21.5) là **2 câu**.
- Tập 6: "Let's count!" (27.2), "One!" (28.5), "Two!" (30.0), "Three!" (31.5) là **4 câu**.

---

## Tập 1 · Đếm 3 quả táo (44 giây) — đã xuất
targets: `[1.2,5.2,7.2,11.0,14.2,18.0,22.0,26.2,27.5,29.5,31.5,34.3,39.2,42.6]`. Điểm cắt: `episodes/voice_ep1_cuts.py`.

## Tập 2 · Đếm 4 chú vịt con (49 giây) — đã xuất
targets: `[1.2,5.2,7.2,10.5,14.0,17.0,20.0,23.0,27.0,30.0,32.2,33.5,35.0,36.5,38.0,39.6,44.0,47.2]`. Điểm cắt: `episodes/voice_ep2_cfg_en.json` và `episodes/voice_ep2_cfg_vi.json`.

---

## Tập 7–11 (bản gộp, gửi người dùng tạo giọng)

### English
```
[excited] Hi! [giggles] It's Little Chick! [excited] Hey! Let's dance! [cheerfully] Clap your wings! Clap clap clap! [excited] Stomp your feet! Stomp stomp stomp! [playfully] Wiggle, wiggle! Wiggle wiggle! [delighted] Turn around! Spin spin spin! [joyful] Hands up high! Yay! [cheerfully] Great dancing! Bye-bye! [happily] See you soon! [excited] Hi! [giggles] It's Little Chick! [playfully] Where's Little Chick? [laughs] Peekaboo! [curious] Who's under the blanket? [laughs] Peekaboo! It's Duckie! [curious] Who's behind the leaf? [laughs] Peekaboo! It's Froggy! [curious] Who's behind the pot? [laughs] Peekaboo! It's Kitty! [playfully] Where are you, baby? [laughs] Peekaboo! I see you! [cheerfully] Let's play peekaboo! Bye-bye! [happily] See you soon! [excited] Hi! [giggles] It's Little Chick! [excited] Tick tock! New Year is coming! [cheerfully] Come on, friends! [excited] Let's count down! [excited] Three! [excited] Two! [excited] One! [joyful] Happy New Year! [delighted] Wow! Fireworks! [sweetly] You're growing up! [cheerfully] Happy New Year! Bye-bye! [happily] See you soon! [excited] Hi! [giggles] It's Little Chick! [surprised] Ooh! A red envelope! [joyful] Lunar New Year is here! [cheerfully] Hello, Little Goat! [joyful] Happy New Year! [delighted] Yummy rice cake! [excited] Let's count! [cheerfully] One! [cheerfully] Two! [excited] Three! [joyful] Happy and healthy! [cheerfully] Have a happy new year! Bye-bye! [happily] See you soon! [excited] Hi! [giggles] It's Little Chick! [surprised] Oops! The balloon flew away! [cheerfully] One! Red balloon! [cheerfully] Two! Yellow balloon! [cheerfully] Three! Green balloon! [cheerfully] Four! Blue balloon! [excited] Five! Purple balloon! [excited] Let's count! One! Two! Three! Four! Five! [joyful] Up, up and away! Wheee! [cheerfully] Great counting! Bye-bye! [happily] See you soon!
```

### Tiếng Việt
```
[excited] Xin chào! [giggles] Gà Con đây! [excited] Bé ơi! Cùng nhảy nào! [cheerfully] Vỗ tay, vỗ tay! Bộp bộp bộp! [excited] Dậm chân, dậm chân! Thình thịch thịch! [playfully] Lắc lư, lắc lư! Lắc lư nào! [delighted] Xoay tròn, xoay tròn! Một vòng nè! [joyful] Giơ tay lên cao! Yeah! [cheerfully] Bé nhảy giỏi quá! Bye bye! [happily] Hẹn gặp lại bé nhé! [excited] Xin chào! [giggles] Gà Con đây! [playfully] Gà Con đâu rồi? [laughs] Ú òa! [curious] Ai trốn dưới khăn thế? [laughs] Ú òa! Là bạn Vịt! [curious] Ai trốn sau lá thế? [laughs] Ú òa! Là bạn Ếch! [curious] Ai trốn sau chậu hoa? [laughs] Ú òa! Là bạn Mèo! [playfully] Bé ơi, bé đâu rồi? [laughs] Ú òa! Thấy bé rồi! [cheerfully] Cùng chơi ú òa nhé! Bye bye! [happily] Hẹn gặp lại bé nhé! [excited] Xin chào! [giggles] Gà Con đây! [excited] Tích tắc! Sắp năm mới rồi! [cheerfully] Các bạn ơi, lại đây! [excited] Cùng đếm ngược nào! [excited] Ba! [excited] Hai! [excited] Một! [joyful] Chúc mừng năm mới! [delighted] Pháo hoa đẹp quá! [sweetly] Năm mới, bé lớn thêm rồi! [cheerfully] Năm mới vui vẻ! Bye bye! [happily] Hẹn gặp lại bé nhé! [excited] Xin chào! [giggles] Gà Con đây! [surprised] Ơ! Bao lì xì kìa! [joyful] Tết đến rồi! Vui quá! [cheerfully] Xin chào bạn Dê! [joyful] Chúc mừng năm mới! [delighted] Bánh chưng xanh, ngon quá! [excited] Cùng đếm nào! [cheerfully] Một! [cheerfully] Hai! [excited] Ba! [joyful] Năm mới an khang! [cheerfully] Chúc bé năm mới vui vẻ! Bye bye! [happily] Hẹn gặp lại bé nhé! [excited] Xin chào! [giggles] Gà Con đây! [surprised] Ơ! Bóng bay mất rồi! [cheerfully] Một! Bóng màu đỏ! [cheerfully] Hai! Bóng màu vàng! [cheerfully] Ba! Bóng màu xanh lá! [cheerfully] Bốn! Bóng màu xanh dương! [excited] Năm! Bóng màu tím! [excited] Cùng đếm nào! Một! Hai! Ba! Bốn! Năm! [joyful] Bay lên nào! Wiii! [cheerfully] Bé đếm giỏi lắm! Bye bye! [happily] Hẹn gặp lại bé nhé!
```

### Mốc đặt câu (targets)
| Tập | Số câu | targets |
|---|---|---|
| 7 · Vỗ tay (bài hát) | 9 | `[1.2,5.2,7.4,14.2,21.0,27.8,34.6,39.2,43.0]` |
| 8 · Ú òa | 13 | `[1.2,5.2,7.4,10.0,12.8,16.0,18.8,22.0,24.8,28.0,31.8,34.8,38.8]` |
| 9 · Năm mới | 12 | `[1.2,5.2,7.4,11.4,15.0,17.0,19.0,21.0,25.0,30.2,34.4,38.8]` |
| 10 · Tết | 13 | `[1.2,5.2,7.4,11.4,15.4,19.4,23.4,25.0,26.5,28.0,30.2,34.4,38.8]` |
| 11 · Bóng bay | 16 | `[1.2,5.2,7.4,11.8,16.2,20.6,25.0,29.4,31.0,32.4,33.8,35.2,36.6,38.0,42.0,45.8]` |

Cách tách câu:
- Tập 7: mỗi câu đoạn bài hát (ví dụ "Vỗ tay, vỗ tay! Bộp bộp bộp!") là **1 câu**.
- Tập 10 và tập 11: "Cùng đếm nào!", rồi từng số, đều là **câu riêng**.
- Tập 8: "Ú òa! Là bạn Vịt!" là **1 câu**.
