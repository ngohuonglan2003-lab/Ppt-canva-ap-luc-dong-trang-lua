// Tập 21 · Say it in Vietnamese! Xin chào (song ngữ cho trẻ gốc Việt) — kênh tiếng Anh
const EP={SHIFT:26,INTRO:4,MAIN:37,END:34.2};
EP.LANG={en:{caps:[[1.2,3.2,"Let's learn Vietnamese!"],[3.4,6.6,'How do we say hello?'],[7.0,10.2,'Xin chào!'],[10.6,13.8,'Say it with me! Xin chào!'],[14.2,17.4,'Hello, Duckie! Xin chào!'],[17.8,21.4,'Xin chào, Little Chick!'],[21.8,25.4,'Wave and say… Xin chào!'],[25.8,29.4,'Great job! You speak Vietnamese!'],[29.8,33.6,'Tạm biệt! That means bye-bye!']],
 name:'Little Chick',sub:'Tạm biệt! See you next time!',ep:'Say it in Vietnamese!'}};
EP.SHOTS=[[0,7.0,1.5,80,232,1.6,80,230],[7.0,14.2,1.25,84,240,1.35,84,238],[14.2,21.8,1.15,96,250,1.2,96,250],[21.8,25.8,1.3,78,236,1.4,78,234],[25.8,99,1.1,92,250,1.2,92,250]];
const DSP=[[17.8,21.4]];
function speech(x,y,text,sub,t,t0){if(t<t0)return '';const sc=popScale(t,t0);return `<g transform="translate(${x} ${y}) scale(${sc})"><rect x="-44" y="-20" width="88" height="${sub?38:28}" rx="12" fill="#fff" stroke="#FFCC33" stroke-width="2.5"/><path d="M-8 ${sub?18:8} l6 10 l6 -10 Z" fill="#fff"/><text y="-1" text-anchor="middle" font-family="'Baloo 2'" font-weight="800" font-size="15" fill="#E63946">${text}</text>${sub?`<text y="13" text-anchor="middle" font-family="'Baloo 2'" font-weight="700" font-size="8" fill="${C.muted||'#59637F'}">${sub}</text>`:''}</g>`;}
EP.main=function(t){
  let w=meadow(t);
  const mv=window.ENV?mouthAt(t+INTRO):0, dSp=DSP.some(([a,b])=>t>a&&t<b);
  let gx=72, dx=t<14.2?210:lerp(210,140,eOut(prog(t,14.2,15)));
  let ge='happy', gwl=0, gwr=0, gj=0, dflap=0;
  if(t>3.4&&t<7){ge='open'; gwl=60;}
  if((t>7&&t<10.6)||(t>21.8&&t<25.8)){gwr=-(100+25*Math.sin(t*10));}
  if(t>10.6&&t<14.2){gwr=-(100+25*Math.sin(t*10)); gj=3*Math.abs(Math.sin(t*5));}
  if(t>14.2&&t<17.8){gwr=-(100+25*Math.sin(t*10));}
  if(t>17.8&&t<21.4){dflap=Math.abs(Math.sin(t*10));}
  if(t>25.8&&t<29.8){gwl=110; gwr=-110; gj=6*Math.abs(Math.sin(t*Math.PI*1.4)); dflap=Math.abs(Math.sin(t*9));}
  if(t>29.8){gwr=waveWR(t,29.8); dflap=(Math.sin(t*12)+1)/2;}
  w+=selChick(gx,238,.56,{jump:gj,wl:gwl,wr:gwr,eyes:ge,mouth:dSp?0:mv},t);
  if(t>14.2)w+=duckStand(dx,262,{s:1.45,flap:dflap,eyes:'happy',quack:dSp?mv:0});
  // bong bóng lời thoại có chữ Việt + phiên âm
  if(t>7&&t<14.2)w+=speech(72,176,'Xin chào!','(sin chow)',t,7.0);
  if(t>14.2&&t<17.8)w+=speech(72,176,'Xin chào!','',t,14.2);
  if(t>17.8&&t<21.4)w+=speech(136,206,'Xin chào!','',t,17.8);
  if(t>21.8&&t<25.8)w+=speech(72,184,'Xin chào!','👋',t,21.8);
  if(t>29.8)w+=speech(90,170,'Tạm biệt!','(tum bee-et) = bye-bye',t,29.8);
  if(t>25.8&&t<29.8)w+=fxHearts(96,220,t,25.8);
  w+=wind(t);
  return `<g transform="${cam(t)}">${w}</g>`+confetti(t,25.8,4);
};
