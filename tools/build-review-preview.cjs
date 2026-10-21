// Build an isolated review-only site; does not edit production source files.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),out=path.resolve(root,'../OkazawaGomi_お気に入り_実画面プレビュー'),web=path.join(out,'web');fs.mkdirSync(web,{recursive:true});
const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');const shell=JSON.parse(sw.match(/const APP_SHELL = (\[[\s\S]*?\]);/)[1]);const files=[...new Set(shell.filter(x=>x!=='./').map(x=>x.replace(/^\.\//,'')))];
const hashes={};for(const f of files){const source=fs.readFileSync(path.join(root,f));hashes[f]=crypto.createHash('sha256').update(source).digest('hex');fs.writeFileSync(path.join(web,f),source);}
let html=fs.readFileSync(path.join(web,'index.html'),'utf8');
html=html.replace(/  <script src="https:\/\/cdn\.onesignal\.com[^\n]*\r?\n/,'');
html=html.replace(/  <script>\s*window\.OneSignalDeferred[\s\S]*?<\/script>/,'  <script>window.okazawaPushReady = Promise.reject(new Error("Preview: notifications disabled")); window.okazawaPushReady.catch(() => {});</script>');
html=html.replace('</head>','  <link rel="stylesheet" href="preview-review.css">\n</head>').replace('<body>','<body>\n  <div id="preview-review-banner"><strong>PREVIEW お気に入り v01 · 公開前確認用</strong><br>本番ではありません / Review only. Notifications disabled.<br><span id="preview-offline-status">オフライン準備を確認中 / Checking offline readiness…</span><br><a href="preview-check.html">確認手順・アイコン / Checklist &amp; icons</a></div>');
html=html.replace('</body>','  <script src="preview-review.js"></script>\n</body>');
html=html.replace('</head>', '<script>if(new URLSearchParams(location.search).get("text")==="200")document.documentElement.style.fontSize="200%";if(new URLSearchParams(location.search).get("push")==="show"){const s=document.createElement("style");s.textContent=".push-card{display:flex!important}";document.head.appendChild(s);}</script></head>');
fs.writeFileSync(path.join(web,'index.html'),html);
fs.writeFileSync(path.join(web,'preview-review.css'),'#preview-review-banner{max-width:390px;margin:0 auto;padding:10px 14px;background:#eee;color:#111;font:13px/1.6 system-ui;overflow-wrap:anywhere}#preview-review-banner a{color:#111} .push-card{display:none!important}');
fs.writeFileSync(path.join(web,'preview-review.js'),`'use strict';\nconst status=document.getElementById('preview-offline-status');\nif (!('serviceWorker' in navigator)||!window.isSecureContext) { status.textContent='オフライン検証にはHTTPSが必要 / HTTPS required for offline testing'; } else { navigator.serviceWorker.ready.then(()=>{const show=()=>{status.textContent=navigator.serviceWorker.controller?'オフライン準備完了（初回オンライン読込済み） / Offline ready':'準備中：一度再読み込み / Reload once to finish offline setup';};show();navigator.serviceWorker.addEventListener('controllerchange',show);}); }\n`);
const checklist=fs.readFileSync(path.join(root,'tools/search-phone-check.html'),'utf8');
fs.writeFileSync(path.join(web,'preview-check.html'),checklist);
let previewSW=sw.replace(/okazawa-gomi-navi-v[\w-]+/, 'okazawa-gomi-preview-favorites-v01').replace('key.startsWith("okazawa-gomi-navi-")','key.startsWith("okazawa-gomi-preview-")').replace('  "./manifest.webmanifest",','  "./manifest.webmanifest",\n  "./preview-review.css",\n  "./preview-review.js",\n  "./preview-check.html",');fs.writeFileSync(path.join(web,'service-worker.js'),previewSW);
files.push('preview-review.css','preview-review.js','preview-check.html','service-worker.js');fs.writeFileSync(path.join(out,'serve-files.json'),JSON.stringify([...new Set(files)],null,2));
fs.writeFileSync(path.join(out,'source-snapshot.json'),JSON.stringify({branch:'feature/item-search',baseCommit:'b0ae31720d738898e7bd1f1d1e615160f7820d02',productionSha256:hashes,previewOnlyModified:['index.html','service-worker.js'],previewAdded:['preview-review.css','preview-review.js','preview-check.html']},null,2));
fs.copyFileSync(path.join(root,'tools/review-preview-server.template.cjs'),path.join(out,'server.cjs'));
fs.copyFileSync(path.join(root,'tools/start-review-preview.template.cmd'),path.join(out,'プレビュー起動.cmd'));
console.log(out);console.log('Public allowlisted files: '+new Set(files).size);
