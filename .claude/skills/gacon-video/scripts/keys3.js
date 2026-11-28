const {chromium}=require('playwright');
(async()=>{const [,,file,lang,list,outp]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:720,height:1280},deviceScaleFactor:.5});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/'+file);await p.evaluate(()=>document.fonts.ready);
const ts=list.split(',').map(Number);
for(const [i,t] of ts.entries()){await p.evaluate(([t,l])=>renderAt(t,l),[t,lang]);if(process.env.SAFE)await p.evaluate(()=>{if(document.getElementById('safez'))return;const d=document.createElement('div');d.id='safez';d.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:99';d.innerHTML='<div style="position:absolute;left:0;right:0;top:0;height:220px;background:rgba(255,0,0,.25)"></div><div style="position:absolute;left:0;right:0;top:950px;bottom:0;background:rgba(255,0,0,.25)"></div><div style="position:absolute;top:220px;bottom:330px;right:0;width:95px;background:rgba(255,0,0,.25)"></div>';document.getElementById('stage').appendChild(d);});
 await p.screenshot({path:`${outp}_${i}.png`});}
console.log(errs.length?errs:'ok');await b.close()})();
