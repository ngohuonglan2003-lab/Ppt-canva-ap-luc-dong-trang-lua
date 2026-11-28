// Tập 14 · Little Chick Learns Gentle Hands (không đẩy, đánh bạn) — chỉ tiếng Anh
const EP={INTRO:4,MAIN:37,END:34.2};
EP.LANG={en:{caps:[[1.2,3.2,'Crash! My tower!'],[3.4,6.6,'Little Chick feels sad.'],[7.0,10.2,'Oops! Duckie, we use gentle hands.'],[10.6,13.8,'Gentle hands, like this.'],[14.2,17.4,'Sorry, Little Chick!'],[17.8,21.4,"Let's build it together!"],[21.8,25.4,'One block, two blocks, three blocks!'],[25.8,29.4,'A big tower! Hooray!'],[29.8,33.6,'Gentle hands are kind hands! Bye-bye!']],
 name:'Little Chick',sub:'See you next time!',ep:'Gentle Hands'}};
EP.SHOTS=[[0,3.4,1.4,96,250,1.5,96,250],[3.4,7.0,1.7,60,230,1.85,60,228],[7.0,14.2,1.1,92,250,1.15,92,250],[14.2,17.8,1.7,128,250,1.85,128,248],[17.8,25.8,1.25,94,252,1.35,94,250],[25.8,99,1.05,92,245,1.15,92,245]];
const SPK=[[14.2,17.4]];
EP.main=function(t){
  let w=meadow(t);
  const mv=window.ENV?mouthAt(t+INTRO):0, dSp=SPK.some(([a,b])=>t>a&&t<b);
  // tháp: 4 khối, đổ lúc 1.0, xây lại 3 khối 21.8–25.4 rồi thêm thành 5
  let tw='';
  if(t<1.0)tw=towerProp(96,290,4,0);
  else if(t<17.8)tw=towerProp(96,290,4,eOut(clamp((t-1.0)/0.5)));
  else{let n=0; if(t>21.8)n=1; if(t>23.0)n=2; if(t>24.2)n=3; if(t>25.8)n=5; tw=towerProp(96,290,n,0);}
  let ge='happy', gwl=0, gwr=0, gj=0, de='open', dflap=0, dx=lerp(150,124,prog(t,0,0.9)); let gx=58; if(t>17.8){const u=eIO(prog(t,17.8,18.6)); gx=lerp(58,46,u); dx=lerp(124,142,u);}
  if(t<1.2)ge='open';
  if(t>1.0&&t<7){ge=t<1.6?'wow':'sad';}
  if(t>0.85&&t<1.1)dflap=1;
  if(t>7&&t<10.6){ge='open';de='sad';gwr=-50;}
  if(t>10.6&&t<14.2){gwr=-40+20*Math.sin(t*4);de='happy'; dflap=0.3+0.3*Math.sin(t*4);}
  if(t>14.2&&t<17.8){de='sad'; ge='open';}
  if(t>17.8){ge='happy';de='happy';}
  for(const b of [21.8,23.0,24.2]) if(t>b&&t<b+0.4)gj=5*Math.sin(Math.PI*(t-b)/0.4);
  if(t>25.8&&t<29.8){gj=8*Math.abs(Math.sin(t*Math.PI*1.4)); gwl=110; gwr=-110; dflap=Math.abs(Math.sin(t*9));}
  if(t>29.8){gwr=waveWR(t,29.8); dflap=(Math.sin(t*12)+1)/2;}
  w+=tw;
  w+=selChick(gx,236,.56,{jump:gj,wl:gwl,wr:gwr,eyes:ge,mouth:dSp?0:mv},t);
  w+=duckStand(dx,262,{s:1.55,flap:dflap,eyes:de,quack:dSp?mv:0});
  if(t>1.6&&t<7)w+=fxTears(gx,222,t);
  // tay hiền: cánh Vịt vuốt nhẹ, có vệt mềm
  if(t>10.6&&t<14.2){for(let k=0;k<3;k++){const ph=((t*0.8+k/3)%1); w+=`<path d="M${110-ph*6} ${244+k*4} q4 -3 8 0" stroke="#FF8FA8" stroke-width="1.4" fill="none" opacity="${1-ph}"/>`;}}
  if(t>0.95&&t<1.6)w+=`<text x="96" y="232" text-anchor="middle" font-family="'Baloo 2'" font-weight="800" font-size="16" fill="#F2545B" stroke="#fff" stroke-width="3" paint-order="stroke">CRASH!</text>`;
  w+=fxHearts(92,220,t,29.8)+wind(t);
  let s=`<g transform="${cam(t)}">${w}</g>`;
  s+=bigNum(1,t,21.8,22.9)+bigNum(2,t,23.0,24.1)+bigNum(3,t,24.2,25.6)+bigWord('GENTLE HANDS',t,10.6,13.6,118,'#FF8FA8',26);
  return s+confetti(t,25.8,4);
};
