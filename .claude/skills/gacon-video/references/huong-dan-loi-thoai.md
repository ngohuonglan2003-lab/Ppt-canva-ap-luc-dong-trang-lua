# Lời thoại có tag cảm xúc (ElevenLabs v3)

## Định dạng (người dùng đã chốt)
- Mỗi câu nằm trên **một dòng riêng**. **Không** thêm dòng "…" để ngăn cách các câu.
- Dấu "…" chỉ dùng **bên trong câu** khi cần ngập ngừng (ví dụ "Oáp… buồn ngủ quá.").
- Tag cảm xúc viết bằng tiếng Anh trong `[ ]`. Tag đặt ở đầu câu, hoặc trước cụm từ cần đổi giọng.
- Đưa 2 khối riêng: **English** trước, **Tiếng Việt** sau. Người dùng tạo 1 file đọc liền, tiếng Anh trước rồi tiếng Việt.
- Kèm bảng mốc thời gian (tính **cả 4 giây intro**) để dùng với `voice_place.py`.
- Câu đầu luôn là intro ("Xin chào! Gà Con đây!" / "Hi! It's Little Chick!"). Câu cuối là outro ("Hẹn gặp lại bé nhé!" / "See you soon!"), trừ tập ru ngủ.

---

## Tập 1 · Đếm 3 quả táo (44 giây)
targets: `[1.2,5.2,7.2,11.0,14.2,18.0,22.0,26.2,27.5,29.5,31.5,34.3,39.2,42.6]`
Điểm cắt đã dùng cho file `hi_it_s_li.mp3`: xem `episodes/voice_ep1_cuts.py`. Tiếng Anh nằm ở 0–16,7 giây, tiếng Việt ở 16,7–35,5 giây.

## Tập 2 · Đếm 4 chú vịt con (49 giây)
targets: `[1.2,5.2,7.2,10.5,14.0,17.0,20.0,23.0,27.0,30.0,32.2,33.5,35.0,36.5,38.0,39.6,44.0,47.2]`
```
[excited] Hi! [giggles] It's Little Chick!
[gasps] Splash! [curious] Who is there?
[happily] One little duck!
[cheerfully] Ooone!
[excited] Two little ducks!
[cheerfully] Twooo!
[surprised] Wow! Three little ducks!
[cheerfully] Threee!
[laughs] Four little ducks!
[cheerfully] Fouuur!
[playfully] Let's count!
[slowly] One…
[slowly] Two…
[slowly] Three…
[cheering] Four!
[joyful] Four little ducks! [laughs] Hooray!
[warmly] Great counting! [cheerfully] Bye-bye!
[softly] See you soon!
```
```
[excited] Xin chào! [giggles] Gà Con đây!
[gasps] Ui! [curious] Ai té nước thế?
[happily] Một chú vịt con!
[cheerfully] Mộộột!
[excited] Hai chú vịt con!
[cheerfully] Haaai!
[surprised] Ồ! Ba chú vịt con!
[cheerfully] Baaa!
[laughs] Bốn chú vịt con!
[cheerfully] Bốốốn!
[playfully] Cùng đếm nào!
[slowly] Một…
[slowly] Hai…
[slowly] Ba…
[cheering] Bốn!
[joyful] Bốn chú vịt con! [laughs] Giỏi quá!
[warmly] Bé đếm giỏi lắm! [cheerfully] Bye bye!
[softly] Hẹn gặp lại bé nhé!
```

## Tập 3 · Ai trốn sau bụi cây? (45 giây)
targets: `[1.2,5.2,7.6,9.6,10.8,14.0,16.0,17.2,20.4,22.6,23.8,27.0,29.0,30.4,33.6,35.0,39.4,43.2]`
```
[excited] Hi! [giggles] It's Little Chick!
[surprised] Hey! [curious] Who is hiding?
[playfully] Meow meow!
[whispers] Who is it?
[excited] It's Kitty!
[playfully] Woof woof!
[whispers] Who is it?
[excited] It's Puppy!
[playfully] Moo moo!
[whispers] Who is it?
[excited] It's Cow!
[playfully] Baa baa!
[whispers] Who is it?
[excited] It's Sheep!
[cheerfully] Let's all sing!
[singing] Meow! Woof! Moo! Baa!
[warmly] Well done! [cheerfully] Bye-bye!
[softly] See you soon!
```
```
[excited] Xin chào! [giggles] Gà Con đây!
[surprised] Ơ! [curious] Ai trốn đó?
[playfully] Meo meo!
[whispers] Ai đây nhỉ?
[excited] Là bạn Mèo!
[playfully] Gâu gâu!
[whispers] Ai đây nhỉ?
[excited] Là bạn Chó!
[playfully] Ủm bò!
[whispers] Ai đây nhỉ?
[excited] Là bạn Bò!
[playfully] Be be!
[whispers] Ai đây nhỉ?
[excited] Là bạn Cừu!
[cheerfully] Cùng kêu nào!
[singing] Meo meo! Gâu gâu! Ủm bò! Be be!
[warmly] Bé giỏi quá! [cheerfully] Bye bye!
[softly] Hẹn gặp lại bé nhé!
```

