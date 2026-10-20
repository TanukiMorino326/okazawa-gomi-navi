// Deterministic production export from the reviewed master; no design synthesis.
const fs = require('node:fs');
const path = require('node:path');
let sharp;
try { sharp = require('sharp'); } catch { sharp = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp')); }
const root = path.resolve(__dirname, '..');
const master = path.join(root, 'assets/icon-source/okazawa-approved-master.png');
const review = path.resolve(root, '../OkazawaGomi_アイコンレビュー_v03');
const prefix = 'icon-okazawa-v1';
async function main() {
  const { data, info } = await sharp(master).flatten({background:'#fff'}).greyscale().threshold(128).raw().toBuffer({resolveWithObject:true});
  let left=info.width,top=info.height,right=-1,bottom=-1;
  for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) if(data[y*info.width+x]<128) {left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  const width=right-left+1,height=bottom-top+1,cx=(left+right)/2,cy=(top+bottom)/2;
  let radius=0;for(let y=top;y<=bottom;y++) for(let x=left;x<=right;x++) if(data[y*info.width+x]<128) radius=Math.max(radius,Math.hypot(x-cx,y-cy));
  const cropped=await sharp(data,{raw:{width:info.width,height:info.height,channels:1}}).extract({left,top,width,height}).png().toBuffer();
  const exports=[
    {file:`${prefix}-192.png`,size:192,kind:'any'}, {file:`${prefix}-512.png`,size:512,kind:'any'},
    {file:`${prefix}-maskable-192.png`,size:192,kind:'maskable'}, {file:`${prefix}-maskable-512.png`,size:512,kind:'maskable'},
    {file:'favicon-okazawa-v1-32.png',size:32,kind:'any'}, {file:'apple-touch-icon-okazawa-v1-180.png',size:180,kind:'any'}
  ];
  for(const e of exports) {
    const scale=e.kind==='maskable' ? (e.size*0.375)/radius : e.size*0.82/Math.max(width,height);
    const w=Math.round(width*scale),h=Math.round(height*scale);
    const symbol=await sharp(cropped).resize(w,h,{kernel:'lanczos3'}).toColourspace('srgb').toBuffer();
    await sharp({create:{width:e.size,height:e.size,channels:3,background:'#ffffff'}}).composite([{input:symbol,left:Math.floor((e.size-w)/2),top:Math.floor((e.size-h)/2)}]).removeAlpha().png().toFile(path.join(root,e.file));
  }
  fs.mkdirSync(review,{recursive:true});
  fs.writeFileSync(path.join(review,'書出し仕様.json'),JSON.stringify({master:'assets/icon-source/okazawa-approved-master.png',sourceBounds:{left,top,right,bottom,radius},normalMaxExtent:0.82,maskableTargetRadius:0.375,specSafeRadius:0.4,exports},null,2));
  console.log(exports.map(e=>e.file).join('\n'));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
