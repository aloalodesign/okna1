/* ============================================================
   OKNA — app.js
   Catalog + unified configurator/calculator + BA slider + UI
   ============================================================ */
"use strict";

const RUB = n => n.toLocaleString("ru-RU") + " ₽";
const IMG = id => "img/" + id + ".jpg";

/* ==================== DATA ==================== */
const PRODUCTS = [
  { id: "w1", name: "Окно Комфорт 60", desc: "3-камерный профиль · 2 створки", price: 9900, img: "04-type-pvc", tags: ["ПВХ", "Хит"], cats: ["pvc"], pop: 98 },
  { id: "w2", name: "Окно Стандарт 58", desc: "Глухая + поворотная створка", price: 8400, img: "11-product-bedroom", tags: ["ПВХ"], cats: ["pvc"], pop: 90 },
  { id: "w3", name: "Алюминиевый фасад AL-50", desc: "Тёплый алюминий · анодирование", price: 28900, img: "05-type-alu", tags: ["Алюминий"], cats: ["alu"], pop: 72 },
  { id: "w4", name: "Панорама Vision Max", desc: "До 6 м · скрытый профиль", price: 78000, img: "06-type-panorama", tags: ["Панорама", "Премиум"], cats: ["pano", "alu"], pop: 84 },
  { id: "w5", name: "Раздвижная система Slide 2000", desc: "Параллельно-сдвижная · 2–4 полотна", price: 42000, img: "07-type-sliding", tags: ["Раздвижная"], cats: ["slide", "pano"], pop: 76 },
  { id: "w6", name: "Балкон Эконом 3 створки", desc: "Глухие + поворотная · отделка в подарок", price: 24900, img: "08-type-balcony", tags: ["ПВХ", "Балкон"], cats: ["balcony", "pvc"], pop: 88 },
  { id: "w7", name: "Дом Тёплый контур", desc: "5 камер · 70 мм · энергостеклопакет", price: 19500, img: "09-type-house", tags: ["ПВХ", "Энерго"], cats: ["pvc", "house"], pop: 82 },
  { id: "w8", name: "Портальное окно Portal 6", desc: "Сдвижное до 6 м · терморазрыв", price: 156000, img: "03-house-facade", tags: ["Премиум", "Раздвижная"], cats: ["slide", "pano", "alu", "house"], pop: 66 },
  { id: "w9", name: "Окно Тихий двор", desc: "Шумозащита до −42 dB", price: 14300, img: "12-product-city", tags: ["ПВХ", "Тишина"], cats: ["pvc"], pop: 78 },
];

const CFG = {
  type: [
    { name: "ПВХ-окно", price: 9900 },
    { name: "Алюминий", price: 18500 },
    { name: "Панорама", price: 42000 },
  ],
  profile: [
    { name: "3 камеры · 58 мм", price: 0 },
    { name: "5 камер · 70 мм", price: 3200 },
    { name: "6 камер · 82 мм", price: 5800 },
  ],
  glass: [
    { name: "Двухкамерный", price: 0 },
    { name: "Энергосберегающий i", price: 2100 },
    { name: "Шумозащитный", price: 3400 },
    { name: "Мультифункциональный", price: 4200 },
  ],
  furn: [
    { name: "Стандарт", price: 0 },
    { name: "Противовзломная", price: 2600 },
    { name: "Премиум Roto NX", price: 4900 },
  ],
};

const REVIEWS = [
  { name: "Сергей М.", city: "Москва · ЖК «Символ»", text: "Замерщик приехал в тот же день, монтаж занял 4 часа. Ни капли грязи, всё упаковали и вывезли. Окна стоят идеально." },
  { name: "Наталья В.", city: "Химки", text: "Меняли три окна в квартире. Отдельное спасибо за шумозащитные стеклопакеты — наконец-то не слышно трассу." },
  { name: "Игорь и Ольга", city: "Загородный дом, Истра", text: "Заказывали панораму на 5 метров. Приехали, посоветовали терморазрыв — зимой стекло холодное не бывает. Работой довольны на 100%." },
  { name: "Дмитрий К.", city: "Одинцово", text: "Раздвижная терраса — мечта осуществилась. Порадовало, что цена в договоре не поменялась ни на рубль после замера." },
  { name: "Елена П.", city: "Москва", text: "Балкон под ключ: утепление, тёплый пол, отделка. Получилась ещё одна комната. Всё за 5 дней, как и обещали." },
  { name: "Андрей С.", city: "Казань", text: "Заказывал окна в офис. Работали в выходные, чтобы не мешать. Аккуратно, быстро, документы в порядке." },
];

/* ==================== STATE ==================== */
const cfgState = { w: 1400, h: 1400, type: 0, profile: 1, glass: 1, furn: 0, sashes: 2 };

/* ==================== CATALOG ==================== */
let activeFilter = "all";
let activeSort = "popular";

