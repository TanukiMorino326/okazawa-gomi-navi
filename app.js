const COLLECTIONS = {
  burnable: { ja: "燃やせるごみ・生ごみ", en: "Burnable Garbage / Food Waste" },
  packaging: { ja: "容器包装", en: "Paper & Plastic Packaging" },
  nonburnable: { ja: "燃やせないごみ", en: "Non-burnable Garbage" },
  cans: { ja: "缶・びん・PETボトル", en: "Cans / Bottles / PET Bottles" },
  paper: { ja: "新聞紙・雑誌類・段ボール", en: "Newspapers / Magazines / Cardboard" }
};

function collectionFor(date) {
  const day = date.getDay();
  const nth = Math.ceil(date.getDate() / 7);

  if ([1, 3, 5].includes(day)) return COLLECTIONS.burnable;
  if (day === 4) return COLLECTIONS.packaging;
  if (day === 6 && [1, 3].includes(nth)) return COLLECTIONS.nonburnable;
  if (day === 2 && [1, 3].includes(nth)) return COLLECTIONS.cans;
  if (day === 2 && [2, 4].includes(nth)) return COLLECTIONS.paper;
  return null;
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
