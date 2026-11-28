// Tập 12 · Little Chick Learns to Share: The Ball (phần 2 của tập Chia bánh) — chỉ tiếng Anh
const EP={SHIFT:26,INTRO:4,MAIN:37,END:34.2};
EP.LANG={en:{caps:[[1.2,3.2,'My ball! No, my ball!'],[3.4,6.6,'Uh-oh! We both want to play.'],[7.0,10.2,"I know! Let's take turns!"],[10.6,14.0,'Your turn, Duckie!'],[14.4,17.6,'Now my turn!'],[18.0,21.4,'Your turn! My turn!'],[21.8,25.4,'Playing together is more fun!'],[25.8,29.6,'Taking turns makes friends happy!'],[30.0,33.6,"Let's share and take turns! Bye-bye!"]],
 name:'Little Chick',sub:'See you next time!',ep:'Share the Ball'}};
EP.SHOTS=[[0,3.4,1.5,94,245,1.6,94,245],[3.4,7.0,1.1,92,250,1.15,92,250],[7.0,10.6,1.6,60,228,1.75,60,226],[10.6,21.8,1.05,92,252,1.1,92,252],[21.8,30.0,1.1,92,250,1.25,92,250],[30.0,99,1.2,92,250,1.3,92,250]];
const DUCK_LINES=[];
EP.main=function(t){
  let w=meadow(t);
  const mv=window.ENV?mouthAt(t+INTRO):0;
  // bóng: giành nhau → chuyền qua lại
  let bx=94+(t<7?Math.sin(t*9)*3:0), by=270, rot=0;
  const pass=(a,b,from,to)=>{const u=eIO(prog(t,a,b)); bx=lerp(from,to,u); by=270-26*Math.sin(Math.PI*u); rot=u*360*(to>from?1:-1);};
  if(t>=10.6&&t<14.4){bx=94; if(t>11.4)pass(11.4,12.4,128,62); else bx=lerp(94,124,eOut(prog(t,10.6,11.2)));}
  if(t>=14.4&&t<18){bx=62; if(t>15.2)pass(15.2,16.2,62,128);}
  if(t>=18&&t<21.8){const seg=Math.floor((t-18)/0.9); const a=18+seg*0.9; const dir=seg%2; pass(a,a+0.8,dir?62:128,dir?128:62);}
  if(t>=21.8){const seg=Math.floor((t-21.8)/0.9); const a=21.8+seg*0.9; const dir=seg%2; pass(a,a+0.8,dir?62:128,dir?128:62);}
  // cảm xúc
  let ge='open', de='open', gwl=0, gwr=0, gj=0, dflap=0, dj=0;
  if(t<7){ge='sad'; de='sad'; gwr=-40+Math.sin(t*9)*12; dflap=0.4;}
  if(t<1.2){ge='wow';}
  if(t>7&&t<10.6){ge='happy'; gwl=110*eOut(prog(t,7,7.3));}
  if(t>10.6){ge='happy'; de='happy';}
  const kick=(k0)=>t>k0&&t<k0+0.4?Math.sin(Math.PI*(t-k0)/0.4):0;
  gj=6*kick(15.1); dj=6*kick(11.3);
  if(t>21.8&&t<30){gj=Math.max(gj,8*Math.abs(Math.sin(t*Math.PI*1.4))); dj=Math.max(dj,8*Math.abs(Math.sin(t*Math.PI*1.4+1))); dflap=Math.abs(Math.sin(t*8));}
  if(t>30){gwr=waveWR(t,30); dflap=(Math.sin(t*12)+1)/2;}
  w+=selChick(62,236,.56,{jump:gj,wl:gwl,wr:gwr,eyes:ge,mouth:mv},t);
  w+=duckStand(128,262-dj,{s:1.6,flap:dflap,eyes:de});
  w+=ballProp(bx,by,9,rot)+`<ellipse cx="${bx}" cy="281" rx="8" ry="1.8" fill="#000" opacity=".12"/>`;
  if(t>7&&t<10.6)w+=fxBulb(62,182,t,7.05);
  if(t>1.2&&t<7)w+=`<path d="M86 210 q-2 3 0 5 q2 -2 0 -5 Z" fill="#9ED8F5"/>`;
  w+=fxHearts(94,226,t,25.8)+wind(t);
  return `<g transform="${cam(t)}">${w}</g>`+bigWord('YOUR TURN!',t,10.6,13.6)+bigWord('MY TURN!',t,14.4,17.4,118,'#45B6F0')+confetti(t,21.8,4);
};
