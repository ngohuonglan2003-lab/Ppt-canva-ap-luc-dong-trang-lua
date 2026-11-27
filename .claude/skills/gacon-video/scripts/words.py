import sys,subprocess,numpy as np
from faster_whisper import WhisperModel
m=WhisperModel(__import__('os').environ.get('WHISPER_DIR','/tmp/claude-0/wm/m'),device='cpu',compute_type='int8')
raw=subprocess.run(['ffmpeg','-loglevel','error','-i',sys.argv[1],'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout
segs,_=m.transcribe(np.frombuffer(raw,np.float32),language=sys.argv[2],word_timestamps=True,condition_on_previous_text=False)
print(' '.join(f"{w.word.strip()}@{w.start:.2f}-{w.end:.2f}" for s in segs for w in s.words))
