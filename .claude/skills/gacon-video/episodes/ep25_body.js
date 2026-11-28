// Tập 25 · Scared of the Dark (đèn ngủ, cái bóng chỉ là cây) — giờ đi ngủ, nhạc ru
const EP={};
const LINES=[
 ['sweetly','Bedtime! Lights off!'],
 ['surprised','Eek! What is that?'],
 ['sweetly','Little Chick feels scared.'],
 ['cheerfully',"Let's turn on the night light!"],
 ['delighted','Look! It is just a tree!'],
 ['happily','Hello, tree! Good night, tree!'],
 ['sweetly','Teddy can keep me company.'],
 ['sweetly','The moon is here too.'],
 ['happily','I feel safe now.'],
 ['sweetly','Good night. Sweet dreams.'],
 ['sweetly','Sleep tight! Bye-bye!'],
];
let B;
EP.init=function(){
  B=setupEpisode(LINES,{ep:'Scared of the Dark',sub:'Sweet dreams!'});
  EP.SHOTS=shotsAt(B,[[-1,1.1,92,236,1.15,92,236],[1,1.3,120,200,1.4,124,196],[2,1.6,72,236,1.75,72,234],[3,1.2,92,236,1.25,92,236],[4,1.3,128,180,1.4,132,176],[6,1.5,76,240,1.65,76,238],[9,1.6,80,240,1.9,80,240]]);
  const A=B.at; EP.SFX=[[0,'noambience',0],[0,'lullaby',0],[A[0]+0.4,'tick',.6],[A[1],'boom',.25],[A[3]+0.2,'tick',.6],[A[3]+0.25,'ting2093',.35],[A[4],'ting2637',.3],[A[6],'pop',.3],[A[9],'ting1047',.2],[A[10],'ting784',.2]];
};
EP.main=function(t){
  if(!window.__endset){const e=document.getElementById('end'); if(e){e.style.background='#3B4C8A'; e.style.color='#FFF3C4'; window.__endset=1;}}
  const A=B.at, on=i=>lineOn(B,t,i);
  const light=t<A[0]+0.4?0.9:(t<A[3]+0.2?0.12:0.65);
  let w=bedroom(t,light);
  // cây ngoài cửa sổ (đung đưa) + bóng "quái vật" trên tường khi tối
  const sw=Math.sin(t*1.3)*4;
  w+=`<g transform="translate(${134+sw} 160)"><path d="M0 10 L0 -20 M0 -8 L-12 -22 M0 -14 L12 -26" stroke="#2A1F3D" stroke-width="3" stroke-linecap="round"/><circle cx="-12" cy="-24" r="6" fill="#2A1F3D"/><circle cx="12" cy="-28" r="7" fill="#2A1F3D"/><circle cx="0" cy="-24" r="7" fill="#2A1F3D"/></g>`;
  if(light<0.3){const op=0.55; w+=`<g transform="translate(${118+sw*3} 220) scale(2.4)" opacity="${op}"><path d="M0 10 L0 -20 M0 -8 L-12 -22 M0 -14 L12 -26" stroke="#141A33" stroke-width="3" stroke-linecap="round"/><circle cx="-12" cy="-24" r="6" fill="#141A33"/><circle cx="12" cy="-28" r="7" fill="#141A33"/><circle cx="0" cy="-24" r="7" fill="#141A33"/></g>`;}
  if(t>A[7]-0.2) w+=`<circle cx="148" cy="112" r="${7+2*Math.sin(t*2)}" fill="#FFF3C4"/><circle cx="148" cy="112" r="14" fill="#FFF3C4" opacity=".25"/>`;
  w+=bed(80,292)+nightLamp(28,290,t>A[3]+0.2?1:0);
  let ce='open', cwl=0, cwr=0, sy=1, rot=0;
  if(t<A[1])ce='happy';
  if(on(1)||on(2)){ce='wow'; rot=Math.sin(t*30)*3;}
  if(on(3))cwl=-60;
  if(t>A[4])ce='happy';
  if(t>A[6]){cwl=-30; cwr=30;}
  if(t>A[9]){ce='sleep'; sy=1+0.03*Math.sin(t*1.4);}
  w+=selChick(80,256,.44,{rot,sy,wl:cwl,wr:cwr,eyes:ce,mouth:mouthFor(B,t,'chick')},t);
  if(t>A[6]) w+=teddy(98,268,1.1);
  if(t>A[9]){for(let k=0;k<3;k++){const ph=((t*0.45+k/3)%1); w+=`<text x="${96+ph*18}" y="${232-ph*40}" font-family="'Baloo 2'" font-weight="800" font-size="${8+ph*6}" fill="#fff" stroke="${C.ink}" stroke-width="1.5" paint-order="stroke" opacity="${Math.sin(Math.PI*ph)}">z</text>`;}}
  // sao lấp lánh trong phòng khi bật đèn
  if(t>A[3]+0.2){for(let i=0;i<10;i++){const x=10+rnd(i)*160,y=40+rnd(i+5)*80; w+=`<path transform="translate(${x} ${y}) scale(${0.5+0.4*Math.sin(t*2+i)})" d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z" fill="#FFE58A" opacity=".8"/>`;}}
  let s=`<g transform="${cam(t)}">${w}</g>`;
  s+=bigWord('EEK!',t,A[1],A[2]-0.1,118,'#9B6CE0')+bigWord('JUST A TREE!',t,A[4]+0.2,A[5]-0.1,118,'#3FAE5A');
  if(t>A[9]) s+=`<rect width="180" height="320" fill="#141A33" opacity="${clamp((t-A[9])/5)*0.4}"/>`;
  return s;
};
