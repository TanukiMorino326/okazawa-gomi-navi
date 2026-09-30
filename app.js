const COLLECTIONS = {
  burnable: { ja: "燃やせるごみ・生ごみ", en: "Burnable Garbage / Food Waste" },
  packaging: { ja: "容器包装", en: "Paper & Plastic Packaging" },
  nonburnable: { ja: "燃やせないごみ", en: "Non-burnable Garbage" },
  cans: { ja: "缶・びん・PETボトル", en: "Cans / Bottles / PET Bottles" },
  paper: { ja: "新聞紙・雑誌類・段ボール", en: "Newspapers / Magazines / Cardboard" }
};

const UI = {
  ja: {
    area: "上越市 中郷区 C地区",
    todayTitle: "今日のごみ",
    nextTitle: "次の収集",
    weekButton: "今週の予定",
    homeTab: "今日", weekTab: "週間", calendarTab: "カレンダー",
    calendarButton: "カレンダー",
    weekTitle: "今週の予定",
    calendarTitle: "カレンダー",
    weatherTitle: "岡沢の天気",
    weatherLoading: "天気情報を読み込みます",
    weatherError: "天気情報を取得できませんでした",
    todayWeather: "今日",
    tomorrowWeather: "明日",
    rainChance: "降水",
    sourceNote: "実際の収集日は年度カレンダーを優先",
    none: "収集なし",
    noFurther: "年度内の次回収集情報はありません",
    weekdays: ["月", "火", "水", "木", "金", "土", "日"],
    short: { burnable: "燃・生", packaging: "容器", nonburnable: "不燃", cans: "缶びん", paper: "古紙" }
  },
  en: {
    area: "Nakago, Joetsu — Area C",
    todayTitle: "Today's Collection",
    nextTitle: "Next Collection",
    weekButton: "This Week",
    homeTab: "Today", weekTab: "Week", calendarTab: "Calendar",
    calendarButton: "Calendar",
    weekTitle: "This Week",
    calendarTitle: "Calendar",
    weatherTitle: "Okazawa Weather",
    weatherLoading: "Loading weather",
    weatherError: "Weather data unavailable",
    todayWeather: "Today",
    tomorrowWeather: "Tomorrow",
    rainChance: "Rain",
    sourceNote: "Official fiscal-year collection calendar takes priority.",
    none: "No collection",
    noFurther: "No further collection data in this fiscal year",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    short: { burnable: "Burn.", packaging: "Pkg.", nonburnable: "Non-b.", cans: "Cans", paper: "Paper" }
  }
};

const SPECIAL_COLLECTION = {
  ja: "乾電池等／蛍光灯・電球",
  en: "Batteries / Fluorescent Lamps / Light Bulbs"
};

let currentLang = localStorage.getItem("okazawa-gomi-lang") || "ja";
let calendarCursor = new Date();
calendarCursor.setDate(1);
calendarCursor.setHours(12, 0, 0, 0);


function collectionIcon(type, size = "md") {
  const common = 'viewBox="0 0 32 32" aria-hidden="true" focusable="false"';
  const icons = {
    burnable: `<svg ${common}><path d="M9 11h14l-1.2 16H10.2L9 11Z"/><path d="M12 11V8h8v3"/><path class="accent" d="M16 23c-2.2-1.3-3.3-3-2.6-4.8.5-1.2 1.5-1.8 2.1-3.4 2.7 1.9 4.4 4.1 3.3 6.3-.5 1-1.4 1.6-2.8 1.9Z"/></svg>`,
    packaging: `<svg ${common}><rect x="5" y="15" width="22" height="11" rx="3"/><path d="M8 15l2-7h12l2 7M12 11h8"/><path class="accent" d="M10 20h12"/></svg>`,
    cans: `<svg ${common}><rect x="5" y="8" width="9" height="18" rx="2"/><path d="M6 11h7M6 23h7"/><path d="M20 6h5v4l2 3v13h-9V13l2-3V6Z"/><path class="accent" d="M20 16h5"/></svg>`,
    paper: `<svg ${common}><path d="M7 9l15-3 3 15-15 3L7 9Z"/><path d="M5 13l3 13 16-4"/><path class="accent" d="M11 11l8-2M12 15l8-2M13 19l8-2"/></svg>`,
    nonburnable: `<svg ${common}><path d="M7 14h16l-1 11H8L7 14Z"/><path d="M10 14v-2h10v2M5 17h3M23 17h4"/><path class="accent" d="M13 9h6"/></svg>`,
    special: `<svg ${common}><rect x="5" y="9" width="9" height="17" rx="2"/><path d="M8 6h3v3M8 14h3M9.5 12.5v3"/><path d="M21 7c-3 0-5 2.2-5 5 0 2 1 3.2 2.3 4.5V20h5.4v-3.5C25 15.2 26 14 26 12c0-2.8-2-5-5-5Z"/><path class="accent" d="M19 23h4M19 26h4"/></svg>`
  };
  return `<span class="collection-icon collection-icon-${size} ${type}">${icons[type] || ""}</span>`;
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function collectionTypeFor(date) {
  return SCHEDULE_2026[dateKey(date)] || null;
}

function hasSpecialCollection(date) {
  return SPECIAL_COLLECTION_2026.has(dateKey(date));
}

function collectionFor(date) {
  const type = collectionTypeFor(date);
  return type ? COLLECTIONS[type] : null;
}

function nextCollectionAfter(date) {
  const cursor = new Date(date);
  cursor.setHours(12, 0, 0, 0);
  for (let i = 1; i <= 370; i += 1) {
    cursor.setDate(cursor.getDate() + 1);
    const collection = collectionFor(cursor);
    if (collection) return { date: new Date(cursor), collection, type: collectionTypeFor(cursor) };
  }
  return null;
}

function formatDate(date, includeYear = false) {
  if (currentLang === "en") {
    return new Intl.DateTimeFormat("en-US", {
      ...(includeYear ? { year: "numeric" } : {}),
      month: "short", day: "numeric", weekday: "short"
    }).format(date);
  }
  return new Intl.DateTimeFormat("ja-JP", {
    ...(includeYear ? { year: "numeric" } : {}),
    month: "long", day: "numeric", weekday: "short"
  }).format(date);
}

function applyStaticLanguage() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = UI[currentLang][el.dataset.i18n];
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === currentLang);
  });
}

