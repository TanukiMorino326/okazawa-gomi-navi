const fs=require('node:fs'),zlib=require('node:zlib');
// Minimal read-only PNG decoder for exported 8-bit RGB/RGBA assets (no dependencies).
module.exports=function decode(file){
 const b=fs.readFileSync(file);if(!b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error('PNG signature');
 let w,h,channels,parts=[];
 for(let p=8;p<b.length;){const n=b.readUInt32BE(p),t=b.toString('ascii',p+4,p+8),d=b.subarray(p+8,p+8+n);if(t==='IHDR'){w=d.readUInt32BE(0);h=d.readUInt32BE(4);if(d[8]!==8||![2,6].includes(d[9])||d[12]!==0)throw Error('Unsupported PNG');channels=d[9]===2?3:4;}if(t==='IDAT')parts.push(d);p+=n+12;}
 const raw=zlib.inflateSync(Buffer.concat(parts)),stride=w*channels,out=Buffer.alloc(w*h*channels);if(raw.length!==(stride+1)*h)throw Error('PNG scanline length');
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c};
 let i=0;for(let y=0;y<h;y++){const filter=raw[i++];if(filter>4)throw Error('PNG filter');for(let x=0;x<stride;x++){const at=y*stride+x,a=x>=channels?out[at-channels]:0,b=y?out[at-stride]:0,c=y&&x>=channels?out[at-stride-channels]:0;out[at]=(raw[i++]+(filter===0?0:filter===1?a:filter===2?b:filter===3?Math.floor((a+b)/2):paeth(a,b,c)))&255;}}
 return {width:w,height:h,channels,pixels:out};
};
