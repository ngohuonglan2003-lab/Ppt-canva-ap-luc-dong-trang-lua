import sys; sys.path.insert(0,'.')
from sfxlib import *
O=4.0; T=Track(44.0); music(T,bpm=72); intro_sfx(T)
T.mus*=0.75
T.add('sfx',1.1+O,drip(),.8); T.add('sfx',1.12+O,ting(2349,0.8),.25)
T.add('sfx',3.0+O,thud(0.6),.15)  # sấm rất nhẹ
for k in range(8): T.add('sfx',3.7+k*0.2+O,step(),.3)
rain_bed(T,3.5+O,26.5+O,0.45)
for t0 in (14.2,14.9): T.add('sfx',t0+O,boing(0.25),.2)
T.add('sfx',15.3+O,splash(0.4),.25); T.add('sfx',16.0+O,ribbit(),.55); T.add('sfx',17.6+O,ribbit(),.5)
for i,m in enumerate([72,76,79,84,88]): T.add('sfx',26.2+i*0.22+O,ting(mf(m),1.4),.22)
for k in range(4): T.add('sfx',32.6+k*1.4+O,ting(mf(84-k*3),1.6),.12)
outro_sfx(T,38.0+O); T.write('music_sfx_ep5.wav',mus_gain=0.28); print('ok5')
