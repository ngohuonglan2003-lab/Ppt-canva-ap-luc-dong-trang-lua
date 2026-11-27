import sys; sys.path.insert(0,'.')
from sfxlib import *
O=4.0; T=Track(48.0); music(T); intro_sfx(T); ambience(T)
T.add('sfx',0.0+O,inflate(0.9),.5); T.add('sfx',0.9+O,deflate(),.5)
for k in range(5):
    b=3.4+k*4.4; T.add('sfx',b+O,inflate(1.3),.55); T.add('sfx',b+1.35+O,pop(),.5); T.add('sfx',b+1.6+O,ting([1047,1175,1319,1568,1760][k]),.4)
for k,f in enumerate([1047,1175,1319,1568,1760]): T.add('sfx',27+k*1.4+O,ting(f),.45)
T.add('sfx',34+O,whoosh(1.5),.5); applause(T,34.2+O,2.6); outro_sfx(T,41.6+O); T.write('music_sfx_ep11.wav'); print('ok11')
