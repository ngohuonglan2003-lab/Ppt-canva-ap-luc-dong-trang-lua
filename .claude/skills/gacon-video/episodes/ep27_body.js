// Tập 27 · Clean Up, Clean Up! (dọn đồ chơi thành trò chơi)
const EP={};
const LINES=[
 ['surprised','Oops! Toys everywhere!'],
 ['cheerfully',"Let's clean up!"],
 ['playfully','Clean up, clean up, everybody clean up!'],
 ['cheerfully','The ball goes in the box!'],
 ['excited','The car goes in the box!'],
 ['happily','The blocks go in the box!'],
 ['delighted','The teddy goes in too!'],
 ['playfully','Clean up, clean up, all done!'],
 ['joyful','Wow! So clean! Hooray!'],
 ['cheerfully','Now we can play again!'],
 ['cheerfully','Clean up is fun! Bye-bye!'],
];
let B;
EP.init=function(){
  B=setupEpisode(LINES,{ep:'Clean Up, Clean Up!'});
  EP.SHOTS=shotsAt(B,[[-1,1.0,90,240,1.05,90,240],[1,1.25,90,250,1.3,90,250],[3,1.15,96,254,1.2,96,254],[8,1.05,90,240,1.1,90,240]]);
  const A=B.at; EP.SFX=[[A[0]-0.2,'thud',.5],[A[0],'boing',.3],[A[3]+0.9,'pop',.5],[A[4]+0.9,'pop',.5],[A[5]+0.9,'pop',.5],[A[6]+0.9,'pop',.5],[A[3]+0.95,'ting1047',.3],[A[4]+0.95,'ting1319',.3],[A[5]+0.95,'ting1568',.3],[A[6]+0.95,'ting2093',.3],[A[8],'applause',1]];
};
EP.main=function(t){
  const A=B.at, on=i=>lineOn(B,t,i);
  let w=`<rect x="-40" y="-40" width="260" height="440" fill="#FFF1DC"/><rect x="-40" y="270" width="260" height="170" fill="#E8C9A0"/><rect x="-40" y="268" width="260" height="4" fill="#D6B184"/><rect x="24" y="120" width="50" height="56" rx="4" fill="#9EDCFF" stroke="#fff" stroke-width="5"/><circle cx="60" cy="136" r="6" fill="#FFD84D"/>`;
  w+=toyBox(120,280);
  // đồ chơi: vị trí bừa bộn → bay vào thùng ở mốc câu 3..6
  const T=[[30,276,'ball'],[146,274,'car'],[54,278,'blocks'],[100,270,'teddy']];
  T.forEach(([x,y,k],i)=>{const a=A[3+i]+0.3; let px=x,py=y,r=0,show=true;
    if(t>a){const u=prog(t,a,a+0.6); px=lerp(x,120,eIO(u)); py=lerp(y,270,u)-36*Math.sin(Math.PI*u); r=u*360; if(u>=1)show=false;}
    if(t>A[9]){ show=true; const u=prog(t,A[9],A[9]+0.5); px=lerp(120,x,u); py=lerp(270,y,u)-20*Math.sin(Math.PI*u); r=0; }
    if(!show)return;
    if(k==='ball')w+=ballProp(px,py,8,r);
    if(k==='car')w+=toyCar(px,py,r,0.8,'#9B6CE0');
    if(k==='blocks')w+=`<g transform="translate(${px} ${py}) rotate(${r})"><rect x="-12" y="-8" width="11" height="10" rx="2" fill="#F2545B"/><rect x="1" y="-8" width="11" height="10" rx="2" fill="#45B6F0"/><rect x="-5" y="-18" width="11" height="10" rx="2" fill="#FFCC33"/></g>`;
    if(k==='teddy')w+=teddy(px,py,0.9);});
  let cx=t<A[1]?58:78, ce='happy', cwl=0, cwr=0, cj=0, rot=0;
  if(t<A[0]+1.2&&t>A[0]-0.3){rot=lerp(0,-30,Math.sin(Math.PI*prog(t,A[0]-0.3,A[0]+0.6))); ce='wow';}
  if(on(2)||on(7)){cj=6*Math.abs(Math.sin(t*Math.PI*1.8)); cwl=60+30*Math.sin(t*8); cwr=-60-30*Math.sin(t*8);}
  for(let i=0;i<4;i++){const a=A[3+i]+0.3; if(t>a&&t<a+0.6){cwr=-80;}}
  if(t>A[8]&&t<A[9]){cj=10*Math.abs(Math.sin(t*Math.PI*1.5)); cwl=110; cwr=-110;}
  if(t>A[10])cwr=waveWR(t,A[10]);
  w+=selChick(cx,236,.5,{rot,jump:cj,wl:cwl,wr:cwr,eyes:ce,mouth:mouthFor(B,t,'chick')},t);
  if(on(2)||on(7))w+=partyNotes(cx+20,214,t);
  if(t>A[8]&&t<A[9])for(let i=0;i<6;i++)w+=`<path transform="translate(${20+i*28} ${200+Math.sin(t*3+i)*6}) scale(${0.8+0.4*Math.sin(t*4+i)})" d="M0 -5 L1.4 -1.4 L5 0 L1.4 1.4 L0 5 L-1.4 1.4 L-5 0 L-1.4 -1.4 Z" fill="#FFD84D"/>`;
  let s=`<g transform="${cam(t)}">${w}</g>`;
  ['BALL!','CAR!','BLOCKS!','TEDDY!'].forEach((wd,i)=>{s+=bigWord(wd,t,A[3+i]+0.2,A[4+i]-0.1,118,['#F2545B','#9B6CE0','#45B6F0','#A86A3D'][i]);});
  s+=bigWord('SO CLEAN!',t,A[8],A[9]-0.1,118,'#3FAE5A');
  return s+confetti(t,A[8],3.6);
};
