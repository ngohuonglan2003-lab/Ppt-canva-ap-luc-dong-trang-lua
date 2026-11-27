// Tập 10 · Tết của Gà Con / Lunar New Year — năm Mùi 2027 (bạn Dê), đếm 3 bao lì xì (đăng giữa tháng 1)
const EP={INTRO:4,MAIN:37,END:34.6};
EP.LANG={
 vi:{caps:[[1.2,3.2,'Ơ! Bao lì xì kìa!'],[3.4,7.0,'Tết đến rồi! Vui quá!'],[7.4,11.0,'Xin chào bạn Dê!'],[11.4,15.0,'Chúc mừng năm mới!'],[15.4,19.0,'Bánh chưng xanh, ngon quá!'],[19.4,20.8,'Cùng đếm nào!'],[21.0,22.4,'Một!'],[22.5,23.9,'Hai!'],[24.0,25.8,'Ba!'],[26.2,30.0,'Năm mới an khang!'],[30.4,34.4,'Chúc bé năm mới vui vẻ! Bye bye!']],
  name:'Gà Con',sub:'Chúc mừng năm mới!',ep:'Tết của Gà Con'},
 en:{caps:[[1.2,3.2,'Ooh! A red envelope!'],[3.4,7.0,'Lunar New Year is here!'],[7.4,11.0,'Hello, Little Goat!'],[11.4,15.0,'Happy New Year!'],[15.4,19.0,'Yummy rice cake!'],[19.4,20.8,"Let's count!"],[21.0,22.4,'One!'],[22.5,23.9,'Two!'],[24.0,25.8,'Three!'],[26.2,30.0,'Happy and healthy!'],[30.4,34.4,'Have a happy new year! Bye-bye!']],
  name:'Little Chick',sub:'Happy Lunar New Year!',ep:'Lunar New Year'}
};
EP.SHOTS=[
 [0,3.4, 1.6,80,230, 1.7,78,228],
 [3.4,7.4, 1.05,90,240, 1.12,90,240],
 [7.4,11.4, 1.45,112,245, 1.55,112,245],
 [11.4,15.4, 1.2,96,248, 1.3,96,248],
 [15.4,19.4, 1.7,92,268, 1.85,92,270],
 [19.4,26.2, 1.1,90,240, 1.2,90,240],
 [26.2,30.4, 1.0,90,180, 1.05,90,185],
 [30.4,99, 1.2,92,250, 1.3,92,250]];
