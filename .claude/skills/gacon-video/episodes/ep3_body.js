// Tập 3 · Ai trốn sau bụi cây? / Who's Hiding? — con vật & tiếng kêu
const EP={INTRO:4,MAIN:41,END:39.0};
EP.LANG={
 vi:{caps:[[1.2,3.2,'Ơ! Ai trốn đó?'],[3.6,5.6,'Meo meo!'],[5.6,6.6,'Ai đây nhỉ?'],[6.8,9.6,'Là bạn Mèo!'],[10.0,12.0,'Gâu gâu!'],[12.0,13.0,'Ai đây nhỉ?'],[13.2,16.0,'Là bạn Chó!'],[16.4,18.6,'Ủm bò!'],[18.6,19.6,'Ai đây nhỉ?'],[19.8,22.6,'Là bạn Bò!'],[23.0,25.2,'Be be!'],[25.2,26.2,'Ai đây nhỉ?'],[26.4,29.2,'Là bạn Cừu!'],[29.6,30.8,'Cùng kêu nào!'],[31.0,35.0,'Meo meo! Gâu gâu! Ủm bò! Be be!'],[35.4,38.8,'Bé giỏi quá! Bye bye!']],
  name:'Gà Con',sub:'Hẹn gặp lại bé nhé!',ep:'Con gì đây?'},
 en:{caps:[[1.2,3.2,'Hey! Who is hiding?'],[3.6,5.6,'Meow meow!'],[5.6,6.6,'Who is it?'],[6.8,9.6,"It's Kitty!"],[10.0,12.0,'Woof woof!'],[12.0,13.0,'Who is it?'],[13.2,16.0,"It's Puppy!"],[16.4,18.6,'Moo moo!'],[18.6,19.6,'Who is it?'],[19.8,22.6,"It's Cow!"],[23.0,25.2,'Baa baa!'],[25.2,26.2,'Who is it?'],[26.4,29.2,"It's Sheep!"],[29.6,30.8,"Let's all sing!"],[31.0,35.0,'Meow! Woof! Moo! Baa!'],[35.4,38.8,'Well done! Bye-bye!']],
  name:'Little Chick',sub:'See you next time!',ep:"Who's Hiding?"}
};
EP.SHOTS=[
 [0,1.0, 1.15,95,250, 1.2,95,250],
 [1.0,3.4, 1.5,70,240, 1.6,68,240],
 [3.4,6.8, 1.6,122,245, 1.75,124,242],
 [6.8,10.0, 1.45,108,245, 1.5,108,245],
 [10.0,13.2, 1.6,122,245, 1.75,124,242],
 [13.2,16.4, 1.45,105,248, 1.5,105,248],
 [16.4,19.8, 1.6,122,245, 1.75,124,242],
 [19.8,23.0, 1.45,105,250, 1.5,105,250],
 [23.0,26.4, 1.6,122,245, 1.75,124,242],
 [26.4,29.6, 1.3,100,255, 1.35,100,255],
 [29.6,35.4, 1.05,90,258, 1.15,92,260],
 [35.4,99, 1.2,90,258, 1.3,90,258]];
