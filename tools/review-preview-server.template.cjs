'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=__dirname,base='/okazawa-gomi-navi/';
const allowed=new Set(JSON.parse(fs.readFileSync(path.join(root,'serve-files.json'),'utf8')));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webmanifest':'application/manifest+json','.png':'image/png'};
function handle(req,res){
 const send=(code,text)=>{res.writeHead(code,{'Content-Type':'text/plain; charset=utf-8'});res.end(text)};
 if(!['GET','HEAD'].includes(req.method))return send(405,'Method not allowed');
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);}catch{return send(400,'Bad URL');}
 if(pathname==='/'){res.writeHead(302,{Location:base});return res.end();}
 if(!pathname.startsWith(base))return send(404,'Not found');
 const file=pathname.slice(base.length)||'index.html';
 if(!allowed.has(file))return send(404,'Not found');
 const data=fs.readFileSync(path.join(root,'web',file));
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':data.length,'Cache-Control':'no-cache','X-Robots-Tag':'noindex, nofollow, noarchive','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.open-meteo.com; worker-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'"});
 res.end(req.method==='HEAD'?undefined:data);
}
function createServer(){return http.createServer(handle);}
module.exports={handle,createServer,base};
if(require.main===module){const port=Number(process.env.OKAZAWA_PREVIEW_PORT||4187);const server=createServer();server.on('error',e=>{console.error(e.message);process.exitCode=1;});server.listen(port,'127.0.0.1',()=>console.log('Review-only local URL: http://127.0.0.1:'+port+base));}
