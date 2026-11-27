import sys; sys.path.insert(0,'.')
from sfxlib import *
O=4.0; T=Track(41.0); music(T,seed_variant=1); intro_sfx(T); ambience(T)
for r in [3.4,8.8,14.8,20.8,27.8]:
    T.add('sfx',r+O,pop(),.7); T.add('sfx',r+0.03+O,ting(2093,0.9),.35); T.add('sfx',r+0.08+O,ting(2637,0.9),.25)
for h in [6.0,12.0,18.0]:
    T.add('sfx',h+0.5+O,rustle(1.5),.4); T.add('sfx',h+0.6+O,pop(),.2)
T.add('sfx',8.85+O,whoosh(0.6),.4); T.add('sfx',8.9+O,quack(),.45); T.add('sfx',14.9+O,ribbit(),.5); T.add('sfx',20.9+O,boing(0.3),.3)
applause(T,27.9+O,2.6); outro_sfx(T,34.6+O); T.write('music_sfx_ep8.wav'); print('ok8')
