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
    calendarButton: "カレンダー",
    weekTitle: "今週の予定",
    calendarTitle: "カレンダー",
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
    calendarButton: "Calendar",
    weekTitle: "This Week",
    calendarTitle: "Calendar",
    sourceNote: "Official fiscal-year collection calendar takes priority.",
    none: "No collection",
    noFurther: "No further collection data in this fiscal year",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    short: { burnable: "Burn.", packaging: "Pkg.", nonburnable: "Non-b.", cans: "Cans", paper: "Paper" }
  }
};

let currentLang = localStorage.getItem("okazawa-gomi-lang") || "ja";

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function collectionTypeFor(date) {
  return SCHEDULE_2026[dateKey(date)] || null;
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
    if (collection) return { date: new Date(cursor), collection };
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
  text.innerHTML = collection
    ? `${collection[currentLang]}<small>${collection[currentLang === "ja" ? "en" : "ja"]}</small>`
    : `${UI[currentLang].none}<small>${currentLang === "ja" ? "No collection" : "収集なし"}</small>`;

  const next = nextCollectionAfter(now);
  const nextText = document.querySelector(".next-card p");
  nextText.innerHTML = next
    ? `<span class="next-date">${formatDate(next.date)}</span>${next.collection[currentLang]}<small>${next.collection[currentLang === "ja" ? "en" : "ja"]}</small>`
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
    const row = document.createElement("div");
    row.className = "week-row";
    const weekday = currentLang === "en"
      ? new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
      : new Intl.DateTimeFormat("ja-JP", { weekday: "short" }).format(date);
    row.innerHTML = `
      <div class="week-date"><strong>${weekday}</strong><span>${date.getMonth() + 1}/${date.getDate()}</span></div>
      <div class="week-collection">
        <strong>${collection ? collection[currentLang] : UI[currentLang].none}</strong>
        <small>${collection ? collection[currentLang === "ja" ? "en" : "ja"] : (currentLang === "ja" ? "No collection" : "収集なし")}</small>
      </div>`;
    list.appendChild(row);
  }
}

function renderLegend() {
  const legend = document.querySelector("#calendar-legend");
  const order = ["burnable", "packaging", "cans", "paper", "nonburnable"];
  legend.innerHTML = order.map((type) =>
    `<div class="legend-item ${type}"><span class="legend-swatch"></span><span>${COLLECTIONS[type][currentLang]}</span></div>`
  ).join("");
}

function renderCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
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
    cell.className = `calendar-day${type ? ` ${type}` : ""}${day === now.getDate() ? " today" : ""}`;
    cell.innerHTML = `<span class="day-number">${day}</span>${type ? `<small>${UI[currentLang].short[type]}</small>` : ""}`;
    grid.appendChild(cell);
  }
  renderLegend();
}

function refreshLanguage() {
  applyStaticLanguage();
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
}

document.querySelector('[data-view="week"]').addEventListener("click", () => showView("week"));
document.querySelector('[data-view="calendar"]').addEventListener("click", () => showView("calendar"));
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
