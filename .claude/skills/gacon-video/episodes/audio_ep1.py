import numpy as np, wave
SR=44100; DUR=44.0; OFF=4.0; N=int(SR*DUR)
mus=np.zeros(N); sfx=np.zeros(N)
rng=np.random.default_rng(7)
def add(buf,t0,sig,g=1.0):
    i=int(t0*SR); j=min(N,i+len(sig))
    if i<N: buf[i:j]+=sig[:j-i]*g
def tt(d): return np.arange(int(d*SR))/SR
def mf(m): return 440*2**((m-69)/12)
def marimba(f,d=0.5):
    t=tt(d); e=np.exp(-7*t); a=np.minimum(1,t/0.004)
    return (np.sin(2*np.pi*f*t)+0.25*np.sin(2*np.pi*4*f*t)*np.exp(-20*t))*e*a
def bass(f,d=0.5):
    t=tt(d); return np.sin(2*np.pi*f*t)*np.exp(-3.5*t)*np.minimum(1,t/0.01)
def noise(d): return rng.uniform(-1,1,int(d*SR))
def lp(x,k): return np.convolve(x,np.ones(k)/k,mode='same')
# ---- music ----
bpm=110; b=60/bpm
chords=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]
basses=[36,43,45,41]
mel=[[72,76,79,76],[74,71,74,79],[72,76,81,79],[77,76,74,72]]
mel2=[[79,76,72,76],[74,79,74,71],[76,72,76,81],[72,74,76,72]]
beat=0; t=0.0
while t<DUR-0.6:
    bar=(beat//4); ci=bar%4; k=beat%4
    m=(mel if (bar//4)%2==0 else mel2)[ci][k]
    add(mus,t,marimba(mf(m),0.5),0.55)
    if k in (0,2): add(mus,t,bass(mf(basses[ci]),b*2),0.7)
    if k in (1,3):
        for n in chords[ci]: add(mus,t,marimba(mf(n+12),0.3),0.14)
    sh=noise(0.05)*np.exp(-60*tt(0.05)); sh=sh-lp(sh,8)
    add(mus,t+b/2,sh,0.12)
    beat+=1; t+=b
env=np.ones(N); tA=np.arange(N)/SR
env*=np.clip(tA/0.6,0,1); env*=np.clip((43.6-tA)/1.2,0,1)
mus*=env
# ---- sfx ----
def thud(d=0.22):
    t=tt(d); f=140-80*t/d; ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-14*t)+lp(noise(d),30)*np.exp(-25*t)*0.6
def boing(d=0.45):
    t=tt(d); f=260+260*t/d+60*np.sin(2*np.pi*16*t); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-5*t)*np.minimum(1,t/0.005)
def pop(d=0.09):
    t=tt(d); f=500+1400*t/d; ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-35*t)
def ting(f=1568,d=0.9):
    t=tt(d); return (np.sin(2*np.pi*f*t)+0.4*np.sin(2*np.pi*2.76*f*t)*np.exp(-6*t))*np.exp(-4.5*t)*np.minimum(1,t/0.003)
def rustle(d=0.45):
    x=noise(d); x=x-lp(x,4); t=tt(d); return lp(x,3)*np.sin(np.pi*t/d)*(0.6+0.4*np.sin(2*np.pi*22*t))
def whoosh(d=0.6):
    x=lp(noise(d),12); t=tt(d); return x*np.sin(np.pi*t/d)**2*2.5
def roll(t0,t1,buf):
    tcur=t0; gap=0.05
    while tcur<t1:
        c=noise(0.012)*np.exp(-300*tt(0.012)); add(buf,tcur,lp(c,6),0.5); tcur+=gap; gap*=1.06
def applause(t0,d,buf):
    for i in range(int(d*40)):
        tc=t0+rng.uniform(0,d); c=noise(0.03)*np.exp(-120*tt(0.03)); c=c-lp(c,5)
        add(buf,tc,c,0.18*min(1,(t0+d-tc)/0.5))
ev=[(0.1,rustle(),.35),(1.1,thud(),.9),(1.12,boing(),.45),(1.3,pop(),.5),(1.95,thud(0.15),.5),
    (3.2,pop(),.6),(3.25,ting(1568),.35),(7.0,ting(1760),.35),(8.9,rustle(),.35),(10.0,pop(),.6),
    (11.5,thud(0.15),.45),(11.5,pop(),.6),(11.55,ting(1568),.35),(14.0,ting(1760),.35),(15.9,rustle(),.35),
    (16.9,thud(),.7),(18.0,pop(),.6),(18.05,ting(1568),.35),
    (23.5,ting(1047),.5),(25.5,ting(1319),.5),(27.5,ting(1568),.55),(30.3,whoosh(),.5)]
for t0,s,g in ev: add(sfx,t0+OFF,s,g)
roll(17.2+OFF,18.0+OFF,sfx); applause(30.4+OFF,2.4,sfx)
for k in range(5): add(sfx,30.9+OFF+k*0.7,boing(0.3),0.18)
for i,f in enumerate([2093,2637,3136]): add(sfx,35.0+OFF+i*0.08,ting(f,0.5),0.15)
for i,m in enumerate([72,76,79,84]): add(sfx,38.5+OFF+i*0.14,ting(mf(m),1.2),0.3)
# intro
for i,m in enumerate([60,64,67,72,76]): add(sfx,0.1+i*0.18,ting(mf(m+12),0.8),0.18)
for i in range(6): add(sfx,0.55+i*0.09,pop(),0.35)
add(sfx,1.1,boing(),0.4); add(sfx,1.9,pop(),0.6)
for i,m in enumerate([79,84]): add(sfx,1.95+i*0.12,ting(mf(m),1.0),0.3)
add(sfx,3.6,whoosh(0.6),0.6)
# birds chirps
def chirp():
    d=0.09; t=tt(d); f=2600+1600*t/d; ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.sin(np.pi*t/d)
tc=0.8
while tc<42:
    for k in range(int(rng.integers(2,4))): add(sfx,tc+k*0.13,chirp(),0.10)
    tc+=rng.uniform(3.5,6.5)
# wind ambience
wn=lp(rng.uniform(-1,1,N),60); tW=np.arange(N)/SR
g=0.5+0.8*np.maximum(0,np.sin(tW*0.9-1))
sfx+=wn*g*0.9
mix=mus*0.33+sfx*0.6
mix/=max(1.0,np.abs(mix).max()/0.89)
st=np.stack([mix,mix],1)
w=wave.open('music_sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st*32767).astype(np.int16).tobytes()); w.close()
print('peak',np.abs(mix).max())
