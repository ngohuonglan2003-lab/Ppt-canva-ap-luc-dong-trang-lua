// Tập 4 · Chia bánh nhé! / Let's Share! — biết chia sẻ
const EP={INTRO:4,MAIN:40,END:37.2};
EP.LANG={
 vi:{caps:[[1.2,3.2,'Bánh của tớ!'],[3.4,6.8,'Ơ! Ai cũng muốn ăn!'],[7.0,10.6,'A! Tớ có cách rồi!'],[10.8,14.6,'Bẻ đôi nào!'],[15.0,17.4,'Một nửa cho bạn!'],[17.5,20.0,'Một nửa cho tớ!'],[20.4,23.8,'Măm măm! Ngon\u00A0quá!'],[24.2,27.6,'Cảm ơn cậu nhé!'],[28.0,32.6,'Chia nhau thật vui!'],[33.0,36.8,'Bé cũng chia sẻ nhé! Bye bye!']],
  name:'Gà Con',sub:'Hẹn gặp lại bé nhé!',ep:'Biết chia sẻ'},
 en:{caps:[[1.2,3.2,'My cookie!'],[3.4,6.8,'Uh-oh! We both want it!'],[7.0,10.6,'I have an idea!'],[10.8,14.6,"Let's break it in two!"],[15.0,17.4,'Half for you!'],[17.5,20.0,'And half for me!'],[20.4,23.8,'Yum yum! So yummy!'],[24.2,27.6,'Thank you, friend!'],[28.0,32.6,'Sharing is fun!'],[33.0,36.8,"Let's share too! Bye-bye!"]],
  name:'Little Chick',sub:'See you next time!',ep:"Let's Share!"}
};
EP.SHOTS=[
 [0,1.2, 1.05,92,250, 1.1,92,250],
 [1.2,3.4, 1.55,94,242, 1.65,94,242],
 [3.4,7.0, 1.08,92,250, 1.12,92,250],
 [7.0,10.8, 1.6,62,228, 1.75,60,226],
 [10.8,15.0, 1.75,94,240, 1.9,94,240],
 [15.0,20.2, 1.08,92,250, 1.15,92,250],
 [20.2,24.2, 1.2,90,248, 1.3,90,248],
 [24.2,28.0, 1.6,128,240, 1.75,128,238],
 [28.0,33.0, 1.1,92,250, 1.25,92,250],
 [33.0,99, 1.25,92,248, 1.35,92,248]];
