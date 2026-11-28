// Tập 17 · When I Feel Angry (hít thở: ngửi hoa – thổi nến) — chỉ tiếng Anh
const EP={INTRO:4,MAIN:37,END:34.0};
EP.LANG={en:{caps:[[1.2,3.2,'Grrr! My block fell down!'],[3.4,6.6,'Little Chick feels angry.'],[7.0,10.2,"It's okay to feel angry."],[10.6,13.8,"Let's take a big breath."],[14.2,17.4,'Smell the flower…'],[17.8,21.0,'Blow the candle!'],[21.4,24.6,'One more time. Smell… and blow!'],[25.0,28.6,'I feel calm now.'],[29.0,33.4,"Let's try again! Bye-bye!"]],
 name:'Little Chick',sub:'See you next time!',ep:'When I Feel Angry'}};
EP.SHOTS=[[0,3.4,1.4,80,250,1.5,80,250],[3.4,7.0,1.8,70,228,1.95,70,226],[7.0,10.6,1.3,80,245,1.35,80,245],[10.6,25.0,1.7,78,228,1.9,78,226],[25.0,29.0,1.3,82,245,1.4,82,245],[29.0,99,1.1,88,250,1.2,88,250]];
function flowerProp(x,y,s){return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L0 14" stroke="#3FAE5A" stroke-width="1.6"/>`+[0,72,144,216,288].map(a=>`<circle cx="${Math.cos(a*Math.PI/180)*3.4}" cy="${Math.sin(a*Math.PI/180)*3.4}" r="2.8" fill="#FF8FA8"/>`).join('')+`<circle r="2" fill="#FFCC33"/></g>`;}
function candleProp(x,y,s,flick){return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-2.5" y="0" width="5" height="12" rx="1" fill="#45B6F0"/><path d="M0 -1 q${-3+flick*6} -4 0 -9 q${3-flick*3} 4 0 9 Z" fill="#FFB000" transform="rotate(${flick*35})" opacity="${1-Math.abs(flick)*0.5}"/></g>`;}
EP.main=function(t){
  let w=meadow(t);
  const mv=window.ENV?mouthAt(t+INTRO):0;
  // tháp đổ lúc 0.6; xây lại từ 29
  let n=3,fall=0; if(t>0.6&&t<29){fall=eOut(clamp((t-0.6)/0.5));} if(t>=29){fall=0; n=Math.min(4,1+Math.floor((t-29)/0.8));}
  w+=towerProp(124,292,n,fall);
  // nhịp thở: hít 14.2-15.8, thở 17.8-19.4, lặp 21.4-23 hít, 23-24.6 thở
  const inh=(a,b)=>t>a&&t<b?Math.sin(Math.PI*(t-a)/(b-a)):0;
  const breathIn=Math.max(inh(14.2,17.4),inh(21.4,23.0));
  const breathOut=Math.max(inh(17.8,21.0),inh(23.0,24.6));
  let ge='open', gwl=0, gwr=0, gj=0, sy=1+0.12*breathIn-0.05*breathOut, body=C.body;
  const angry=t>0.8&&t<25? clamp(1-(t-10.6)/14.4):0;
  if(t>0.8&&t<25) body=mix(C.body,'#FF8C6B',0.55*Math.min(1,angry*1.4));
  if(t>0.8&&t<10.6){ge='sad'; gj=t<3.4?4*Math.abs(Math.sin(t*14)):0;}
  if(t>10.6&&t<25)ge=breathIn>0.1?'sleep':(breathOut>0.1?'happy':'open');
  if(t>14.2&&t<17.4||t>21.4&&t<23){gwl=-40;}  // cầm hoa
  if(t>17.8&&t<21||t>23&&t<24.6){gwr=40;}       // cầm nến
  if(t>25){ge='happy';}
  if(t>29){gwr=waveWR(t,31); if(t<31){gwl=60; gwr=-60;} }
  let mouth=window.ENV?mv:0; if(!window.ENV&&breathOut>0.1)mouth=0.5*breathOut;
  w+=selChick(70,236,.58,{sy,jump:gj,wl:gwl,wr:gwr,eyes:ge,mouth,body},t);
  if(t>0.8&&t<10.6)w+=fxSteam(70,184,t);
  if(t>14.2&&t<17.4||t>21.4&&t<23)w+=flowerProp(52,236,1.6);
  if(t>17.8&&t<21||t>23&&t<24.6){const fl=Math.sin(t*20)*0.3+breathOut*0.7; w+=candleProp(92,228,1.6,fl);
    for(let k=0;k<3;k++){const ph=((t*1.5+k/3)%1); w+=`<path d="M${80+ph*16} ${222+k*3} q3 -2 6 0" stroke="#fff" stroke-width="1.4" fill="none" opacity="${(1-ph)*breathOut}"/>`;}}
  if(t>25&&t<29)w+=fxHearts(70,200,t,25);
  w+=wind(t);
  return `<g transform="${cam(t)}">${w}</g>`+bigWord('GRRR!',t,0.8,3.2,112,'#F2545B',36)+bigWord('SMELL…',t,14.2,17.2,112,'#FF8FA8')+bigWord('BLOW!',t,17.8,20.8,112,'#45B6F0')+bigWord('CALM 💛',t,25,28.4,112,'#3FAE5A');
};
