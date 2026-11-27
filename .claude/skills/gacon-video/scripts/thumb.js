// node thumb.js <anim.html> <lang> <out.png> <title> <numbers> <badge>
const {chromium}=require('playwright');
const [,,page,lang,out,title,nums,badge]=process.argv;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:720,height:1280},deviceScaleFactor:1.5});
await p.goto('file://'+process.cwd()+'/'+page);await p.evaluate(()=>document.fonts.ready);
await p.evaluate(([title,nums,badge])=>{
 document.querySelectorAll('#logo,#ep,#cap,#end,#flash').forEach(e=>e.style.display='none');
 let w=sky(3.2,70)+hills()+grass(1.0);
 const ap=[[48,258],[90,266],[132,258]];
 w+=`<g transform="translate(90 212) scale(.8)">${chick({eyes:'happy',wl:110,wr:-110,mouth:.8})}</g>`;
 if(typeof EP!=='undefined'&&EP.thumb){w+=EP.thumb();} else ap.forEach(([x,y],i)=>{w+=apple(x,y,1.25,(i-1)*12)});
 for(let k=0;k<10;k++){const x=15+((k*37)%150), y=150+((k*53)%70); w+=`<path transform="translate(${x} ${y}) scale(${.6+(k%3)*.25})" d="M0 -5 L1.4 -1.4 L5 0 L1.4 1.4 L0 5 L-1.4 1.4 L-5 0 L-1.4 -1.4 Z" fill="#fff"/>`;}
 document.getElementById('svg').innerHTML=w;
 const st=document.getElementById('stage');
 const cols=['#FF8C2B','#F2545B','#45B6F0','#3FAE5A','#B06CE0'];
 const N=nums.split(' ');
 const ov=document.createElement('div');
 ov.style.cssText='position:absolute;left:0;right:0;top:120px;display:flex;flex-direction:column;align-items:center;gap:0;font-family:"Baloo 2";font-weight:800;';
 const sh=(c,w)=>`0 ${w+3}px 0 ${c},${w}px 0 0 ${c},-${w}px 0 0 ${c},0 -${w}px 0 ${c},${w}px ${w}px 0 ${c},-${w}px ${w}px 0 ${c},${w}px -${w}px 0 ${c},-${w}px -${w}px 0 ${c}`;
 ov.innerHTML=`<div style="font-size:${title.length>8?96:120}px;line-height:1;color:#fff;text-shadow:${sh('#1D3557',7)};transform:rotate(-3deg)">${title}</div>
 <div style="display:flex;gap:${N.length>3?18:30}px;margin-top:6px">${N.map((n,i)=>`<span style="font-size:${N.length>3?200:230}px;line-height:1;color:${cols[i%5]};text-shadow:${sh('#fff',9)},0 18px 0 rgba(29,53,87,.35);display:inline-block;transform:rotate(${(i%2?6:-6)}deg) translateY(${i%2?20:0}px)">${n}</span>`).join('')}</div>`;
 st.appendChild(ov);
 const bd=document.createElement('div');
 bd.style.cssText='position:absolute;left:50%;transform:translateX(-50%) rotate(-2deg);top:1150px;background:#FFCC33;color:#1D3557;border-radius:40px;padding:12px 44px 4px;font-family:"Baloo 2";font-weight:800;font-size:64px;white-space:nowrap;box-shadow:0 8px 0 #1D3557;border:5px solid #1D3557';
 bd.textContent=badge; st.appendChild(bd);
},[title,nums,badge]);
await p.waitForTimeout(300);
await p.screenshot({path:out});await b.close();console.log('ok',out)})();
