// Tập 18 · It's OK to Cry (kem rơi, bạn ôm, chia kem) — chỉ tiếng Anh
const EP={SHIFT:26,INTRO:4,MAIN:37,END:34.2};
EP.LANG={en:{caps:[[1.2,3.2,'Oh no! My ice cream!'],[3.4,6.6,'Little Chick is sad.'],[7.0,10.2,"It's okay to cry."],[10.6,13.8,'Duckie gives a big hug.'],[14.2,17.4,'Sad feelings go away.'],[17.8,21.4,"Let's share my ice cream!"],[21.8,25.4,'Yummy! I feel happy again!'],[25.8,29.4,'Friends help when we are sad.'],[29.8,33.6,'Big hugs! Bye-bye!']],
 name:'Little Chick',sub:'See you next time!',ep:"It's OK to Cry"}};
EP.SHOTS=[[0,3.4,1.6,74,250,1.7,74,252],[3.4,10.6,1.8,62,228,1.95,62,226],[10.6,17.8,1.35,86,245,1.45,86,245],[17.8,25.8,1.25,92,248,1.35,92,248],[25.8,99,1.1,90,250,1.2,90,250]];
const DSP=[[17.8,21.4]];
EP.main=function(t){
  let w=meadow(t);
  const mv=window.ENV?mouthAt(t+INTRO):0, dSp=DSP.some(([a,b])=>t>a&&t<b);
  let gx=62, dx=150; if(t>10.6){const u=eIO(prog(t,10.6,11.4)); dx=lerp(150,104,u);} if(t>17.8){const u=eIO(prog(t,17.8,18.4)); dx=lerp(104,122,u);}
  let ge='open', gwl=0, gwr=0, gj=0, de='sad', dflap=0;
  if(t<0.6)ge='happy'; if(t>0.6&&t<1.6)ge='wow';
  const crying=t>1.6&&t<14.2;
  if(crying)ge='sad';
  if(t>10.6&&t<17.8){gwr=25; dflap=0.5; de='happy';}
  if(t>14.2&&t<17.8)ge='happy';
  if(t>17.8){ge='happy'; de='happy';}
  if(t>21.8&&t<25.8){gj=5*Math.abs(Math.sin(t*Math.PI*1.4));}
  if(t>29.8){gwr=waveWR(t,29.8); dflap=(Math.sin(t*12)+1)/2;}
  w+=selChick(gx,238,.56,{jump:gj,wl:gwl,wr:gwr,eyes:ge,mouth:dSp?0:mv,sy:crying?1+0.02*Math.sin(t*14):1},t);
  w+=duckStand(dx,262,{s:1.55,flap:dflap,eyes:de,quack:dSp?mv:0});
  // kem của Gà Con rơi
  const drop=eIn(clamp((t-0.6)/0.6));
  if(t<17.8){w+=iceCream(gx+28,240,1.5,drop); if(drop>=1)w+=`<ellipse cx="${gx+20}" cy="298" rx="9" ry="3" fill="#FF8FA8"/>`+(t<1.6?`<text x="${gx+30}" y="290" font-family="'Baloo 2'" font-weight="800" font-size="10" fill="#F2545B">SPLAT!</text>`:'');}
  else w+=`<ellipse cx="${gx+20}" cy="298" rx="9" ry="3" fill="#FF8FA8"/>`;
  // kem của Vịt, chia sẻ (2 muỗng)
  if(t>17.8){const sc=1.6; w+=iceCream(lerp(dx-20,92,eIO(prog(t,18.4,19.2))),232,sc,0);}
  if(crying)w+=fxTears(gx,224,t);
  if(t>10.6&&t<17.8)w+=fxHearts(84,214,t,11);
  if(t>25.8)w+=fxHearts(92,220,t,25.8);
  w+=wind(t);
  return `<g transform="${cam(t)}">${w}</g>`+bigWord('BIG HUG 🤗',t,10.6,13.6,112,'#FF8FA8',30)+confetti(t,21.8,3.6);
};