const LX=[[48,170],[90,160],[132,170]];
function lixi(x,y,s,rot){return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-8" y="-11" width="16" height="22" rx="2" fill="#E63946"/><path d="M-8 -11 L0 -3 L8 -11" fill="#C92A35"/><circle cy="2" r="4.5" fill="#FFCC33"/><text y="4" text-anchor="middle" font-size="5.5" font-weight="800" fill="#C92A35" font-family="'Baloo 2'">福</text></g>`;}
function goat(x,y,o){
  const {talk=0,blink=false,jump=0}=o; let g=`<g transform="translate(${x} ${y-jump})">`;
  g+=`<ellipse cx="0" cy="26" rx="18" ry="3" fill="#000" opacity=".12"/><rect x="-11" y="14" width="5" height="12" rx="2" fill="#E8E1D4"/><rect x="6" y="14" width="5" height="12" rx="2" fill="#E8E1D4"/><ellipse cx="0" cy="10" rx="17" ry="12" fill="#FFFFFF"/>`;
  g+=`<path d="M-10 -20 q-10 -8 -6 -16 q4 6 10 10 Z M10 -20 q10 -8 6 -16 q-4 6 -10 10 Z" fill="#C9A77A"/>`;
  g+=`<ellipse cx="-17" cy="-10" rx="7" ry="3.5" transform="rotate(-20 -17 -10)" fill="#F4EEE4"/><ellipse cx="17" cy="-10" rx="7" ry="3.5" transform="rotate(20 17 -10)" fill="#F4EEE4"/>`;
  g+=`<ellipse cx="0" cy="-8" rx="14" ry="15" fill="#FFFFFF"/>`;
  g+= blink?`<path d="M-8 -10 h5 M3 -10 h5" stroke="${C.eye}" stroke-width="1.6" stroke-linecap="round"/>`:`<circle cx="-5.5" cy="-10" r="2.4" fill="${C.eye}"/><circle cx="5.5" cy="-10" r="2.4" fill="${C.eye}"/><circle cx="-4.8" cy="-10.8" r=".8" fill="#fff"/><circle cx="6.2" cy="-10.8" r=".8" fill="#fff"/>`;
  g+=`<circle cx="-9" cy="-3" r="2.4" fill="${C.cheek}" opacity=".8"/><circle cx="9" cy="-3" r="2.4" fill="${C.cheek}" opacity=".8"/><ellipse cx="0" cy="0" rx="5" ry="3.5" fill="#FFD5DC"/>`;
  g+= talk>0.08?`<ellipse cx="0" cy="${3+talk}" rx="${2.5+talk}" ry="${0.8+2*talk}" fill="#B23A48"/>`:`<path d="M-2 3 q2 1.5 4 0" stroke="${C.eye}" stroke-width="1" fill="none"/>`;
  g+=`<path d="M-2 6 q2 6 4 0" fill="#F4EEE4"/><path d="M-6 -22 l12 0" stroke="#E63946" stroke-width="3" stroke-linecap="round"/>`;
  return g+'</g>';
}
function maiTree(t,x,y,bloom){
  let g=`<path d="M${x} ${y} q-4 -30 -18 -52 M${x} ${y-24} q10 -18 22 -26 M${x-10} ${y-40} q-14 -6 -24 -2" stroke="#7A4A2A" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const P=[[-18,-52],[4,-50],[-30,-44],[-8,-36],[10,-28],[-22,-30],[16,-44],[-34,-40],[-14,-58],[2,-40]];
  P.forEach(([dx,dy],i)=>{const sc=clamp(bloom*1.4-i*0.08); if(sc<=0)return; const sw=Math.sin(t*2+i)*1;
    g+=`<g transform="translate(${x+dx+sw} ${y+dy}) scale(${sc})">`+[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-2.6" rx="2" ry="2.8" fill="#FFD23F" transform="rotate(${a})"/>`).join('')+`<circle r="1.3" fill="#FF8C2B"/></g>`;});
  return g;
}
function lantern(x,y,t,i){const sw=Math.sin(t*2+i)*5; return `<g transform="translate(${x} ${y}) rotate(${sw})"><path d="M0 -14 L0 -4" stroke="#7A4A2A" stroke-width="1"/><ellipse cx="0" cy="6" rx="9" ry="10" fill="#E63946"/><ellipse cx="0" cy="6" rx="4" ry="10" fill="#F2545B"/><rect x="-5" y="-5" width="10" height="3" fill="#FFCC33"/><rect x="-5" y="15" width="10" height="3" fill="#FFCC33"/><path d="M0 18 L0 26" stroke="#FFCC33" stroke-width="1.5"/></g>`;}
function banhChung(x,y,s){return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-14" y="-14" width="28" height="28" rx="3" fill="#3FAE5A"/><rect x="-14" y="-14" width="28" height="28" rx="3" fill="none" stroke="#2F7A44" stroke-width="1.4"/><path d="M-14 -5 H14 M-14 5 H14 M-5 -14 V14 M5 -14 V14" stroke="#F4E3B5" stroke-width="2.2"/><ellipse cx="0" cy="17" rx="16" ry="2.5" fill="#000" opacity=".12"/></g>`;}
EP.main=function(t){
  let w=sky(t)+hills()+grass(t);
  const bloom=clamp((t-3.4)/2.5);
  w+=maiTree(t,30,280,bloom);
  w+=lantern(130,18,t,0)+lantern(160,30,t,1)+lantern(20,24,t,2);
  // banner chúc Tết
  if(t>11.4){const a=clamp((t-11.4)/0.6); w+=`<g opacity="${a}"><path d="M36 112 Q90 124 144 112 L144 128 Q90 140 36 128 Z" fill="#E63946"/><text x="90" y="129" text-anchor="middle" font-family="'Baloo 2'" font-weight="800" font-size="8.5" fill="#FFCC33">${lang==='vi'?'CHÚC MỪNG NĂM MỚI':'HAPPY NEW YEAR'}</text></g>`;}
  const mv=window.ENV?mouthAt(t+INTRO):0;
  // bạn Dê
  if(t>7.2){const u=eBack(prog(t,7.2,7.8)); const gx=lerp(210,140,u); const jumpG=(t>11.4&&t<15)?6*Math.abs(Math.sin(t*Math.PI*1.4)):0;
    w+=goat(gx,262,{talk:0,blink:(t%3.7)>3.55,jump:jumpG});}
  // bánh chưng
  if(t>15.4){const u=eBack(prog(t,15.4,15.9)); w+=banhChung(98,292,1.1*u);}
  // Gà Con
  let wl=0,wr=0,eyes='open',jump=0,rot=Math.sin(t*1.1)*2;
  if(t<3.4)eyes='wow';
  if(t>3.4&&t<7){eyes='happy'; jump=6*Math.abs(Math.sin(t*Math.PI*1.8)); wl=100; wr=-100;}
  if(t>7.4&&t<11){wr=-(100+25*Math.sin(t*12)); eyes='happy';}
  if(t>11.4&&t<15){rot=15*Math.max(0,Math.sin((t-11.4)*2.5)); wl=-30; wr=30; eyes='happy';}   // cúi chào
  if(t>15.4&&t<19){eyes='happy'; jump=3*Math.abs(Math.sin(t*6));}
  for(let k=0;k<3;k++){const b=21+k*1.5; if(t>b&&t<b+0.4)jump=5*Math.sin(Math.PI*(t-b)/0.4);}
  if(t>26.2&&t<30.4){eyes='happy'; wl=110; wr=-110; jump=8*Math.abs(Math.sin(t*Math.PI*1.5));}
  if(t>30.4){eyes='happy'; const k=eOut(prog(t,30.4,30.8)); wr=-k*(100+25*Math.sin((t-30.4)*2*Math.PI*2)); jump=3*Math.abs(Math.sin(t*5));}
  if(eyes==='open'&&(t%3.3)>3.15)eyes='blink';
  w+=`<g transform="translate(78 236) rotate(${rot} 0 50) scale(.56)">${chick({jump,wl,wr,eyes,mouth:mv})}</g>`;
  // khăn đỏ ngày Tết
  w+=`<path d="M58 258 Q78 266 98 258 L96 264 Q78 272 60 264 Z" fill="#E63946" transform="translate(0 ${-jump*.56})"/>`;
  // lì xì: hook bay vào, rồi 3 bao rơi xuống khi đếm
  if(t<3.4){const u=eOut(prog(t,0.2,1.4)); w+=lixi(lerp(200,110,u),lerp(80,190,u)+Math.sin(t*4)*4,1.4,Math.sin(t*5)*15);}
  for(let k=0;k<3;k++){const b=21+k*1.5; if(t>b-0.6){const u=eOut(prog(t,b-0.6,b)); const [x,y]=LX[k]; const sc=1.6*pulse(t,b,0.5)*(t>34?1:1); const fy=t>26.2?y-Math.max(0,Math.sin((t-26.2)*4-k))*8:y; w+=lixi(x,lerp(-20,fy,u),sc,Math.sin(t*3+k)*8);}}
  if(t>21&&t<26.2){for(let k=0;k<3;k++){const b=21+k*1.5; if(t>b){const sc=popScale(t,b); w+=`<g transform="translate(${LX[k][0]} ${LX[k][1]+24}) scale(${sc})"><text text-anchor="middle" dominant-baseline="central" font-family="'Baloo 2'" font-weight="800" font-size="12" fill="#fff" stroke="${C.ink}" stroke-width="2.5" paint-order="stroke">${k+1}</text></g>`;}}}
  w+=wind(t);
  let s=`<g transform="${cam(t)}">${w}</g>`;
  for(let k=0;k<3;k++){const b=21+k*1.5; s+=bigNum(k+1,t,b,b+(k<2?1.45:1.8));}
  // pháo hoa nhỏ & hoa mai rơi khi chúc
  if(t>26.2&&t<31){const cols=['#E63946','#FFCC33','#FF8C2B'];
    for(let i=0;i<46;i++){const st=26.2+rnd(i)*1.2; if(t<st)continue; const u=t-st; const x=rnd(i+9)*180+Math.sin(u*3+i)*6; const y=-10+u*(50+rnd(i+3)*40); if(y>330)continue;
      s+= i%2?`<rect x="${x}" y="${y}" width="3.2" height="5" fill="${cols[i%3]}" transform="rotate(${(u*300+i*40)%360} ${x+1.6} ${y+2.5})"/>`:`<g transform="translate(${x} ${y}) rotate(${u*200})">`+[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-2" rx="1.5" ry="2.2" fill="#FFD23F" transform="rotate(${a})"/>`).join('')+'</g>';}}
  return s;
};
