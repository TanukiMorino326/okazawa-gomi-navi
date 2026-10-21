const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const base = 'https://example.test/okazawa-gomi-navi/';
const source = fs.readFileSync('service-worker.js', 'utf8');
function worker({ entries = {}, online, cacheError = false } = {}) {
  const handlers = {}, opened = [], written = [];
  const cache = {
    async match(request) {
      return entries[typeof request === 'string' ? request : request.url];
    },
    async put(request, response) { written.push([request.url, response]); }
  };
  vm.runInNewContext(source, {
    URL, Response,
    self: { location: { origin: 'https://example.test', href: base + 'service-worker.js' },
      addEventListener: (name, handler) => { handlers[name] = handler; } },
    fetch: async () => { if (online) return online; throw new TypeError('offline'); },
    caches: { async open(name) { opened.push(name); if (cacheError) throw Error('cache'); return cache; } }
  });
  return {
    opened, written,
    async request(path, { mode = 'no-cors', method = 'GET', external = false } = {}) {
      let result;
      handlers.fetch({ request: { url: external ? path : base + path, mode, method },
        respondWith(promise) { result = promise; } });
      return result === undefined ? undefined : await result;
    }
  };
}
for (const resource of ['missing.js', 'missing.css', 'missing.json', 'missing.png', 'missing.woff2']) {
  test('offline missing ' + resource + ' never receives HTML', async () => {
    const w = worker({ entries: { [base + 'index.html']: new Response('<html>app</html>') } });
    const response = await w.request(resource);
    assert.equal(response.type, 'error');
    assert.equal(response.status, 0);
    assert.equal(await response.text(), '');
    assert(w.opened.every(name => name === 'okazawa-gomi-navi-v27-favorites'));
  });
}
for (const path of ['', 'index.html?lang=en']) {
  test('offline entry navigation fallback: ' + (path || '/'), async () => {
    const w = worker({ entries: { [base + 'index.html']: new Response('<html>app</html>') } });
    const response = await w.request(path, { mode: 'navigate' });
    assert.equal(await response.text(), '<html>app</html>');
  });
}
test('offline uncached non-entry navigation, including JS navigation, is a network error', async () => {
  const w = worker({ entries: { [base + 'index.html']: new Response('<html>app</html>') } });
  for (const path of ['missing.js', 'unknown-page', 'push/onesignal/missing.js']) {
    assert.equal((await w.request(path, { mode: 'navigate' })).type, 'error');
  }
});
test('offline cached JS preserves its type and content', async () => {
  const response = new Response('const SORT = true;', { headers: { 'Content-Type': 'text/javascript' } });
  const w = worker({ entries: { [base + 'sort.js']: response } });
  const actual = await w.request('sort.js');
  assert.equal(actual.headers.get('Content-Type'), 'text/javascript');
  assert.equal(await actual.text(), 'const SORT = true;');
});
test('offline first visit without cached entry returns network error', async () => {
  assert.equal((await worker().request('', { mode: 'navigate' })).type, 'error');
});
test('online HTTP 404 is preserved, not replaced with cached HTML or cached JS', async () => {
  const w = worker({ online: new Response('not found', { status: 404 }), entries: {
    [base + 'missing.js']: new Response('stale'), [base + 'index.html']: new Response('<html>app</html>')
  } });
  const response = await w.request('missing.js');
  assert.equal(response.status, 404);
  assert.equal(await response.text(), 'not found');
  assert.equal(w.written.length, 0);
});
test('non-GET and cross-origin requests are left to the browser', async () => {
  const w = worker();
  assert.equal(await w.request('sort.js', { method: 'POST' }), undefined);
  assert.equal(await w.request('https://cdn.onesignal.com/sdk.js', { external: true }), undefined);
  assert.equal(w.opened.length, 0);
});
test('manifest updates only approved metadata and icons', () => {
  const current = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
  const original = JSON.parse(fs.readFileSync('tests/fixtures/base/manifest.webmanifest', 'utf8'));
  assert.equal(current.short_name, 'Okazawa Gomi');
  assert(current.name.includes('収集日') && current.name.includes('分別'));
  assert(current.description.includes('収集日') && current.description.includes('分け方'));
  for (const key of ['name', 'short_name', 'description', 'icons', 'theme_color', 'background_color']) { delete current[key]; delete original[key]; }
  assert.deepEqual(current, original);
});
