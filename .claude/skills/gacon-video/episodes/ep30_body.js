// Tập 30 · Brave at the Doctor (hít thở, nắm tay mẹ, sticker dũng cảm)
const EP={};
const LINES=[
 ['curious','Little Chick goes to the doctor.'],
 ['sweetly','Hello, Doctor Owl!'],
 ['cheerfully','Hello, Little Chick!','owl'],
 ['surprised','Uh-oh! I feel scared.'],
 ['cheerfully',"Let's take a big breath!",'owl'],
 ['sweetly',"Hold Mommy's hand."],
 ['cheerfully','Listen to your heart. Thump, thump!','owl'],
 ['excited','Open wide! Aaah!','owl'],
 ['delighted','All done! You were so brave!','owl'],
 ['joyful','A brave sticker! Hooray!'],
 ['cheerfully','Be brave like Little Chick! Bye-bye!'],
];
let B;
EP.init=function(){
  B=setupEpisode(LINES,{ep:'Brave at the Doctor'});
  EP.SHOTS=shotsAt(B,[[-1,1.05,90,240,1.1,90,240],[2,1.4,112,238,1.5,112,238],[3,1.7,86,236,1.85,86,234],[5,1.25,74,244,1.3,74,244],[6,1.3,100,240,1.4,100,240],[9,1.5,86,236,1.6,86,234],[10,1.05,90,240,1.1,90,240]]);
  const A=B.at; EP.SFX=[[0,'noambience',0],[A[1],'ting1568',.3],[A[3],'boom',.15],[A[4],'whoosh',.4],[A[6]+0.6,'thud',.4],[A[6]+1.0,'thud',.4],[A[8],'ting2093',.35],[A[9],'pop',.5],[A[9],'applause',1]];
};
EP.main=function(t){
  const A=B.at, on=i=>lineOn(B,t,i);
  let w=`<rect x="-40" y="-40" width="260" height="440" fill="#E8F6F3"/><rect x="-40" y="270" width="260" height="170" fill="#BFE3DA"/><rect x="-40" y="268" width="260" height="4" fill="#9FD2C6"/>`;
  w+=`<g transform="translate(30 150)"><rect x="-14" y="-14" width="28" height="28" rx="4" fill="#fff"/><rect x="-3" y="-9" width="6" height="18" fill="#F2545B"/><rect x="-9" y="-3" width="18" height="6" fill="#F2545B"/></g>`;
  w+=`<rect x="100" y="250" width="54" height="22" rx="4" fill="#fff" stroke="#9FD2C6" stroke-width="2"/>`;
  w+=owl(128,234,1.1,{talk:mouthFor(B,t,'owl'),blink:(t%3.4)>3.25});
  // ống nghe khi nghe tim
  if(on(6)) w+=`<path d="M114 236 Q104 250 98 248" stroke="#2E2A3B" stroke-width="1.6" fill="none"/><circle cx="96" cy="248" r="3.4" fill="#AEB8C4"/>`;
  w+=momHen(30,238,.5,{wl:on(5)?-40:0,eyes:'happy'});
  let ce='happy', cwl=0, cwr=0, cj=0, rot=0, sy=1;
  if(on(3)){ce='wow'; rot=Math.sin(t*30)*4;}
  if(on(4)){const b=Math.sin(Math.PI*prog(t,A[4]+0.3,A[4]+2.0)); sy=1+0.1*b; ce=b>0.2?'sleep':'happy';}
  if(on(5)){cwl=-50;}
  if(on(7)){ce='happy';}
  if(t>A[8]&&t<A[10]){cj=on(9)?8*Math.abs(Math.sin(t*Math.PI*1.5)):0; cwl=on(9)?110:0; cwr=on(9)?-110:0;}
  if(t>A[10])cwr=waveWR(t,A[10]);
  let mouth=mouthFor(B,t,'chick'); if(on(7)&&!window.ENV)mouth=0.9;
  w+=selChick(84,244,.48,{rot,sy,jump:cj,wl:cwl,wr:cwr,eyes:ce,mouth,},t);
  if(on(6)){const b=Math.abs(Math.sin(t*6)); w+=`<path transform="translate(84 236) scale(${0.8+0.3*b})" d="M0 5 C -7 0, -6 -6, 0 -3 C 6 -6, 7 0, 0 5 Z" fill="#F2545B" opacity=".85"/>`;}
  if(t>A[9]){const u=eBack(prog(t,A[9],A[9]+0.5)); w+=`<g transform="translate(96 230) scale(${u})"><circle r="9" fill="#FFCC33" stroke="#fff" stroke-width="2"/><path d="M0 -5 L1.5 -1.5 L5 -1.2 L2.3 1.2 L3 5 L0 3 L-3 5 L-2.3 1.2 L-5 -1.2 L-1.5 -1.5 Z" fill="#F2545B"/></g>`;}
  w+=fxSparkle(84,220,t,A[8],40);
  let s=`<g transform="${cam(t)}">${w}</g>`;
  s+=bigWord('BREATHE IN…',t,A[4]+0.3,A[5]-0.1,118,'#45B6F0')+bigWord('THUMP THUMP',t,A[6]+0.4,A[7]-0.1,118,'#F2545B')+bigWord('AAAH!',t,A[7]+0.4,A[8]-0.1,118,'#FF8C2B')+bigWord('BRAVE!',t,A[8]+0.3,A[10]-0.1,118,'#3FAE5A');
  return s+confetti(t,A[9],3.6);
};
