// Tập 24 · A New Baby Duckie (có em bé mới, làm anh chị)
const EP={};
const LINES=[
 ['excited','Duckie has a new baby brother!'],
 ['delighted','Hello, little baby!'],
 ['sweetly','Mama Duck is busy with the baby.'],
 ['sweetly','Duckie feels left out.'],
 ['cheerfully','Little Chick has an idea.'],
 ['excited','Big sisters can help!'],
 ['happily','Duckie brings a soft blanket!'],
 ['playfully','Duckie sings a song! La la la!','duck'],
 ['delighted','The baby smiles at Duckie!'],
 ['sweetly','Mama hugs Duckie too!'],
 ['cheerfully','Being a big sister is fun! Bye-bye!'],
];
let B;
EP.init=function(){
  B=setupEpisode(LINES,{ep:'A New Baby Duckie'});
  EP.SHOTS=shotsAt(B,[[-1,1.25,110,245,1.3,110,245],[2,1.5,118,248,1.6,118,248],[3,1.7,70,250,1.85,70,248],[4,1.55,52,232,1.65,52,230],[5,1.1,96,248,1.2,96,248],[9,1.35,120,246,1.45,120,246],[10,1.05,92,248,1.1,92,248]]);
  const A=B.at; EP.SFX=[[A[0],'ting2093',.4],[A[1],'quack',.3],[A[4],'ting2349',.35],[A[6],'whoosh',.3],[A[8],'ting2637',.3],[A[9],'pop',.4],[A[10],'applause',1]];
};
function nest(x,y){return `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="4" rx="24" ry="9" fill="#C9A06A"/><path d="M-24 2 q8 -6 16 0 q8 -6 16 0 q8 -6 16 0" stroke="#A47A44" stroke-width="2" fill="none"/></g>`;}
function blanketOn(x,y,u){return u<=0?'':`<g transform="translate(${x} ${y-30*(1-u)})" opacity="${u}"><path d="M-16 -2 Q0 -12 16 -2 L14 8 Q0 2 -14 8 Z" fill="#9EDCFF"/>${[-8,0,8].map(d=>`<circle cx="${d}" cy="0" r="1.6" fill="#fff"/>`).join('')}</g>`;}
EP.main=function(t){
  const A=B.at, on=i=>lineOn(B,t,i);
  let w=meadow(t)+nest(126,290);
  // Mama Duck (to), em bé trong tổ, Duckie (chị), Gà Con
  const mamaHug=t>A[9]&&t<A[10]+0.5; const mamaX=mamaHug?lerp(150,128,eOut(prog(t,A[9],A[9]+0.5))):150;
  w+=duckStand(mamaX,256,{s:2.1,flap:mamaHug?0.6:(on(2)?0.3*Math.abs(Math.sin(t*4)):0),eyes:'happy'});
  const babySmile=t>A[8]; w+=duckStand(126,282+Math.sin(t*3)*0.6,{s:0.75,eyes:babySmile?'happy':'open',flap:babySmile?Math.abs(Math.sin(t*8))*0.5:0});
  w+=blanketOn(126,288,t>A[6]?eOut(prog(t,A[6]+0.3,A[6]+1.0)):0);
  let dx=t<A[5]?70:lerp(70,100,eOut(prog(t,A[5],A[5]+0.8))); if(mamaHug) dx=lerp(100,108,prog(t,A[9],A[9]+0.5));
  const dSad=on(2)||on(3);
  w+=duckStand(dx,268,{s:1.4,eyes:dSad?'sad':'happy',flap:(on(7)?Math.abs(Math.sin(t*8)):0)||(t>A[10]?(Math.sin(t*12)+1)/2:0),quack:mouthFor(B,t,'duck')});
  let ce='happy',cwl=0,cwr=0;
  if(dSad)ce='open'; if(on(4)){cwl=110*eOut(prog(t,A[4],A[4]+0.3));} if(t>A[10])cwr=waveWR(t,A[10]);
  w+=selChick(40,244,.46,{wl:cwl,wr:cwr,eyes:ce,mouth:mouthFor(B,t,'chick')},t);
  if(on(3))w+=fxTears(70,254,t);
  if(on(4))w+=fxBulb(40,206,t,A[4]+0.05);
  if(on(7))w+=partyNotes(96,240,t);
  if(t>A[8])w+=fxHearts(124,262,t,A[8]);
  if(mamaHug)w+=fxHearts(110,232,t,A[9]);
  w+=wind(t);
  let s=`<g transform="${cam(t)}">${w}</g>`;
  s+=bigWord('BIG SISTER!',t,A[5]+0.2,A[6]-0.1,118,'#FF8C2B')+bigWord('LA LA LA ♪',t,A[7]+0.3,A[8]-0.1,118,'#9B6CE0');
  return s+confetti(t,A[10],3.5);
};
