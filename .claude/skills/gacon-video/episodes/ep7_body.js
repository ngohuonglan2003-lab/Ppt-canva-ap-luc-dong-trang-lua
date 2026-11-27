// Tập 7 · Gà Con vỗ tay / Clap with Little Chick — bài hát riêng của kênh (nhảy theo nhịp 110 BPM)
const EP={INTRO:4,MAIN:41,END:38.8};
EP.LANG={
 vi:{caps:[[1.2,3.2,'Bé ơi! Cùng nhảy nào!'],[3.4,10.0,'Vỗ tay, vỗ tay! Bộp bộp bộp!'],[10.2,16.8,'Dậm chân, dậm chân! Thình thịch thịch!'],[17.0,23.6,'Lắc lư, lắc lư! Lắc lư nào!'],[23.8,30.4,'Xoay tròn, xoay tròn! Một vòng nè!'],[30.6,34.8,'Giơ tay lên cao! Yeah!'],[35.2,38.6,'Bé nhảy giỏi quá! Bye bye!']],
  name:'Gà Con',sub:'Hẹn gặp lại bé nhé!',ep:'Bài hát: Vỗ tay',fx:['BỘP!','THỊCH!','LẮC LƯ!','XOAY!']},
 en:{caps:[[1.2,3.2,"Hey! Let's dance!"],[3.4,10.0,'Clap your wings! Clap clap clap!'],[10.2,16.8,'Stomp your feet! Stomp stomp stomp!'],[17.0,23.6,'Wiggle, wiggle! Wiggle wiggle!'],[23.8,30.4,'Turn around! Spin spin spin!'],[30.6,34.8,'Hands up high! Yay!'],[35.2,38.6,'Great dancing! Bye-bye!']],
  name:'Little Chick',sub:'See you next time!',ep:'Song: Clap Along',fx:['CLAP!','STOMP!','WIGGLE!','SPIN!']}
};
EP.SHOTS=[
 [0,3.4, 1.6,90,230, 1.75,90,228],
 [3.4,10.0, 1.3,90,245, 1.45,90,240],
 [10.2-0.2,16.8, 1.05,90,250, 1.15,90,252],
 [16.8,23.6, 1.15,80,255, 1.3,85,250],
 [23.6,30.4, 1.05,90,252, 1.2,90,248],
 [30.4,34.9, 1.0,90,200, 1.05,90,210],
 [34.9,99, 1.25,90,250, 1.35,90,250]];