function renderToday() {
  const now = new Date();
  const collection = collectionFor(now);
  let dateLine = document.querySelector(".today-date");
  if (!dateLine) {
    dateLine = document.createElement("p");
    dateLine.className = "today-date";
    document.querySelector("#home-view header").appendChild(dateLine);
  }
  dateLine.textContent = formatDate(now, true);

  const text = document.querySelector(".today-card p");
  const todayType = collectionTypeFor(now);
  text.innerHTML = collection
    ? `<span class="collection-line">${collectionIcon(todayType, "lg")}<span class="collection-copy">${collection[currentLang]}<small>${collection[currentLang === "ja" ? "en" : "ja"]}</small></span></span>`
    : `<span class="collection-line"><span class="collection-copy">${UI[currentLang].none}<small>${currentLang === "ja" ? "No collection" : "収集なし"}</small></span></span>`;
  if (hasSpecialCollection(now)) {
    text.insertAdjacentHTML("beforeend",
      `<span class="special-note"><b>${currentLang === "ja" ? "特別収集" : "Special Collection"}</b>${SPECIAL_COLLECTION[currentLang]}</span>`
    );
  }

  const next = nextCollectionAfter(now);
  const nextText = document.querySelector(".next-card p");
  nextText.innerHTML = next
    ? `<span class="next-date">${formatDate(next.date)}</span><span class="collection-line">${collectionIcon(next.type, "md")}<span class="collection-copy">${next.collection[currentLang]}<small>${next.collection[currentLang === "ja" ? "en" : "ja"]}</small></span></span>`
    : UI[currentLang].noFurther;
}

function mondayOfWeek(date) {
  const monday = new Date(date);
  monday.setHours(12, 0, 0, 0);
  const day = monday.getDay();
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  return monday;
}

function renderWeek() {
  const start = mondayOfWeek(new Date());
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  document.querySelector("#week-range").textContent = `${formatDate(start)} – ${formatDate(end)}`;

  const list = document.querySelector("#week-list");
  list.innerHTML = "";
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const collection = collectionFor(date);
    const type = collectionTypeFor(date);
    const row = document.createElement("div");
    row.className = `week-row${type ? ` ${type}` : ""}`;
    const weekday = currentLang === "en"
      ? new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
      : new Intl.DateTimeFormat("ja-JP", { weekday: "short" }).format(date);
    row.innerHTML = `
      <div class="week-date"><strong>${weekday}</strong><span>${date.getMonth() + 1}/${date.getDate()}</span></div>
      <div class="week-collection">
        <div class="week-collection-main">${type ? collectionIcon(type, "sm") : '<span class="collection-icon-placeholder"></span>'}<strong>${collection ? collection[currentLang] : UI[currentLang].none}</strong></div>
        <small>${collection ? collection[currentLang === "ja" ? "en" : "ja"] : (currentLang === "ja" ? "No collection" : "収集なし")}</small>
      </div>
      ${hasSpecialCollection(date) ? `<div class="week-special"><b>${currentLang === "ja" ? "特別収集" : "Special"}</b> ${SPECIAL_COLLECTION[currentLang]}</div>` : ""}`;
    list.appendChild(row);
  }
}

function renderLegend() {
  const legend = document.querySelector("#calendar-legend");
  const order = ["burnable", "packaging", "cans", "paper", "nonburnable"];
  legend.innerHTML = order.map((type) =>
    `<div class="legend-item ${type}">${collectionIcon(type, "sm")}<span>${COLLECTIONS[type][currentLang]}</span></div>`
  ).join("") +
    `<div class="legend-item special">${collectionIcon("special", "sm")}<span>${SPECIAL_COLLECTION[currentLang]}</span></div>`;
}

