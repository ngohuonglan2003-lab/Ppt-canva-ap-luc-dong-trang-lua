// Tập 23 · Time to Leave the Park (báo trước, chào tạm biệt, về nhà)
const EP={};
const LINES=[
 ['excited','Wheee! I love the slide!'],
 ['cheerfully','Mommy says, five more slides!','mom'],
 ['excited','One, two, three, four, five!'],
 ['cheerfully','Time to go home!','mom'],
 ['playfully','No! I want to stay!'],
 ['sweetly','It is hard to leave the park.','mom'],
 ['cheerfully',"Let's say bye-bye, slide!"],
 ['happily','Bye-bye, swing! Bye-bye, sand!'],
 ['excited','We can come back tomorrow!','mom'],
 ['joyful','Hold hands, and go home!'],
 ['cheerfully','Bye-bye, park! See you tomorrow!'],
];
let B;
EP.init=function(){
  B=setupEpisode(LINES,{ep:'Time to Leave the Park'});
  EP.SHOTS=shotsAt(B,[[-1,1.1,100,236,1.15,100,236],[1,1.05,92,240,1.05,92,240],[4,1.5,96,236,1.6,96,234],[5,1.1,90,244,1.15,90,244],[9,1.0,90,240,1.05,90,240]]);
  const A=B.at; EP.SFX=[[A[0],'whoosh',.5],...[0,1,2,3,4].map(k=>[A[2]+k*0.5,'ting'+[1047,1175,1319,1568,1760][k],.35]),[A[3],'bells',.5],[A[4],'boing',.3],[A[6],'pop',.3],[A[7],'pop',.3],[A[8],'ting2093',.35],...[0,1,2,3,4,5].map(k=>[A[9]+k*0.45,'step',.35]),[A[10],'applause',1]];
};
const SL={x:96,y:290};
function swing(x,y,t,still){const a=still?0:Math.sin(t*2)*18; return `<g transform="translate(${x} ${y})"><path d="M-18 0 L-12 -60 L12 -60 L18 0" stroke="#F2545B" stroke-width="3" fill="none"/><g transform="translate(0 -60) rotate(${a})"><path d="M-6 0 L-6 40 M6 0 L6 40" stroke="#7A7A8A" stroke-width="1.2"/><rect x="-8" y="40" width="16" height="4" rx="2" fill="#45B6F0"/></g></g>`;}
EP.main=function(t){
  const A=B.at, on=i=>lineOn(B,t,i);
  let w=meadow(t)+`<ellipse cx="146" cy="300" rx="22" ry="6" fill="#F4D58D"/>`+swing(150,290,t,t>A[7]+1)+`<g transform="translate(${SL.x} ${SL.y}) scale(1.2) translate(${-SL.x} ${-SL.y})">${slideProp(SL.x,SL.y)}</g>`;
  // vị trí trượt: u 0→1
  const K=1.2, P=[[SL.x+8*K,SL.y-82*K],[SL.x+30*K,SL.y-62*K],[SL.x+46*K,SL.y-24*K],[SL.x+70*K,SL.y-6*K]];
  const slidePos=u=>{const i=Math.min(2,Math.floor(u*3)),v=u*3-i;return [lerp(P[i][0],P[i+1][0],v),lerp(P[i][1],P[i+1][1],v)];};
  let cx=60, cy=244, cr=0, ce='happy', cwl=0, cwr=0, cj=0, cs=.44;
  const ride=(a,d)=>{const u=prog(t,a,a+d); if(u<=0||u>=1)return false; const [x,y]=slidePos(eIn(u)); cx=x; cy=y-24; cr=-18; cwl=110; cwr=-110; return true;};
  if(t<A[2]){ if(!ride(A[0]-0.3,1.6)) {cx=SL.x+82; cy=264;} }
  if(t>=A[2]&&t<A[3]){ const k=Math.floor((t-A[2])/0.5); const a=A[2]+k*0.5; ride(a,0.45)||(cx=SL.x+82,cy=264); }
  if(t>=A[3]){ cx=SL.x+82; cy=264; if(t>A[3]+0.3) {cx=lerp(SL.x+82,SL.x+4,eOut(prog(t,A[3]+0.2,A[3]+0.8))); cy=lerp(264,250,prog(t,A[3]+0.2,A[3]+0.8));} }
  if(on(4)){ce='sad'; cwl=-60; cwr=60; cj=3*Math.abs(Math.sin(t*12));}
  if(on(5))ce='sad';
  if(on(6)||on(7)){ce='happy'; cwr=waveWR(t,A[6]);}
  let mx=26;
  if(t>A[9]){ const u=eIO(prog(t,A[9],A[9]+2.4)); cx=lerp(cx,30,u); mx=lerp(26,-10,u); cy=lerp(cy,250,u); cj=3*Math.abs(Math.sin(t*8)); }
  if(t>A[10]){cwr=waveWR(t,A[10]);}
  w+=momHen(mx,236,.6,{wl:on(1)||on(3)?100:0,eyes:'happy',mouth:mouthFor(B,t,'mom')});
  w+=selChick(cx,cy,cs,{rot:cr,jump:cj,wl:cwl,wr:cwr,eyes:ce,mouth:mouthFor(B,t,'chick')},t);
  if(on(4))w+=fxTears(cx,cy-8,t);
  w+=wind(t);
  let s=`<g transform="${cam(t)}">${w}</g>`;
  s+=bigWord('5 MORE!',t,A[1]+0.3,A[2]-0.1,118,'#FF8C2B');
  for(let k=0;k<5;k++){const a=A[2]+k*0.5; s+=bigNum(k+1,t,a,a+0.48);}
  s+=bigWord('BYE-BYE!',t,A[6]+0.2,A[8]-0.1,118,'#45B6F0')+bigWord('TOMORROW!',t,A[8]+0.2,A[9]-0.1,118,'#3FAE5A');
  return s+confetti(t,A[10],3);
};
