// Tập 28 · Use Your Words (nói thay vì mè nheo)
const EP={};
const LINES=[
 ['playfully','Eeeh! Eeeh!'],
 ['curious','Hmm? What do you want?','mom'],
 ['playfully','Eeeeh!'],
 ['cheerfully',"Let's use our words!",'mom'],
 ['sweetly','Can I have water, please?'],
 ['delighted','Yes, you can! Here you go!','mom'],
 ['happily','Thank you, Mommy!'],
 ['excited','Words are magic!'],
 ['cheerfully','Can I have a hug, please?'],
 ['joyful','Big hug! Hooray!','mom'],
 ['cheerfully','Use your words! Bye-bye!'],
];
let B;
EP.init=function(){
  B=setupEpisode(LINES,{ep:'Use Your Words'});
  EP.SHOTS=shotsAt(B,[[-1,1.4,100,240,1.5,100,240],[1,1.2,90,244,1.25,90,244],[4,1.6,104,240,1.7,104,238],[5,1.2,90,244,1.25,90,244],[8,1.35,84,240,1.45,84,240],[10,1.1,90,244,1.15,90,244]]);
  const A=B.at; EP.SFX=[[A[0],'boing',.3],[A[2],'boing',.3],[A[3],'ting1568',.3],[A[4],'ting2093',.3],[A[5]+0.4,'whoosh',.3],[A[5]+0.9,'pop',.4],[A[6]+0.2,'bubbles',.4],[A[7],'ting2637',.35],[A[9],'applause',1]];
};
EP.main=function(t){
  const A=B.at, on=i=>lineOn(B,t,i);
  let w=`<rect x="-40" y="-40" width="260" height="440" fill="#FFF1DC"/><rect x="-40" y="270" width="260" height="170" fill="#E8C9A0"/><rect x="-40" y="268" width="260" height="4" fill="#D6B184"/>`;
  w+=`<rect x="84" y="236" width="50" height="8" rx="2" fill="#C98A48"/><rect x="89" y="244" width="5" height="26" fill="#A86A3D"/><rect x="124" y="244" width="5" height="26" fill="#A86A3D"/>`;
  // cốc: trên bàn → mẹ đưa cho Gà Con
  let cupX=108, cupY=236, water=1;
  if(t>A[5]+0.4){const u=eIO(prog(t,A[5]+0.4,A[5]+1.0)); cupX=lerp(108,78,u); cupY=lerp(236,244,u);}
  if(t>A[6]+0.2) water=clamp(1-(t-A[6]-0.2)/1.2);
  if(t>A[7]) {cupX=lerp(78,108,eIO(prog(t,A[7],A[7]+0.6))); cupY=lerp(244,236,prog(t,A[7],A[7]+0.6));}
  const hug=on(9);
  const mx=hug?lerp(126,94,eOut(prog(t,A[9],A[9]+0.4))):126;
  w+=momHen(mx,232,.6,{wl:on(5)?80:0,wr:on(1)?-40:0,eyes:'happy',mouth:mouthFor(B,t,'mom')});
  w+=cupProp(cupX,cupY,water);
  let ce='open', cwl=0, cwr=0, cj=0;
  if(on(0)||on(2)){ce='sad'; cwr=-70+Math.sin(t*14)*15; cj=3*Math.abs(Math.sin(t*10));}
  if(t>A[3])ce='happy';
  if(on(4)||on(8)){cwl=-20; cwr=20;}
  if(on(7)){cwl=110; cwr=-110; cj=6*Math.abs(Math.sin(t*Math.PI*1.4));}
  if(hug){cwr=40;}
  if(t>A[10])cwr=waveWR(t,A[10]);
  w+=selChick(60,244,.46,{jump:cj,wl:cwl,wr:cwr,eyes:ce,mouth:mouthFor(B,t,'chick')},t);
  if(on(1))w+=fxQ(126,186,t,A[1]+0.2);
  if(on(7))w+=fxSparkle(80,214,t,A[7],40);
  if(hug)w+=fxHearts(90,204,t,A[9]);
  let s=`<g transform="${cam(t)}">${w}</g>`;
  s+=bigWord('EEEH!',t,A[0],A[1]-0.1,118,'#F2545B')+bigWord('USE WORDS',t,A[3]+0.2,A[4]-0.1,118,'#45B6F0')+bigWord('PLEASE',t,A[4]+0.3,A[5]-0.1,118,'#9B6CE0')+bigWord('WORDS = MAGIC ✨',t,A[7],A[8]-0.1,118,'#FF8C2B');
  return s+confetti(t,A[9],3.6);
};
