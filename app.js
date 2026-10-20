const COLLECTIONS = {
  burnable: { ja: "燃やせるごみ・生ごみ", en: "Burnable Waste & Food Waste" },
  packaging: { ja: "容器包装", en: "Packaging" },
  nonburnable: { ja: "燃やせないごみ", en: "Non-burnable Waste" },
  cans: { ja: "缶・びん・PETボトル", en: "Cans, Glass & PET Bottles" },
  paper: { ja: "新聞紙・雑誌類・段ボール", en: "Paper Recycling" }
};

const UI = {
  ja: {
    sortTab: "分別", sortButton: "分別を調べる", backHome: "ホームに戻る",
    area: "上越市 中郷区 C地区",
    todayTitle: "今日のごみ",
    todayClosedTitle: "ごみ出し締切を過ぎました",
    deadlineNote: "朝8:30まで",
    nextTitle: "次の収集",
    weekButton: "今週の予定",
    homeTab: "今日", weekTab: "週間", calendarTab: "カレンダー",
    calendarButton: "カレンダー",
    weekTitle: "今週の予定",
    previousWeek: "先週",
    currentWeek: "今週",
    nextWeek: "来週",
    calendarTitle: "カレンダー",
    weatherTitle: "岡沢の天気",
    pushTitle: "㊕ 特別収集日の通知",
    pushDescription: "前日にお知らせを受け取れます",
    pushButton: "通知を受け取る",
    pushEnabled: "通知ON",
    pushDenied: "通知がブロックされています",
    pushUnavailable: "この端末では通知を利用できません",
    gomisakuTitle: "捨て方を調べる",
    gomisakuSubtitle: "上越市ごみ分別辞典「ごみサク」",
    gomisakuAria: "上越市ごみ分別辞典 ごみサクを開く",
    weatherLoading: "天気情報を読み込みます",
    weatherError: "天気情報を取得できませんでした",
    todayWeather: "今日",
    tomorrowWeather: "明日",
    rainChance: "降水",
    sourceNote: "実際の収集日は年度カレンダーを優先",
    outOfPeriod: "収集データ対象期間外です（2026年4月1日～2027年3月31日）",
    none: "収集なし",
    noFurther: "登録済みの次回収集情報はありません",
    weekdays: ["月", "火", "水", "木", "金", "土", "日"],
    short: { burnable: "燃・生", packaging: "容器", nonburnable: "不燃", cans: "缶びん", paper: "古紙" }
  },
  en: {
    sortTab: "Sort", sortButton: "Sort waste", backHome: "Back to Today",
    area: "Nakago, Joetsu — Area C",
    todayTitle: "Today's Collection",
    todayClosedTitle: "Today's set-out deadline has passed",
    deadlineNote: "Put out by 8:30 AM",
    nextTitle: "Next Collection",
    weekButton: "This Week",
    homeTab: "Today", weekTab: "Week", calendarTab: "Calendar",
    calendarButton: "Calendar",
    weekTitle: "This Week",
    previousWeek: "Previous",
    currentWeek: "This Week",
    nextWeek: "Next",
    calendarTitle: "Calendar",
    weatherTitle: "Okazawa Weather",
    pushTitle: "Ⓢ Special Collection Alerts",
    pushDescription: "Get a reminder the day before",
    pushButton: "Enable alerts",
    pushEnabled: "Alerts ON",
    pushDenied: "Notifications are blocked",
    pushUnavailable: "Notifications are unavailable on this device",
    gomisakuTitle: "How to Sort & Dispose",
    gomisakuSubtitle: "Joetsu Garbage Sorting Dictionary “Gomisaku”",
    gomisakuAria: "Open Joetsu Garbage Sorting Dictionary Gomisaku",
    weatherLoading: "Loading weather",
    weatherError: "Weather data unavailable",
    todayWeather: "Today",
    tomorrowWeather: "Tomorrow",
    rainChance: "Rain",
    sourceNote: "Official fiscal-year collection calendar takes priority.",
    outOfPeriod: "Collection data is available for Apr 1, 2026 – Mar 31, 2027.",
    none: "No collection",
    noFurther: "No further collection data is available",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    short: { burnable: "Burn.", packaging: "Pkg.", nonburnable: "Non-b.", cans: "Cans", paper: "Paper" }
  }
};

