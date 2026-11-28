// Tập 22 · Bye-Bye, Mommy! (đi nhà trẻ, sợ xa mẹ) — khuôn tự động: LINES → mốc thời gian
const EP={};
const LINES=[
 ['sweetly','Today is a big day!'],
 ['curious','Little Chick goes to daycare.'],
 ['sweetly',"Oh no! Don't go, Mommy!"],
 ['sweetly','Mommy always comes back.','mom'],
 ['cheerfully',"Let's do our goodbye. A big hug!",'mom'],
 ['happily','A kiss!','mom'],
 ['cheerfully','And a wave! Bye-bye, Mommy!'],
 ['excited','Look! Duckie is here!'],
 ['delighted',"Let's play with blocks!"],
 ['joyful','Mommy is back! Hooray!'],
 ['cheerfully','Mommy always comes back! Bye-bye!'],
];
let B;
EP.init=function(){
  B=setupEpisode(LINES,{ep:'Bye-Bye, Mommy!'});
  EP.SHOTS=shotsAt(B,[[-1,1.05,90,245,1.1,92,245],[2,1.6,70,236,1.7,70,234],[3,1.35,74,240,1.4,74,240],[7,1.1,100,248,1.2,100,248],[9,1.0,90,240,1.05,90,240],[10,1.15,90,248,1.2,90,248]]);
  const A=B.at; EP.SFX=[[A[0],'step',.4],[A[0]+0.5,'step',.4],[A[0]+1,'step',.4],[A[0]+1.5,'step',.4],[A[3],'ting',.3],[A[4]+0.6,'pop',.4],[A[5]+0.2,'ting2093',.35],[A[6]+0.8,'whoosh',.3],[A[7],'quack',.4],[A[8]+0.6,'pop',.4],[A[8]+1.4,'pop',.4],[A[8]+2.2,'pop',.4],[A[9]-0.6,'whoosh',.4],[A[9],'applause',1],[A[9]+0.1,'ting2349',.35]];
};
function daycare(){return `<g><rect x="112" y="196" width="64" height="76" rx="4" fill="#FFE8C2"/><path d="M106 200 L144 170 L182 200 Z" fill="#F2545B"/><rect x="134" y="236" width="20" height="36" rx="3" fill="#A86A3D"/><circle cx="150" cy="255" r="1.6" fill="#FFCC33"/><rect x="118" y="208" width="14" height="14" rx="2" fill="#9EDCFF"/><rect x="156" y="208" width="14" height="14" rx="2" fill="#9EDCFF"/><rect x="124" y="182" width="40" height="11" rx="3" fill="#fff"/><text x="144" y="191" text-anchor="middle" font-family="'Baloo 2'" font-weight="800" font-size="8" fill="#F2545B">DAYCARE</text></g>`;}
EP.main=function(t){
  const A=B.at, on=i=>lineOn(B,t,i);
  let w=meadow(t)+daycare();
  // vị trí
  let mx=lerp(-30,46,eOut(prog(t,A[0]-0.8,A[1]))), cx=lerp(-10,92,eOut(prog(t,A[0]-0.6,A[1]+0.4)));
  if(t>A[2]) cx=lerp(92,74,eOut(prog(t,A[2],A[2]+0.4)));
  if(t>A[4]) cx=lerp(74,66,eOut(prog(t,A[4],A[4]+0.3)));
  if(t>A[6]+0.6){mx=lerp(46,-50,eIn(prog(t,A[6]+0.6,A[7]))); cx=lerp(66,84,eOut(prog(t,A[6],A[6]+0.6)));}
  if(t>A[9]-0.6){mx=lerp(-50,46,eOut(prog(t,A[9]-0.6,A[9]+0.4)));}
  const sunX=t>A[9]-1.2&&t<A[9]?1:0;
  // Mẹ Gà & Gà Con
  let ce='happy', cwl=0, cwr=0, cj=0, me='happy', mwl=0, mwr=0;
  if(t<A[2]) {cj=(t<A[1]+0.4)?3*Math.abs(Math.sin(t*8)):0;}
  if(on(2)||on(3)){ce='sad'; cwl=-40;}
  if(on(4)){mwr=40; cwl=-50; cwr=50;}
  if(on(6)){cwr=waveWR(t,A[6]); mwl=t<A[7]?110:0;}
  if(on(7)||on(8)){ce='happy'; cj=on(8)?3*Math.abs(Math.sin(t*6)):0;}
  if(on(9)){cj=10*Math.abs(Math.sin(t*Math.PI*1.5)); cwl=110; cwr=-110;}
  if(t>A[10]){cwr=waveWR(t,A[10]); mwr=-(100+25*Math.sin(t*12));}
  w+=momHen(mx,232,.66,{wl:mwl,wr:mwr,eyes:me,mouth:mouthFor(B,t,'mom')});
  if(t>A[7]-0.2){const u=eBack(prog(t,A[7]-0.2,A[7]+0.3)); w+=duckStand(lerp(150,128,u),268-(on(8)?3*Math.abs(Math.sin(t*6+1)):0),{s:1.3,flap:on(7)?Math.abs(Math.sin(t*9)):0,eyes:'happy',quack:0});}
  if(t>A[8]){let n=0; for(let k=0;k<3;k++) if(t>A[8]+0.6+k*0.8) n=k+1; if(t>A[9]) n=3; w+=towerProp(108,296,n,0);}
  w+=selChick(cx,242,.48,{jump:cj,wl:cwl,wr:cwr,eyes:ce,mouth:mouthFor(B,t,'chick')},t);
  if(on(2)||on(3))w+=fxTears(cx,230,t);
  if(on(4)||on(5))w+=fxHearts((mx+cx)/2,204,t,A[4]);
  if(on(5)&&t>A[5]+0.2){const sc=popScale(t,A[5]+0.2); w+=`<path transform="translate(${cx+8} 212) scale(${sc*1.4})" d="M0 5 C -7 0, -6 -6, 0 -3 C 6 -6, 7 0, 0 5 Z" fill="#F2545B"/>`;}
  w+=wind(t);
  let s=`<g transform="${cam(t)}">${w}</g>`;
  s+=bigWord('BIG HUG',t,A[4]+0.4,A[5]-0.1,118,'#FF8FA8')+bigWord('KISS!',t,A[5],A[6]-0.1,118,'#F2545B')+bigWord('WAVE!',t,A[6],A[7]-0.2,118,'#45B6F0');
  if(t>A[9]-1.2&&t<A[9]) s+=`<rect width="180" height="320" fill="#FFF3C4" opacity="${0.5*Math.sin(Math.PI*prog(t,A[9]-1.2,A[9]))}"/>`+bigWord('LATER…',t,A[9]-1.1,A[9]-0.05,118,'#FF8C2B');
  return s+confetti(t,A[9],4);
};
