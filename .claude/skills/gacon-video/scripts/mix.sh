#!/bin/bash
# Trộn nhạc/hiệu ứng với giọng, tự hạ nhạc khi có giọng (giọng to hơn nhạc ~9 dB).
# Dùng: mix.sh <music_sfx.wav> <voice.wav> <out.wav>
ffmpeg -loglevel error -y -i "$1" -i "$2" -filter_complex "[1:a]aformat=channel_layouts=stereo,asplit=2[v1][v2];[0:a][v1]sidechaincompress=threshold=0.02:ratio=8:attack=15:release=400[duck];[duck][v2]amix=inputs=2:weights='0.5 1.3':normalize=0,alimiter=limit=0.95" -ar 44100 "$3"
