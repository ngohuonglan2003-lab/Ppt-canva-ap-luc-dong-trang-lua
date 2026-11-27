"""Tự tìm điểm cắt câu cho file giọng đọc liền (nhiều tập).
Dùng: python3 -I auto_cuts.py voice.mp3 lang spec.json outprefix
spec.json: {"episodes":[{"name":"ep3","dur":45,"targets":[...],"words":[4,4,2,...]}, ...]}
 - words: số chữ (theo whisper) của từng câu, đúng thứ tự. Tổng mọi tập phải bằng số chữ whisper nhận được.
Kết quả: <outprefix>_<name>.json (config cho voice_place.py) + in bảng câu để kiểm tra."""
import sys,json,os,subprocess,numpy as np
from faster_whisper import WhisperModel
src,lang,specp,outp=sys.argv[1:5]; spec=json.load(open(specp))
raw=subprocess.run(['ffmpeg','-loglevel','error','-i',src,'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout
a=np.frombuffer(raw,np.float32)
m=WhisperModel(os.environ.get('WHISPER_DIR','/tmp/claude-0/wm/m'),device='cpu',compute_type='int8')
segs,_=m.transcribe(a,language=lang,word_timestamps=True,condition_on_previous_text=False)
W=[(w.word.strip(),w.start,w.end) for s in segs for w in s.words]
counts=[c for e in spec['episodes'] for c in e['words']]
if sum(counts)!=len(W):
    print('\n'.join(f'{i} {w} {s:.2f}' for i,(w,s,e) in enumerate(W))); sys.exit(f'tổng chữ trong spec {sum(counts)} != whisper {len(W)}')
db=np.array([20*np.log10(np.sqrt(np.mean(a[i:i+320]**2))+1e-9) for i in range(0,len(a)-320,160)])
lines=[];i=0
for c in counts: lines.append(W[i:i+c]); i+=c
def dip(t0,t1):
    i0,i1=max(0,int(t0*100)),min(len(db)-1,int(t1*100))
    if i1<=i0: return (t0+t1)/2
    return (i0+int(np.argmin(db[i0:i1])))/100
# các khoảng lặng ứng viên: đoạn db < -35 kéo dài >= 70 ms
gaps=[];i=0
while i<len(db):
    if db[i]<-35:
        j=i
        while j<len(db) and db[j]<-35: j+=1
        if j-i>=7: gaps.append(((i+j)/200,(j-i)/100))
        i=j
    else: i+=1
WIN=float(os.environ.get('GAP_WIN','0.7'))
b=[]
for k in range(len(lines)-1):
    x=(lines[k][-1][2]+lines[k+1][0][1])/2
    cand=[g for g in gaps if abs(g[0]-x)<=WIN and (not b or g[0]>b[-1]+0.15)]
    if cand: b.append(max(cand,key=lambda g:(g[1]-abs(g[0]-x)*0.15))[0])
    else: b.append(dip(x-0.3,x+0.3))
starts=[0.0]+[x+0.03 for x in b]; ends=[x-0.03 for x in b]+[len(a)/16000]
# trim leading/trailing silence of each cut
def trim(s,e):
    i0,i1=int(s*100),int(e*100); seg=db[i0:i1]; on=np.where(seg>-40)[0]
    if len(on)==0: return s,e
    return (i0+on[0])/100-0.02,(i0+on[-1])/100+0.04
cuts=[trim(s,e) for s,e in zip(starts,ends)]
k=0
for ep in spec['episodes']:
    n=len(ep['words']); cc=cuts[k:k+n]; ll=lines[k:k+n]; k+=n
    json.dump({"dur":ep['dur'],"targets":ep['targets'],"cuts":{lang:[[round(s,2),round(e,2)] for s,e in cc]}},open(f"{outp}_{ep['name']}.json",'w'))
    print('==',ep['name'])
    for (s,e),l,t in zip(cc,ll,ep['targets']):
        print(f"  {s:6.2f}-{e:6.2f} ({e-s:4.2f}s) -> @{t:5.1f}  {' '.join(w for w,_,_ in l)}")
