// Bảng kiểm tra: chụp giữa mỗi câu + phủ vùng an toàn đỏ. node qa.js ep.html out.png
const {chromium}=require('playwright');const {execSync}=require('child_process');
(async()=>{const [,,f,out]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:720,height:1280},deviceScaleFactor:.35});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+process.cwd()+'/'+f);await p.evaluate(()=>document.fonts.ready);
 const ts=await p.evaluate(()=>[2.6,...EP.B.caps.map(c=>(c[0]+c[1])/2+INTRO),END+INTRO+1]);
 await p.evaluate(()=>{const d=document.createElement('div');d.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:99';d.innerHTML='<div style="position:absolute;left:0;right:0;top:0;height:220px;background:rgba(255,0,0,.22)"></div><div style="position:absolute;left:0;right:0;top:950px;bottom:0;background:rgba(255,0,0,.22)"></div><div style="position:absolute;top:220px;bottom:330px;right:0;width:95px;background:rgba(255,0,0,.22)"></div>';document.getElementById('stage').appendChild(d);});
 const files=[];for(const [i,t] of ts.entries()){await p.evaluate(t=>renderAt(t,'en'),t);const fn=`/tmp/qa_${i}.png`;await p.screenshot({path:fn});files.push(fn);}
 await b.close(); if(errs.length){console.error(errs);process.exit(1);}
 execSync(`ffmpeg -loglevel error -y ${files.map(x=>`-i ${x}`).join(' ')} -filter_complex "${files.map((_,i)=>`[${i}]`).join('')}hstack=${files.length}" ${out}`);
 console.log('ok',out,ts.length,'khung');})();
