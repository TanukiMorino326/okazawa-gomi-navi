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

function renderToday() {
  const now = new Date();
  const collection = collectionFor(now);
  const section = document.querySelector("section");
  const text = section.querySelector("p");

  const dateText = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "short"
  }).format(now);

  document.querySelector("header").insertAdjacentHTML(
    "beforeend",
    `<p class="today-date">${dateText}</p>`
  );

  if (collection) {
    text.innerHTML = `${collection.ja}<small>${collection.en}</small>`;
  } else {
    text.innerHTML = `収集なし<small>No collection</small>`;
  }
}

renderToday();
