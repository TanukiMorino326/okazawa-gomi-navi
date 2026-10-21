'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
let playwright;try{playwright=require('playwright')}catch{playwright=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))}
const root=path.resolve(__dirname,'..'),preview=path.resolve(root,'../OkazawaGomi_お気に入り_実画面プレビュー');
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
   await page.setViewportSize({width:390,height:844});
   await page.locator('[data-sort-search-clear]').click();
   const paperBox=await page.locator('[data-sort-category="paper"]').boundingBox(),favoritesBox=await page.locator('[data-sort-favorites]').boundingBox();
   assert(Math.abs(paperBox.y-favoritesBox.y)<1);assert(favoritesBox.x>paperBox.x);
   await page.screenshot({path:path.join(root,'favorites-grid-'+lang+'.png'),fullPage:true});
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
   await page.screenshot({path:path.join(root,'favorites-search-'+lang+'.png'),fullPage:true});
   await item.click();assert.equal(await page.locator('[data-sort-section="spray"] h3').evaluate(e=>e===document.activeElement),true);
   await page.locator('[data-sort-back]').click();
   assert.equal(await page.locator('#sort-search-input').inputValue(),lang==='ja'?'スプレー缶':'aerosol cans');
   assert.equal(await page.locator('#sort-search-results [data-sort-category]').count(),2);
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

  await page.locator('[data-lang="ja"]').click();
  await page.locator('#sort-search-input').fill('スプレー缶');
  await page.locator('#sort-search-results .sort-saved-row').first().locator('[data-sort-save]').click();
  assert((await page.locator('#sort-favorite-status').innerText()).includes('保存しました'));
  await page.locator('#sort-search-results .sort-saved-row').nth(1).locator('[data-sort-save]').click();
  await page.locator('[data-sort-favorites]').click();
  assert.equal(await page.locator('[data-sort-favorite-open]').count(),2);
  assert((await page.locator('.sort-search-caution').innerText()).includes('対象外で、燃やせないごみ'));
  for(const width of [320,390,768]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)}
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(root,'favorites-list-ja.png'),fullPage:true});
  await page.locator('[data-lang="en"]').click();
  assert((await page.locator('.sort-search-caution').innerText()).includes('not recyclable'));
  await page.screenshot({path:path.join(root,'favorites-list-en.png'),fullPage:true});
  await page.locator('.sort-search-caution').click();
  assert.equal(await page.locator('[data-sort-section="cans"] h3').evaluate(e=>e===document.activeElement),true);
  assert((await page.locator('[data-sort-back]').innerText()).includes('Favorites'));
  await page.locator('[data-sort-back]').click();assert.equal(await page.locator('[data-sort-favorite-open]').count(),2);
  await page.locator('[data-sort-remove]').first().click();assert.equal(await page.locator('[data-sort-favorite-open]').count(),1);
  await page.reload();await page.locator('.sort-home-button').click();await page.locator('[data-sort-favorites]').click();
  assert.equal(await page.locator('[data-sort-favorite-open]').count(),1);
  await page.locator('[data-sort-favorites-back]').click();
  await page.locator('[data-sort-category="food"]').click();await page.locator('[data-sort-save]').click();
  assert((await page.locator('#sort-favorite-status').innerText()).includes('Saved to favorites'));
  await page.locator('[data-sort-back]').click();await page.locator('[data-sort-favorites]').click();
  assert.equal(await page.locator('[data-sort-favorite-open]').count(),2);
  while(await page.locator('[data-sort-remove]').count())await page.locator('[data-sort-remove]').first().click();
  assert((await page.locator('#sort-content').innerText()).includes('No saved guidance yet'));
  await page.locator('[data-sort-favorites-back]').click();
  checks.push('favorites: correct grid position, search/detail save, exclusion label in both languages, direct open/back, delete, reload persistence and empty state');

  await page.evaluate(()=>Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('SW readiness timeout')),10000))]).then(()=>true));
  await page.reload();await page.locator('.sort-home-button').click();
  await context.setOffline(true);
  await page.locator('[data-lang="ja"]').click();await page.locator('#sort-search-input').fill('スプレー缶');
  assert.equal(await page.locator('#sort-search-results [data-sort-category]').count(),2);
  await page.reload();await page.locator('.sort-home-button').click();await page.locator('#sort-search-input').fill('スプレー缶');
  assert.equal(await page.locator('#sort-search-results [data-sort-category]').count(),2);
  await page.locator('#sort-search-results .sort-saved-row').nth(1).locator('[data-sort-save]').click();
  await page.reload();await page.locator('.sort-home-button').click();await page.locator('[data-sort-favorites]').click();
  assert.equal(await page.locator('[data-sort-favorite-open]').count(),1);
  assert((await page.locator('.sort-search-caution').innerText()).includes('対象外で、燃やせないごみ'));
  await page.locator('[data-sort-remove]').click();assert((await page.locator('#sort-content').innerText()).includes('まだ保存した案内はありません'));
  checks.push('isolated preview: search and favorites save/reload/list/delete work offline');
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(root,'favorites-search-browser-results.json'),JSON.stringify({checks,pageErrors:errors,device:'Headless Edge mobile emulation; not Galaxy hardware'},null,2));
  console.log(checks.join('\n'));
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1});
