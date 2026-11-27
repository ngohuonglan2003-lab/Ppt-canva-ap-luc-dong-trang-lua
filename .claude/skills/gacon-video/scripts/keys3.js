const {chromium}=require('playwright');
(async()=>{const [,,file,lang,list,outp]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:720,height:1280},deviceScaleFactor:.5});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/'+file);await p.evaluate(()=>document.fonts.ready);
const ts=list.split(',').map(Number);
for(const [i,t] of ts.entries()){await p.evaluate(([t,l])=>renderAt(t,l),[t,lang]);await p.screenshot({path:`${outp}_${i}.png`});}
console.log(errs.length?errs:'ok');await b.close()})();
