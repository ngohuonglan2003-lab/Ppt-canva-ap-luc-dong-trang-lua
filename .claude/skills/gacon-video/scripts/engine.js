// Gà Con engine: shared drawing, camera, intro, captions, render. Episode file must define EP before loading.
const INTRO=EP.INTRO||4, MAIN=EP.MAIN, TOTAL=INTRO+MAIN, END=EP.END;

const C={sky0:'#9EDCFF',sky1:'#E6F7FF',ground:'#7CCB5E',ground2:'#6BBE4E',grass:'#5DB548',body:'#FFCC33',wing:'#FFB81C',beak:'#FF8C2B',eye:'#2E2A3B',cheek:'#FF8FA8',
 apple:'#F2545B',leaf:'#3FAE5A',trunk:'#A86A3D',canopy:'#3FAE5A',canopy2:'#5CC46F',cloud:'#FFFFFF',ink:'#1D3557',num:'#FF8C2B',sun:'#FFD84D',ray:'#FFE58A',bird:'#45B6F0',bird2:'#FF8FA8'};
const LANG=EP.LANG;
let lang='vi';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,u)=>a+(b-a)*u;
const prog=(t,a,b)=>clamp((t-a)/(b-a));
const eIn=u=>u*u, eOut=u=>1-(1-u)*(1-u), eIO=u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
function eBack(u){const c1=1.9,c3=c1+1;return 1+c3*Math.pow(u-1,3)+c1*Math.pow(u-1,2)}
function popScale(t,a,d=0.35){ if(t<a)return 0; return eBack(clamp((t-a)/d)); }
function pulse(t,a,d=0.5){ if(t<a||t>a+d)return 1; return 1+0.38*Math.sin(Math.PI*(t-a)/d); }
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)}


