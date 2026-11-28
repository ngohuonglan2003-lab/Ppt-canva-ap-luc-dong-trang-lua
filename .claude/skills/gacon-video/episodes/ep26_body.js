// Tập 26 · I Can Do It Myself! (tự xỏ giày, kiên trì)
const EP={};
const LINES=[
 ['excited',"Let's go outside!"],
 ['cheerfully','First, shoes on!'],
 ['playfully','Hmm, this is tricky!'],
 ['playfully','Grrr! It will not go!'],
 ['sweetly','Take a breath. Try again!'],
 ['cheerfully','Toes in, then push!'],
 ['delighted','One shoe on!'],
 ['excited','Now the other one!'],
 ['joyful','I did it! All by myself!'],
 ['happily','Trying again helps!'],
 ['cheerfully','You can do it too! Bye-bye!'],
];
let B;
EP.init=function(){
  B=setupEpisode(LINES,{ep:'I Can Do It Myself!'});
  EP.SHOTS=shotsAt(B,[[-1,1.1,90,240,1.15,90,240],[1,1.6,84,256,1.7,84,256],[3,1.75,80,240,1.85,80,238],[4,1.6,84,252,1.7,84,250],[8,1.05,90,240,1.15,90,240]]);
  const A=B.at; EP.SFX=[[A[1],'pop',.4],[A[2],'rustle',.3],[A[3],'boing',.3],[A[4],'whoosh',.35],[A[5]+0.6,'pop',.5],[A[6],'ting1568',.4],[A[7]+0.8,'pop',.5],[A[8],'applause',1],[A[8]+0.05,'ting2093',.4]];
};
EP.main=function(t){
  const A=B.at, on=i=>lineOn(B,t,i);
  let w=meadow(t)+`<rect x="114" y="250" width="40" height="46" rx="4" fill="#A86A3D"/><rect x="118" y="254" width="32" height="38" rx="2" fill="#8B5A2B"/><circle cx="146" cy="273" r="1.8" fill="#FFCC33"/>`;
  const shoeOnL=t>A[5]+0.6, shoeOnR=t>A[7]+0.8;
  let ce='happy', cwl=0, cwr=0, cj=0, body=C.body, rot=0;
  if(on(2)){ce='open'; rot=Math.sin(t*6)*5;}
  if(on(3)){ce='sad'; body=mix(C.body,'#FF8C6B',0.4); cj=3*Math.abs(Math.sin(t*12));}
  if(on(4)){ce='sleep';}
  if(t>A[8]&&t<A[9]){cj=10*Math.abs(Math.sin(t*Math.PI*1.5)); cwl=110; cwr=-110;}
  if(t>A[10])cwr=waveWR(t,A[10]);
  w+=selChick(80,236,.5,{rot,jump:cj,wl:cwl,wr:cwr,eyes:ce,mouth:mouthFor(B,t,'chick'),body},t);
  // giày: trước khi xỏ nằm dưới đất & lắc lư; xỏ xong nằm ở chân
  const fy=270-cj*.5;
  if(shoeOnL) w+=shoe(70,fy,0); else { const wig=(on(2)||on(3))?Math.sin(t*14)*10:0; w+=shoe(lerp(52,68,prog(t,A[5],A[5]+0.6)),278+(on(2)||on(3)?-4:0),wig); }
  if(shoeOnR) w+=shoe(92,fy,0); else w+=shoe(lerp(110,92,prog(t,A[7],A[7]+0.8)),280,t>A[7]?Math.sin(t*14)*6:0);
  if(on(3))w+=fxSteam(80,206,t);
  if(t>A[8])w+=fxHearts(80,214,t,A[8]);
  w+=wind(t);
  let s=`<g transform="${cam(t)}">${w}</g>`;
  s+=bigWord('GRRR!',t,A[3],A[4]-0.1,118,'#F2545B')+bigWord('TRY AGAIN!',t,A[4]+0.3,A[5]-0.1,118,'#45B6F0')+bigWord('I DID IT!',t,A[8],A[9]-0.1,118,'#3FAE5A');
  return s+confetti(t,A[8],4);
};
