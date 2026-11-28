// Xuất thông tin tập (mốc câu, targets giọng, hiệu ứng, lời thoại). Dùng: node export_meta.js ep22_x.html > ep22_meta.json
const {chromium}=require('playwright');
(async()=>{const f=process.argv[2]; const b=await chromium.launch(); const p=await b.newPage();
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+process.cwd()+'/'+f);
 const meta=await p.evaluate(()=>{const B=EP.B; const intro=['excited','Hi! [giggles] It\'s Little Chick!']; const outro=['happily','See you soon!'];
   return {file:location.pathname.split('/').pop(), name:EP.LANG.en.ep, INTRO, MAIN, END, dur:INTRO+MAIN,
     caps:B.caps, spk:B.spk, tags:B.tags,
     targets:[1.2,...B.at.map(a=>+(a+INTRO).toFixed(2)), +(END+INTRO+0.2).toFixed(2)],
     voice:[intro,...B.caps.map((c,i)=>[B.tags[i],c[2].replace(/ /g,' ')]),outro],
     words:[4,...B.caps.map(c=>wordCount(c[2])),3],
     sfx:(EP.SFX||[]).map(([t,n,g])=>[+(t+INTRO).toFixed(2),n,g])};});
 if(errs.length){console.error(errs);process.exit(1);}
 console.log(JSON.stringify(meta)); await b.close();})();
