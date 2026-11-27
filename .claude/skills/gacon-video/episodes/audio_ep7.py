import sys; sys.path.insert(0,'.')
from sfxlib import *
O=4.0; T=Track(45.0); music(T); intro_sfx(T); T.mus*=1.2
B=60/110; VS=[3.4,10.2,17.0,23.8]
def beats(a,b):
    k=int(np.ceil(a/B)); out=[]
    while k*B<b: out.append(k*B); k+=1
    return out
for bt in beats(VS[0]+O,VS[0]+O+6.6): T.add('sfx',bt,clap(),0.7)
for bt in beats(VS[1]+O,VS[1]+O+6.6): T.add('sfx',bt,thud(0.18),0.8)
for bt in beats(VS[2]+O,VS[2]+O+6.6)[::2]: T.add('sfx',bt,boing(0.3),0.25)
for bt in beats(VS[3]+O,VS[3]+O+6.6)[::4]: T.add('sfx',bt,whoosh(0.8),0.45)
T.add('sfx',VS[1]+O,pop(),.5); T.add('sfx',VS[2]+O,pop(),.5); T.add('sfx',VS[3]+O,pop(),.5)
for bt in beats(30.6+O,34.9+O): T.add('sfx',bt,clap(),0.55)
applause(T,30.7+O,3.0); outro_sfx(T,38.8+O); T.write('music_sfx_ep7.wav',mus_gain=0.4); print('ok7')
