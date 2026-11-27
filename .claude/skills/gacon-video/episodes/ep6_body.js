// Tập 6 · Noel của Gà Con / Little Chick's Christmas — đếm quà 1·2·3 (đăng tháng 12)
const EP={INTRO:4,MAIN:40,END:37.5};
EP.LANG={
 vi:{caps:[[1.2,3.2,'Ơ! Hộp quà nhảy kìa!'],[3.4,7.0,'Một món quà! Quả\u00A0bóng!'],[7.0,9.0,'Một!'],[9.4,14.0,'Hai món quà! Vịt con!'],[14.0,16.0,'Hai!'],[16.4,21.0,'Ba món quà! Gấu bông!'],[21.0,23.0,'Ba!'],[23.2,24.4,'Cùng đếm nào!'],[24.5,25.9,'Một…'],[26.0,27.4,'Hai…'],[27.5,29.2,'Ba!'],[29.5,33.8,'Ba món quà! Giáng sinh vui vẻ!'],[34.0,37.2,'Bé đếm giỏi lắm! Bye bye!']],
  name:'Gà Con',sub:'Giáng sinh vui vẻ!',ep:'Noel · Đếm quà 1 · 2 · 3'},
 en:{caps:[[1.2,3.2,'Whoa! The present is hopping!'],[3.4,7.0,'One present! A ball!'],[7.0,9.0,'One!'],[9.4,14.0,'Two presents! A duckie!'],[14.0,16.0,'Two!'],[16.4,21.0,'Three presents! A teddy!'],[21.0,23.0,'Three!'],[23.2,24.4,"Let's count!"],[24.5,25.9,'One…'],[26.0,27.4,'Two…'],[27.5,29.2,'Three!'],[29.5,33.8,'Three presents! Merry Christmas!'],[34.0,37.2,'Great counting! Bye-bye!']],
  name:'Little Chick',sub:'Merry Christmas!',ep:'Christmas · Count 1 · 2 · 3'}
};
EP.SHOTS=[
 [0,1.2, 1.1,96,240, 1.15,96,242],
 [1.2,3.4, 1.7,92,262, 1.8,90,264],
 [3.4,7.0, 1.6,86,258, 1.75,86,260],
 [7.0,9.0, 1.4,66,236, 1.45,66,236],
 [9.0,9.4, 1.15,100,240, 1.15,100,240],
 [9.4,14.0, 1.6,112,262, 1.75,114,262],
 [14.0,16.0, 1.4,66,236, 1.45,66,236],
 [16.0,16.4, 1.15,100,240, 1.15,100,240],
 [16.4,21.0, 1.6,140,262, 1.75,142,262],
 [21.0,23.0, 1.4,66,236, 1.45,66,236],
 [23.0,29.4, 1.05,92,250, 1.18,94,256],
 [29.4,34.0, 1.0,90,190, 1.1,92,200],
 [34.0,99, 1.3,88,250, 1.4,88,250]];
