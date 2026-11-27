import sys
from faster_whisper import WhisperModel
m=WhisperModel(__import__('os').environ.get('WHISPER_DIR','/tmp/claude-0/wm/m'),device='cpu',compute_type='int8')
import subprocess,numpy as np
raw=subprocess.run(['ffmpeg','-loglevel','error','-i',sys.argv[1],'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout
audio=np.frombuffer(raw,np.float32)
segs,info=m.transcribe(audio,language=sys.argv[2],word_timestamps=True,vad_filter=False,condition_on_previous_text=False)
print('lang',info.language)
for s in segs:
    print(f"[{s.start:.2f}-{s.end:.2f}] {s.text}")
    pass