/* ---------- shared pieces ---------- */
function apple(x,y,s=1,rot=0,shadow=false){
  let g='';
  if(shadow)g+=`<ellipse cx="${x}" cy="${y+11*s+1}" rx="${10*s}" ry="${2.4*s}" fill="#000" opacity=".13"/>`;
  g+=`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
   <path d="M0 -9 q1 -6 3 -8" stroke="#6B3F24" stroke-width="1.8" fill="none" stroke-linecap="round"/>
   <ellipse cx="6" cy="-15" rx="5.5" ry="2.8" transform="rotate(-25 6 -15)" fill="${C.leaf}"/>
   <path d="M0 -8 C -6 -13, -13 -9, -12 0 C -11 9, -5 12, 0 10 C 5 12, 11 9, 12 0 C 13 -9, 6 -13, 0 -8 Z" fill="${C.apple}"/>
   <ellipse cx="-5.5" cy="-3" rx="2.6" ry="4" transform="rotate(20 -5.5 -3)" fill="#fff" opacity=".55"/></g>`;
  return g;
}
function chick(o){
  const {sy=1,jump=0,wl=0,wr=0,eyes='open',mouth=0,hat=false,body=C.body}=o;
  let s=`<ellipse cx="0" cy="70" rx="${48-jump*.25}" ry="8" fill="#000" opacity="${.15-jump*.002}"/>`;
  s+=`<g transform="translate(0 ${-jump}) translate(0 68) scale(${2-sy} ${sy}) translate(0 -68)">`;
  s+=`<ellipse cx="-18" cy="64" rx="11" ry="5" fill="${C.beak}"/><ellipse cx="18" cy="64" rx="11" ry="5" fill="${C.beak}"/>`;
  s+=`<g transform="rotate(${wl} -50 0)"><ellipse cx="-60" cy="14" rx="14" ry="22" transform="rotate(25 -60 14)" fill="${C.wing}"/></g>`;
  s+=`<g transform="rotate(${wr} 50 0)"><ellipse cx="60" cy="14" rx="14" ry="22" transform="rotate(-25 60 14)" fill="${C.wing}"/></g>`;
  s+=`<path d="M-8 -58 C -12 -84, 4 -86, 2 -61 C 8 -80, 24 -76, 10 -57 Z" fill="${C.wing}"/>`;
  s+=`<circle cx="0" cy="0" r="62" fill="${body}"/>`;
  s+=`<ellipse cx="-24" cy="-32" rx="16" ry="9" transform="rotate(-30 -24 -32)" fill="#fff" opacity=".35"/>`;
  if(eyes==='happy') s+=`<path d="M-31 -9 q9 -11 18 0 M13 -9 q9 -11 18 0" fill="none" stroke="${C.eye}" stroke-width="4.5" stroke-linecap="round"/>`;
  else if(eyes==='sleep') s+=`<path d="M-31 -12 q9 8 18 0 M13 -12 q9 8 18 0" fill="none" stroke="${C.eye}" stroke-width="4" stroke-linecap="round"/>`;
  else if(eyes==='sad'){ s+=`<circle cx="-22" cy="-10" r="8" fill="${C.eye}"/><circle cx="22" cy="-10" r="8" fill="${C.eye}"/><circle cx="-19" cy="-13" r="2.6" fill="#fff"/><circle cx="25" cy="-13" r="2.6" fill="#fff"/><path d="M-32 -21 L-14 -27 M32 -21 L14 -27" stroke="${C.eye}" stroke-width="3.5" stroke-linecap="round"/><path d="M-6 22 q6 -4 12 0" stroke="${C.eye}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`; }
  else if(eyes==='blink') s+=`<path d="M-30 -12 h16 M14 -12 h16" stroke="${C.eye}" stroke-width="4" stroke-linecap="round"/>`;
  else{const r=eyes==='wow'?11:8.5;
    s+=`<circle cx="-22" cy="-12" r="${r}" fill="${C.eye}"/><circle cx="22" cy="-12" r="${r}" fill="${C.eye}"/>`;
    s+=`<circle cx="-18.5" cy="-16" r="${r*.33}" fill="#fff"/><circle cx="25.5" cy="-16" r="${r*.33}" fill="#fff"/>`;}
  s+=`<ellipse cx="-38" cy="10" rx="10" ry="6" fill="${C.cheek}" opacity=".85"/><ellipse cx="38" cy="10" rx="10" ry="6" fill="${C.cheek}" opacity=".85"/>`;
  const m=clamp(mouth);
  if(m<0.06){ s+=`<path d="M-11 2 L11 2 L0 11 Z" fill="${C.beak}"/>`; }
  else{
    s+=`<ellipse cx="0" cy="${5+3*m}" rx="${7+2*m}" ry="${2+5*m}" fill="#B23A48"/>`;
    s+=`<ellipse cx="0" cy="${7+6*m}" rx="${3.5+1.5*m}" ry="${1.2+1.6*m}" fill="#FF8FA8"/>`;
    s+=`<path d="M-8.5 ${5+6*m} L8.5 ${5+6*m} L0 ${11+8*m} Z" fill="#F27A1F"/>`;
    s+=`<path d="M-11.5 ${1-m} L11.5 ${1-m} L0 ${8.5-m} Z" fill="${C.beak}"/>`;
  }
  if(hat){ s+=`<path d="M-44 -40 Q-6 -112 46 -86 Q30 -62 40 -40 Z" fill="#E63946"/><circle cx="48" cy="-86" r="10" fill="#fff"/><rect x="-50" y="-48" width="96" height="16" rx="8" fill="#fff"/>`; }
  return s+`</g>`;
}
function sun(x,y,r,t){
  let s=`<g transform="translate(${x} ${y})"><g transform="rotate(${t*25})">`;
  for(let i=0;i<12;i++){const L=r*(i%2?0.55:0.8)*(1+0.12*Math.sin(t*4+i));
    s+=`<rect x="${-r*0.13}" y="${-(r*1.25+L)}" width="${r*0.26}" height="${L}" rx="${r*0.13}" fill="${C.ray}" transform="rotate(${i*30})"/>`;}
  s+=`</g><circle r="${r*1.12}" fill="${C.ray}" opacity=".45"/><circle r="${r}" fill="${C.sun}"/>`;
  const bl=(t%4)>3.85;
  s+= bl?`<path d="M${-r*.45} ${-r*.12} h${r*.3} M${r*.15} ${-r*.12} h${r*.3}" stroke="${C.ink}" stroke-width="${r*.1}" stroke-linecap="round"/>`
        :`<circle cx="${-r*.32}" cy="${-r*.12}" r="${r*.11}" fill="${C.ink}"/><circle cx="${r*.32}" cy="${-r*.12}" r="${r*.11}" fill="${C.ink}"/>`;
  s+=`<path d="M${-r*.32} ${r*.22} q${r*.32} ${r*.3} ${r*.64} 0" fill="none" stroke="${C.ink}" stroke-width="${r*.09}" stroke-linecap="round"/>`;
  s+=`<circle cx="${-r*.55}" cy="${r*.16}" r="${r*.14}" fill="${C.cheek}" opacity=".7"/><circle cx="${r*.55}" cy="${r*.16}" r="${r*.14}" fill="${C.cheek}" opacity=".7"/></g>`;
  return s;
}
function bird(x,y,s,t,dir,col){
  const f=Math.sin(t*14); // flap
  return `<g transform="translate(${x} ${y}) scale(${dir*s} ${s})">
   <path d="M-1 0 Q -6 ${-9*f} -11 ${-6*f-1} Q -6 ${-2*f} -1 1 Z" fill="${col}" opacity=".85"/>
   <ellipse cx="0" cy="1" rx="6" ry="3.6" fill="${col}"/><circle cx="5" cy="-1.5" r="3" fill="${col}"/>
   <circle cx="6" cy="-2.2" r=".8" fill="${C.ink}"/><path d="M7.8 -1.6 l2.6 .8 l-2.6 .8 Z" fill="${C.beak}"/>
   <path d="M-5 0 l-4 -2 l0 4 Z" fill="${col}"/>
   <path d="M1 0 Q -3 ${-10*f} -8 ${-8*f-2} Q -3 ${-3*f} 1 1.5 Z" fill="${col}"/></g>`;
}
function gust(t){return 0.5+0.5*Math.max(0,Math.sin(t*0.9-1))*1.6}
function birds(t){
  let s='';
  const B=[[0,20,62,1,C.bird,.9],[3.5,14,38,1,C.bird2,.75],[7,26,104,-1,C.bird,.8]];
  B.forEach(([off,sp,yb,dir,col,sc],i)=>{const per=260/sp; const u=((t+off*3)%per)/per;
    const x=dir>0? -40+u*260 : 220-u*260; const y=yb+6*Math.sin(t*1.7+i*2);
    s+=bird(x,y,sc,t+i,dir,col);});
  return s;
}
function wind(t){
  let s='';
  // streaks
  for(let k=0;k<3;k++){const per=5.5; const ph=((t+k*1.9)%per); if(ph>1.8)continue; const u=ph/1.8;
    const x=-50+u*280, y=70+k*55+4*Math.sin(t*2+k); const op=Math.sin(Math.PI*u)*.8;
    s+=`<path d="M${x} ${y} q8 -5 16 0 t16 0 q6 3 9 -2" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity="${op}"/>`;}
  // flying leaves
  for(let k=0;k<4;k++){const per=7+k; const ph=((t+k*2.3)%per)/per; const x=-20+ph*230; const y=120+k*40+10*Math.sin(t*2.5+k*2)+ph*20;
    s+=`<ellipse cx="${x}" cy="${y}" rx="4" ry="2" fill="${k%2?C.canopy2:C.leaf}" transform="rotate(${(t*200+k*90)%360} ${x} ${y})"/>`;}
  return s;
}
function grass(t){
  let s=''; const g=gust(t);
  const X=[8,24,38,58,102,118,128,170,15,80,112,160];
  X.forEach((x,i)=>{const y=i<8?282:302; const a=(Math.sin(t*2.4+x*.15)*7+g*6);
    s+=`<g transform="rotate(${a} ${x} ${y})"><path d="M${x-3} ${y} q-2 -7 -4 -11 q4 5 5 11 Z M${x} ${y} q0 -9 1 -14 q2 7 1 14 Z M${x+3} ${y} q2 -6 5 -10 q-3 5 -3 10 Z" fill="${C.grass}"/></g>`;});
  // flowers
  [[20,286,'#FF8FA8'],[112,290,'#FFFFFF'],[166,288,'#FFCC33'],[60,306,'#FFFFFF']].forEach(([x,y,c],i)=>{const a=Math.sin(t*2+i*1.3)*9+g*7;
    s+=`<g transform="rotate(${a} ${x} ${y})"><path d="M${x} ${y} L${x} ${y-12}" stroke="${C.leaf}" stroke-width="1.6"/>`;
    for(let p=0;p<5;p++){const an=p*72*Math.PI/180; s+=`<circle cx="${x+3.2*Math.cos(an)}" cy="${y-12+3.2*Math.sin(an)}" r="2.6" fill="${c}"/>`;}
    s+=`<circle cx="${x}" cy="${y-12}" r="2" fill="#FFB81C"/></g>`;});
  return s;
}
function sky(t,sunY=56){
  let s=`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sky0}"/><stop offset="1" stop-color="${C.sky1}"/></linearGradient></defs>`;
  s+=`<rect x="-40" y="-40" width="260" height="400" fill="url(#sky)"/>`;
  s+=sun(150,sunY,12,t);
  const g=gust(t);
  const cx1=((20+t*3*g)%240)-40, cx2=((120+t*2*g)%240)-40;
  s+=`<g fill="${C.cloud}"><circle cx="${cx1}" cy="88" r="11"/><circle cx="${cx1+14}" cy="82" r="15"/><circle cx="${cx1+28}" cy="89" r="10"/></g>`;
  s+=`<g fill="${C.cloud}" opacity=".95"><circle cx="${cx2}" cy="200" r="8"/><circle cx="${cx2+10}" cy="195" r="11"/><circle cx="${cx2+21}" cy="201" r="7"/></g>`;
  s+=birds(t);
  return s;
}
function hills(){return `<path d="M-40 262 Q60 238 120 258 T220 250 L220 340 L-40 340 Z" fill="${C.ground2}"/><path d="M-40 276 Q90 254 220 276 L220 340 L-40 340 Z" fill="${C.ground}"/>`;}

