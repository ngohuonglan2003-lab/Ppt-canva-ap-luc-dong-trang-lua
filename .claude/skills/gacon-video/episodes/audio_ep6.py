import sys; sys.path.insert(0,'.')
from sfxlib import *
O=4.0; T=Track(44.0); music(T); sleigh(T,O,O+40); intro_sfx(T)
for k in range(6): T.add('sfx',0.3+k*0.45+O,boing(0.3),.25)
OPEN=[3.4,9.4,16.4]
for k,o in enumerate(OPEN):
    if k>0:
        for j in range(5): T.add('sfx',o-0.6+j*0.12+O,step(),.4)
    T.add('sfx',o+O,pop(),.7); T.add('sfx',o+0.02+O,ting(1568),.35); T.add('sfx',o+0.1+O,bells(0.5),.6)
    T.add('sfx',o+0.6+O,thud(0.15),.3)
for k,f in enumerate([1047,1319,1568]): T.add('sfx',24.5+k*1.5+O,ting(f),.45)
for k in range(10): T.add('sfx',29.5+k*0.2+O,bells(0.3),.35)
applause(T,29.6+O,2.4); outro_sfx(T,37.5+O); T.write('music_sfx_ep6.wav'); print('ok6')
