import subprocess,numpy as np,wave,json
SR=44100; N=int(44*SR)
raw=subprocess.run(['ffmpeg','-loglevel','error','-i','voice/en_raw.mp3','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
a=np.frombuffer(raw,np.float32).copy()
TGT=[1.2,5.2,7.2,11.0,14.2,18.0,22.0,26.2,27.5,29.5,31.5,34.3,39.2,42.6]
CUT={'en':[(0.0,1.71),(2.02,3.20),(3.60,5.55),(5.79,6.39),(6.55,7.60),(7.65,8.18),(8.24,9.21),(9.29,10.05),(10.46,10.96),(11.0,11.6),(11.68,12.28),(12.72,14.23),(14.32,15.84),(15.88,16.68)],
     'vi':[(16.74,18.50),(18.93,20.25),(20.78,22.45),(22.87,23.24),(23.68,24.52),(24.64,25.42),(25.73,26.53),(26.89,27.62),(27.95,28.22),(28.48,29.13),(29.28,29.84),(30.02,32.20),(32.35,34.01),(34.28,35.52)]}
for lang,cuts in CUT.items():
    v=np.zeros(N,np.float32)
    for (s,e),t in zip(cuts,TGT):
        s=max(0,s-0.04); e=e+0.06
        c=a[int(s*SR):int(e*SR)].copy(); f=int(0.02*SR)
        c[:f]*=np.linspace(0,1,f); c[-f:]*=np.linspace(1,0,f)
        i=int(t*SR); v[i:i+len(c)]+=c[:N-i]
        print(lang,round(t,2),'->',round(t+len(c)/SR,2))
    v=v/max(1e-6,np.abs(v).max())*0.95
    w=wave.open(f'voice/voice_{lang}.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((v*32767).astype(np.int16).tobytes());w.close()
    hop=SR//100; env=[float(np.sqrt(np.mean(v[i:i+hop]**2))) for i in range(0,N,hop)]
    m=max(env); env=[round(min(1,(x/m)*2.2),3) for x in env]
    json.dump(env,open(f'voice/env_{lang}.json','w'))