function mouthAt(T){const E=window.ENV;if(!E)return 0;const i=Math.round(T*100);let e=0;for(let k=i-2;k<=i+2;k++)if(E[k]>e)e=E[k];return clamp((e-0.08)/0.55);}

/* ---------- bạn bè dùng chung (Vịt đứng, đầu con vật, Ếch) ---------- */
function duckStand(x,y,o){
  const {s=1,flap=0,quack=0,eyes='open'}=o;
  let g=`<g transform="translate(${x} ${y}) scale(${-s} ${s})">`;
  g+=`<ellipse cx="0" cy="13" rx="15" ry="3" fill="#000" opacity=".12"/><ellipse cx="-5" cy="11" rx="4" ry="2" fill="${C.beak}"/><ellipse cx="5" cy="11" rx="4" ry="2" fill="${C.beak}"/>`;
  g+=`<path d="M-12 -2 L-19 -8 L-15 1 Z" fill="#FFE27A"/><ellipse cx="0" cy="0" rx="14" ry="10.5" fill="#FFE27A"/>`;
  g+=`<g transform="rotate(${-flap*50} -2 -3)"><ellipse cx="-3" cy="-1" rx="7.5" ry="5" fill="#FFD23F"/></g>`;
  g+=`<circle cx="8" cy="-11" r="8" fill="#FFE27A"/><path d="M6 -19 q2 -6 5 -1 q2 -5 4 0" fill="#45B6F0"/>`;
  if(eyes==='happy') g+=`<path d="M8 -13 q2.2 -2.6 4.4 0" stroke="${C.eye}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  else if(eyes==='sad') g+=`<circle cx="10.5" cy="-12" r="1.9" fill="${C.eye}"/><path d="M8 -16.5 l5 1.2" stroke="${C.eye}" stroke-width="1.1" stroke-linecap="round"/>`;
  else g+=`<circle cx="10.5" cy="-12.5" r="1.9" fill="${C.eye}"/><circle cx="11.1" cy="-13.2" r=".6" fill="#fff"/>`;
  g+=`<circle cx="8" cy="-8" r="1.8" fill="${C.cheek}" opacity=".8"/>`;
  const q=quack*3;
  g+=`<path d="M14 ${-10-q*.3} q6 -1 8 ${1-q*.2} q-4 1.5 -8 1 Z" fill="${C.beak}"/><path d="M14 ${-8.5+q*.2} q5 ${0.5+q} 7 ${1.5+q*.6} q-4 0.5 -7 -0.5 Z" fill="#F27A1F"/>`;
  return g+'</g>';
}
function animal(k,talk,blink){
  const m=clamp(talk); let s='';
  const eye=(x,y)=> blink?`<path d="M${x-3} ${y} h6" stroke="${C.eye}" stroke-width="2" stroke-linecap="round"/>`:`<circle cx="${x}" cy="${y}" r="3.2" fill="${C.eye}"/><circle cx="${x+1}" cy="${y-1.2}" r="1" fill="#fff"/>`;
  const mouth=(y,c)=>m>0.08?`<ellipse cx="0" cy="${y+2*m}" rx="${3+2*m}" ry="${1+4*m}" fill="#B23A48"/>`:`<path d="M-4 ${y} q2 2 4 0 q2 2 4 0" stroke="${c}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  if(k===0){ // mèo
    s+=`<path d="M-20 -8 L-16 -30 L-4 -18 Z M20 -8 L16 -30 L4 -18 Z" fill="#FF9F43"/><path d="M-16 -12 L-14 -24 L-8 -17 Z M16 -12 L14 -24 L8 -17 Z" fill="#FFC6A5"/>`;
    s+=`<circle r="22" fill="#FFB25B"/><path d="M-6 -21 l2 7 M0 -22 l0 7 M6 -21 l-2 7" stroke="#E8873A" stroke-width="2.4" stroke-linecap="round"/>`;
    s+=eye(-8,-3)+eye(8,-3)+`<path d="M-2.5 4 L2.5 4 L0 7 Z" fill="#FF7A9A"/>`+mouth(9,C.eye);
    s+=`<path d="M-10 6 h-12 M-10 9 l-11 3 M10 6 h12 M10 9 l11 3" stroke="${C.eye}" stroke-width="1" opacity=".6"/>`;
  } else if(k===1){ // chó
    s+=`<circle r="22" fill="#D29E6B"/><ellipse cx="-21" cy="-2" rx="7" ry="15" transform="rotate(18 -21 -2)" fill="#8B5A3C"/><ellipse cx="21" cy="-2" rx="7" ry="15" transform="rotate(-18 21 -2)" fill="#8B5A3C"/>`;
    s+=`<ellipse cx="0" cy="8" rx="12" ry="9" fill="#F1D7B5"/>`+eye(-8,-5)+eye(8,-5)+`<ellipse cx="0" cy="3" rx="4" ry="3" fill="${C.eye}"/>`;
    s+= m>0.08?`<ellipse cx="0" cy="${11+2*m}" rx="${3.5+2*m}" ry="${1+4*m}" fill="#B23A48"/><ellipse cx="0" cy="${13+4*m}" rx="3" ry="${1.5+2*m}" fill="#FF7A9A"/>`:mouth(10,C.eye);
  } else if(k===2){ // bò
    s+=`<path d="M-14 -18 q-6 -10 -2 -14 q3 6 7 9 Z M14 -18 q6 -10 2 -14 q-3 6 -7 9 Z" fill="#F5E6C8"/>`;
    s+=`<ellipse cx="-24" cy="-8" rx="8" ry="4.5" transform="rotate(-20 -24 -8)" fill="#fff"/><ellipse cx="24" cy="-8" rx="8" ry="4.5" transform="rotate(20 24 -8)" fill="#fff"/>`;
    s+=`<ellipse rx="21" ry="22" fill="#FFFFFF"/><path d="M-21 -8 q8 -10 14 -4 q-2 10 -14 10 Z" fill="#2E2A3B"/><circle cx="12" cy="-14" r="5" fill="#2E2A3B"/>`;
    s+=eye(-8,-3)+eye(8,-3)+`<ellipse cx="0" cy="11" rx="14" ry="9" fill="#FFB3C1"/><ellipse cx="-5" cy="9" rx="2" ry="2.6" fill="#C9677E"/><ellipse cx="5" cy="9" rx="2" ry="2.6" fill="#C9677E"/>`;
    if(m>0.08)s+=`<ellipse cx="0" cy="${15+m}" rx="${4+2*m}" ry="${1+3*m}" fill="#B23A48"/>`;
  } else { // cừu
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2; s+=`<circle cx="${Math.cos(a)*19}" cy="${Math.sin(a)*19-2}" r="9" fill="#FFFFFF"/>`;}
    s+=`<ellipse cx="-17" cy="0" rx="7" ry="3.5" transform="rotate(25 -17 0)" fill="#5D5A6B"/><ellipse cx="17" cy="0" rx="7" ry="3.5" transform="rotate(-25 17 0)" fill="#5D5A6B"/>`;
    s+=`<ellipse cx="0" cy="2" rx="13" ry="16" fill="#6E6A80"/><circle cx="0" cy="-14" r="8" fill="#FFFFFF"/><circle cx="-7" cy="-12" r="6" fill="#FFFFFF"/><circle cx="7" cy="-12" r="6" fill="#FFFFFF"/>`;
    s+=eye(-5,0).replace(/#2E2A3B/g,'#fff').replace('fill="#fff"/>','fill="#2E2A3B"/>')+eye(5,0).replace(/#2E2A3B/g,'#fff').replace('fill="#fff"/>','fill="#2E2A3B"/>');
    s+= m>0.08?`<ellipse cx="0" cy="${10+m}" rx="${3+2*m}" ry="${1+3*m}" fill="#B23A48"/>`:`<path d="M-3 10 q3 2 6 0" stroke="#fff" stroke-width="1.4" fill="none"/>`;
  }
  return s;
}
function frog(x,y,o){
  const {puff=0,blink=false,jumpK=0}=o; let g=`<g transform="translate(${x} ${y})">`;
  g+=`<ellipse cx="0" cy="9" rx="13" ry="2.5" fill="#000" opacity=".12"/>`;
  g+=`<ellipse cx="-10" cy="6" rx="6" ry="3.4" fill="#5AB43C"/><ellipse cx="10" cy="6" rx="6" ry="3.4" fill="#5AB43C"/>`;
  g+=`<ellipse cx="0" cy="0" rx="13" ry="${9+jumpK*2}" fill="#6CC24A"/><ellipse cx="0" cy="3" rx="8" ry="5" fill="#A6E07A"/>`;
  if(puff>0)g+=`<ellipse cx="0" cy="6" rx="${4+5*puff}" ry="${3+4*puff}" fill="#C9F0A8"/>`;
  [-6,6].forEach(ex=>{g+=`<circle cx="${ex}" cy="-8" r="5" fill="#6CC24A"/>`+(blink?`<path d="M${ex-3} -8 h6" stroke="${C.eye}" stroke-width="1.4" stroke-linecap="round"/>`:`<circle cx="${ex}" cy="-8" r="3.2" fill="#fff"/><circle cx="${ex+.5}" cy="-7.6" r="1.8" fill="${C.eye}"/>`);});
  g+=`<path d="M-5 -1 q5 4 10 0" stroke="${C.eye}" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="-8" cy="1" r="1.6" fill="${C.cheek}" opacity=".7"/><circle cx="8" cy="1" r="1.6" fill="${C.cheek}" opacity=".7"/>`;
  return g+'</g>';
}
/* ---------- camera ---------- */
const SHOTS=EP.SHOTS;
function cam(t){
  const sh=SHOTS.find(s=>t>=s[0]&&t<s[1])||SHOTS[SHOTS.length-1];
  const u=eIO(prog(t,sh[0],Math.min(sh[1],MAIN)));
  const z=lerp(sh[2],sh[5],u); let cx=lerp(sh[3],sh[6],u), cy=lerp(sh[4],sh[7],u);
  cx=clamp(cx,90/z,180-90/z); cy=clamp(cy,160/z,320-160/z);
  return `translate(90 160) scale(${z}) translate(${-cx} ${-cy})`;
}

