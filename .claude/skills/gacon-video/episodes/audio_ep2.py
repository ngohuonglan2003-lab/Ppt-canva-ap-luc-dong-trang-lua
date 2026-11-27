import sys; sys.path.insert(0,'.')
from sfxlib import *
O=4.0; T=Track(49.0); music(T,seed_variant=1); intro_sfx(T); ambience(T)
E=[(0.45,splash(),.6),(1.1,splash(0.4),.5),(1.15,boing(),.3),(1.6,rustle(0.6),.3),(2.2,bubbles(1.0),.5),
   (3.2,splash(),.6),(3.35,quack(),.55),(3.25,ting(1568),.3),(6.5,ting(1760),.35),
   (8.6,whoosh(1.2),.25),(10.0,quack(),.55),(10.0,pop(),.5),(10.05,ting(1568),.3),(13.0,ting(1760),.35),
   (15.0,boing(),.4),(16.0,splash(),.6),(16.1,quack(0.25,460),.55),(16.05,ting(1568),.3),(19.0,ting(1760),.35),
   (22.4,whoosh(0.5),.4),(23.0,splash(),.7),(23.1,quack(0.3,520),.6),(23.05,ting(1568),.3),(26.0,ting(1760),.35),
   (29.5,ting(1047),.45),(31.0,ting(1319),.45),(32.5,ting(1568),.5),(34.0,ting(2093),.5)]
for t0,s,g in E: T.add('sfx',t0+O,s,g)
for k in range(4): T.add('sfx',29.5+O+k*1.5,quack(0.2,400+k*40),0.45)
for k in range(14): T.add('sfx',21.0+O+k*0.1,step(),0.4)
applause(T,35.7+O,2.4)
for k in range(6): T.add('sfx',35.8+O+k*0.65,quack(0.15,450+(k%4)*50),0.3)
outro_sfx(T,43.0+O)
T.write('music_sfx_ep2.wav'); print('ok')
