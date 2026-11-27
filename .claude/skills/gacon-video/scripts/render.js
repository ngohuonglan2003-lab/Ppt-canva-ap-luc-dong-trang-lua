const {chromium}=require('playwright');const {spawn}=require('child_process');
const lang=process.argv[2], out=process.argv[3], PREVIEW=process.argv[5]==='preview', FPS=PREVIEW?15:30, DUR=Number(process.env.DUR||44);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:720,height:1280},deviceScaleFactor:PREVIEW?0.5:1.5});
await p.goto('file://'+process.cwd()+'/'+(process.env.EP_FILE||'anim2.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
const ff=spawn('ffmpeg',['-loglevel','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-i',process.argv[4]||'music_sfx.wav',
 '-c:v','libx264','-preset','medium','-crf',PREVIEW?'32':'19','-pix_fmt','yuv420p','-r',String(FPS),'-c:a','aac','-b:a',PREVIEW?'64k':'160k','-shortest','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
const n=FPS*DUR; await p.evaluate(([l,e])=>{window.__l=l;window.ENV=e},[lang,(require('fs').existsSync((process.env.ENV_DIR||'voice')+'/env_'+lang+'.json')?JSON.parse(require('fs').readFileSync((process.env.ENV_DIR||'voice')+'/env_'+lang+'.json','utf8')):null)]);
for(let i=0;i<n;i++){await p.evaluate(t=>renderAt(t,window.__l),i/FPS).catch(()=>{});
 if(i===0)await p.evaluate(l=>{window.__l=l;renderAt(0,l)},lang);
 const buf=await p.screenshot({type:'jpeg',quality:PREVIEW?70:92});
 if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
 if(i%300===0)console.log(lang,i);}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done',out)})();