Object.assign(UI.ja, {
  todayTitle: '今日の収集', todayClosedTitle: '今日の収集（締切後）', deadlineNote: '朝8:30までに出してください',
  weekTitle: '週間の収集', calendarTitle: '収集カレンダー', weatherTitle: '岡沢の天気', pushTitle: '特別収集日の通知',
  previousWeek: '前の週', nextWeek: '次の週', previousMonth: '前の月', nextMonth: '次の月',
  todayJump: '今日へ', calendarHint: '日付をタップして収集内容を確認', selected: '選択中', todayMark: '今日', special: '特別収集',
  guide: '色・アイコンの見方', calendarHelp: '矢印キーでも日付を選べます',
  sortButton: '分別ガイドを見る', bagNote: 'それぞれの指定袋で、同じ集積所へ。',
  burnableName: '燃やせるごみ', foodName: '生ごみ', packagingNote: 'プラスチック製・紙製を分ける',
  closedHelp: '締切を過ぎています。次の収集予定を確認してください。',
  collectionDays: '収集日の朝8:30までに出してください', weatherSource: '天気情報：Open-Meteo',
  unknown: '収集情報を確認できません', navLabel: '画面切替', languageLabel: '表示言語'
});
Object.assign(UI.en, {
  area: 'Nakago · Area C, Joetsu', calendarTab: 'Month', nextTitle: 'Next collection', todayTitle: 'Today’s collection', todayClosedTitle: 'Today’s collection (deadline passed)',
  deadlineNote: 'Set out by 8:30 AM', weekTitle: 'Weekly collection', calendarTitle: 'Collection calendar', weatherTitle: 'Weather in Okazawa',
  pushTitle: 'Special collection alerts', previousWeek: 'Previous week', nextWeek: 'Next week', previousMonth: 'Previous month', nextMonth: 'Next month',
  todayJump: 'Today', calendarHint: 'Tap a date for collection details', selected: 'Selected', todayMark: 'Today', special: 'Special collection',
  guide: 'Color & icon guide', calendarHelp: 'You can also use arrow keys to select a date',
  sortButton: 'Open sorting guide', bagNote: 'Separate designated bags. Same collection point.',
  burnableName: 'Burnable Waste', foodName: 'Food Waste', packagingNote: 'Keep plastic and paper separate',
  closedHelp: 'The deadline has passed. Check the next collection date.',
  collectionDays: 'Set out by 8:30 AM on collection days', weatherSource: 'Weather data: Open-Meteo',
  unknown: 'Collection information unavailable', navLabel: 'Main navigation', languageLabel: 'Display language'
});
const SPECIAL_COLLECTION = { ja: '乾電池等／蛍光灯・電球', en: 'Batteries, fluorescent lamps & light bulbs' };
const APP_TIME_ZONE = 'Asia/Tokyo';
// Register only official, verified fiscal-year data here.
// To add 2027: load schedule-2027.js before app.js and add its entry below.
// Never generate future collection dates from weekday patterns.
const SCHEDULE_PERIODS = [
  { start: '2026-04-01', end: '2027-03-31', collections: SCHEDULE_2026, special: SPECIAL_COLLECTION_2026 }
];
function schedulePeriodFor(key) {
  return SCHEDULE_PERIODS.find(period => key >= period.start && key <= period.end) || null;
}
function hasScheduleInRange(startKey, endKey) {
  return SCHEDULE_PERIODS.some(period => period.start <= endKey && period.end >= startKey);
}
const SCHEDULE_START = SCHEDULE_PERIODS[0].start;
const SCHEDULE_END = SCHEDULE_PERIODS[SCHEDULE_PERIODS.length - 1].end;
UI.ja.outOfPeriod = `収集データ対象期間外です（${SCHEDULE_PERIODS.map(p => `${p.start.replace(/(\\d{4})-(\\d{2})-(\\d{2})/, (_,y,m,d) => `${y}年${+m}月${+d}日`)}～${p.end.replace(/(\\d{4})-(\\d{2})-(\\d{2})/, (_,y,m,d) => `${y}年${+m}月${+d}日`)}`).join('、')}）`;
UI.en.outOfPeriod = `Collection data available for: ${SCHEDULE_PERIODS.map(p => `${p.start} – ${p.end}`).join(', ')}.`;
let currentLang = 'ja';
try { const saved = localStorage.getItem('okazawa-gomi-lang'); if (saved === 'ja' || saved === 'en') currentLang = saved; } catch (_) { /* Storage can be unavailable; the switch still works in this session. */ }
let weekOffset = 0;
// All calendar Date objects below carry Tokyo civil fields in UTC slots.
// Only tokyoParts receives a real instant. Never reinterpret a civil date in the device time zone.
function tokyoParts(instant = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: APP_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(instant);
  return Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
}
function tokyoNow() {
  const p = tokyoParts();
  return new Date(Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute));
}
function dateKey(civilDate) { return civilDate.toISOString().slice(0, 10); }
function dateFromKey(key) { return new Date(key + 'T12:00:00.000Z'); }
function civilDate(year, month, day = 1) { return new Date(Date.UTC(year, month, day, 12)); }
function addDays(date, days) { const next = new Date(date); next.setUTCDate(next.getUTCDate() + days); return next; }
function monthStart(date) { return civilDate(date.getUTCFullYear(), date.getUTCMonth()); }
let calendarCursor = monthStart(tokyoNow());
let calendarSelectedKey = dateKey(tokyoNow());
function isWithinSchedulePeriod(date) { return Boolean(schedulePeriodFor(dateKey(date))); }
function collectionTypeFor(date) {
  const key = dateKey(date), period = schedulePeriodFor(key);
  return period ? period.collections[key] || null : null;
}
function hasSpecialCollection(date) {
  const key = dateKey(date), period = schedulePeriodFor(key);
  return period ? period.special.has(key) : false;
}
function collectionFor(date) { const type = collectionTypeFor(date); return type ? COLLECTIONS[type] : null; }
function nextCollectionAfter(date) {
  for (let i = 1; i <= 370; i++) { const next = addDays(date, i), collection = collectionFor(next); if (collection || hasSpecialCollection(next)) return { date: next, collection, type: collectionTypeFor(next) }; }
  return null;
}
function formatDate(date, includeYear = false) {
  return new Intl.DateTimeFormat(currentLang === 'en' ? 'en-US' : 'ja-JP', { timeZone: 'UTC', ...(includeYear ? {year: 'numeric'} : {}), month: currentLang === 'en' ? 'short' : 'long', day: 'numeric', weekday: 'short' }).format(date);
}
function isPastCollectionDeadline(date) { return date.getUTCHours() * 60 + date.getUTCMinutes() >= 510; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

const UI_ICONS = {bin:'<path d="M7 8h10l-1 12H8L7 8ZM9 5h6M5 8h14M10 11v6m4-6v6"/>',food:'<path d="M5 12h14c0 5-3 8-7 8s-7-3-7-8ZM8 3c-3 3 3 3 0 6m4-6c-3 3 3 3 0 6m4-6c-3 3 3 3 0 6"/>',clock:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',box:'<path d="m3 8 9-5 9 5v11l-9 3-9-3V8Zm0 0 9 4 9-4M12 12v10M7 6l10 4"/>',grid:'<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>',rain:'<path d="M6 15a4 4 0 1 1 1-8 5 5 0 0 1 9 1 3.5 3.5 0 0 1 1 7H6Zm2 3-1 3m6-3-1 3m6-3-1 3"/>',home:'<path d="m3 10 9-7 9 7M5 9v12h14V9M10 21v-7h4v7"/>',week:'<path d="M7 5h14M7 12h14M7 19h14M3 5h.1M3 12h.1M3 19h.1"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18M7 14h2m3 0h2m3 0h.1M7 18h2m3 0h2"/>',bell:'<path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3Zm5 4h4"/>'};
Object.assign(UI_ICONS, {
  cans: '<path d="M3 5c0-2 8-2 8 0v14c0 2-8 2-8 0V5Zm0 0c0 2 8 2 8 0M16 2h4v5l2 4v10h-8V11l2-4V2Zm0 13h4"/>',
  paper: '<path d="M4 5h15v14H4V5Zm3-3h15v14M7 9h9M7 12h9M7 15h6"/>',
  nonburnable: '<path d="M5 9h14v10H5V9Zm3 0V6h8v3M2 12h3m14 0h3"/>',
  special: '<rect x="3" y="7" width="7" height="14" rx="1"/><path d="M5 4h3v3M5 11h3m-1.5-1.5v3M18 3c-5 0-5 6-2 8v4h4v-4c3-2 3-8-2-8Zm-2 15h4m-4 3h4"/>',
  none: '<path d="M6 12h12"/>', prev: '<path d="m14 6-6 6 6 6"/>', next: '<path d="m10 6 6 6-6 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
  cloud: '<path d="M6 18a4 4 0 1 1 1-8 5 5 0 0 1 9 1 3.5 3.5 0 0 1 1 7H6Z"/>',
  snow: '<path d="M12 2v20M3 7l18 10M3 17 21 7M8 4l4 3 4-3M8 20l4-3 4 3"/>',
  storm: '<path d="M5 15a4 4 0 1 1 2-7 5 5 0 0 1 9 1 3 3 0 0 1 1 6M13 12l-4 6h4l-2 5"/>',
  fog: '<path d="M4 9h16M2 13h16M6 17h16"/>',
  thermometer: '<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0ZM12 8v10"/>'
});
function uiIcon(id) { return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${UI_ICONS[id] || UI_ICONS.none}</svg>`; }
function collectionIcon(type, size = 'md') { return `<span class="collection-icon collection-icon-${size} ${type}">${uiIcon({burnable:'bin',packaging:'box'}[type] || type)}</span>`; }
function applyStaticLanguage() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = UI[currentLang][el.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', UI[currentLang][el.dataset.i18nAria]); });
  document.querySelectorAll('[data-lang]').forEach(button => {
    const active = button.dataset.lang === currentLang;
    button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
  });
}
function homeCollection(type) {
  const t = UI[currentLang];
  if (type === 'burnable') return `<div class="waste-row"><span class="waste-mark">${uiIcon('bin')}</span><strong>${t.burnableName}</strong></div><div class="waste-row"><span class="waste-mark food">${uiIcon('food')}</span><strong>${t.foodName}</strong></div>`;
  return `<div class="waste-row"><span class="waste-mark ${type}">${uiIcon({packaging:'box'}[type] || type)}</span><strong>${COLLECTIONS[type][currentLang]}</strong></div>`;
}
function renderToday() {
  const t = UI[currentLang], now = tokyoNow(), inPeriod = isWithinSchedulePeriod(now), type = collectionTypeFor(now), special = hasSpecialCollection(now);
  const hasCollection = inPeriod && (type || special), closed = hasCollection && isPastCollectionDeadline(now);
  document.getElementById('today-title').textContent = closed ? t.todayClosedTitle : t.todayTitle;
  document.getElementById('today-date').textContent = formatDate(now);
  document.getElementById('today-content').innerHTML = !inPeriod ? `<p class="empty-copy">${t.outOfPeriod}</p>`
    : `${type ? homeCollection(type) : (!special ? `<p class="empty-copy">${t.none}</p>` : '')}${special ? `<div class="special-note"><b>${t.special}</b><span>${SPECIAL_COLLECTION[currentLang]}</span></div>` : ''}${hasCollection ? `<div class="deadline-note">${uiIcon('clock')}<span>${t.deadlineNote}</span></div>${closed ? `<p class="bag-note">${t.closedHelp}</p>` : (type === 'burnable' ? `<p class="bag-note">${t.bagNote}</p>` : '')}` : ''}`;
  const next = nextCollectionAfter(now), content = document.getElementById('next-content');
  content.innerHTML = next ? `<div class="section-top"><h2>${t.nextTitle}</h2><time>${formatDate(next.date)}</time></div><div class="next-item"><span class="waste-mark ${next.type || 'special'}">${uiIcon({burnable:'bin',packaging:'box'}[next.type] || next.type || 'special')}</span><div><strong>${next.collection ? next.collection[currentLang] : t.special}</strong>${next.type === 'packaging' ? `<small>${t.packagingNote}</small>` : ''}</div></div>${hasSpecialCollection(next.date) ? `<p class="next-special">${t.special} · ${SPECIAL_COLLECTION[currentLang]}</p>` : ''}` : `<div class="section-top"><h2>${t.nextTitle}</h2></div><p class="empty-copy">${dateKey(now) > SCHEDULE_END ? t.outOfPeriod : t.noFurther}</p>`;
}
function mondayOfWeek(date) {
  const d = civilDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return addDays(d, -((d.getUTCDay() + 6) % 7));
}
function renderWeek() {
  const t = UI[currentLang], now = tokyoNow(), start = addDays(mondayOfWeek(now), weekOffset * 7), end = addDays(start, 6);
  const selectedWeekLabel = weekOffset < 0 ? t.previousWeek : (weekOffset > 0 ? t.nextWeek : t.currentWeek);
  document.getElementById('current-week').textContent = selectedWeekLabel;
  document.querySelector('#week-view .view-header h2').textContent = currentLang === 'ja' ? `${selectedWeekLabel}の予定` : selectedWeekLabel;
  document.getElementById('week-range').textContent = `${formatDate(start, true)} — ${formatDate(end)}`;
  document.getElementById('prev-week').disabled = weekOffset <= -1;
  document.getElementById('next-week').disabled = weekOffset >= 1;
  document.getElementById('current-week').disabled = weekOffset === 0;
  document.getElementById('week-list').innerHTML = Array.from({length:7}, (_, i) => {
    const date = addDays(start, i), type = collectionTypeFor(date), inPeriod = isWithinSchedulePeriod(date), today = dateKey(date) === dateKey(now), special = hasSpecialCollection(date);
    const weekday = t.weekdays[(date.getUTCDay() + 6) % 7];
    return `<div class="week-row${today ? ' today' : ''}"${today ? ' aria-current="date"' : ''}><div class="week-date"><span>${weekday}</span><strong>${date.getUTCDate()}</strong>${today ? `<small class="today-tag">${t.todayMark}</small>` : ''}</div><div class="week-collection"><div class="week-collection-main">${collectionIcon(inPeriod ? (type || (special ? 'special' : 'none')) : 'none','sm')}<strong class="${!type ? 'no-collection' : ''}">${!inPeriod ? t.outOfPeriod : (type ? COLLECTIONS[type][currentLang] : (special ? t.special : t.none))}</strong></div>${special ? `<div class="week-special"><b>${t.special}</b><p>${SPECIAL_COLLECTION[currentLang]}</p></div>` : ''}</div></div>`;
  }).join('');
}
function renderLegend() {
  const t = UI[currentLang];
  document.getElementById('calendar-legend').innerHTML = ['burnable','packaging','cans','paper','nonburnable'].map(type => `<div class="legend-item ${type}"><span class="legend-swatch"></span>${collectionIcon(type,'sm')}<span>${COLLECTIONS[type][currentLang]}</span></div>`).join('') + `<div class="legend-item special"><span class="special-plus-inline">+</span><span>${t.special} · ${SPECIAL_COLLECTION[currentLang]}</span></div>`;
}
function renderCalendarDetail() {
  const t = UI[currentLang], date = dateFromKey(calendarSelectedKey), inPeriod = isWithinSchedulePeriod(date), type = collectionTypeFor(date), special = hasSpecialCollection(date);
  document.getElementById('calendar-detail').innerHTML = `<h3>${formatDate(date, true)}</h3><div class="detail-main">${collectionIcon(inPeriod ? type || (special ? 'special' : 'none') : 'none','sm')}<strong>${!inPeriod ? t.outOfPeriod : (type ? COLLECTIONS[type][currentLang] : (special ? t.special : t.none))}</strong></div>${special ? `<div class="special-detail"><span>${t.special}</span><p>${SPECIAL_COLLECTION[currentLang]}</p></div>` : ''}${inPeriod && (type || special) ? `<div class="detail-deadline">${uiIcon('clock')}<span>${t.deadlineNote}</span></div>` : ''}`;
}
function renderCalendar() {
  const t = UI[currentLang], now = tokyoNow(), year = calendarCursor.getUTCFullYear(), month = calendarCursor.getUTCMonth();
  const first = civilDate(year,month), last = civilDate(year,month+1,0), leading = (first.getUTCDay()+6)%7;
  const selectedDate = dateFromKey(calendarSelectedKey);
  if (selectedDate.getUTCFullYear() !== year || selectedDate.getUTCMonth() !== month) calendarSelectedKey = dateKey(first);
  document.getElementById('calendar-month').textContent = new Intl.DateTimeFormat(currentLang === 'en' ? 'en-US' : 'ja-JP',{year:'numeric',month:'long',timeZone:'UTC'}).format(first);
  document.querySelector('.calendar-weekdays').innerHTML = t.weekdays.map((day,i) => `<span aria-label="${day}"><span class="weekday-full">${day}</span><span class="weekday-narrow" aria-hidden="true">${currentLang === 'en' ? ['M','T','W','T','F','S','S'][i] : day}</span></span>`).join('');
  const note = document.getElementById('calendar-period-note');
  note.hidden = hasScheduleInRange(dateKey(first), dateKey(last)); note.textContent = t.outOfPeriod;
  const cells = Array.from({length:leading},()=>'<div class="date-cell blank" aria-hidden="true"></div>');
  for (let day=1; day<=last.getUTCDate(); day++) {
    const date = civilDate(year,month,day), key=dateKey(date), inPeriod=isWithinSchedulePeriod(date), type=collectionTypeFor(date), special=hasSpecialCollection(date), today=key===dateKey(now), selected=key===calendarSelectedKey;
    const label = `${formatDate(date,true)} · ${!inPeriod ? t.outOfPeriod : (type ? COLLECTIONS[type][currentLang] : (special ? t.special : t.none))}${special ? ' · '+t.special : ''}`;
    cells.push(`<button type="button" class="date-cell ${inPeriod ? type || 'none' : 'unknown'}${today ? ' today-date' : ''}${selected ? ' selected' : ''}" data-date="${key}" tabindex="${selected ? '0':'-1'}" aria-label="${escapeHtml(label)}" aria-pressed="${selected}"${today ? ' aria-current="date"' : ''}><span class="date-number">${day}</span>${collectionIcon(inPeriod ? type || (special ? 'special':'none') : 'none','xs')}${special ? '<span class="special-plus" aria-hidden="true">+</span>' : ''}</button>`);
  }
  while(cells.length%7) cells.push('<div class="date-cell blank" aria-hidden="true"></div>');
  document.getElementById('calendar-grid').innerHTML = cells.join('');
  renderCalendarDetail(); renderLegend();
}
function selectCalendarDate(key, focus = false) {
  const date = dateFromKey(key); if (!Number.isFinite(date.getTime())) return;
  calendarSelectedKey = key;
  if (date.getUTCFullYear() !== calendarCursor.getUTCFullYear() || date.getUTCMonth() !== calendarCursor.getUTCMonth()) { calendarCursor = monthStart(date); renderCalendar(); }
  else {
    document.querySelectorAll('[data-date]').forEach(button => { const selected=button.dataset.date === key; button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));button.tabIndex=selected?0:-1; });
    renderCalendarDetail();
  }
  if (focus) document.querySelector(`[data-date="${key}"]`)?.focus({preventScroll:true});
}
function changeCalendarMonth(delta) {
  const old=dateFromKey(calendarSelectedKey), target=civilDate(calendarCursor.getUTCFullYear(),calendarCursor.getUTCMonth()+delta);
  calendarCursor=target;calendarSelectedKey=dateKey(civilDate(target.getUTCFullYear(),target.getUTCMonth(),Math.min(old.getUTCDate(),civilDate(target.getUTCFullYear(),target.getUTCMonth()+1,0).getUTCDate())));renderCalendar();
}
function jumpToToday() { const now=tokyoNow();calendarCursor=monthStart(now);calendarSelectedKey=dateKey(now);renderCalendar();document.querySelector(`[data-date="${calendarSelectedKey}"]`)?.focus({preventScroll:true}); }
function weatherLabel(code, lang) {
  if(code===0)return lang==='ja'?'晴れ':'Clear';if([1,2].includes(code))return lang==='ja'?'晴れ・くもり':'Partly cloudy';if(code===3)return lang==='ja'?'くもり':'Cloudy';if([45,48].includes(code))return lang==='ja'?'霧':'Fog';if([51,53,55,56,57].includes(code))return lang==='ja'?'霧雨':'Drizzle';if([61,63,65,66,67,80,81,82].includes(code))return lang==='ja'?'雨':'Rain';if([71,73,75,77,85,86].includes(code))return lang==='ja'?'雪':'Snow';if([95,96,99].includes(code))return lang==='ja'?'雷雨':'Thunderstorm';return lang==='ja'?'天気':'Weather';
}
function weatherIcon(code) { return uiIcon(code===0?'sun':[1,2,3].includes(code)?'cloud':[45,48].includes(code)?'fog':[71,73,75,77,85,86].includes(code)?'snow':[95,96,99].includes(code)?'storm':[51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)?'rain':'thermometer'); }
let weatherData=null, weatherState='loading';
function renderWeather() {
  const box=document.getElementById('weather-content'),t=UI[currentLang];if(!box)return;
  if(!weatherData){box.innerHTML=`<p class="weather-loading" role="status">${weatherState==='error'?t.weatherError:t.weatherLoading}</p>`;return;}
  const d=weatherData.daily,number=value=>Number.isFinite(value)?Math.round(value):'—';
  box.innerHTML=[0,1].map(i=>`<div class="weather-day"><div class="weather-left">${weatherIcon(d.weather_code[i])}<span>${i===0?t.todayWeather:t.tomorrowWeather}<small>${weatherLabel(d.weather_code[i],currentLang)}</small></span></div><div class="weather-values"><strong>${number(d.temperature_2m_max[i])}° / ${number(d.temperature_2m_min[i])}°</strong><small>${t.rainChance} ${number(d.precipitation_probability_max[i])}%</small></div></div>`).join('');
}
async function loadWeather() {
  weatherState='loading';renderWeather();
  try {
    const url='https://api.open-meteo.com/v1/forecast?latitude=36.9849&longitude=138.2010&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&forecast_days=2';
    const response=await fetch(url);if(!response.ok)throw new Error('weather request failed');
    const result=await response.json();for(const key of ['weather_code','temperature_2m_max','temperature_2m_min','precipitation_probability_max'])if(!Array.isArray(result.daily?.[key])||result.daily[key].length<2)throw new Error('Incomplete weather data');
    weatherData=result;weatherState='ready';
  } catch(_){weatherData=null;weatherState='error';}renderWeather();
}
function refreshLanguage() { applyStaticLanguage();refreshPushStatus();renderWeather();renderToday();if(!document.getElementById('week-view').hidden)renderWeek();if(!document.getElementById('calendar-view').hidden)renderCalendar();if(!document.getElementById('sort-view').hidden)renderSort(); }
function showView(view) {
  if(!['home','week','calendar','sort'].includes(view))return;
  for(const name of ['home','week','calendar','sort'])document.getElementById(name+'-view').hidden=name!==view;
  if(view==='week')renderWeek();if(view==='calendar')renderCalendar();if(view==='sort')renderSort();
  document.querySelectorAll('[data-tab]').forEach(button=>{const active=button.dataset.tab===view;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
  window.scrollTo(0,0);
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>showView(button.dataset.view)));
document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>showView(button.dataset.tab)));
document.getElementById('prev-week').addEventListener('click',()=>{if(weekOffset>-1){weekOffset--;renderWeek();}});
document.getElementById('next-week').addEventListener('click',()=>{if(weekOffset<1){weekOffset++;renderWeek();}});
document.getElementById('current-week').addEventListener('click',()=>{weekOffset=0;renderWeek();});
document.getElementById('prev-month').addEventListener('click',()=>changeCalendarMonth(-1));
document.getElementById('next-month').addEventListener('click',()=>changeCalendarMonth(1));
document.getElementById('calendar-today').addEventListener('click',jumpToToday);
document.getElementById('calendar-grid').addEventListener('click',event=>{const button=event.target.closest('[data-date]');if(button)selectCalendarDate(button.dataset.date);});
document.getElementById('calendar-grid').addEventListener('keydown',event=>{
  const button=event.target.closest('[data-date]');if(!button)return;
  const date=dateFromKey(button.dataset.date),day=(date.getUTCDay()+6)%7,deltas={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7,Home:-day,End:6-day};
  if(!(event.key in deltas))return;event.preventDefault();selectCalendarDate(dateKey(addDays(date,deltas[event.key])),true);
});

// Do not persist an ON flag: confirm the SDK state in every session.
let pushSDK = null;
let pushState = "checking";
let pushBusy = false;
let pushTimer = null;
let pushDeadline = 0;
let pushAwaitingOn = false;
let pushAwaitingOff = false;
let pushRecoveryRequired = false;
let pushOperation = 0;
let pushOperationDeadline = 0;
let pushInitExpired = false;
const PUSH_WAIT_MS = 15000;
const PUSH_COPY = {
  ja: { checking: "通知状態を確認中…", working: "通知設定を変更中…", offButton: "通知をONにする", retry: "通知状態を再確認", unknown: "通知状態を確認できません。再確認してください", error: "通知の処理に失敗しました。再確認してください", deniedHelp: "端末・ブラウザーの設定で通知を許可してから戻ってください" },
  en: { checking: "Checking alerts…", working: "Updating alerts…", offButton: "Turn alerts ON", retry: "Check alert status", unknown: "Could not confirm alerts. Please check again.", error: "Alert setup failed. Please check again.", deniedHelp: "Allow notifications in device/browser settings, then return here." }
};

function renderPushStatus(state = pushState) {
  if (pushRecoveryRequired) state = "recovery";
  pushState = state;
  const button = document.getElementById("push-subscribe");
  const status = document.getElementById("push-status");
  if (!button || !status) return;

  const ui = UI[currentLang];
  const copy = PUSH_COPY[currentLang];
  const labels = { checking: copy.checking, working: copy.working, on: (currentLang === "ja" ? "通知をOFFにする" : "Turn alerts OFF"),
    off: copy.offButton, denied: ui.pushDenied, unavailable: ui.pushUnavailable,
    unknown: copy.retry, error: copy.retry,
    recovery: currentLang === "ja" ? "再読み込みして確認" : "Reload and check" };
  button.disabled = pushBusy || ["checking", "working", "denied", "unavailable"].includes(state);
  button.textContent = ["unknown", "error"].includes(state)
    ? (!pushSDK ? (currentLang === "ja" ? "再読み込み" : "Reload")
      : (currentLang === "ja" ? "通知を登録・再確認" : "Enable and check alerts")) : labels[state];
  button.setAttribute("aria-busy", String(pushBusy || state === "checking"));
  status.textContent = state === "on" ? ui.pushEnabled
    : state === "off" ? ui.pushDescription
    : state === "unknown" ? copy.unknown : state === "error" ? copy.error
    : state === "denied" ? copy.deniedHelp : labels[state];
  if (state === "recovery") {
    status.textContent = currentLang === "ja"
      ? "通知処理が時間内に完了しませんでした。再読み込みして状態を確認してください"
      : "Alert setup timed out. Reload to check its current state.";
  }
  button.classList.toggle("enabled", state === "on");
}

function readPushState() {
  if (!("Notification" in window)) return "unavailable";
  if (Notification.permission === "denied") return "denied";
  if (!pushSDK) return null;
  if (!pushSDK.Notifications.isPushSupported()) return "unavailable";
  const subscription = pushSDK.User?.PushSubscription;
  if (!subscription) return null;
  if (Notification.permission === "granted" && pushSDK.Notifications.permission === true &&
      subscription.optedIn === true && subscription.id && subscription.token) return "on";
  if (Notification.permission === "default") return "off";
  // Granted permission with missing registration details can be restoration in flight.
  if (subscription.optedIn === false) return "off";
  return null;
}

function syncPushStatus() {
  clearTimeout(pushTimer);
  if (pushBusy && Date.now() >= pushOperationDeadline) requirePushReload();
  if (pushRecoveryRequired) {
    renderPushStatus("recovery");
    return;
  }
  try {
    const state = readPushState();
    if (pushBusy) {
      renderPushStatus(state === "denied" ? state : "working");
    } else if (state && !(state === "off" && pushAwaitingOn) && !(state === "on" && pushAwaitingOff)) {
      pushAwaitingOn = false;
      pushAwaitingOff = false;
      renderPushStatus(state);
    } else if (Date.now() >= pushDeadline) {
      pushAwaitingOn = false;
      pushAwaitingOff = false;
      renderPushStatus("unknown");
    } else {
      renderPushStatus("checking");
      pushTimer = setTimeout(syncPushStatus, 500);
    }
  } catch (error) {
    renderPushStatus("error");
  }
}

function refreshPushStatus() {
  // A language change must preserve pending operations and retry messages.
  renderPushStatus();
}

function recheckPushStatus(startNewCheck = false) {
  // DOM events pass an event object; only explicit true starts a new deadline.
  // Unresolved/expired checks retain their deadline despite repeated focus events.
  if (startNewCheck === true || ["on", "off", "denied", "unavailable"].includes(pushState)) {
    pushDeadline = Date.now() + PUSH_WAIT_MS;
  }
  syncPushStatus();
}

function requirePushReload() {
  pushRecoveryRequired = true;
  pushBusy = false;
  pushAwaitingOn = false;
  pushAwaitingOff = false;
  ++pushOperation; // Invalidate every continuation of the timed-out operation.
  clearTimeout(pushTimer);
  renderPushStatus("recovery");
}

// SDK script loading and init() share a fixed, event-independent deadline.
const pushInitDeadline = Date.now() + PUSH_WAIT_MS;
function expirePushInit() {
  pushInitExpired = true;
  if (!("Notification" in window) || Notification.permission === "denied") return;
  requirePushReload();
}
const pushInitTimer = setTimeout(expirePushInit, PUSH_WAIT_MS);

// Explicitly wait for init(), rather than relying on ordering of deferred callbacks.
Promise.resolve(window.okazawaPushReady).then((sdk) => {
  if (Date.now() >= pushInitDeadline) expirePushInit();
  if (pushInitExpired) return;
  clearTimeout(pushInitTimer);
  if (!sdk) throw new Error("Push initialization unavailable");
  pushSDK = sdk;
  sdk.User.PushSubscription.addEventListener("change", recheckPushStatus);
  sdk.Notifications.addEventListener("permissionChange", recheckPushStatus);
  recheckPushStatus(true);
}).catch(() => {
  if (pushInitExpired) return;
  clearTimeout(pushInitTimer);
  clearTimeout(pushTimer);
  renderPushStatus(!("Notification" in window) ? "unavailable"
    : Notification.permission === "denied" ? "denied" : "error");
});
recheckPushStatus(true);

document.getElementById("push-subscribe")?.addEventListener("click", async () => {
  if (pushBusy && Date.now() >= pushOperationDeadline) requirePushReload();
  if (pushRecoveryRequired) {
    // Never start a second SDK operation alongside one that cannot be cancelled.
    // Reload restores actual state; it does not automatically call optIn().
    window.location.reload();
    return;
  }
  if (pushBusy) return;
  if (!pushSDK) {
    window.location.reload();
    return;
  }
  const state = readPushState();
  if (state !== "off" && state !== "on" && state !== null) {
    recheckPushStatus();
    return;
  }
  pushBusy = true;
  const operation = ++pushOperation;
  pushOperationDeadline = Date.now() + PUSH_WAIT_MS;
  const isCurrentOperation = () => {
    if (operation !== pushOperation) return false;
    if (Date.now() >= pushOperationDeadline) {
      requirePushReload();
      return false;
    }
    return true;
  };
  renderPushStatus("working");
  const timeout = setTimeout(() => {
    if (operation === pushOperation) requirePushReload();
  }, PUSH_WAIT_MS);
  try {
    if (state !== "on" && Notification.permission !== "granted") {
      await pushSDK.Notifications.requestPermission();
      if (!isCurrentOperation()) return;
    }
    if (state === "on") {
      await pushSDK.User.PushSubscription.optOut();
      if (!isCurrentOperation()) return;
      pushAwaitingOff = true;
      pushAwaitingOn = false;
    } else if (Notification.permission === "granted") {
      await pushSDK.User.PushSubscription.optIn();
      if (!isCurrentOperation()) return;
      pushAwaitingOn = true;
      pushAwaitingOff = false;
    }
    pushBusy = false;
    recheckPushStatus(true);
  } catch (error) {
    if (!isCurrentOperation()) return;
    pushBusy = false;
    renderPushStatus(Notification.permission === "denied" ? "denied" : "error");
  } finally {
    clearTimeout(timeout);
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") recheckPushStatus();
});
window.addEventListener("pageshow", recheckPushStatus);
window.addEventListener("focus", recheckPushStatus);
window.addEventListener("online", recheckPushStatus);

// End of notification controls.
document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{
  currentLang=button.dataset.lang;try{localStorage.setItem('okazawa-gomi-lang',currentLang);}catch(_){}refreshLanguage();
}));
document.querySelectorAll('[data-ui-icon]').forEach(node => { node.innerHTML = uiIcon(node.dataset.uiIcon); });
refreshLanguage();
let renderedDateKey=dateKey(tokyoNow()),renderedDeadline=isPastCollectionDeadline(tokyoNow());
function refreshCivilClock() {
  const now=tokyoNow(),key=dateKey(now),deadline=isPastCollectionDeadline(now),newDay=key!==renderedDateKey;
  if(!newDay&&deadline===renderedDeadline)return;
  if(newDay&&calendarSelectedKey===renderedDateKey){calendarCursor=monthStart(now);calendarSelectedKey=key;}
  renderedDateKey=key;renderedDeadline=deadline;renderToday();
  if(!document.getElementById('week-view').hidden)renderWeek();if(!document.getElementById('calendar-view').hidden)renderCalendar();
}
setInterval(refreshCivilClock,30000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refreshCivilClock();});
window.addEventListener('pageshow',refreshCivilClock);
loadWeather();
