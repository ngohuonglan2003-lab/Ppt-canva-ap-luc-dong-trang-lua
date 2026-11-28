#!/bin/bash
# Quy trình mặc định kênh Little Chick (tập 22+, chỉ tiếng Anh). Chạy trong thư mục làm việc chứa engine.js, mk_ep.py, render.js...
#  1) bash pipeline.sh build  ep32_body.js:ep32_ten ...   → html + QA (qa_epN.png, có phủ vùng an toàn) + meta + âm thanh
#  2) bash pipeline.sh preview ep32_ten ...               → EpN_ten_EN_preview.mp4 (360x640, 15fps)
#  3) bash pipeline.sh script  Voice_Ep32-41 ep32_ten ... → lời thoại gộp 1 đoạn + spec tách câu
#  4) (người dùng gửi file giọng)  bash pipeline.sh cut voice.mp3 Voice_Ep32-41_spec.json → cfg + bảng kiểm tra TỪNG CÂU (sửa tay nếu dính chữ)
#  5) bash pipeline.sh final voice.mp3 ep32_ten ...       → ghép giọng, nhép miệng, hạ nhạc, xuất EpN_ten_EN_final.mp4 (1080x1920)
set -e; cmd=$1; shift
num(){ echo "$1" | grep -o '^ep[0-9]*' | tr -d ep; }
dur(){ python3 -c "import json;print(json.load(open('ep$1_meta.json'))['dur'])"; }
case $cmd in
 build) for p in "$@"; do b=${p%%:*}; f=${p#*:}; n=$(num $f); python3 mk_ep.py $b $f.html; node qa.js $f.html qa_ep$n.png; node export_meta.js $f.html > ep${n}_meta.json; python3 audio_auto.py ep${n}_meta.json music_sfx_ep$n.wav; done;;
 preview) for f in "$@"; do n=$(num $f); (ENV_DIR=none EP_FILE=$f.html DUR=$(dur $n) node render.js en Ep${n}_${f#ep${n}_}_EN_preview.mp4 music_sfx_ep$n.wav preview >/dev/null 2>&1) & done; wait;;
 script) out=$1; shift; python3 voice_script.py $out $(for f in "$@"; do echo -n "ep$(num $f)_meta.json "; done);;
 cut) mkdir -p cuts; python3 -I auto_cuts.py "$1" en "$2" cuts/cfg_en; python3 -I verify_cuts.py "$1" en cuts/cfg_en_ep*.json;;
 final) v=$1; shift; for f in "$@"; do n=$(num $f); python3 voice_place.py "$v" cuts/cfg_en_ep$n.json voice_ep$n; bash mix.sh music_sfx_ep$n.wav voice_ep$n/voice_en.wav mix_ep${n}_en.wav; done
   for f in "$@"; do n=$(num $f); (ENV_DIR=voice_ep$n EP_FILE=$f.html DUR=$(dur $n) node render.js en Ep${n}_${f#ep${n}_}_EN_final.mp4 mix_ep${n}_en.wav >/dev/null 2>&1) & while [ $(jobs -r | wc -l) -ge 3 ]; do sleep 2; done; done; wait;;
 *) sed -n '2,8p' $0;;
esac