function productCardHTML(p) {
  return `
  <article class="product-card">
    <div class="product-card__media">
      <img src="${IMG(p.img)}" alt="${p.name}" loading="lazy">
      <div class="product-card__overlay">
        <h3 class="product-card__title">${p.name}</h3>
        <p class="product-card__desc">${p.desc}</p>
        <div class="product-card__tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
      <div class="product-card__foot">
        <span class="product-card__price">${RUB(p.price)}</span>
        <button class="btn btn--white btn--add" data-order="${p.id}">Заказать</button>
      </div>
    </div>
  </article>`;
}

function renderCatalog() {
  let list = [...PRODUCTS];
  if (activeFilter !== "all") list = list.filter(p => p.cats.includes(activeFilter));
  if (activeSort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (activeSort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (activeSort === "popular") list.sort((a, b) => b.pop - a.pop);
  document.getElementById("catalogGrid").innerHTML = list.map(productCardHTML).join("");
  document.getElementById("catalogEmpty").hidden = list.length > 0;
}

/* ==================== CONFIGURATOR / CALCULATOR ==================== */
function renderOptions(elId, group, items, selected) {
  document.getElementById(elId).innerHTML = items.map((o, i) => `
    <button class="config__opt" data-group="${group}" data-index="${i}" aria-pressed="${i === selected}">
      <span class="config__opt-name">${o.name}</span>
      <span class="config__opt-price">${o.price ? "+" + RUB(o.price) : "включено"}</span>
    </button>`).join("");
}

function cfgTotal() {
  const area = (cfgState.w / 1000) * (cfgState.h / 1000);
  const base = CFG.type[cfgState.type].price + area * 6200;
  const sashExtra = Math.max(0, cfgState.sashes - 2) * 2400;
  const raw = base + CFG.profile[cfgState.profile].price +
    CFG.glass[cfgState.glass].price + CFG.furn[cfgState.furn].price + sashExtra;
  return Math.round(raw / 100) * 100;
}

function updateConfig() {
  renderOptions("cfgType", "type", CFG.type, cfgState.type);
  renderOptions("cfgProfile", "profile", CFG.profile, cfgState.profile);
  renderOptions("cfgGlass", "glass", CFG.glass, cfgState.glass);
  renderOptions("cfgFurn", "furn", CFG.furn, cfgState.furn);
  const area = ((cfgState.w / 1000) * (cfgState.h / 1000)).toFixed(2);
  const rows = [
    ["Размер", `${cfgState.w} × ${cfgState.h} мм · ${area} м²`],
    ["Тип", CFG.type[cfgState.type].name],
    ["Профиль", CFG.profile[cfgState.profile].name],
    ["Стеклопакет", CFG.glass[cfgState.glass].name],
    ["Фурнитура", CFG.furn[cfgState.furn].name],
    ["Створки", String(cfgState.sashes)],
    ["Монтаж и откосы", "включено"],
  ];
  document.getElementById("cfgRows").innerHTML = rows.map(([l, n]) =>
    `<div class="config__row"><span>${l}</span><span>${n}</span></div>`).join("");
  document.getElementById("cfgSum").textContent = RUB(cfgTotal());
}

/* ==================== REVIEWS ==================== */
let revIndex = 0;
function renderReviews() {
  document.getElementById("reviewsTrack").innerHTML = REVIEWS.map(r => `
    <article class="review-card">
      <div class="review-card__head">
        <img class="review-card__avatar" src="img/av1.jpg" alt="${r.name}" loading="lazy">
        <div>
          <div class="review-card__name">${r.name}</div>
          <div class="review-card__meta">${r.city}</div>
        </div>
      </div>
      <p class="review-card__text">«${r.text}»</p>
    </article>`).join("");
  updateReviewsCarousel();
}

function reviewsPerPage() {
  const w = window.innerWidth;
  return w <= 640 ? 1 : w <= 1024 ? 2 : 4;
}

function updateReviewsCarousel() {
  const track = document.getElementById("reviewsTrack");
  const per = reviewsPerPage();
  const max = Math.max(0, REVIEWS.length - per);
  revIndex = Math.min(revIndex, max);
  const colW = track.firstElementChild ? track.firstElementChild.offsetWidth : 0;
  track.style.transform = `translateX(-${revIndex * (colW + 24)}px)`;
  document.getElementById("reviewsCount").textContent = `${revIndex + 1} / ${max + 1}`;
  document.getElementById("revPrev").disabled = revIndex === 0;
  document.getElementById("revNext").disabled = revIndex >= max;
}

/* ==================== DRAWER ==================== */
function openDrawer(open, title, sub) {
  document.getElementById("orderDrawer").classList.toggle("open", open);
  document.getElementById("orderDrawer").setAttribute("aria-hidden", String(!open));
  document.getElementById("drawerBackdrop").classList.toggle("open", open);
  if (title) document.getElementById("drawerTitle").textContent = title;
  if (sub) document.getElementById("drawerSub").textContent = sub;
  if (open) document.getElementById("drawerClose").focus();
}

/* ==================== TOAST ==================== */
let toastTimer;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

/* ==================== EVENTS ==================== */
document.addEventListener("click", e => {
  const t = e.target;

  const opt = t.closest("[data-group]");
  if (opt) {
    cfgState[opt.dataset.group] = +opt.dataset.index;
    updateConfig();
    return;
  }

  if (t.closest("#cfgMinus")) { cfgState.sashes = Math.max(1, cfgState.sashes - 1); document.getElementById("cfgSashes").value = cfgState.sashes; updateConfig(); return; }
  if (t.closest("#cfgPlus")) { cfgState.sashes = Math.min(6, cfgState.sashes + 1); document.getElementById("cfgSashes").value = cfgState.sashes; updateConfig(); return; }

  const orderBtn = t.closest("[data-order]");
  if (orderBtn) {
    const p = PRODUCTS.find(p => p.id === orderBtn.dataset.order);
    openDrawer("Заказать окно", `«${p.name}» — ${RUB(p.price)} под ключ. Оставьте контакты, зафиксируем цену и предложим время замера.`);
    return;
  }

  const typeCard = t.closest("[data-type]");
  if (typeCard) {
    const f = typeCard.dataset.type;
    activeFilter = f;
    document.querySelectorAll(".filter-chip").forEach(c =>
      c.setAttribute("aria-pressed", String(c.dataset.filter === f)));
    renderCatalog();
    return;
  }

  const chip = t.closest(".filter-chip");
  if (chip) {
    activeFilter = chip.dataset.filter;
    document.querySelectorAll(".filter-chip").forEach(c =>
      c.setAttribute("aria-pressed", String(c === chip)));
    renderCatalog();
    return;
  }

  if (t.closest("#cfgOrder")) {
    openDrawer("Зафиксировать цену", `Ваша конфигурация — ${RUB(cfgTotal())}. Оставьте контакты, зафиксируем цену на 14 дней и приедем на замер.`);
    return;
  }

  if (t.closest("#drawerClose") || t.closest("#drawerBackdrop")) { openDrawer(false); return; }

  if (t.closest("[data-cta]")) {
    document.getElementById("mobileMenu").classList.remove("open");
    openDrawer(true, "Вызвать замерщика", "Оставьте контакты — инженер приедет на бесплатный замер в удобное время. Это ни к чему не обязывает.");
    return;
  }

  if (t.closest("#burgerBtn")) { document.getElementById("mobileMenu").classList.add("open"); return; }
  if (t.closest("#mobileClose") || t.closest("#mobileMenu a")) { document.getElementById("mobileMenu").classList.remove("open"); return; }
});

document.getElementById("cfgSashes").addEventListener("change", e => {
  cfgState.sashes = Math.min(6, Math.max(1, +e.target.value || 1));
  e.target.value = cfgState.sashes;
  updateConfig();
});

["cfgW", "cfgH"].forEach(id => {
  document.getElementById(id).addEventListener("input", e => {
    const key = id === "cfgW" ? "w" : "h";
    cfgState[key] = Math.max(+e.target.min, Math.min(+e.target.max, +e.target.value || +e.target.min));
    updateConfig();
  });
});

document.getElementById("sortSelect").addEventListener("change", e => {
  activeSort = e.target.value;
  renderCatalog();
});

document.getElementById("revPrev").addEventListener("click", () => { revIndex--; updateReviewsCarousel(); });
document.getElementById("revNext").addEventListener("click", () => { revIndex++; updateReviewsCarousel(); });
window.addEventListener("resize", updateReviewsCarousel);

document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();
  openDrawer(false);
  toast("Заявка отправлена! Менеджер свяжется с вами в ближайшее время");
  e.target.reset();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    openDrawer(false);
    document.getElementById("mobileMenu").classList.remove("open");
  }
});

/* ==================== NAVBAR ==================== */
window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("navbar--solid", window.scrollY > 60);
}, { passive: true });

/* ==================== REVEAL ON SCROLL ====================
   Scroll + rect checker (no IntersectionObserver dependency):
   works in every browser; above-fold items reveal instantly. */
const revealEls = [...document.querySelectorAll(".reveal")];

function revealCheck() {
  const vh = window.innerHeight;
  for (const el of revealEls) {
    if (el.classList.contains("visible")) continue;
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add("visible");
  }
}

let revealRaf = false;
window.addEventListener("scroll", () => {
  if (!revealRaf) { requestAnimationFrame(() => { revealCheck(); revealRaf = false; }); revealRaf = true; }
}, { passive: true });

/* ==================== INIT ==================== */
renderCatalog();
updateConfig();
renderReviews();
revealCheck();
