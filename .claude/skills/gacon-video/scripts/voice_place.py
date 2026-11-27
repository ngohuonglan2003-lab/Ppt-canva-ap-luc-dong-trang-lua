"""Đặt từng câu thoại từ 1 file giọng (ElevenLabs) vào đúng mốc video + tạo envelope nhép miệng.
Dùng: python3 voice_place.py <voice.mp3> <config.json> <outdir>
config.json: {"dur":49, "targets":[1.2,5.2,...], "cuts":{"vi":[[s,e],...], "en":[[s,e],...]}}
 - targets: giây bắt đầu (tính cả intro) của từng câu trong video.
 - cuts: đoạn [bắt đầu,kết thúc] của từng câu trong file giọng gốc (tìm bằng transcribe.py + silencedetect).
Kết quả: <outdir>/voice_<lang>.wav và <outdir>/env_<lang>.json (100 giá trị/giây) cho render.js."""
import subprocess,numpy as np,wave,json,sys,os
src,cfgp,out=sys.argv[1:4]; cfg=json.load(open(cfgp)); SR=44100; N=int(cfg['dur']*SR); os.makedirs(out,exist_ok=True)
raw=subprocess.run(['ffmpeg','-loglevel','error','-i',src,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
a=np.frombuffer(raw,np.float32).copy()
for lang,cuts in cfg['cuts'].items():
    assert len(cuts)==len(cfg['targets']),f'{lang}: số câu ({len(cuts)}) khác số mốc ({len(cfg["targets"])})'
    v=np.zeros(N,np.float32)
    for (s,e),t in zip(cuts,cfg['targets']):
        s=max(0,s-0.04);e=e+0.06;c=a[int(s*SR):int(e*SR)].copy();f=int(0.02*SR)
        c[:f]*=np.linspace(0,1,f);c[-f:]*=np.linspace(1,0,f);i=int(t*SR);v[i:i+len(c)]+=c[:N-i]
    v=v/max(1e-6,np.abs(v).max())*0.95
    w=wave.open(f'{out}/voice_{lang}.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((v*32767).astype(np.int16).tobytes());w.close()
    hop=SR//100;env=[float(np.sqrt(np.mean(v[i:i+hop]**2))) for i in range(0,N,hop)];m=max(env)
    json.dump([round(min(1,(x/m)*2.2),3) for x in env],open(f'{out}/env_{lang}.json','w'))
    print('ok',lang)
