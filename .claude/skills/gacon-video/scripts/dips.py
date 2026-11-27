import sys,subprocess,numpy as np
raw=subprocess.run(['ffmpeg','-loglevel','error','-i',sys.argv[1],'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout
a=np.frombuffer(raw,np.float32)
db=np.array([20*np.log10(np.sqrt(np.mean(a[i:i+320]**2))+1e-9) for i in range(0,len(a)-320,160)])
for w in sys.argv[2:]:
    t0,t1=map(float,w.split(':')); i0,i1=int(t0*100),int(t1*100); k=int(np.argmin(db[i0:i1]))
    print(w,'-> dip',(i0+k)/100,round(float(db[i0+k]),1))