function bigNum(n,t,a,b){
  if(t<a||t>b)return '';
  const sc=popScale(t,a)*(t>b-0.25?clamp((b-t)/0.25):1);
  return `<g transform="translate(40 128) scale(${sc}) rotate(${Math.sin(t*5)*4})"><text x="0" y="0" text-anchor="middle" dominant-baseline="central" font-family="'Baloo 2'" font-weight="800" font-size="74" fill="${C.num}" stroke="#fff" stroke-width="7" paint-order="stroke" stroke-linejoin="round">${n}</text></g>`;
}
const main=EP.main;
/* ---------- intro ---------- */
function intro(T){
  const sunY=lerp(150,62,eOut(prog(T,0,1.2)));
  let w=sky(T+20,sunY);
  // rising bubbles of colour
  w+=hills()+grass(T+20);
  // chick pops up from behind hill
  let cy=lerp(360,232,eBack(prog(T,1.1,1.6))); if(T<1.1)cy=360;
  const wave=T>1.7? -(100+25*Math.sin((T-1.7)*2*Math.PI*2)) : 0;
  const jump=T>2.4&&T<3.2?8*Math.abs(Math.sin((T-2.4)*Math.PI*2.5)):0;
  w+=`<g transform="translate(90 ${cy}) scale(.82)">${chick({eyes:T>1.7?'happy':'wow',wr:wave,jump,wl:T>2.4?30*Math.sin(T*10):0,mouth:mouthAt(T)})}</g>`;
  w+=wind(T+20);
  const z=lerp(1.0,1.12,eIO(prog(T,0,INTRO)));
  let s=`<g transform="translate(90 160) scale(${z}) translate(-90 -160)">${w}</g>`;
  // sparkles around logo
  if(T>0.6){for(let k=0;k<8;k++){const ph=(T*1.3+k/8)%1; const x=20+rnd(k)*140, y=40+rnd(k+4)*60; const sc=Math.sin(Math.PI*ph)*(0.6+rnd(k+2)*.6);
    s+=`<path transform="translate(${x} ${y}) scale(${sc})" d="M0 -5 L1.4 -1.4 L5 0 L1.4 1.4 L0 5 L-1.4 1.4 L-5 0 L-1.4 -1.4 Z" fill="#fff"/>`;}}
  return s;
}

