import sys; sys.path.insert(0,'.')
from sfxlib import *
O=4.0; T=Track(41.0); music(T); intro_sfx(T)
for k in range(int(17/0.5)): T.add('sfx',O+k*0.5,tick(),0.35 if k%2==0 else 0.2)
T.add('sfx',3.6+O,quack(),.35)
for b,f in [(11,1047),(13,1319),(15,1568)]: T.add('sfx',b+O,ting(f),.5)
T.add('sfx',17+O,gong(),.6)
for t0 in [17.0,17.6,18.1,19.2,19.8,21.0,21.8,22.4,23.2,24.0,25.0,30.6,31.4,32.2]:
    T.add('sfx',t0-0.6+O,whoosh(0.5),.25); T.add('sfx',t0+O,boom(),.45); T.add('sfx',t0+0.15+O,crackle(),.25)
applause(T,17.1+O,3.0); outro_sfx(T,34.6+O); T.write('music_sfx_ep9.wav'); print('ok9')
