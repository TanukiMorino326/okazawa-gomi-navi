const SORT_UI = {
  ja: { title: '分別ガイド', intro: '分け方・出し方・使う袋を確認', examples: '代表的なもの', bag: '使う袋・出す場所', steps: '出し方', caution: '注意すること', back: 'カテゴリー一覧へ', sample: '指定袋の見本を見る', buy: '指定袋はどこで買う？', storeNote: '取扱店の例です。種類・在庫は店舗でご確認ください。', source: '公式ガイド', page: 'ページ', note: '上越市・2026年4月改訂版に基づく案内', checked: '確認日', external: '外部サイト・日本語／通信が必要です', battery: '電池の公式案内・市への問い合わせ', dictionary: 'もっと品目を調べる（ごみサク・日本語）', city: '上越市の公式ガイドを見る', unavailable: '分別ガイドを読み込めませんでした。オンラインで開き直してください。' },
  en: { title: 'Sorting Guide', intro: 'What goes where, how to set it out, and which bag to use', examples: 'Common examples', bag: 'Bag & collection point', steps: 'How to set it out', caution: 'Important', back: 'All categories', sample: 'View designated bag examples', buy: 'Where to buy bags', storeNote: 'Examples of participating stores. Ask the store about bag types and stock.', source: 'Official guide', page: 'page', note: 'Based on Joetsu City’s April 2026 guide. English is an app translation.', checked: 'Checked', external: 'External Japanese page • Internet required', battery: 'Official battery guidance & city contact', dictionary: 'Look up more items (Gomisaku, Japanese)', city: 'Joetsu City’s official guide', unavailable: 'The sorting guide could not load. Reopen the app online.' }
};
let selectedSortCategory = null;
let sortSearchQuery = '';
let sortSearchReturnSection = null;
const SORT_SEARCH_UI = {
  ja: {label:'品目名で案内を探す', placeholder:'例：スプレー缶、電池', clear:'消去', note:'登録済みの案内を検索します。対象外・条件の説明も確認してください。', item:'品目・出し方の案内', caution:'対象外・注意の説明', related:'関連説明（分別先未確定）', location:'掲載先：', open:'出し方・注意事項を見る', results:'関連する案内', empty:'該当する案内がありません。別の名前で検索するか、下の「ごみサク」で確認してください。'},
  en: {label:'Find guidance by item', placeholder:'e.g. aerosol, battery', clear:'Clear', note:'Searches existing guidance. Check exclusions and conditions before disposal.', item:'Item disposal guidance', caution:'Exclusions & precautions', related:'Related text — disposal not determined', location:'Found in: ', open:'View instructions & precautions', results:'Related guidance', empty:'No guidance found. Try another name or use the Gomisaku link below (Japanese).'}
};
function normalizeSortSearch(value) {
  return String(value).normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0)-0x60)).replace(/\s+/g,' ').trim();
}
// Labels describe the source of the matched text, never an inferred disposal decision.
function searchSortGuides(query, lang = currentLang) {
  const terms = normalizeSortSearch(query).split(' ').filter(Boolean);
  if (!terms.length || typeof SORT_GUIDE === 'undefined') return [];
  const exactItem = text => text.split(/[・&]/).some(part => normalizeSortSearch(part) === normalizeSortSearch(query));
  return SORT_GUIDE.categories.flatMap(category => {
    const passages = [{text:category.title[lang]}, {text:category.subtitle[lang]},
      ...category.examples[lang].map(text => ({text, kind:exactItem(text) ? 'item' : 'related'})),
      ...category.sections.flatMap(section => [
        {text:section.title[lang], section:section.id, kind:exactItem(section.title[lang]) ? 'item' : 'related'},
        ...section.steps[lang].map(text => ({text, section:section.id, kind:'related'})),
        ...section.cautions[lang].map(text => ({text, section:section.id, kind:'caution'}))])];
    const hits = passages.filter(p => terms.every(term => normalizeSortSearch(p.text).includes(term)));
    if (!hits.length) return [];
    // Conditions/exclusions must not be hidden behind an otherwise matching example.
    const selected = hits.find(p => p.kind === 'caution') || hits.find(p => p.kind === 'item') || hits[0];
    return [{category, matches:hits.map(p => p.text), text:selected.text,
      kind:selected.kind || 'related', section:selected.section || null}];
  }).sort((a,b) => ({item:0,related:1,caution:2}[a.kind] - {item:0,related:1,caution:2}[b.kind]));
}
function renderSortSearchResults() {
  const node = document.getElementById('sort-search-results');
  if (!node) return;
  const ui = SORT_SEARCH_UI[currentLang];
  if (!normalizeSortSearch(sortSearchQuery)) { node.innerHTML = ''; return; }
  const results = searchSortGuides(sortSearchQuery);
  node.innerHTML = results.length ? '<p>'+ui.results+' · '+results.length+'</p>'+results.map(result =>
    '<button type="button" class="sort-search-result sort-search-'+result.kind+'" data-sort-category="'+result.category.id+'" data-sort-result="'+(result.section || '')+'"><strong class="sort-search-label">'+sortEscape(ui[result.kind])+'</strong><span class="sort-search-location">'+ui.location+sortEscape(result.category.title[currentLang])+'</span><span>'+sortEscape(result.text)+'</span><small>'+sortEscape(ui.open)+' ›</small></button>').join('') : '<p>'+ui.empty+'</p>';
}