const CH={x:48,y:236,s:.62};
const CLUE=[3.6,10.0,16.4,23.0], REV=[6.8,13.2,19.8,26.4];
const SLOT=[[74,288],[102,292],[130,288],[158,292]];
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
function bush(t){
  let sh=0; for(let k=0;k<4;k++){ if(t>CLUE[k]-0.3&&t<REV[k]) sh+=Math.sin(t*38)*2.2*(t<CLUE[k]+2.2?1:0.4);} if(t>0.2&&t<3.2) sh+=Math.sin(t*34)*2;
  const g=gust(t)*1.2;
  return `<g transform="translate(${sh+g} 0)"><circle cx="100" cy="262" r="24" fill="#2F9A4E"/><circle cx="150" cy="262" r="24" fill="#2F9A4E"/><circle cx="125" cy="248" r="32" fill="#3FAE5A"/><circle cx="104" cy="266" r="22" fill="#3FAE5A"/><circle cx="146" cy="266" r="22" fill="#3FAE5A"/><circle cx="114" cy="236" r="12" fill="#5CC46F"/><circle cx="140" cy="244" r="9" fill="#5CC46F"/><circle cx="108" cy="258" r="3" fill="#F2545B"/><circle cx="142" cy="262" r="3" fill="#FFCC33"/><circle cx="126" cy="230" r="3" fill="#FF8FA8"/></g>`;
}
EP.main=function(t){
  let w=sky(t)+hills();
  const mouthG=window.ENV?mouthAt(t+INTRO):0;
  // animals: behind bush until reveal, then hop to slot
  let back='', front='';
  for(let k=0;k<4;k++){
    const r=REV[k]; const talkSeg=(a,b)=>t>a&&t<b?Math.abs(Math.sin((t-a)*9)):0;
    let talk=talkSeg(CLUE[k],CLUE[k]+1.6)*0.9+talkSeg(r+0.2,r+0.9);
    const fin=31.0+k; talk+=talkSeg(fin,fin+0.9);
    if(t>35.4)talk+=talkSeg(35.4+k*0.15,36.4+k*0.15)*0.6;
    const blink=(t+k*0.7)%3.6>3.45;
    if(t<r){ // peeking ears during clue
      if(t>CLUE[k]){const u=Math.min(1,(t-CLUE[k])/0.4); const y=lerp(246,232,u)+Math.sin(t*10)*1.5; back+=`<g transform="translate(125 ${y}) scale(1.25)">${animal(k,0,true)}</g>`;}
      continue;}
    if(t<r+2.4){const u=eBack(prog(t,r,r+0.45)); const y=lerp(240,192,u); back+=`<g transform="translate(125 ${y}) scale(1.35) rotate(${Math.sin(t*6)*5})">${animal(k,talk,blink)}</g>`; continue;}
    const u=prog(t,r+2.4,r+3.0); let x=lerp(125,SLOT[k][0],eIO(u)), y=lerp(192,SLOT[k][1],u)-30*Math.sin(Math.PI*u);
    let sc=lerp(1.35,0.72,u);
    if(t>fin&&t<fin+0.9) y-=8*Math.sin(Math.PI*(t-fin)/0.9);
    if(t>35.4){y-=Math.max(0,Math.sin((t-35.4)*7-k))*5;}
    y+=Math.sin(t*2.5+k)*0.8;
    (u<1?back:front);
    const g=`<g transform="translate(${x} ${y}) scale(${sc}) rotate(${Math.sin(t*2+k)*3})">${animal(k,talk,blink)}</g>`;
    if(u<0.5)back+=g; else front+=g;
  }
  w+=`<defs><clipPath id="cl"><rect x="-40" y="-60" width="80" height="48"/></clipPath></defs>`;
  w+=back+bush(t)+grass(t);
  // question mark above bush during "who is it?"
  for(let k=0;k<4;k++){const a=CLUE[k]+2.0; if(t>a&&t<REV[k]){const sc=popScale(t,a); w+=`<g transform="translate(125 186) scale(${sc}) rotate(${Math.sin(t*8)*10})"><text text-anchor="middle" dominant-baseline="central" font-family="'Baloo 2'" font-weight="800" font-size="30" fill="${C.ink}" stroke="#fff" stroke-width="4" paint-order="stroke">?</text></g>`;}}
  // Gà Con
  let jump=0, wl=0, wr=0, eyes='open', lean=Math.sin(t*1.1)*2;
  for(let k=0;k<4;k++){ if(t>CLUE[k]&&t<REV[k]){lean=8; eyes=(t>CLUE[k]+2)?'wow':'open';} if(t>REV[k]&&t<REV[k]+1.2){eyes='happy';jump=8*Math.abs(Math.sin((t-REV[k])*Math.PI*1.7));wl=100;wr=-100;} }
  if(t<3.4){eyes='wow';lean=6;}
  if(t>29.6&&t<35.4){jump=5*Math.abs(Math.sin(t*Math.PI*2));eyes='happy';wl=60+30*Math.sin(t*6);wr=-60-30*Math.sin(t*6);}
  if(t>35.4){eyes='happy';const k=eOut(prog(t,35.4,35.8));wr=-k*(100+25*Math.sin((t-35.4)*2*Math.PI*2));}
  if(eyes==='open'&&(t%3.3)>3.15)eyes='blink';
  w+=`<g transform="translate(${CH.x} ${CH.y}) rotate(${lean} 0 50) scale(${CH.s})">${chick({jump,wl,wr,eyes,mouth:mouthG})}</g>`;
  w+=front+wind(t);
  let s=`<g transform="${cam(t)}">${w}</g>`;
  if(t>35.4&&t<40){const cols=['#F2545B','#45B6F0','#FFCC33','#3FAE5A','#FF8FA8'];
    for(let i=0;i<50;i++){const st=35.4+rnd(i)*1.2; if(t<st)continue; const u=t-st; const x=rnd(i+9)*180+Math.sin(u*3+i)*6; const y=-10+u*(55+rnd(i+3)*40); if(y>330)continue;
      s+=`<rect x="${x}" y="${y}" width="3.2" height="5" fill="${cols[i%5]}" transform="rotate(${(u*300+i*40)%360} ${x+1.6} ${y+2.5})"/>`;}}
  return s;
};
