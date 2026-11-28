// Tập 29 · Feelings Faces (gọi tên 4 cảm xúc, mời bé làm theo)
const EP={};
const LINES=[
 ['excited','Look! Feelings faces!'],
 ['delighted','This is happy! Ha ha ha!'],
 ['cheerfully','Can you make a happy face?'],
 ['sweetly','This is sad. Boo hoo.'],
 ['cheerfully','Can you make a sad face?'],
 ['playfully','This is angry. Grrr!'],
 ['cheerfully','Can you make an angry face?'],
 ['surprised','This is scared. Eek!'],
 ['cheerfully','Can you make a scared face?'],
 ['joyful','All feelings are okay!'],
 ['cheerfully','Great job! Bye-bye!'],
];
let B;
EP.init=function(){
  B=setupEpisode(LINES,{ep:'Feelings Faces'});
  EP.SHOTS=shotsAt(B,[[-1,1.05,90,240,1.05,90,240],[1,1.05,90,240,1.08,90,240],[9,1.05,90,240,1.05,90,240]]);
  const A=B.at; EP.SFX=[[A[0],'whoosh',.4],[A[0]+0.3,'pop',.4],[A[1],'ting2093',.35],[A[3],'ting784',.3],[A[5],'boing',.3],[A[7],'boom',.2],[A[9],'applause',1]];
};
const FEEL=['happy','sad','angry','scared'], FCOL={happy:'#FFCC33',sad:'#7CC8F0',angry:'#F2545B',scared:'#9B6CE0'};
EP.main=function(t){
  const A=B.at, on=i=>lineOn(B,t,i);
  let w=meadow(t);
  // 4 mặt cảm xúc rơi xuống thành hàng ở trên
  FEEL.forEach((k,i)=>{const u=eBack(prog(t,A[0]+i*0.2,A[0]+i*0.2+0.6)); const active=(on(1+i*2)||on(2+i*2)); const x=30+i*40, y=lerp(-30,176,u)+Math.sin(t*2+i)*2; w+=maskFace(k,x,y,active?1.1*pulse(t,A[1+i*2],0.5):0.9);});
  let fi=-1; for(let i=0;i<4;i++) if(on(1+i*2)||on(2+i*2)) fi=i;
  let ce='happy', body=C.body, rot=0, cwl=0, cwr=0, cj=0;
  if(fi===0){ce='happy'; cj=on(1)?5*Math.abs(Math.sin(t*10)):0;}
  if(fi===1){ce='sad';}
  if(fi===2){ce='sad'; body=mix(C.body,'#FF8C6B',0.5);}
  if(fi===3){ce='wow'; rot=Math.sin(t*30)*4;}
  if(on(2)||on(4)||on(6)||on(8)){cwr=-70;}  // mời bé
  if(t>A[9]){ce='happy'; cwl=110; cwr=-110; cj=8*Math.abs(Math.sin(t*Math.PI*1.5));}
  if(t>A[10])cwr=waveWR(t,A[10]);
  w+=selChick(90,248,.52,{rot,jump:cj,wl:cwl,wr:cwr,eyes:ce,mouth:mouthFor(B,t,'chick'),body},t);
  if(fi===1)w+=fxTears(90,236,t);
  if(fi===2)w+=fxSteam(90,206,t);
  if(t>A[9])w+=fxHearts(90,214,t,A[9]);
  let s=`<g transform="${cam(t)}">${w}</g>`;
  FEEL.forEach((k,i)=>{s+=bigWord(k.toUpperCase(),t,A[1+i*2],A[3+i*2]-0.1,118,FCOL[k],26);});
  return s+confetti(t,A[9],3.6);
};
