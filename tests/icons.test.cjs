const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const decode=require('./decode-png.cjs');
const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
const extras=[{src:'favicon-okazawa-v1-32.png',size:32},{src:'apple-touch-icon-okazawa-v1-180.png',size:180}];
for(const icon of [...manifest.icons.map(x=>({...x,size:Number(x.sizes.split('x')[0])})),...extras])test('PNG dimensions, opaque white background, neutral black symbol: '+icon.src,()=>{
 const im=decode(icon.src);assert.equal(im.width,icon.size);assert.equal(im.height,icon.size);let black=0,white=0;const {width:w,height:h,channels:c,pixels:p}=im;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*c;assert.equal(p[i],p[i+1]);assert.equal(p[i],p[i+2]);if(c===4)assert.equal(p[i+3],255);if(p[i]===0)black++;if(p[i]===255)white++;if(x===0||y===0||x===w-1||y===h-1)assert.equal(p[i],255);}
 assert(black>w*h*0.04);assert(white>w*h*0.5);
});
for(const icon of manifest.icons.filter(x=>x.purpose==='maskable'))test('entire maskable symbol inside 40% radius: '+icon.src,()=>{
 const im=decode(icon.src),center=(im.width-1)/2;let radius=0;
 for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++)if(im.pixels[(y*im.width+x)*im.channels]<255)radius=Math.max(radius,Math.hypot(x-center,y-center));
 assert(radius<im.width*0.4,`${radius} exceeds safe radius ${im.width*.4}`);
});
test('manifest separates any and maskable PNGs at 192 and 512; approved PWA settings preserved',()=>{
 assert.equal(manifest.short_name,'Okazawa Gomi');assert.equal(manifest.icons.length,4);
 for(const purpose of ['any','maskable'])for(const size of [192,512]){const i=manifest.icons.find(i=>i.purpose===purpose&&i.sizes===`${size}x${size}`);assert(i);assert.equal(i.type,'image/png');assert(fs.existsSync(i.src));assert(!['icon-192.png','icon-512.png'].includes(i.src));}
});
test('favicon and Apple title/reference use new assets',()=>{
 const html=fs.readFileSync('index.html','utf8');assert(html.includes('sizes="32x32" href="favicon-okazawa-v1-32.png"'));assert(html.includes('sizes="180x180" href="apple-touch-icon-okazawa-v1-180.png"'));assert(html.includes('name="apple-mobile-web-app-title" content="Okazawa Gomi"'));assert(!/href="icon-(192|512)\.png"/.test(html));
});
test('SW install caches every icon and new manifest; version upgrade removes only app caches',async()=>{
 const handlers={},deleted=[],saved=[];const src=fs.readFileSync('service-worker.js','utf8');let promise;vm.runInNewContext(src,{self:{addEventListener:(k,f)=>handlers[k]=f,skipWaiting(){},clients:{claim(){}}},caches:{open:async name=>{assert.equal(name,'okazawa-gomi-navi-v25-search');return {addAll:async files=>saved.push(...files)}},keys:async()=>['okazawa-gomi-navi-v20','okazawa-gomi-navi-v21-sort','okazawa-gomi-navi-v22-sort','okazawa-gomi-navi-v25-search','onesignal-cache','other-app'],delete:async name=>deleted.push(name)}});
 handlers.install({waitUntil:p=>promise=p});await promise;for(const i of [...manifest.icons,...extras])assert(saved.includes('./'+i.src));assert(saved.includes('./manifest.webmanifest'));assert(!saved.includes('./icon-192.png'));assert(!saved.includes('./icon-512.png'));for(const f of saved)assert(fs.existsSync(f==='./'?'index.html':f));handlers.activate({waitUntil:p=>promise=p});await promise;assert.deepEqual(deleted,['okazawa-gomi-navi-v20','okazawa-gomi-navi-v21-sort','okazawa-gomi-navi-v22-sort']);
});
test('each new icon is returned byte-for-byte from current cache offline',async()=>{
 let handler;const src=fs.readFileSync('service-worker.js','utf8');const base='https://example.test/okazawa-gomi-navi/';vm.runInNewContext(src,{URL,Response,self:{location:{origin:'https://example.test',href:base+'service-worker.js'},addEventListener:(k,f)=>{if(k==='fetch')handler=f}},fetch:async()=>{throw Error('offline')},caches:{open:async name=>{assert.equal(name,'okazawa-gomi-navi-v25-search');return {match:async req=>{const file=new URL(typeof req==='string'?req:req.url,base).pathname.split('/').pop();return fs.existsSync(file)?new Response(fs.readFileSync(file),{headers:{'Content-Type':'image/png'}}):undefined}}}}});
 for(const i of [...manifest.icons,...extras]){let response;handler({request:{url:base+i.src,method:'GET',mode:'no-cors'},respondWith:p=>response=p});response=await response;assert.equal(response.headers.get('Content-Type'),'image/png');assert(Buffer.from(await response.arrayBuffer()).equals(fs.readFileSync(i.src)));}
});

test('existing sorting data and original styling remain unchanged',()=>{
 const crypto=require('node:crypto'),hashes=JSON.parse(fs.readFileSync('tests/fixtures/sort-v02-hashes.json','utf8'));
 for(const [file,hash]of Object.entries(hashes).filter(([file])=>file!=='app.js' && file!=='sort.js'))assert([fs.readFileSync(file,'utf8'),fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n')].some(text=>crypto.createHash('sha256').update(text).digest('hex')===hash),file);
});