const OPEN=[3.4,9.4,16.4], SL=[[88,288],[116,292],[146,288]];
const GC=[['#E63946','#2E8B57'],['#45B6F0','#FFCC33'],['#9B6CE0','#FF8FA8']];
function gift(x,y,k,lidOff){
  const [c,r]=GC[k]; let g=`<g transform="translate(${x} ${y})"><rect x="-12" y="-16" width="24" height="18" rx="2" fill="${c}"/><rect x="-2.5" y="-16" width="5" height="18" fill="${r}"/>`;
  if(!lidOff) g+=`<rect x="-14" y="-21" width="28" height="7" rx="2" fill="${c}"/><rect x="-2.5" y="-21" width="5" height="7" fill="${r}"/><ellipse cx="-5" cy="-24" rx="5" ry="3" transform="rotate(-25 -5 -24)" fill="${r}"/><ellipse cx="5" cy="-24" rx="5" ry="3" transform="rotate(25 5 -24)" fill="${r}"/><circle cx="0" cy="-22" r="2.2" fill="${r}"/>`;
  return g+'</g>';
}
function lid(x,y,k,rot){const [c,r]=GC[k]; return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-14" y="-3.5" width="28" height="7" rx="2" fill="${c}"/><rect x="-2.5" y="-3.5" width="5" height="7" fill="${r}"/><ellipse cx="-5" cy="-6" rx="5" ry="3" transform="rotate(-25 -5 -6)" fill="${r}"/><ellipse cx="5" cy="-6" rx="5" ry="3" transform="rotate(25 5 -6)" fill="${r}"/></g>`;}
function toy(k,x,y,s){
  let g=`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="11" rx="11" ry="2.4" fill="#000" opacity=".12"/>`;
  if(k===0) g+=`<circle r="11" fill="#45B6F0"/><path d="M0 -6 L1.8 -1.8 L6 -1.6 L2.7 1.3 L3.8 5.6 L0 3.2 L-3.8 5.6 L-2.7 1.3 L-6 -1.6 L-1.8 -1.8 Z" fill="#fff"/><ellipse cx="-5" cy="-5" rx="3" ry="2" fill="#fff" opacity=".5"/>`;
  else if(k===1) g+=`<ellipse cx="0" cy="3" rx="11" ry="7.5" fill="#FFD23F"/><path d="M-9 1 L-14 -4 L-11 3 Z" fill="#FFD23F"/><circle cx="5" cy="-6" r="6.5" fill="#FFD23F"/><circle cx="7" cy="-7.5" r="1.5" fill="${C.eye}"/><path d="M10 -6 q5 -1 6 1 q-3 1.5 -6 1 Z" fill="${C.beak}"/><ellipse cx="-2" cy="2" rx="5" ry="3.4" fill="#FFC21A"/>`;
  else g+=`<circle cx="-7" cy="-13" r="4" fill="#A86A3D"/><circle cx="7" cy="-13" r="4" fill="#A86A3D"/><ellipse cx="0" cy="5" rx="10" ry="8" fill="#A86A3D"/><circle cx="0" cy="-7" r="9" fill="#B97A48"/><ellipse cx="0" cy="-4" rx="4.5" ry="3.4" fill="#E8C9A0"/><circle cx="0" cy="-5" r="1.4" fill="${C.eye}"/><circle cx="-3.5" cy="-9" r="1.3" fill="${C.eye}"/><circle cx="3.5" cy="-9" r="1.3" fill="${C.eye}"/><ellipse cx="0" cy="6" rx="5" ry="4" fill="#E8C9A0"/><path d="M-3 0 l6 0" stroke="#E63946" stroke-width="2"/>`;
  return g+'</g>';
}
function tree(t,fast){
  let g=`<rect x="136" y="262" width="12" height="22" fill="#8B5A2B"/>`;
  [[142,150,112,202,172],[142,176,104,236,180],[142,206,98,270,186]].forEach(([tx,ty,lx,by,rx])=>{g+=`<path d="M${tx} ${ty} L${lx} ${by} Q${tx} ${by+8} ${rx} ${by} Z" fill="#2E8B57"/><path d="M${tx} ${ty} L${lx+6} ${by-2} Q${tx-8} ${by+4} ${tx} ${by+3} Z" fill="#3FAE5A" opacity=".55"/>`;});
  const L=[[130,190],[152,196],[122,222],[142,226],[162,220],[114,256],[132,260],[152,262],[172,256],[142,170]];
  const cols=['#F2545B','#FFCC33','#45B6F0','#FF8FA8','#FFFFFF'];
  L.forEach(([x,y],i)=>{const on=Math.sin(t*(fast?14:4)+i*1.7)>-0.2; g+=`<circle cx="${x}" cy="${y}" r="3" fill="${cols[i%5]}" opacity="${on?1:0.35}"/>`+(on?`<circle cx="${x}" cy="${y}" r="5.5" fill="${cols[i%5]}" opacity=".25"/>`:'');});
  const sc=1+0.08*Math.sin(t*3);
  g+=`<g transform="translate(142 146) scale(${sc}) rotate(${t*20})"><path d="M0 -10 L2.9 -3.1 L9.5 -3.1 L4.3 1.4 L6.1 8.1 L0 4.3 L-6.1 8.1 L-4.3 1.4 L-9.5 -3.1 L-2.9 -3.1 Z" fill="#FFD84D"/></g>`;
  return g;
}
EP.main=function(t){
  if(!window.__endset){const e=document.getElementById('end'); if(e){e.style.background='#D9E8F7'; window.__endset=1;}}
  let w=`<defs><linearGradient id="wsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9CBEF"/><stop offset="1" stop-color="#EAF3FC"/></linearGradient></defs><rect x="-40" y="-40" width="260" height="400" fill="url(#wsky)"/>`;
  w+=`<circle cx="30" cy="70" r="12" fill="#FFF6D6" opacity=".9"/>`;
  w+=`<path d="M-40 260 Q60 236 120 256 T220 248 L220 340 L-40 340 Z" fill="#DCE8F5"/><path d="M-40 274 Q90 252 220 274 L220 340 L-40 340 Z" fill="#F7FAFD"/>`;
  // snowman far left back
  w+=`<g transform="translate(14 250)"><circle cy="10" r="10" fill="#fff"/><circle cy="-4" r="7" fill="#fff"/><circle cx="-2" cy="-5" r="1" fill="${C.eye}"/><circle cx="2" cy="-5" r="1" fill="${C.eye}"/><path d="M0 -3 l5 1 l-5 1 Z" fill="${C.beak}"/></g>`;
  w+=tree(t, t>29.5&&t<34);
  // gifts / toys
  for(let k=0;k<3;k++){const O=OPEN[k]; const [x,y]=SL[k];
    if(t<O){let hop=0, sh=0; if(k===0&&t>0.3&&t<3.2){hop=Math.abs(Math.sin((t-0.3)*Math.PI*2.2))*8;} if(t>O-0.6)sh=Math.sin(t*45)*2;
      w+=`<g transform="translate(${sh} ${-hop})">${gift(x,y,k,false)}</g>`;}
    else{const u=t-O;
      if(u<1.0)w+=lid(x+u*30*(k%2?1:-1),y-21-60*u+70*u*u,k,u*300*(k%2?1:-1));
      if(u<0.5)w+=`<g opacity="${1-u/0.5}">${gift(x,y,k,true)}</g>`;
      let ty=y-2, s=1.15; if(u<0.7){ty=y-2-34*Math.sin(Math.PI*u/0.7);}
      const cnt=24.5+k*1.5; s*=pulse(t,O,0.5)*pulse(t,cnt,0.5);
      if(t>29.5&&t<34) ty-=Math.max(0,Math.sin((t-29.5)*6-k))*5;
      if(u<0.9){for(let i=0;i<7;i++){const a=i/7*Math.PI*2; const r=6+u*26; w+=`<path transform="translate(${x+Math.cos(a)*r} ${y-12+Math.sin(a)*r}) scale(${(1-u)})" d="M0 -3 L.9 -.9 L3 0 L.9 .9 L0 3 L-.9 .9 L-3 0 L-.9 -.9 Z" fill="#FFD84D"/>`;}}
      w+=toy(k,x,ty,s);}
  }
  if(t>24.5&&t<29.5){for(let k=0;k<3;k++){const b=24.5+k*1.5; if(t>b){const sc=popScale(t,b); w+=`<g transform="translate(${SL[k][0]} ${SL[k][1]-26}) scale(${sc})"><text text-anchor="middle" dominant-baseline="central" font-family="'Baloo 2'" font-weight="800" font-size="12" fill="#fff" stroke="${C.ink}" stroke-width="2.5" paint-order="stroke">${k+1}</text></g>`;}}}
  // Gà Con with Santa hat
  let jump=0, wl=0, wr=0, eyes='open', sy=1+0.015*Math.sin(t*3.2);
  if(t<3.2)eyes='wow';
  for(const O of OPEN){ if(t>O&&t<O+1.0){eyes='wow'; jump=6*Math.sin(Math.PI*(t-O));} if(t>O+1.0&&t<O+3.4){eyes='happy'; jump=Math.max(jump,3*Math.abs(Math.sin(t*Math.PI*1.8)));} }
  const raise=(a,b,both)=>{if(t>a&&t<b){const k=eOut(prog(t,a,a+0.3))*(1-eIn(prog(t,b-0.3,b)));wl=Math.max(wl,110*k);if(both)wr=Math.min(wr,-110*k);}};
  raise(7,9,false); raise(14,16,true); raise(21,23,true);
  for(let k=0;k<3;k++){const b=24.5+k*1.5; if(t>b&&t<b+0.4)jump=5*Math.sin(Math.PI*(t-b)/0.4);}
  if(t>29.5&&t<34){const ph=((t-29.5)%0.7)/0.7; jump=10*Math.sin(Math.PI*ph); eyes='happy'; wl=70; wr=-70;}
  if(t>34){eyes='happy';const k=eOut(prog(t,34,34.4));wr=-k*(100+25*Math.sin((t-34)*2*Math.PI*2));}
  if(eyes==='open'&&(t%3.3)>3.15)eyes='blink';
  const mouth=window.ENV?mouthAt(t+INTRO):0;
  w+=`<g transform="translate(52 236) rotate(${Math.sin(t*1.1)*2} 0 50) scale(.62)">${chick({sy,jump,wl,wr,eyes,mouth,hat:true})}</g>`;
  // snowfall
  for(let i=0;i<55;i++){const sp=16+rnd(i)*18; const x=(rnd(i+3)*220-20+Math.sin(t*0.8+i)*8); const y=((t*sp+rnd(i+30)*380)%380)-40; w+=`<circle cx="${x}" cy="${y}" r="${0.9+rnd(i+11)*1.4}" fill="#fff" opacity=".9"/>`;}
  let s=`<g transform="${cam(t)}">${w}</g>`;
  s+=bigNum(1,t,3.4,9.0)+bigNum(2,t,9.4,16.0)+bigNum(3,t,16.4,23.0);
  for(let k=0;k<3;k++){const b=24.5+k*1.5; s+=bigNum(k+1,t,b,b+(k<2?1.45:1.7));}
  if(t>29.5&&t<35){const cols=['#E63946','#2E8B57','#FFD84D','#FFFFFF','#45B6F0'];
    for(let i=0;i<50;i++){const st=29.5+rnd(i)*1.2; if(t<st)continue; const u=t-st; const x=rnd(i+9)*180+Math.sin(u*3+i)*6; const y=-10+u*(55+rnd(i+3)*40); if(y>330)continue;
      s+=`<rect x="${x}" y="${y}" width="3.2" height="5" fill="${cols[i%5]}" transform="rotate(${(u*300+i*40)%360} ${x+1.6} ${y+2.5})"/>`;}}
  return s;
};