/* ---------- render ---------- */
function capAt(t){
  for(const [a,b,txt] of LANG[lang].caps){ if(t>=a&&t<b){ const u=prog(t,a,a+0.3); const out=t>b-0.2?clamp((b-t)/0.2):1; return [txt,eBack(u)*out]; } }
  return ['',0];
}
let builtLogo='';
function renderAt(T,l){
  if(l)lang=l;
  const logo=document.getElementById('logo'), ep=document.getElementById('ep'), cap=document.getElementById('cap'), end=document.getElementById('end'), fl=document.getElementById('flash');
  if(builtLogo!==lang){logo.innerHTML=[...LANG[lang].name].map(ch=>`<span>${ch===' '?'&nbsp;':ch}</span>`).join('');ep.textContent=LANG[lang].ep;builtLogo=lang;logo.style.fontSize=(LANG[lang].name.length>8?108:150)+'px';logo.style.top=(LANG[lang].name.length>8?215:190)+'px';}
  if(T<INTRO){
    document.getElementById('svg').innerHTML=intro(T);
    [...logo.children].forEach((sp,i)=>{const a=0.55+i*0.09; const sc=popScale(T,a,0.4); sp.style.transform=`translateY(${Math.sin(T*4+i*.7)*6}px) scale(${sc}) rotate(${Math.sin(T*3+i)*4}deg)`;});
    logo.style.visibility='visible';
    const es=popScale(T,1.9,0.4); ep.style.visibility=es>0.01?'visible':'hidden'; ep.style.transform=`translateX(-50%) scale(${es})`;
    cap.style.visibility='hidden'; end.style.visibility='hidden';
    fl.style.opacity=clamp((T-3.65)/0.35)*0.95;
    return;
  }
  logo.style.visibility='hidden'; ep.style.visibility='hidden';
  const t=T-INTRO;
  fl.style.opacity=t<0.3?(1-t/0.3)*0.95:0;
  document.getElementById('svg').innerHTML=main(t);
  const [txt,sc]=capAt(t);
  cap.style.visibility=sc>0.01?'visible':'hidden'; cap.textContent=txt; cap.style.transform=`translateX(-50%) scale(${sc})`;
  const eo=clamp((t-END)/0.5);
  end.style.opacity=eo; end.style.visibility=eo>0?'visible':'hidden';
  if(eo>0){document.getElementById('endName').textContent=LANG[lang].name;document.getElementById('endSub').textContent=LANG[lang].sub;
    const w=-(100+25*Math.sin((t-35)*2*Math.PI*2));
    document.getElementById('endsvg').innerHTML=chick({eyes:'happy',wr:w,jump:Math.abs(Math.sin(t*5))*4,mouth:mouthAt(T)});}
}
window.renderAt=renderAt;

