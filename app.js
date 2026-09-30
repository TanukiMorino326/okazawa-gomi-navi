const COLLECTIONS = {
  burnable: { ja: "燃やせるごみ・生ごみ", en: "Burnable Garbage / Food Waste" },
  packaging: { ja: "容器包装", en: "Paper & Plastic Packaging" },
  nonburnable: { ja: "燃やせないごみ", en: "Non-burnable Garbage" },
  cans: { ja: "缶・びん・PETボトル", en: "Cans / Bottles / PET Bottles" },
  paper: { ja: "新聞紙・雑誌類・段ボール", en: "Newspapers / Magazines / Cardboard" }
};

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function collectionFor(date) {
  const type = SCHEDULE_2026[dateKey(date)];
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
  return new Intl.DateTimeFormat("ja-JP", {
    ...(includeYear ? { year: "numeric" } : {}),
    month: "long", day: "numeric", weekday: "short"
  }).format(date);
}

function renderToday() {
  const now = new Date();
  const collection = collectionFor(now);
  const text = document.querySelector(".today-card p");

  document.querySelector("#home-view header").insertAdjacentHTML(
    "beforeend",
    `<p class="today-date">${formatDate(now, true)}</p>`
  );

  text.innerHTML = collection
    ? `${collection.ja}<small>${collection.en}</small>`
    : `収集なし<small>No collection</small>`;

  const next = nextCollectionAfter(now);
  const nextText = document.querySelector(".next-card p");
  nextText.innerHTML = next
    ? `<span class="next-date">${formatDate(next.date)}</span>${next.collection.ja}<small>${next.collection.en}</small>`
    : `年度内の次回収集情報はありません<small>No further collection data in this fiscal year</small>`;
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

  document.querySelector("#week-range").textContent =
    `${formatDate(start)} – ${formatDate(end)}`;

  const list = document.querySelector("#week-list");
  list.innerHTML = "";

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const collection = collectionFor(date);
    const row = document.createElement("div");
    row.className = "week-row";
    row.innerHTML = `
      <div class="week-date">
        <strong>${new Intl.DateTimeFormat("ja-JP", { weekday: "short" }).format(date)}</strong>
        <span>${date.getMonth() + 1}/${date.getDate()}</span>
      </div>
      <div class="week-collection">
        <strong>${collection ? collection.ja : "収集なし"}</strong>
        <small>${collection ? collection.en : "No collection"}</small>
      </div>`;
    list.appendChild(row);
  }
}

function collectionTypeFor(date) {
  return SCHEDULE_2026[dateKey(date)] || null;
}

function renderCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  document.querySelector("#calendar-month").textContent = `${year}年${month + 1}月`;

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
    const labels = { burnable: "燃・生", packaging: "容器", nonburnable: "不燃", cans: "缶びん", paper: "古紙" };
    cell.innerHTML = `<span class="day-number">${day}</span>${type ? `<small>${labels[type]}</small>` : ""}`;
    grid.appendChild(cell);
  }
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

renderToday();