const SP=[[24.2,27.6]]; // câu do bạn Vịt nói
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
function cookie(x,y,r,part,bite){ // part: 'full' | 'L' | 'R'; bite = số miếng đã cắn
  const chips=[[-4,-3],[3,2],[-1,5],[5,-4],[-6,3]]; const id='ck'+part;
  const side=part==='L'?-1:1;
  let mask=`<mask id="${id}m" maskUnits="userSpaceOnUse" x="-40" y="-40" width="80" height="80"><rect x="-40" y="-40" width="80" height="80" fill="#fff"/>`;
  if(part!=='full'){mask+=`<path d="M${side*-40} -40 L1 -40 L-2 -8 L2 0 L-1 9 L1 40 L${side*-40} 40 Z" fill="#000"/>`;}
  for(let k=0;k<bite;k++){const a=-0.9+k*0.8; mask+=`<circle cx="${side*Math.cos(a)*r}" cy="${Math.sin(a)*r}" r="${r*0.36}" fill="#000"/>`;}
  mask+='</mask>';
  let g=`<g transform="translate(${x} ${y})"><defs>${mask}</defs><g mask="url(#${id}m)"><circle r="${r}" fill="#D9A066"/><circle r="${r*0.8}" fill="#E5B27A"/>`;
  chips.forEach(([a,b])=>g+=`<circle cx="${a*r/10}" cy="${b*r/10}" r="${r*0.13}" fill="#6B3F24"/>`);
  return g+'</g></g>';
}
EP.main=function(t){
  let w=sky(t)+hills()+grass(t);
  // picnic blanket
  w+=`<g><path d="M18 270 L166 270 L178 306 L6 306 Z" fill="#F2545B"/>`;
  for(let i=0;i<8;i++){w+=`<path d="M${18+i*18.5} 270 L${27+i*18.5} 270 L${24+i*21.5} 306 L${14+i*21.5} 306 Z" fill="#fff" opacity=".55"/>`;}
  w+=`<path d="M12 282 L172 282 L174 290 L10 290 Z" fill="#fff" opacity=".45"/></g>`;
  const inSp=SP.some(([a,b])=>t>a&&t<b);
  const mv=window.ENV?mouthAt(t+INTRO):0;
  const mouthG=inSp?0:mv, quackD=inSp?mv:0;
  // positions
  let gx=54, dx=136; if(t>28){const u=eIO(prog(t,28,28.8)); gx=lerp(54,68,u); dx=lerp(136,118,u);}
  // cookie state
  let tug=0; if(t<7)tug=Math.sin(t*9)*3*(t>0.8?1:0);
  let eyesG='open', eyesD='open', wl=0, wr=0, jump=0, flap=0;
  if(t>0.8&&t<7){eyesG='sad';eyesD='sad'; wr=-40+tug*4; flap=0.4;}
  if(t<1.2){eyesG='wow';}
  if(t>7&&t<10.8){eyesG='happy'; wl=110*eOut(prog(t,7,7.3)); jump=t<8?6*Math.abs(Math.sin((t-7)*Math.PI*2)):0;}
  if(t>10.8&&t<15){wr=-60; wl=60;}
  if(t>15&&t<17.5){eyesD='happy'; wr=-70;}
  if(t>17.5&&t<20){eyesG='happy'; wl=50;}
  if(t>20.4&&t<23.8){eyesG='happy';eyesD='happy'; jump=3*Math.abs(Math.sin(t*Math.PI*2));}
  if(t>24.2&&t<27.6){eyesD='happy'; flap=Math.abs(Math.sin(t*6));}
  if(t>28&&t<33){eyesG='happy';eyesD='happy'; wr=-15; flap=0.3;}
  if(t>33){eyesG='happy';eyesD='happy';const k=eOut(prog(t,33,33.4));wl=k*(100+25*Math.sin((t-33)*2*Math.PI*2)); flap=(Math.sin(t*12)+1)/2;}
  if(eyesG==='open'&&(t%3.3)>3.15)eyesG='blink';
  w+=`<g transform="translate(${gx} 238) rotate(${Math.sin(t*1.1)*2} 0 50) scale(.62)">${chick({jump,wl,wr,eyes:eyesG,mouth:mouthG})}</g>`;
  w+=duckStand(dx,262-(t>20.4&&t<23.8?2*Math.abs(Math.sin(t*Math.PI*2)):0),{s:1.8,flap,quack:quackD,eyes:eyesD});
  // cookie drawing
  if(t<11.4){ const cx=95+tug, cy=242+(t>10.8?-6*eOut(prog(t,10.8,11.2)):0); w+=cookie(cx,cy,13,'full',0);
    if(t>10.8){const sh=Math.sin(t*50)*1; w=w;} }
  else {
    const u=eOut(prog(t,11.4,12.0));
    let Lx=lerp(94,88,u), Rx=lerp(96,102,u), Ly=236, Ry=236;
    if(t>15){const v=eIO(prog(t,15,15.8)); Rx=lerp(102,dx-16,v); Ry=lerp(236,246,v);}
    if(t>17.5){const v=eIO(prog(t,17.5,18.3)); Lx=lerp(88,gx+22,v); Ly=lerp(236,246,v);}
    const biteL=t>20.6?Math.min(3,Math.floor((t-20.6)/1.0)+1):0, biteR=t>21.0?Math.min(3,Math.floor((t-21.0)/1.0)+1):0;
    const scL=t>23.4?clamp(1-(t-23.4)/0.4):1, scR=t>23.6?clamp(1-(t-23.6)/0.4):1;
    if(scL>0)w+=`<g transform="translate(${Lx} ${Ly}) scale(${scL}) translate(${-Lx} ${-Ly})">${cookie(Lx,Ly,13,'L',biteL)}</g>`;
    if(scR>0)w+=`<g transform="translate(${Rx} ${Ry}) scale(${scR}) translate(${-Rx} ${-Ry})">${cookie(Rx,Ry,13,'R',biteR)}</g>`;
    // crumbs at break
    if(t<12.2){for(let i=0;i<8;i++){const uu=t-11.4; w+=`<circle cx="${95+(rnd(i)-.5)*30*uu}" cy="${240+uu*40*rnd(i+3)}" r="1.2" fill="#B5844D"/>`;}}
  }
  // lightbulb
  if(t>7&&t<10.6){const sc=popScale(t,7.1); w+=`<g transform="translate(${gx+2} 180) scale(${sc})"><circle r="9" fill="#FFE066"/><rect x="-4" y="8" width="8" height="5" rx="1.5" fill="#AEB8C4"/>`+[0,60,120,180,240,300].map(a=>`<rect x="-1" y="-17" width="2" height="5" rx="1" fill="#FFE066" transform="rotate(${a+t*40})"/>`).join('')+`</g>`;}
  // tug sweat drops
  if(t>1.2&&t<7){w+=`<path d="M${gx+26} ${206+Math.sin(t*3)*2} q-2 3 0 5 q2 -2 0 -5 Z" fill="#9ED8F5"/>`;}
  // hearts
  if(t>28){for(let i=0;i<6;i++){const st=28.3+i*0.6; if(t<st)continue; const u=(t-st)%3.6; const x=92+Math.sin(u*3+i)*14+(i%2?8:-8), y=225-u*26; const sc=0.8+0.3*Math.sin(u*5);
    w+=`<path transform="translate(${x} ${y}) scale(${sc})" d="M0 5 C -7 0, -6 -6, 0 -3 C 6 -6, 7 0, 0 5 Z" fill="${['#F2545B','#FF8FA8'][i%2]}" opacity="${clamp(1-u/3.6)}"/>`;}}
  w+=wind(t);
  return `<g transform="${cam(t)}">${w}</g>`;
};
