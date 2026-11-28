// Tập 16 · Magic Words: Please & Thank You — chỉ tiếng Anh
const EP={INTRO:4,MAIN:37,END:34.0};
EP.LANG={en:{caps:[[1.2,3.2,'Give me that!'],[3.4,6.6,'Oops! The toy ran away!'],[7.0,10.2,'Hmm… what are the magic words?'],[10.6,13.8,'Please! May I play?'],[14.2,17.4,'Yes, you may!'],[17.8,21.0,'Thank you, Duckie!'],[21.4,24.6,"You're welcome!"],[25.0,29.0,'Please and thank you! Magic words!'],[29.4,33.4,'Use your magic words! Bye-bye!']],
 name:'Little Chick',sub:'See you next time!',ep:'Magic Words'}};
EP.SHOTS=[[0,3.4,1.4,100,250,1.5,100,250],[3.4,7.0,1.05,92,245,1.1,92,245],[7.0,10.6,1.7,58,228,1.85,58,226],[10.6,25.0,1.2,96,250,1.3,96,250],[25.0,29.4,1.0,90,200,1.05,90,205],[29.4,99,1.2,94,250,1.3,94,250]];
const DSP=[[14.2,17.4],[21.4,24.6]];
function toyCar(x,y,rot,sc=1){return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})"><rect x="-13" y="-9" width="26" height="9" rx="3" fill="#45B6F0"/><path d="M-7 -9 L-4 -16 L6 -16 L9 -9 Z" fill="#45B6F0"/><rect x="-3" y="-14" width="7" height="4" rx="1" fill="#DDF4FF"/><circle cx="-7" cy="1" r="3.6" fill="#2E2A3B"/><circle cx="7" cy="1" r="3.6" fill="#2E2A3B"/><circle cx="-7" cy="1" r="1.4" fill="#AEB8C4"/><circle cx="7" cy="1" r="1.4" fill="#AEB8C4"/></g>`;}
EP.main=function(t){
  let w=meadow(t);
  const mv=window.ENV?mouthAt(t+INTRO):0, dSp=DSP.some(([a,b])=>t>a&&t<b);
  // xe: ban đầu ở Vịt, bị giật → chạy trốn vòng quanh → về lại Vịt → Vịt đưa cho Gà Con
  let cx=118, cy=286, cr=0;
  if(t>0.8&&t<1.6){cx=lerp(118,96,eOut(prog(t,0.8,1.2)));}
  if(t>=1.6&&t<7){const u=(t-1.6); cx=96+Math.sin(u*2.2)*70; cy=290-Math.abs(Math.sin(u*4.4))*6; cr=Math.cos(u*2.2)>0?0:0; }
  if(t>=7&&t<14.2){cx=lerp(96+Math.sin(5.4*2.2)*70,124,eOut(prog(t,7,8))); cy=288;}
  if(t>=14.2&&t<17.8){cx=lerp(124,92,eIO(prog(t,15,16)));}
  if(t>=17.8){cx=92+(t>25?Math.sin(t*3)*10:0);}
  const flip=(t>=1.6&&t<7)?(Math.cos((t-1.6)*2.2)>0?1:-1):1;
  // biểu cảm
  let ge='open', gwl=0, gwr=0, gj=0, de='open', dflap=0;
  if(t<1.6){ge='open'; gwr=t>0.6?-70:0; de='wow'==='x'?'open':'open';}
  if(t>1.6&&t<7){ge='wow'; de='sad';}
  if(t>7&&t<10.6){ge='open'; gwl=60;}
  if(t>10.6&&t<14.2){ge='happy'; gwl=-30; gwr=30;}
  if(t>14.2){de='happy';}
  if(t>17.8&&t<21.4){ge='happy'; gj=5*Math.abs(Math.sin(t*Math.PI*1.4));}
  if(t>25&&t<29.4){ge='happy'; gwl=110; gwr=-110; gj=6*Math.abs(Math.sin(t*Math.PI*1.4)); dflap=Math.abs(Math.sin(t*9));}
  if(t>29.4){gwr=waveWR(t,29.4); dflap=(Math.sin(t*12)+1)/2;}
  w+=selChick(56,238,.54,{jump:gj,wl:gwl,wr:gwr,eyes:ge,mouth:dSp?0:mv},t);
  w+=duckStand(138,262,{s:1.55,flap:dflap,eyes:de,quack:dSp?mv:0});
  w+=`<g transform="translate(${cx} ${cy}) scale(${flip} 1) translate(${-cx} ${-cy})">${toyCar(cx,cy,cr)}</g>`;
  if(t>1.6&&t<7){w+=`<text x="${cx+16}" y="${cy-18}" font-family="'Baloo 2'" font-weight="800" font-size="10" fill="${C.ink}">VROOM!</text>`;}
  if(t>7&&t<10.6)w+=fxQ(56,186,t,7.2);
  // chữ phép thuật lấp lánh
  for(const a of [10.6,17.8,25.0]) w+=fxSparkle(92,220,t,a,40);
  w+=wind(t);
  return `<g transform="${cam(t)}">${w}</g>`+bigWord('PLEASE',t,10.6,13.6,112,'#9B6CE0')+bigWord('THANK YOU',t,17.8,20.8,112,'#3FAE5A')+bigWord('✨ MAGIC WORDS ✨',t,25.0,29.0,112,'#FF8C2B',22)+confetti(t,25,4);
};
