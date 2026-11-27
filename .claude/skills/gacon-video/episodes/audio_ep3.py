import sys; sys.path.insert(0,'.')
from sfxlib import *
O=4.0; T=Track(45.0); music(T); intro_sfx(T); ambience(T)
T.add('sfx',0.2+O,rustle(1.2),.45); T.add('sfx',1.4+O,rustle(1.2),.45)
CLUE=[3.6,10.0,16.4,23.0]; REV=[6.8,13.2,19.8,26.4]
for c,r in zip(CLUE,REV):
    T.add('sfx',c-0.3+O,rustle(1.6),.45); T.add('sfx',c+1.8+O,rustle(1.0),.3)
    T.add('sfx',c+2.0+O,pop(),.35)
    T.add('sfx',r+O,boing(),.45); T.add('sfx',r+0.05+O,ting(1568),.35)
    T.add('sfx',r+2.4+O,whoosh(0.6),.3); T.add('sfx',r+2.95+O,thud(0.15),.35)
for k in range(4): T.add('sfx',31.0+k+O,ting([1047,1319,1568,2093][k]),.35)
applause(T,35.5+O,2.4); outro_sfx(T,39.0+O); T.write('music_sfx_ep3.wav'); print('ok3')
