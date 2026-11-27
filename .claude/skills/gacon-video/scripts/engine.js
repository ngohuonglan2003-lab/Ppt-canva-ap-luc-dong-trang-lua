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
  else if(eyes==='sad'){ s+=`<circle cx="-22" cy="-10" r="8" fill="${C.eye}"/><circle cx="22" cy="-10" r="8" fill="${C.eye}"/><circle cx="-19" cy="-13" r="2.6" fill="#fff"/><circle cx="25" cy="-13" r="2.6" fill="#fff"/><path d="M-32 -26 L-14 -22 M32 -26 L14 -22" stroke="${C.eye}" stroke-width="3.5" stroke-linecap="round"/>`; }
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