## Tập 4 · Chia bánh nhé! (44 giây)
targets: `[1.2,5.2,7.4,11.0,14.8,19.0,21.5,24.4,28.2,32.0,37.0,41.4]`
Câu thứ 9 ("Cảm ơn cậu nhé!") do **bạn Vịt** nói. Trong video, mỏ bạn Vịt nhép ở câu này. Có thể dùng một giọng khác cao hơn.
```
[excited] Hi! [giggles] It's Little Chick!
[whining] My cookie!
[sad] Uh-oh… we both want it.
[excited] I have an idea!
[cheerfully] Let's break it in two!
[warmly] Half for you…
[happily] and half for me!
[delighted] Yum yum! So yummy!
[shyly] Thank you, friend!
[joyful] Sharing is fun!
[warmly] Let's share too! [cheerfully] Bye-bye!
[softly] See you soon!
```
```
[excited] Xin chào! [giggles] Gà Con đây!
[whining] Bánh của tớ!
[sad] Ơ… ai cũng muốn ăn.
[excited] A! Tớ có cách rồi!
[cheerfully] Bẻ đôi nào!
[warmly] Một nửa cho bạn…
[happily] một nửa cho tớ!
[delighted] Măm măm! Ngon quá!
[shyly] Cảm ơn cậu nhé!
[joyful] Chia nhau thật vui!
[warmly] Bé cũng chia sẻ nhé! [cheerfully] Bye bye!
[softly] Hẹn gặp lại bé nhé!
```

## Tập 5 · Mưa rơi tí tách (44 giây, ru ngủ)
targets: `[1.2,5.2,7.6,12.0,18.0,24.0,30.2,36.0,42.2]`
Toàn bộ tập đọc **nhỏ, chậm, ấm**. Không dùng tag hét hay phấn khích.
```
[softly] Hi… It's Little Chick.
[surprised] Plip! It's raining!
[softly] Hide under the mushroom!
[whispers] Pitter… patter…
[softly] Froggy hears the rain too.
[yawns] Yaaawn… [sleepy] so sleepy.
[softly amazed] Look, a rainbow!
[whispers] Sweet dreams, little one.
[whispers] Good night.
```
```
[softly] Xin chào… Gà Con đây.
[surprised] Tách! Mưa rồi!
[softly] Trốn dưới nấm thôi!
[whispers] Tí tách… tí tách…
[softly] Bạn Ếch cũng nghe mưa.
[yawns] Oáp… [sleepy] buồn ngủ quá.
[softly amazed] Cầu vồng kìa!
[whispers] Ngủ ngon nhé, bé yêu.
[whispers] Chúc bé ngủ ngon.
```

## Tập 6 · Noel của Gà Con (44 giây, đăng tháng 12)
targets: `[1.2,5.2,7.4,11.0,13.4,18.0,20.4,25.0,27.2,28.5,30.0,31.5,33.5,38.0,41.7]`
```
[excited] Hi! [giggles] It's Little Chick!
[gasps] Whoa! [curious] The present is hopping!
[happily] One present! A ball!
[cheerfully] Ooone!
[excited] Two presents! A duckie!
[cheerfully] Twooo!
[surprised] Three presents! A teddy!
[cheerfully] Threee!
[playfully] Let's count!
[slowly] One…
[slowly] Two…
[cheering] Three!
[joyful] Three presents! [cheerfully] Merry Christmas!
[warmly] Great counting! [cheerfully] Bye-bye!
[softly] See you soon!
```
```
[excited] Xin chào! [giggles] Gà Con đây!
[gasps] Ơ! [curious] Hộp quà nhảy kìa!
[happily] Một món quà! Quả bóng!
[cheerfully] Mộộột!
[excited] Hai món quà! Vịt con!
[cheerfully] Haaai!
[surprised] Ba món quà! Gấu bông!
[cheerfully] Baaa!
[playfully] Cùng đếm nào!
[slowly] Một…
[slowly] Hai…
[cheering] Ba!
[joyful] Ba món quà! [cheerfully] Giáng sinh vui vẻ!
[warmly] Bé đếm giỏi lắm! [cheerfully] Bye bye!
[softly] Hẹn gặp lại bé nhé!
```
