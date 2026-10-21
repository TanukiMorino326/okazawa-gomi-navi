'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
let playwright;try{playwright=require('playwright')}catch{playwright=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))}
const root=path.resolve(__dirname,'..'),preview=path.resolve(root,'../OkazawaGomi_品目検索_実画面プレビュー');
const {createServer,base}=require(path.join(preview,'server.cjs'));
(async()=>{
 const server=createServer();let browser;
 const checks=[],errors=[];
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const origin='http://127.0.0.1:'+server.address().port;
  browser=await playwright.chromium.launch({headless:true,channel:'msedge'});
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/*',route=>route.request().url().startsWith(origin+'/')?route.continue():route.abort());
  await page.goto(origin+base);await page.locator('.sort-home-button').click();
  for(const lang of ['ja','en']){
   await page.locator('[data-lang="'+lang+'"]').click();
   await page.locator('#sort-search-input').fill(lang==='ja'?'スプレー缶':'aerosol cans');
   const item=page.locator('#sort-search-results .sort-search-item'),caution=page.locator('#sort-search-results .sort-search-caution');
   assert.equal(await item.count(),1);assert.equal(await caution.count(),1);
   assert((await caution.innerText()).includes(lang==='ja'?'対象外':'not recyclable'));
   for(const width of [320,375,390,412,768]){
    await page.setViewportSize({width,height:844});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    const input=await page.locator('#sort-search-input').boundingBox();assert(input.width>150);
    checks.push(lang+': no overflow at '+width);
   }
   await page.setViewportSize({width:390,height:844});
   await page.screenshot({path:path.join(root,'search-mobile-v02-'+lang+'.png'),fullPage:true});
   await item.click();assert.equal(await page.locator('[data-sort-section="spray"] h3').evaluate(e=>e===document.activeElement),true);
   await page.locator('[data-sort-back]').click();
   assert.equal(await page.locator('#sort-search-input').inputValue(),lang==='ja'?'スプレー缶':'aerosol cans');
   assert.equal(await page.locator('#sort-search-results button').count(),2);
   assert.equal(await page.locator('#sort-search-results .sort-search-item').evaluate(e=>e===document.activeElement),true);
   await page.locator('#sort-search-results .sort-search-caution').click();
   assert.equal(await page.locator('[data-sort-section="cans"] h3').evaluate(e=>e===document.activeElement),true);
   await page.locator('[data-sort-back]').click();
   await page.locator('#sort-search-input').fill(lang==='ja'?'哺乳びん':'baby feeding bottles');
   assert.equal(await page.locator('#sort-search-results .sort-search-caution').count(),1);
   assert.equal(await page.locator('#sort-search-results .sort-search-item').count(),0);
   await page.locator('#sort-search-input').fill('xyz未登録');
   assert((await page.locator('#sort-search-results').innerText()).includes(lang==='ja'?'該当する案内がありません':'No guidance found'));
   await page.locator('[data-sort-search-clear]').click();
   assert.equal(await page.locator('#sort-search-input').inputValue(),'');
   assert.equal(await page.locator('.sort-grid [data-sort-category]').count(),8);
   for(const id of ['burnable','food','nonburnable']){
    await page.locator('.sort-grid [data-sort-category="'+id+'"]').click();
    assert.equal(await page.locator('.sort-examples li').count(),4);
    assert.equal(await page.locator('a[href*="syuusekijyo.html"]').count(),1);
    await page.locator('[data-sort-back]').click();
   }
   await page.locator('#sort-search-input').fill(lang==='ja'?'スプレー缶':'aerosol cans');
   await page.evaluate(()=>document.documentElement.style.fontSize='200%');
   await page.setViewportSize({width:320,height:844});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.evaluate(()=>document.documentElement.style.fontSize='');
   checks.push(lang+': labels, exclusions, section jump, restored results/focus, no results, clear, 8 cards, 3 bag samples, CSS 200% at 320px');
  }
  await page.evaluate(()=>Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('SW readiness timeout')),10000))]).then(()=>true));
  await page.reload();await page.locator('.sort-home-button').click();
  await context.setOffline(true);
  await page.locator('[data-lang="ja"]').click();await page.locator('#sort-search-input').fill('スプレー缶');
  assert.equal(await page.locator('#sort-search-results button').count(),2);
  await page.reload();await page.locator('.sort-home-button').click();await page.locator('#sort-search-input').fill('スプレー缶');
  assert.equal(await page.locator('#sort-search-results button').count(),2);
  checks.push('isolated preview: cached search and reload work offline');
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(root,'search-browser-results-v02.json'),JSON.stringify({checks,pageErrors:errors,device:'Headless Edge mobile emulation; not Galaxy hardware'},null,2));
  console.log(checks.join('\n'));
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1});
