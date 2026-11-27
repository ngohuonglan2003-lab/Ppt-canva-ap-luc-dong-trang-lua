"""Thư viện âm thanh kênh Gà Con: nhạc nền marimba tự soạn + hiệu ứng tổng hợp (không bản quyền)."""
import numpy as np, wave
SR=44100
rng=np.random.default_rng(7)
def tt(d): return np.arange(int(d*SR))/SR
def mf(m): return 440*2**((m-69)/12)
def noise(d): return rng.uniform(-1,1,int(d*SR))
def lp(x,k): return np.convolve(x,np.ones(k)/k,mode='same')
class Track:
    def __init__(s,dur): s.N=int(dur*SR); s.dur=dur; s.mus=np.zeros(s.N); s.sfx=np.zeros(s.N)
    def add(s,buf,t0,sig,g=1.0):
        b=s.mus if buf=='mus' else s.sfx; i=int(t0*SR); j=min(s.N,i+len(sig))
        if 0<=i<s.N: b[i:j]+=sig[:j-i]*g
    def write(s,path,mus_gain=0.33,sfx_gain=0.6):
        mix=s.mus*mus_gain+s.sfx*sfx_gain; mix/=max(1.0,np.abs(mix).max()/0.89)
        st=np.stack([mix,mix],1); w=wave.open(path,'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st*32767).astype(np.int16).tobytes()); w.close()
def marimba(f,d=0.5):
    t=tt(d); return (np.sin(2*np.pi*f*t)+0.25*np.sin(2*np.pi*4*f*t)*np.exp(-20*t))*np.exp(-7*t)*np.minimum(1,t/0.004)
def bass(f,d=0.5):
    t=tt(d); return np.sin(2*np.pi*f*t)*np.exp(-3.5*t)*np.minimum(1,t/0.01)
def music(T,bpm=110,seed_variant=0):
    b=60/bpm; chords=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]; basses=[36,43,45,41]
    mel=[[72,76,79,76],[74,71,74,79],[72,76,81,79],[77,76,74,72]]
    mel2=[[79,76,72,76],[74,79,74,71],[76,72,76,81],[72,74,76,72]]
    if seed_variant: mel,mel2=mel2,mel
    beat=0;t=0.0
    while t<T.dur-0.6:
        bar=beat//4;ci=bar%4;k=beat%4
        m=(mel if (bar//4)%2==0 else mel2)[ci][k]
        T.add('mus',t,marimba(mf(m)),0.55)
        if k in(0,2):T.add('mus',t,bass(mf(basses[ci]),b*2),0.7)
        if k in(1,3):
            for n in chords[ci]:T.add('mus',t,marimba(mf(n+12),0.3),0.14)
        sh=noise(0.05)*np.exp(-60*tt(0.05));sh=sh-lp(sh,8);T.add('mus',t+b/2,sh,0.12)
        beat+=1;t+=b
    tA=np.arange(T.N)/SR; T.mus*=np.clip(tA/0.6,0,1)*np.clip((T.dur-0.4-tA)/1.2,0,1)
def thud(d=0.22):
    t=tt(d);f=140-80*t/d;ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-14*t)+lp(noise(d),30)*np.exp(-25*t)*0.6
def boing(d=0.45):
    t=tt(d);f=260+260*t/d+60*np.sin(2*np.pi*16*t);ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-5*t)*np.minimum(1,t/0.005)
def pop(d=0.09):
    t=tt(d);f=500+1400*t/d;ph=2*np.pi*np.cumsum(f)/SR; return np.sin(ph)*np.exp(-35*t)
def ting(f=1568,d=0.9):
    t=tt(d); return (np.sin(2*np.pi*f*t)+0.4*np.sin(2*np.pi*2.76*f*t)*np.exp(-6*t))*np.exp(-4.5*t)*np.minimum(1,t/0.003)
def rustle(d=0.45):
    x=noise(d);x=x-lp(x,4);t=tt(d); return lp(x,3)*np.sin(np.pi*t/d)*(0.6+0.4*np.sin(2*np.pi*22*t))
def whoosh(d=0.6):
    x=lp(noise(d),12);t=tt(d); return x*np.sin(np.pi*t/d)**2*2.5
def splash(d=0.7):
    x=noise(d); t=tt(d); hi=x-lp(x,3); return (lp(hi,2)*np.exp(-5*t)*1.2+lp(x,20)*np.exp(-9*t))*np.minimum(1,t/0.01)
def bubbles(d=0.9):
    out=np.zeros(int(d*SR))
    for k in range(6):
        st=rng.uniform(0,d-0.08); t=tt(0.06); f=500+rng.uniform(0,600)+4000*t
        b=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-50*t); i=int(st*SR); out[i:i+len(b)]+=b
    return out
def quack(d=0.22,f0=420):
    t=tt(d); f=f0*(1+0.25*np.sin(np.pi*t/d))
    ph=2*np.pi*np.cumsum(f)/SR; saw=sum(np.sin(k*ph)/k for k in range(1,9))
    env=np.sin(np.pi*np.minimum(1,t/d))**0.6
    return lp(saw,3)*env*0.7
def step(): return lp(noise(0.03),10)*np.exp(-150*tt(0.03))*2
def chirp():
    d=0.09;t=tt(d);f=2600+1600*t/d; return np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*t/d)
def applause(T,t0,d):
    for i in range(int(d*40)):
        tc=t0+rng.uniform(0,d);c=noise(0.03)*np.exp(-120*tt(0.03));c=c-lp(c,5);T.add('sfx',tc,c,0.18*min(1,(t0+d-tc)/0.5))
def intro_sfx(T):
    for i,m in enumerate([60,64,67,72,76]):T.add('sfx',0.1+i*0.18,ting(mf(m+12),0.8),0.18)
    for i in range(6):T.add('sfx',0.55+i*0.09,pop(),0.35)
    T.add('sfx',1.1,boing(),0.4);T.add('sfx',1.9,pop(),0.6)
    for i,m in enumerate([79,84]):T.add('sfx',1.95+i*0.12,ting(mf(m),1.0),0.3)
    T.add('sfx',3.6,whoosh(0.6),0.6)
def ambience(T):
    tc=0.8
    while tc<T.dur-2:
        for k in range(int(rng.integers(2,4))):T.add('sfx',tc+k*0.13,chirp(),0.10)
        tc+=rng.uniform(3.5,6.5)
    wn=lp(rng.uniform(-1,1,T.N),60);tW=np.arange(T.N)/SR
    T.sfx+=wn*(0.5+0.8*np.maximum(0,np.sin(tW*0.9-1)))*0.9
def outro_sfx(T,t_end):
    for i,f in enumerate([2093,2637,3136]):T.add('sfx',t_end-3.5+i*0.08,ting(f,0.5),0.15)
    for i,m in enumerate([72,76,79,84]):T.add('sfx',t_end+i*0.14,ting(mf(m),1.2),0.3)