function sortIcon(id) {
  const paths = {
    burnable: '<path d="M7 8h10l-1 12H8L7 8Zm2-3h6M5 8h14M10 11v6m4-6v6"/>',
    food: '<path d="M5 12h14c0 5-3 8-7 8s-7-3-7-8ZM8 3c-3 3 3 3 0 6m4-6c-3 3 3 3 0 6m4-6c-3 3 3 3 0 6"/>',
    nonburnable: '<path d="M5 9h14v10H5V9Zm3 0V6h8v3M2 12h3m14 0h3M9 13l3 3 3-3"/>',
    packaging: '<path d="m3 8 9-5 9 5v11l-9 3-9-3V8Zm0 0 9 4 9-4M12 12v10M7 6l10 4"/>',
    pet: '<path d="M10 2h4v5l3 4v9c0 2-10 2-10 0v-9l3-4V2Zm0 3h4M7 13h10M7 17h10"/>',
    cans: '<path d="M3 5c0-2 8-2 8 0v14c0 2-8 2-8 0V5Zm0 0c0 2 8 2 8 0M16 2h4v5l2 4v10h-8V11l2-4V2Zm0 13h4"/>',
    paper: '<path d="M4 5h15v14H4V5Zm3-3h15v14M7 9h9M7 12h9M7 15h6"/>',
    special: '<rect x="3" y="7" width="7" height="14" rx="1"/><path d="M5 4h3v3M5 11h3m-1.5-1.5v3M18 3c-5 0-5 6-2 8v4h4v-4c3-2 3-8-2-8Zm-2 15h4m-4 3h4"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[id] || paths.special}</svg>`;
}

// Data is local and authored here, but escape every value before using HTML.
function sortEscape(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderSort() {
  const content = document.getElementById('sort-content');
  if (!content) return;
  const ui = SORT_UI[currentLang];
  document.getElementById('sort-heading').textContent = ui.title;
  document.getElementById('sort-intro').textContent = ui.intro;
  if (typeof SORT_GUIDE === 'undefined') {
    content.innerHTML = `<p role="status">${ui.unavailable}</p>`;
    return;
  }
  const searchUi = SORT_SEARCH_UI[currentLang];
  const t = value => value[currentLang];
  const list = (items, ordered = false) => `<${ordered ? 'ol' : 'ul'}>${items.map(item => `<li>${sortEscape(item)}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`;
  const external = (url, label, className = 'sort-link') => `<a class="${className}" href="${sortEscape(url)}" target="_blank" rel="noopener noreferrer">${sortEscape(label)}<span aria-hidden="true"> ↗</span></a>`;
  const footer = `<footer class="sort-footer"><p>${ui.note}</p><p>${ui.checked}: ${SORT_GUIDE.checked}</p><p>${ui.external}</p></footer>`;
  const category = SORT_GUIDE.categories.find(c => c.id === selectedSortCategory);
  if (!category) {
    selectedSortCategory = null;
    content.innerHTML = `<div class="sort-search" role="search"><label for="sort-search-input">${searchUi.label}</label><div class="sort-search-row"><input id="sort-search-input" type="search" maxlength="100" enterkeyhint="search" autocomplete="off" aria-describedby="sort-search-note" placeholder="${searchUi.placeholder}" value="${sortEscape(sortSearchQuery)}"><button type="button" data-sort-search-clear>${searchUi.clear}</button></div><p id="sort-search-note">${searchUi.note}</p><div id="sort-search-results" role="status" aria-live="polite" aria-atomic="true"></div></div><div class="sort-grid">${SORT_GUIDE.categories.map(c => `<button type="button" class="sort-category${c.id === 'special' ? ' sort-special' : ''}" data-sort-category="${c.id}"><span class="sort-pictogram">${sortIcon(c.icon)}</span><span><strong>${sortEscape(t(c.title))}</strong><small>${sortEscape(t(c.subtitle))}</small></span><span class="sort-arrow" aria-hidden="true">›</span></button>`).join('')}</div>
      <aside class="sort-buy"><h2>${ui.buy}</h2><p>${sortEscape(t(SORT_GUIDE.purchase))}</p><small>${ui.storeNote}</small></aside>
      <div class="sort-resources">${external(SORT_GUIDE.cityGuide, ui.city)}${external('https://www.gomisaku.jp/0152/?lang=ja', ui.dictionary)}</div>${footer}`;
    renderSortSearchResults();
    return;
  }
  content.innerHTML = `<button type="button" class="sort-back" data-sort-back>‹ ${ui.back}</button>
    <div class="sort-detail-heading"><span class="sort-pictogram">${sortIcon(category.icon)}</span><h2 id="sort-detail-title" tabindex="-1">${sortEscape(t(category.title))}</h2></div>
    <section class="sort-examples"><h3>${ui.examples}</h3>${list(t(category.examples))}</section>
    ${category.sections.map(s => `<section class="sort-section" data-sort-section="${s.id}"><h3 tabindex="-1">${sortEscape(t(s.title))}</h3><div class="sort-bag"><span>${ui.bag}</span><strong>${sortEscape(t(s.bag))}</strong></div><h4>${ui.steps}</h4>${list(t(s.steps), true)}<div class="sort-caution"><h4>${ui.caution}</h4>${list(t(s.cautions))}</div>
      ${s.id === 'rechargeable' ? external(SORT_GUIDE.batteryGuide, ui.battery) : ''}
      <div class="sort-sources">${s.sources.map(source => external(source.url, `${ui.source} · ${ui.page} ${source.page}`)).join('')}</div></section>`).join('')}
    ${category.bagSample ? `<aside class="sort-buy"><h3>${ui.buy}</h3><p>${sortEscape(t(SORT_GUIDE.purchase))}</p><small>${ui.storeNote}</small>${external(SORT_GUIDE.bagExamples, ui.sample)}</aside>` : ''}${footer}`;
}

document.getElementById('sort-content')?.addEventListener('click', event => {
  if (event.target.closest('[data-sort-search-clear]')) {
    sortSearchQuery = '';
    const input = document.getElementById('sort-search-input');
    if (input) { input.value = ''; input.focus(); }
    renderSortSearchResults();
    return;
  }
  const card = event.target.closest('[data-sort-category]');
  if (card) {
    sortSearchReturnSection = card.dataset.sortResult !== undefined ? card.dataset.sortResult : null;
    selectedSortCategory = card.dataset.sortCategory;
    renderSort();
    document.getElementById('sort-detail-title')?.focus();
    window.scrollTo(0, 0);
    if (sortSearchReturnSection) {
      const heading = document.querySelector('[data-sort-section="'+sortSearchReturnSection+'"] h3');
      heading?.focus();
      heading?.scrollIntoView?.({block:'start'});
    }
  } else if (event.target.closest('[data-sort-back]')) {
    const previous = selectedSortCategory;
    selectedSortCategory = null;
    renderSort();
    const selector = sortSearchReturnSection !== null
      ? '[data-sort-category="'+previous+'"][data-sort-result="'+sortSearchReturnSection+'"]'
      : '[data-sort-category="'+previous+'"]';
    document.querySelector(selector)?.focus();
    sortSearchReturnSection = null;
  }
});

document.getElementById('sort-content')?.addEventListener('input', event => {
  if (event.target.id !== 'sort-search-input' || event.isComposing) return;
  sortSearchQuery = event.target.value.slice(0,100);
  renderSortSearchResults();
});
document.getElementById('sort-content')?.addEventListener('compositionend', event => {
  if (event.target.id !== 'sort-search-input') return;
  sortSearchQuery = event.target.value.slice(0,100);
  renderSortSearchResults();
});