/* ---------- SEL kit: hiệu ứng cảm xúc, đạo cụ, nhân vật đặt sẵn (tập 12+) ---------- */
function confetti(t,t0,dur=5){ if(t<t0||t>t0+dur)return ''; let s=''; const cols=['#F2545B','#45B6F0','#FFCC33','#3FAE5A','#FF8FA8'];
  for(let i=0;i<50;i++){const st=t0+rnd(i)*1.2; if(t<st)continue; const u=t-st; const x=rnd(i+9)*180+Math.sin(u*3+i)*6; const y=-10+u*(55+rnd(i+3)*40); if(y>330)continue;
    s+=`<rect x="${x}" y="${y}" width="3.2" height="5" fill="${cols[i%5]}" transform="rotate(${(u*300+i*40)%360} ${x+1.6} ${y+2.5})"/>`;} return s;}
function fxTears(x,y,t){let s='';for(let k=0;k<2;k++){const ph=((t*1.2+k*0.5)%1);[-1,1].forEach(d=>{s+=`<path d="M${x+d*9} ${y+ph*14} q-1.8 2.8 0 4 q1.8 -1.2 0 -4 Z" fill="#7CC8F0" opacity="${1-ph}"/>`;});}return s;}
function fxSteam(x,y,t){let s='';for(let k=0;k<3;k++){const ph=((t*1.4+k/3)%1); s+=`<circle cx="${x+(k-1)*10+Math.sin(t*5+k)*2}" cy="${y-ph*18}" r="${3+ph*4}" fill="#fff" opacity="${(1-ph)*0.9}"/>`;}
  return s+`<path d="M${x+14} ${y+4} l4 -4 m-4 0 l4 4 M${x+20} ${y+6} l3 -3 m-3 0 l3 3" stroke="#F2545B" stroke-width="1.6" stroke-linecap="round"/>`;}