function renderCalendar() {
  const now = new Date();
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  document.querySelector("#calendar-month").textContent = currentLang === "en"
    ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(now)
    : `${year}年${month + 1}月`;

  document.querySelector(".calendar-weekdays").innerHTML =
    UI[currentLang].weekdays.map((day) => `<span>${day}</span>`).join("");

  const first = new Date(year, month, 1, 12);
  const last = new Date(year, month + 1, 0, 12);
  const leading = (first.getDay() + 6) % 7;
  const grid = document.querySelector("#calendar-grid");
  grid.innerHTML = "";

  for (let i = 0; i < leading; i += 1) {
    const blank = document.createElement("div");
    blank.className = "calendar-day blank";
    grid.appendChild(blank);
  }

  for (let day = 1; day <= last.getDate(); day += 1) {
    const date = new Date(year, month, day, 12);
    const type = collectionTypeFor(date);
    const cell = document.createElement("div");
    cell.className = `calendar-day${type ? ` ${type}` : ""}${year === now.getFullYear() && month === now.getMonth() && day === now.getDate() ? " today" : ""}`;
    cell.innerHTML = `<span class="day-number">${day}</span>${type ? `${collectionIcon(type, "xs")}<small class="calendar-short">${UI[currentLang].short[type]}</small>` : ""}${hasSpecialCollection(date) ? `<span class="special-badge">${currentLang === "ja" ? "特" : "S"}</span>` : ""}`;
    grid.appendChild(cell);
  }
  renderLegend();
}

function weatherLabel(code, lang) {
  if (code === 0) return lang === "ja" ? "晴れ" : "Clear";
  if ([1, 2].includes(code)) return lang === "ja" ? "晴れ・くもり" : "Partly cloudy";
  if (code === 3) return lang === "ja" ? "くもり" : "Cloudy";
  if ([45, 48].includes(code)) return lang === "ja" ? "霧" : "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return lang === "ja" ? "霧雨" : "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return lang === "ja" ? "雨" : "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return lang === "ja" ? "雪" : "Snow";
  if ([95, 96, 99].includes(code)) return lang === "ja" ? "雷雨" : "Thunderstorm";
  return lang === "ja" ? "天気" : "Weather";
}

function weatherIcon(code) {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "🌨️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌡️";
}

let weatherData = null;

function renderWeather() {
  const box = document.getElementById("weather-content");
  if (!box) return;
  if (!weatherData) {
    box.innerHTML = `<p class="weather-loading">${UI[currentLang].weatherLoading}</p>`;
    return;
  }
  const d = weatherData.daily;
  box.innerHTML = [0, 1].map((i) => `
    <div class="weather-day">
      <div>
        <b>${i === 0 ? UI[currentLang].todayWeather : UI[currentLang].tomorrowWeather}</b>
        <span class="weather-condition">${weatherIcon(d.weather_code[i])} ${weatherLabel(d.weather_code[i], currentLang)}</span>
      </div>
      <div class="weather-values">
        <strong>${Math.round(d.temperature_2m_max[i])}° / ${Math.round(d.temperature_2m_min[i])}°</strong>
        <small>${UI[currentLang].rainChance} ${d.precipitation_probability_max[i]}%</small>
      </div>
    </div>
  `).join("");
}

async function loadWeather() {
  const box = document.getElementById("weather-content");
  try {
    // 岡沢の固定代表地点。端末の位置情報は使用しない。
    const url = "https://api.open-meteo.com/v1/forecast?latitude=36.9849&longitude=138.2010&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&forecast_days=2";
    const response = await fetch(url);
    if (!response.ok) throw new Error("weather request failed");
    weatherData = await response.json();
    renderWeather();
  } catch (error) {
    if (box) box.innerHTML = `<p class="weather-loading">${UI[currentLang].weatherError}</p>`;
  }
}

function refreshLanguage() {
  applyStaticLanguage();
  renderWeather();
  renderToday();
  if (!document.querySelector("#week-view").hidden) renderWeek();
  if (!document.querySelector("#calendar-view").hidden) renderCalendar();
}

function showView(view) {
  document.querySelector("#home-view").hidden = view !== "home";
  document.querySelector("#week-view").hidden = view !== "week";
  document.querySelector("#calendar-view").hidden = view !== "calendar";
  if (view === "week") renderWeek();
  if (view === "calendar") renderCalendar();
  document.querySelectorAll("[data-tab]").forEach((button) => button.classList.toggle("active", button.dataset.tab === view));
}

document.querySelector('[data-view="week"]').addEventListener("click", () => showView("week"));
document.querySelector('[data-view="calendar"]').addEventListener("click", () => showView("calendar"));
document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.tab));
});
document.getElementById("prev-month").addEventListener("click", () => {
  calendarCursor.setMonth(calendarCursor.getMonth() - 1);
  renderCalendar();
});
document.getElementById("next-month").addEventListener("click", () => {
  calendarCursor.setMonth(calendarCursor.getMonth() + 1);
  renderCalendar();
});

document.querySelectorAll('[data-view="home"]').forEach((button) => {
  button.addEventListener("click", () => showView("home"));
});
document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    currentLang = button.dataset.lang;
    localStorage.setItem("okazawa-gomi-lang", currentLang);
    refreshLanguage();
  });
});

refreshLanguage();


loadWeather();
