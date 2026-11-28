// Tập 31 · Say Thank You in Vietnamese: Cảm ơn (ngách song ngữ, phần 2)
const EP={};
const LINES=[
 ['excited',"Let's learn Vietnamese!"],
 ['delighted','Duckie has a flower for me!'],
 ['curious','How do we say thank you?'],
 ['cheerfully','Cảm ơn!'],
 ['playfully','Say it with me! Cảm ơn!'],
 ['happily','Cảm ơn, Duckie!'],
 ['sweetly','You are welcome! Không có gì!','duck'],
 ['cheerfully','Cảm ơn means thank you!'],
 ['joyful','Great job! You speak Vietnamese!'],
 ['cheerfully','Tạm biệt! Bye-bye!'],
];
let B;
EP.init=function(){
  B=setupEpisode(LINES,{ep:'Cảm ơn = Thank you',sub:'Tạm biệt! See you next time!'});
  EP.SHOTS=shotsAt(B,[[-1,1.25,84,238,1.3,84,238],[1,1.15,96,248,1.2,96,248],[3,1.15,84,244,1.2,84,244],[6,1.3,112,250,1.35,112,250],[8,1.1,92,248,1.15,92,248]]);
  const A=B.at; EP.SFX=[[A[1],'pop',.4],[A[1]+0.2,'quack',.3],[A[3],'ting1568',.4],[A[5],'ting2093',.35],[A[6],'pop',.35],[A[8],'applause',1],[A[9],'pop',.4]];
};
function flower(x,y,s){return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L0 14" stroke="#3FAE5A" stroke-width="1.6"/>`+[0,72,144,216,288].map(a=>`<circle cx="${Math.cos(a*Math.PI/180)*3.4}" cy="${Math.sin(a*Math.PI/180)*3.4}" r="2.8" fill="#FF8FA8"/>`).join('')+`<circle r="2" fill="#FFCC33"/></g>`;}
EP.main=function(t){
  const A=B.at, on=i=>lineOn(B,t,i);
  let w=meadow(t);
  const dx=t<A[1]?lerp(200,128,eOut(prog(t,A[1]-0.6,A[1]))):128;
  w+=duckStand(dx,262,{s:1.45,flap:on(1)?Math.abs(Math.sin(t*9))*0.5:(t>A[9]?(Math.sin(t*12)+1)/2:0),eyes:'happy',quack:mouthFor(B,t,'duck')});
  // bông hoa: Vịt cầm → đưa cho Gà Con
  const fx=t<A[5]?lerp(dx-16,112,0):lerp(112,92,eIO(prog(t,A[5],A[5]+0.6)));
  w+=flower(t>A[1]-0.6?fx:-50,236,1.6);
  let cwl=0,cwr=0,cj=0;
  if(on(3)||on(4))cwr=-(100+25*Math.sin(t*10));
  if(on(8)){cwl=110; cwr=-110; cj=6*Math.abs(Math.sin(t*Math.PI*1.4));}
  if(t>A[9])cwr=waveWR(t,A[9]);
  w+=selChick(72,240,.52,{jump:cj,wl:cwl,wr:cwr,eyes:'happy',mouth:mouthFor(B,t,'chick')},t);
  if(on(3)||on(4)||on(7))w+=speech(72,196,'Cảm ơn!','(kahm uhn) = thank you',t,on(3)?A[3]:(on(4)?A[4]:A[7]));
  if(on(5))w+=speech(72,196,'Cảm ơn!','',t,A[5]);
  if(on(6))w+=speech(122,206,'Không có gì!','(kohng kaw zee)',t,A[6]);
  if(t>A[9])w+=speech(90,196,'Tạm biệt!','(tum bee-et) = bye-bye',t,A[9]);
  if(on(8))w+=fxHearts(96,220,t,A[8]);
  w+=wind(t);
  return `<g transform="${cam(t)}">${w}</g>`+confetti(t,A[8],3.6);
};