function fxHearts(x,y,t,t0){if(t<t0)return '';let s='';for(let i=0;i<6;i++){const st=t0+i*0.5; if(t<st)continue; const u=(t-st)%3; const xx=x+Math.sin(u*3+i)*14+(i%2?8:-8), yy=y-u*24;
  s+=`<path transform="translate(${xx} ${yy}) scale(${0.8+0.3*Math.sin(u*5)})" d="M0 5 C -7 0, -6 -6, 0 -3 C 6 -6, 7 0, 0 5 Z" fill="${['#F2545B','#FF8FA8'][i%2]}" opacity="${clamp(1-u/3)}"/>`;}return s;}
function fxBulb(x,y,t,t0){if(t<t0)return '';const sc=popScale(t,t0);return `<g transform="translate(${x} ${y}) scale(${sc})"><circle r="8" fill="#FFE066"/><rect x="-3.5" y="7" width="7" height="4" rx="1.5" fill="#AEB8C4"/>`+[0,60,120,180,240,300].map(a=>`<rect x="-1" y="-15" width="2" height="4" rx="1" fill="#FFE066" transform="rotate(${a+t*40})"/>`).join('')+`</g>`;}
function fxSparkle(x,y,t,t0,R=50){if(t<t0||t>t0+0.9)return '';const u=(t-t0)/0.9;let s='';for(let i=0;i<8;i++){const a=i/8*Math.PI*2; s+=`<path transform="translate(${x+Math.cos(a)*R*u} ${y+Math.sin(a)*R*u}) scale(${1.4*(1-u)})" d="M0 -5 L1.4 -1.4 L5 0 L1.4 1.4 L0 5 L-1.4 1.4 L-5 0 L-1.4 -1.4 Z" fill="#FFD84D"/>`;}return s;}
function fxQ(x,y,t,t0){if(t<t0)return '';return `<g transform="translate(${x} ${y}) scale(${popScale(t,t0)}) rotate(${Math.sin(t*8)*10})"><text text-anchor="middle" dominant-baseline="central" font-family="'Baloo 2'" font-weight="800" font-size="22" fill="${C.ink}" stroke="#fff" stroke-width="4" paint-order="stroke">?</text></g>`;}
function ballProp(x,y,r,rot){return `<g transform="translate(${x} ${y}) rotate(${rot})"><circle r="${r}" fill="#F2545B"/><path d="M${-r} 0 A${r} ${r} 0 0 0 ${r} 0" fill="#FFCC33"/><circle r="${r*0.32}" fill="#fff"/><ellipse cx="${-r*0.4}" cy="${-r*0.45}" rx="${r*0.25}" ry="${r*0.15}" fill="#fff" opacity=".5"/></g>`;}
function towerProp(x,y,n,fall){ // n khối, fall 0..1 đổ
  const cols=['#F2545B','#45B6F0','#FFCC33','#3FAE5A','#9B6CE0','#FF8C2B']; let s='';
  for(let i=0;i<n;i++){const fx=fall*(i*9+4)*(i%2?1:-1)*0.6, fy=fall*(i*13), r=fall*(i%2?60:-50);
    s+=`<g transform="translate(${x+fx} ${y-8-i*14+fy}) rotate(${r})"><rect x="-10" y="-7" width="20" height="14" rx="2" fill="${cols[i%6]}"/><rect x="-7" y="-4" width="6" height="3" rx="1" fill="#fff" opacity=".4"/></g>`;}
  return s;}
