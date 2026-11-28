// Tập 20 · Screen Time Is Over! (video giúp bé chuyển hoạt động) — chỉ tiếng Anh
const EP={SHIFT:26,INTRO:4,MAIN:37,END:34.2};
EP.LANG={en:{caps:[[1.2,3.2,'Ding! Screen time is over!'],[3.4,6.6,'Oh… but I want more!'],[7.0,10.2,"It's okay. Let's say bye-bye to the screen."],[10.6,13.8,'Bye-bye, screen!'],[14.2,17.4,'What should we do now?'],[17.8,21.4,"Let's play outside!"],[21.8,25.4,'Run, jump, play!'],[25.8,29.4,'Playing is so much fun!'],[29.8,33.6,'Turn off the screen and go play! Bye-bye!']],
 name:'Little Chick',sub:'Time to play!',ep:'Screen Time Is Over'}};
EP.SHOTS=[[0,3.4,1.35,96,232,1.45,96,232],[3.4,7.0,1.6,70,228,1.7,70,226],[7.0,14.2,1.2,90,245,1.25,90,245],[14.2,17.8,1.6,70,232,1.7,70,230],[17.8,99,1.05,92,250,1.15,92,250]];
function room(t){
  let s=`<rect x="-40" y="-40" width="260" height="400" fill="#FFF1DC"/><rect x="-40" y="268" width="260" height="80" fill="#E8C9A0"/><rect x="-40" y="266" width="260" height="4" fill="#D6B184"/>`;
  s+=`<rect x="20" y="110" width="56" height="60" rx="4" fill="#9EDCFF" stroke="#fff" stroke-width="5"/><circle cx="62" cy="128" r="7" fill="#FFD84D"/><path d="M20 158 Q48 146 76 158 L76 170 L20 170 Z" fill="#7CCB5E"/><path d="M48 110 L48 170 M20 140 L76 140" stroke="#fff" stroke-width="3"/>`;
  s+=`<rect x="100" y="230" width="66" height="38" rx="8" fill="#9B6CE0"/><rect x="96" y="222" width="74" height="16" rx="8" fill="#B590EC"/>`;
  return s;}
function tablet(x,y,on,t){let s=`<g transform="translate(${x} ${y})"><rect x="-22" y="-16" width="44" height="30" rx="4" fill="#2E2A3B"/>`;
  if(on>0){s+=`<rect x="-19" y="-13" width="38" height="24" rx="2" fill="#7CD3FF" opacity="${on}"/><circle cx="${-6+Math.sin(t*5)*6}" cy="-1" r="5" fill="#FFCC33" opacity="${on}"/><path d="M4 6 l8 -10 l6 10 Z" fill="#F2545B" opacity="${on}"/>`;}
  else s+=`<rect x="-19" y="-13" width="38" height="24" rx="2" fill="#1B1830"/>`;
  return s+`<path d="M-8 14 L8 14 L4 22 L-4 22 Z" fill="#AEB8C4"/></g>`;}
function timer(x,y,t,ring){const sh=ring?Math.sin(t*50)*6:0; return `<g transform="translate(${x} ${y}) rotate(${sh})"><circle r="10" fill="#F2545B"/><circle r="7.5" fill="#fff"/><path d="M0 0 L0 -5 M0 0 L4 0" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round"/><rect x="-3" y="-14" width="6" height="4" rx="1.5" fill="#F2545B"/></g>`;}
EP.main=function(t){
  const mv=window.ENV?mouthAt(t+INTRO):0;
  const outside=t>=17.8;
  let w='';
  if(!outside){
    w+=room(t); const on=t<10.6?1:clamp(1-(t-10.6)/0.6); w+=tablet(112,236,on,t)+timer(128,186,t,t<3.2);
    if(t<3.2&&t>0.2)w+=`<text x="128" y="168" text-anchor="middle" font-family="'Baloo 2'" font-weight="800" font-size="11" fill="#F2545B">DING!</text>`;
    let ge='open', gwl=0, gwr=0, gj=0;
    if(t<0.3)ge='happy'; if(t>0.3&&t<1.2)ge='wow';
    if(t>3.4&&t<7)ge='sad';
    if(t>7&&t<10.6)ge='open';
    if(t>10.6&&t<14.2){ge='happy'; gwr=waveWR(t,10.6);}
    if(t>14.2){ge='open'; gwl=50;}
    w+=selChick(62,240,.56,{jump:gj,wl:gwl,wr:gwr,eyes:ge,mouth:mv},t);
    if(t>14.2)w+=fxQ(62,188,t,14.4);
    if(t>10.6&&t<11.6)w+=fxSparkle(110,236,t,10.6,30);
    // đèn tablet hắt lên mặt khi đang xem

  } else {
    w+=meadow(t);
    const run=(ph)=>(t>21.8&&t<29.8)?Math.abs(Math.sin((t-21.8)*Math.PI*1.6+ph))*10:0;
    const gx=t<21.8?lerp(-30,66,eOut(prog(t,17.8,18.8))):66+Math.sin((t-21.8)*1.2)*20;
    w+=ballProp(t<21.8?120:120+Math.sin((t-21.8)*1.2+2)*22,282-run(1)*1.2,9,t*200);
    w+=duckStand(140,262-run(2),{s:1.4,flap:t>21.8?Math.abs(Math.sin(t*9)):0,eyes:'happy'});
    let gwl=t>21.8?100:0, gwr=t>21.8?-100:0; if(t>29.8){gwl=0; gwr=waveWR(t,29.8);}
    w+=selChick(gx,238,.54,{jump:run(0),wl:gwl,wr:gwr,eyes:'happy',mouth:mv},t);
    w+=fxHearts(96,222,t,25.8)+wind(t);
  }
  let s=`<g transform="${cam(t)}">${w}</g>`;
  s+=bigWord('BYE-BYE, SCREEN!',t,10.6,13.6,112,'#9B6CE0',19)+bigWord('LET\'S PLAY!',t,17.8,21.2,112,'#3FAE5A',30)+confetti(t,21.8,3.6);
  // chuyển cảnh trắng lúc ra ngoài
  if(t>17.4&&t<18.2)s+=`<rect width="180" height="320" fill="#fff" opacity="${1-Math.abs(t-17.8)/0.4}"/>`;
  return s;
};
