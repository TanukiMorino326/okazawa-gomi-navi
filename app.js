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
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(date);
}

function renderToday() {
  const now = new Date();
  const collection = collectionFor(now);
  const text = document.querySelector(".today-card p");

  document.querySelector("header").insertAdjacentHTML(
    "beforeend",
    `<p class="today-date">${formatDate(now, true)}</p>`
  );

  if (collection) {
    text.innerHTML = `${collection.ja}<small>${collection.en}</small>`;
  } else {
    text.innerHTML = `収集なし<small>No collection</small>`;
  }

  const next = nextCollectionAfter(now);
  const nextText = document.querySelector(".next-card p");

  if (next) {
    nextText.innerHTML = `<span class="next-date">${formatDate(next.date)}</span>${next.collection.ja}<small>${next.collection.en}</small>`;
  } else {
    nextText.innerHTML = `年度内の次回収集情報はありません<small>No further collection data in this fiscal year</small>`;
  }
}

renderToday();