function slideProp(x,y){return `<g transform="translate(${x} ${y})"><rect x="-4" y="-70" width="5" height="70" fill="#45B6F0"/><rect x="14" y="-70" width="5" height="70" fill="#45B6F0"/>${[0,1,2,3].map(i=>`<rect x="-4" y="${-60+i*16}" width="23" height="3" fill="#2F86C2"/>`).join('')}<path d="M19 -70 Q40 -60 52 -20 Q58 -4 74 0 L74 6 Q52 4 46 -16 Q36 -54 19 -62 Z" fill="#FFCC33"/><rect x="-6" y="-74" width="27" height="6" rx="2" fill="#F2545B"/></g>`;}
function iceCream(x,y,sc,drop){ // drop: 0 còn trên ốc quế, 1 rơi xuống đất
  let s=`<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-6 0 L0 16 L6 0 Z" fill="#E0A060"/><path d="M-5 3 L5 3 M-3.5 7 L3.5 7" stroke="#C98A48" stroke-width=".8"/>`;
  if(drop<1){const dy=drop*40; s+=`<circle cx="0" cy="${-5+dy}" r="7" fill="#FF8FA8"/><circle cx="-2" cy="${-8+dy}" r="1" fill="#fff"/><circle cx="2.5" cy="${-4+dy}" r="1" fill="#F2545B"/>`;}
  return s+'</g>';}
function easel(x,y,wet,draw){ // wet 0..1 vết nước, draw 0..1 tranh mới
  let s=`<g transform="translate(${x} ${y})"><path d="M-14 0 L-6 -46 M14 0 L6 -46 M0 0 L0 -40" stroke="#A86A3D" stroke-width="2.4"/><rect x="-18" y="-52" width="36" height="30" rx="2" fill="#fff" stroke="#E0D5C0" stroke-width="1.2"/>`;
  if(draw<=0){s+=`<circle cx="-8" cy="-42" r="4" fill="#FFCC33"/><path d="M-12 -30 q6 -6 12 0 q6 -6 12 0" stroke="#3FAE5A" stroke-width="2" fill="none"/>`;
    if(wet>0)s+=`<ellipse cx="2" cy="-36" rx="${12*wet}" ry="${9*wet}" fill="#7CC8F0" opacity=".75"/>`;}
  else{const st=['#F2545B','#FF8C2B','#FFCC33','#3FAE5A','#45B6F0'];st.forEach((c,i)=>{if(draw*5>i)s+=`<path d="M${-14} ${-26-i*3} Q0 ${-46-i*3} 14 ${-26-i*3}" stroke="${c}" stroke-width="2.4" fill="none" stroke-dasharray="40" stroke-dashoffset="${40*(1-clamp(draw*5-i))}"/>`;}); if(draw>0.8)s+=`<circle cx="12" cy="-46" r="3.5" fill="#FFCC33"/>`;}
  return s+'</g>';}
function waveWR(t,t0){const k=eOut(prog(t,t0,t0+0.4)); return -k*(100+25*Math.sin((t-t0)*2*Math.PI*2));}
function meadow(t){return sky(t)+hills()+grass(t);}
function selChick(x,y,s,o,t){const e=o.eyes||'open'; const eyes=(e==='open'&&(t%3.3)>3.15)?'blink':e; return `<g transform="translate(${x} ${y}) rotate(${(o.rot||0)+Math.sin(t*1.1)*2} 0 50) scale(${s})">${chick({...o,eyes})}</g>`;}
function bigWord(text,t,a,b,y=118,col='#FF8C2B',fs=34){if(t<a||t>b)return '';const sc=popScale(t,a)*(t>b-0.25?clamp((b-t)/0.25):1);
  return `<g transform="translate(90 ${y}) scale(${sc}) rotate(${Math.sin(t*4)*3})"><text text-anchor="middle" dominant-baseline="central" font-family="'Baloo 2'" font-weight="800" font-size="${fs}" fill="${col}" stroke="#fff" stroke-width="6" paint-order="stroke" stroke-linejoin="round">${text}</text></g>`;}
function mix(a,b,t){const p=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16));const A=p(a),B=p(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