const BEAT=60/110, VS=[3.4,10.2,17.0,23.8];
function beatPh(t){return (((t+INTRO)/BEAT)%1+1)%1;}
function onBeat(t){const ph=beatPh(t); return Math.max(0,1-ph*4);} // 1 ngay phách, giảm dần
EP.main=function(t){
  let w=sky(t)+hills()+grass(t);
  const verse=VS.findIndex((v,i)=>t>=v&&t<v+6.6);
  const ob=onBeat(t);
  let jump=0, sy=1, wl=0, wr=0, eyes='happy', rot=0, sx=1;
  if(t<3.4){eyes='open'; wl=20*Math.sin(t*6); if((t%3.3)>3.15)eyes='blink';}
  if(verse===0){wl=-15-35*ob; wr=15+35*ob; jump=2*ob;}
  if(verse===1){jump=10*Math.sin(Math.PI*beatPh(t)); sy=1-0.12*ob; wl=40; wr=-40;}
  if(verse===2){rot=12*Math.sin(((t+INTRO)/BEAT)*Math.PI); wl=60+30*Math.sin(t*8); wr=-60-30*Math.sin(t*8);}
  if(verse===3){const u=((t-VS[3])/(BEAT*4))%1; sx=Math.cos(u*Math.PI*2); wl=90; wr=-90; jump=3*ob;}
  if(t>30.6&&t<34.9){wl=120; wr=-120; jump=12*Math.sin(Math.PI*beatPh(t)); }
  if(t>34.9){const k=eOut(prog(t,34.9,35.3)); wr=-k*(100+25*Math.sin((t-34.9)*2*Math.PI*2)); jump=2*ob;}
  const mouth=window.ENV?mouthAt(t+INTRO):0;
  w+=`<g transform="translate(92 232) rotate(${rot} 0 50) scale(${0.6*sx} .6)">${chick({sy,jump,wl,wr,eyes,mouth})}</g>`;
  // bạn bè lần lượt vào nhảy
  const join=(i)=>t>=VS[i];
  const bop=(k)=>(t>10.2&&t<34.9)?6*Math.abs(Math.sin(((t+INTRO)/BEAT)*Math.PI+k)):0;
  if(join(1)){const u=eBack(prog(t,VS[1],VS[1]+0.5)); const x=lerp(205,150,u); w+=duckStand(x,268-bop(0.5),{s:1.5,flap:(t>VS[1]+0.5)?Math.abs(Math.sin(t*9)):0,eyes:'happy',quack:t>30.6&&t<34.9?ob:0});}
  if(join(2)){const u=eBack(prog(t,VS[2],VS[2]+0.5)); const x=lerp(-30,24,u); w+=`<g transform="translate(${x} ${262-bop(1)}) rotate(${Math.sin(t*7)*8}) scale(.85)"><ellipse cx="0" cy="22" rx="16" ry="12" fill="#FFB25B"/>${animal(0,t>30.6&&t<34.9?ob:0,false)}</g>`;}
  if(join(3)){const u=eBack(prog(t,VS[3],VS[3]+0.5)); const y=lerp(340,290,u); w+=`<g transform="translate(44 ${y-bop(2)}) scale(.75) rotate(${Math.sin(t*6)*6})"><ellipse cx="0" cy="22" rx="16" ry="12" fill="#D29E6B"/>${animal(1,t>30.6&&t<34.9?ob:0,false)}</g>`;}
  // nốt nhạc bay
  for(let k=0;k<5;k++){const ph=((t*0.5+k/5)%1); const x=20+k*35+Math.sin(t*2+k)*6; w+=`<text x="${x}" y="${200-ph*120}" font-size="${10+(k%2)*4}" fill="${['#F2545B','#45B6F0','#9B6CE0','#FF8C2B','#3FAE5A'][k]}" opacity="${Math.sin(Math.PI*ph)}">${k%2?'♪':'♫'}</text>`;}
  w+=wind(t);
  let s=`<g transform="${cam(t)}">${w}</g>`;
  // chữ tượng thanh bật theo phách
  if(verse>=0){const fx=LANG[lang].fx[verse]; const sc=0.6+0.5*ob; const side=Math.floor((t+INTRO)/BEAT)%2;
    s+=`<g transform="translate(${side?128:52} 132) scale(${sc}) rotate(${side?10:-10})"><text text-anchor="middle" dominant-baseline="central" font-family="'Baloo 2'" font-weight="800" font-size="30" fill="${['#FF8C2B','#F2545B','#9B6CE0','#45B6F0'][verse]}" stroke="#fff" stroke-width="5" paint-order="stroke">${fx}</text></g>`;}
  if(t>30.6&&t<36){const cols=['#F2545B','#45B6F0','#FFCC33','#3FAE5A','#FF8FA8'];
    for(let i=0;i<50;i++){const st=30.6+rnd(i)*1.2; if(t<st)continue; const u=t-st; const x=rnd(i+9)*180+Math.sin(u*3+i)*6; const y=-10+u*(55+rnd(i+3)*40); if(y>330)continue;
      s+=`<rect x="${x}" y="${y}" width="3.2" height="5" fill="${cols[i%5]}" transform="rotate(${(u*300+i*40)%360} ${x+1.6} ${y+2.5})"/>`;}}
  return s;
};
