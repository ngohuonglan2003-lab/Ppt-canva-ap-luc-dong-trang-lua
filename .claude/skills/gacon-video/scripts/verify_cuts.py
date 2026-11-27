"""Kiểm tra từng câu đã cắt: python3 -I verify_cuts.py voice.mp3 lang cfg1.json [cfg2.json ...]"""
import sys,os,json,subprocess,numpy as np
from faster_whisper import WhisperModel
src,lang=sys.argv[1:3]
a=np.frombuffer(subprocess.run(['ffmpeg','-loglevel','error','-i',src,'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout,np.float32)
m=WhisperModel(os.environ.get('WHISPER_DIR','/tmp/claude-0/wm/m'),device='cpu',compute_type='int8')
for cp in sys.argv[3:]:
    cfg=json.load(open(cp)); print('==',os.path.basename(cp))
    for k,(s,e) in enumerate(cfg['cuts'][lang]):
        clip=np.concatenate([np.zeros(4000,np.float32),a[int(s*16000):int(e*16000)],np.zeros(4000,np.float32)])
        segs,_=m.transcribe(clip,language=lang,condition_on_previous_text=False,vad_filter=False)
        print(f'  {k:2d} {s:6.2f}-{e:6.2f}  {"".join(x.text for x in segs).strip()}')
