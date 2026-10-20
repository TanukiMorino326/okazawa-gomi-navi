const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const source = fs.readFileSync('app.js', 'utf8');
const notificationCode = source.slice(source.indexOf('// Do not persist an ON flag:'), source.indexOf('\n// End of notification controls.'));
const translations = source.slice(0, source.indexOf('const SPECIAL_COLLECTION'));
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };

function setup({ permission = 'granted', supported = true, missingAPI = false, integratedInit = false } = {}) {
  let now = 0, id = 0, resolveReady, rejectReady, reloads = 0, calls = 0;
  const timers = new Map(), events = {}, sdkEvents = {};
  const element = () => ({ textContent: '', disabled: false, attrs: {}, classes: new Set(),
    setAttribute(k, v) { this.attrs[k] = v; },
    addEventListener(k, fn) { this[k] = fn; },
    classList: { toggle() {} } });
  const button = element(), status = element();
  const sdk = { User: { PushSubscription: { id: null, token: null, optedIn: undefined,
    addEventListener(k, fn) { sdkEvents.subscription = fn; },
    async optIn() { calls++; }
  } }, Notifications: { permission: permission === 'granted', isPushSupported: () => supported,
    addEventListener(k, fn) { sdkEvents.permission = fn; }, async requestPermission() {} } };
  const window = { Notification: { permission },
    okazawaPushReady: new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; }),
    addEventListener(k, fn) { events[k] = fn; }, location: { reload() { reloads++; } } };
  if (missingAPI) delete window.Notification;
  const document = { visibilityState: 'visible', getElementById: k => k === 'push-subscribe' ? button : status,
    addEventListener(k, fn) { events[k] = fn; } };
  const context = vm.createContext({ window, Notification: window.Notification, document,
    Date: { now: () => now }, setTimeout(fn, delay) { timers.set(++id, { fn, at: now + delay }); return id; },
    clearTimeout(k) { timers.delete(k); } });
  if (integratedInit) {
    window.OneSignalDeferred = [];
    context.OneSignalDeferred = window.OneSignalDeferred;
    vm.runInContext(fs.readFileSync('index.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1], context);
  }
  vm.runInContext(translations + '\nlet currentLang = "ja";\n' + notificationCode, context);
  return { button, status, sdk, events, document, window, sdkEvents,
    ready: async () => { resolveReady(sdk); await flush(); },
    fail: async () => { rejectReady(new Error('init')); await flush(); },
    init: () => window.OneSignalDeferred[0](sdk),
    deadline: () => vm.runInContext('pushDeadline', context),
    state: () => vm.runInContext('pushState', context),
    lang: () => vm.runInContext('currentLang = "en"; refreshPushStatus();', context),
    complete() { Object.assign(sdk.User.PushSubscription, { id: 'id', token: 'token', optedIn: true }); },
    get calls() { return calls; }, get reloads() { return reloads; },
    suspend(ms) { now += ms; },
    async tick(ms) { const end = now + ms;
      while (true) { const next = [...timers].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break; now = next[1].at; timers.delete(next[0]); next[1].fn(); await flush(); }
      now = end; await flush(); }
  };
}

test('waits for init and delayed subscription restoration without false OFF/ON', async () => {
  const h = setup(); assert.equal(h.state(), 'checking');
  await h.ready(); assert.equal(h.state(), 'checking');
  h.complete(); await h.tick(500); assert.equal(h.state(), 'on'); assert.equal(h.button.disabled, false);
});
test('missing ID/token and timeout stay unknown; late event recovers', async () => {
  const h = setup(); await h.ready(); h.sdk.User.PushSubscription.optedIn = true;
  await h.tick(15000); assert.equal(h.state(), 'unknown'); assert.equal(h.button.disabled, false);
  h.complete(); h.sdkEvents.subscription(); assert.equal(h.state(), 'on');
});
test('permission denial overrides stale ON and recovers on permission event', async () => {
  const h = setup({ permission: 'denied' }); h.complete(); await h.ready();
  assert.equal(h.state(), 'denied');
  h.window.Notification.permission = 'granted'; h.sdk.Notifications.permission = true;
  h.sdkEvents.permission(); assert.equal(h.state(), 'on');
});
test('request is locked, language switch preserves working, delayed event completes', async () => {
  const h = setup({ permission: 'default' }); await h.ready(); assert.equal(h.state(), 'off');
  let finish;
  h.sdk.Notifications.requestPermission = () => new Promise(r => { finish = r; });
  const pending = h.button.click(); assert.equal(h.state(), 'working');
  await h.button.click(); h.lang(); assert.equal(h.button.textContent, 'Updating alerts…');
  h.window.Notification.permission = 'granted'; h.sdk.Notifications.permission = true; finish();
  await pending; assert.equal(h.calls, 1); assert.equal(h.state(), 'checking');
  h.complete(); h.sdkEvents.subscription(); assert.equal(h.state(), 'on');
});
test('SDK rejection is visible and allows retry', async () => {
  const h = setup({ permission: 'default' }); await h.ready();
  h.sdk.Notifications.requestPermission = async () => { throw new Error('network'); };
  await h.button.click(); assert.equal(h.state(), 'error'); assert.equal(h.button.disabled, false);
});
test('initialization failure and SDK load timeout can reload', async () => {
  const h = setup(); await h.fail(); assert.equal(h.state(), 'error'); await h.button.click(); assert.equal(h.reloads, 1);
  const delayed = setup(); await delayed.tick(15000); assert.equal(delayed.state(), 'recovery');
  await delayed.button.click(); assert.equal(delayed.reloads, 1);
});
test('unsupported API and unsupported SDK are distinct from OFF', async () => {
  const h = setup({ missingAPI: true }); assert.equal(h.state(), 'unavailable');
  const other = setup({ supported: false }); await other.ready(); assert.equal(other.state(), 'unavailable');
});
test('resume, pageshow, focus, online re-read state; hidden does not recheck', async () => {
  const h = setup(); h.complete(); await h.ready();
  for (const event of ['visibilitychange', 'pageshow', 'focus', 'online']) {
    h.window.Notification.permission = 'denied'; h.events[event](); assert.equal(h.state(), 'denied');
    h.window.Notification.permission = 'granted'; h.events[event](); assert.equal(h.state(), 'on');
  }
  h.document.visibilityState = 'hidden'; h.window.Notification.permission = 'denied';
  h.events.visibilitychange(); assert.equal(h.state(), 'on');
});
test('fresh app session restores state without a stored ON flag', async () => {
  for (let i = 0; i < 2; i++) { const h = setup(); await h.ready(); assert.equal(h.state(), 'checking');
    h.complete(); h.sdkEvents.subscription(); assert.equal(h.state(), 'on'); }
});
test('opt-out is actionable and optIn is never assumed successful', async () => {
  const h = setup(); h.complete(); h.sdk.User.PushSubscription.optedIn = false; await h.ready();
  assert.equal(h.state(), 'off'); await h.button.click(); assert.equal(h.calls, 1); assert.equal(h.state(), 'checking');
  await h.tick(15000); assert.equal(h.state(), 'unknown');
});
test('hanging request does not allow duplicate subscription operations', async () => {
  const h = setup({ permission: 'default' }); await h.ready();
  h.sdk.Notifications.requestPermission = () => new Promise(() => {});
  h.button.click(); await h.tick(15000); assert.equal(h.state(), 'recovery'); assert.equal(h.button.disabled, false);
  await h.button.click(); assert.equal(h.reloads, 1); assert.equal(h.calls, 0);
});

test('permission request timeout invalidates late continuation without calling optIn', async () => {
  const h = setup({ permission: 'default' }); await h.ready();
  let finish;
  h.sdk.Notifications.requestPermission = () => new Promise(r => { finish = r; });
  const pending = h.button.click(); await h.tick(15000);
  assert.equal(h.state(), 'recovery'); assert.equal(h.button.attrs['aria-busy'], 'false');
  await h.button.click(); assert.equal(h.reloads, 1);
  h.window.Notification.permission = 'granted'; h.sdk.Notifications.permission = true;
  finish(); await pending; assert.equal(h.calls, 0); assert.equal(h.state(), 'recovery');
  h.lang(); assert.equal(h.button.textContent, 'Reload and check');
});

test('timed-out optIn cannot duplicate or overwrite UI through late results and events', async () => {
  const h = setup(); h.complete(); h.sdk.User.PushSubscription.optedIn = false; await h.ready();
  let finish, calls = 0;
  h.sdk.User.PushSubscription.optIn = () => { calls++; return new Promise(r => { finish = r; }); };
  const pending = h.button.click(); await h.tick(15000);
  assert.equal(h.state(), 'recovery');
  await h.button.click(); await h.button.click(); assert.equal(calls, 1);
  h.complete(); h.sdkEvents.subscription(); h.sdkEvents.permission();
  h.events.focus(); h.events.pageshow(); assert.equal(h.state(), 'recovery');
  finish(); await pending; assert.equal(h.state(), 'recovery'); assert.equal(calls, 1);
  const fresh = setup(); fresh.complete(); await fresh.ready(); assert.equal(fresh.state(), 'on'); assert.equal(fresh.calls, 0);
});

test('late rejected optIn is handled without replacing the recovery action', async () => {
  const h = setup(); await h.ready();
  let reject;
  h.sdk.User.PushSubscription.optIn = () => new Promise((_, r) => { reject = r; });
  const pending = h.button.click(); await h.tick(15000); reject(new Error('late network failure'));
  await pending; assert.equal(h.state(), 'recovery'); assert.equal(h.button.disabled, false);
});

test('SDK script never loads: fixed initialization deadline survives event storms', async () => {
  const h = setup({ integratedInit: true }); const deadline = h.deadline();
  for (let i = 0; i < 16; i++) {
    h.events.focus({ type: 'focus' }); h.events.pageshow({ type: 'pageshow' }); h.events.online();
    h.events.visibilitychange(); await h.tick(1000);
    assert.equal(h.deadline(), deadline);
  }
  assert.equal(h.state(), 'recovery'); assert.equal(h.button.disabled, false);
  await h.button.click(); assert.equal(h.reloads, 1);
});

test('init never settles: integration timeout permits reload and ignores late success', async () => {
  const h = setup({ integratedInit: true }); let finish;
  h.sdk.init = () => new Promise(r => { finish = r; });
  const pending = h.init(); await h.tick(15000); assert.equal(h.state(), 'recovery');
  h.complete(); finish(); await pending; await flush();
  assert.equal(h.state(), 'recovery'); assert.equal(h.sdkEvents.subscription, undefined);
  await h.button.click(); assert.equal(h.reloads, 1);
});

test('late initialization failure cannot replace timeout recovery', async () => {
  const h = setup({ integratedInit: true }); let reject;
  h.sdk.init = () => new Promise((_, r) => { reject = r; });
  const pending = h.init(); await h.tick(15000); reject(new Error('late init failure'));
  await pending; await flush(); assert.equal(h.state(), 'recovery');
});

test('restoration deadline remains fixed during repeated SDK and lifecycle events', async () => {
  const h = setup(); await h.ready(); const deadline = h.deadline();
  for (let i = 0; i < 16; i++) {
    h.events.focus({}); h.events.pageshow({}); h.events.online(); h.events.visibilitychange();
    h.sdkEvents.subscription(); h.sdkEvents.permission(); await h.tick(1000);
    assert.equal(h.deadline(), deadline);
  }
  assert.equal(h.state(), 'unknown');
  for (let i = 0; i < 4; i++) { h.events.focus({}); await h.tick(1000); assert.equal(h.state(), 'unknown'); }
  h.complete(); h.sdkEvents.subscription(); assert.equal(h.state(), 'on');
});

test('post-optIn confirmation deadline is not extended by focus events', async () => {
  const h = setup(); h.complete(); h.sdk.User.PushSubscription.optedIn = false; await h.ready();
  await h.button.click(); const deadline = h.deadline();
  for (let i = 0; i < 15; i++) { h.events.focus({}); await h.tick(1000); assert.equal(h.deadline(), deadline); }
  assert.equal(h.state(), 'unknown'); assert.equal(h.button.disabled, false);
});

test('suspended timers cannot allow a late permission response to start optIn', async () => {
  const h = setup({ permission: 'default' }); await h.ready(); let finish;
  h.sdk.Notifications.requestPermission = () => new Promise(r => { finish = r; });
  const pending = h.button.click(); h.suspend(16000);
  h.window.Notification.permission = 'granted'; finish(); await pending;
  assert.equal(h.calls, 0); assert.equal(h.state(), 'recovery');
});

test('suspended init timer still rejects an expired initialization result', async () => {
  const h = setup({ integratedInit: true }); let finish;
  h.sdk.init = () => new Promise(r => { finish = r; });
  const pending = h.init(); h.suspend(16000); h.complete(); finish(); await pending; await flush();
  assert.equal(h.state(), 'recovery'); assert.equal(h.sdkEvents.subscription, undefined);
});

test('resume after suspended operation timeout exposes recovery before re-registration', async () => {
  const h = setup(); await h.ready();
  h.sdk.User.PushSubscription.optIn = () => new Promise(() => {});
  h.button.click(); h.suspend(16000); h.events.focus({});
  assert.equal(h.state(), 'recovery'); await h.button.click(); assert.equal(h.reloads, 1);
});
test('index readiness only resolves after init and catches rejection', async () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const inline = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const fails of [false, true]) {
    const window = { OneSignalDeferred: [] };
    vm.runInNewContext(inline, { window, OneSignalDeferred: window.OneSignalDeferred });
    let finish; const waiting = new Promise((resolve, reject) => { finish = fails ? reject : resolve; });
    let settled = false;
    const result = window.okazawaPushReady.then(() => { settled = true; return 'ready'; }, () => 'error');
    const invocation = window.OneSignalDeferred[0]({ init: () => waiting });
    await flush(); assert.equal(settled, false); finish(fails ? new Error('init') : undefined);
    await invocation; assert.equal(await result, fails ? 'error' : 'ready');
  }
});

test('collection, calendar, language and weather retain expected data after layout migration', async () => {
  const h = require('./helpers/app-context.cjs').setup(); await h.flush();
  for (const lang of ['ja', 'en']) {
    h.lang(lang); h.eval('renderWeek(); renderCalendar();');
    const today = h.node('#today-content').innerHTML;
    assert(today.includes(lang === 'ja' ? '燃やせるごみ' : 'Burnable Waste'));
    assert(today.includes(lang === 'ja' ? '生ごみ' : 'Food Waste'));
    assert.equal((h.node('#week-list').innerHTML.match(/class="week-row/g) || []).length, 7);
    assert.equal((h.node('#calendar-grid').innerHTML.match(/data-date=/g) || []).length, 31);
    assert(h.node('#weather-content').innerHTML.includes('23° / 10°'));
    assert(h.node('#weather-content').innerHTML.includes('19° / 11°'));
  }
});
