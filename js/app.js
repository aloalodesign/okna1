/* ============================================================
   GLASO — app.js
   Motion: SYSTEM 05 EDITORIAL (typography reveal, image mask,
   dim scroll-state, native controlled scroll)
   ============================================================ */
"use strict";

const RUB = n => n.toLocaleString("ru-RU") + " ₽";
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ==================== DATA ==================== */
const CFG = {
  type: [
    { name: "Норд · ПВХ", price: 9900 },
    { name: "Фьорд · Энерго", price: 19500 },
    { name: "Панорама", price: 42000 },
  ],
  profile: [
    { name: "70 мм · 5 камер", price: 0 },
    { name: "82 мм · 6 камер", price: 4800 },
    { name: "Алюминий тёплый", price: 8600 },
  ],
  glass: [
    { name: "Двухкамерный", price: 0 },
    { name: "i-стекло", price: 2100 },
    { name: "Мультифункциональный", price: 4200 },
    { name: "Шумозащитный", price: 3400 },
  ],
};

const SERIES = {
  nord: { title: "Серия «Норд»", price: 9900 },
  fjord: { title: "Серия «Фьорд»", price: 19500 },
  pano: { title: "Серия «Панорама»", price: 42000 },
};

const cfgState = { w: 1400, h: 1400, type: 0, profile: 0, glass: 1, sashes: 2 };

/* ==================== CALCULATOR ==================== */
function renderOptions(elId, group, items, selected) {
  document.getElementById(elId).innerHTML = items.map((o, i) => `
    <button class="calc__opt" data-group="${group}" data-index="${i}" aria-pressed="${i === selected}">
      <span class="calc__opt-name">${o.name}</span>
      <span class="calc__opt-price">${o.price ? "+" + RUB(o.price) : "включено"}</span>
    </button>`).join("");
}

function cfgTotal() {
  const area = (cfgState.w / 1000) * (cfgState.h / 1000);
  const sashExtra = Math.max(0, cfgState.sashes - 2) * 2400;
  const raw = CFG.type[cfgState.type].price + area * 6200 +
    CFG.profile[cfgState.profile].price + CFG.glass[cfgState.glass].price + sashExtra;
  return Math.round(raw / 100) * 100;
}

function updateConfig() {
  renderOptions("cfgType", "type", CFG.type, cfgState.type);
  renderOptions("cfgProfile", "profile", CFG.profile, cfgState.profile);
  renderOptions("cfgGlass", "glass", CFG.glass, cfgState.glass);
  const area = ((cfgState.w / 1000) * (cfgState.h / 1000)).toFixed(2);
  const rows = [
    ["Размер", `${cfgState.w} × ${cfgState.h} мм · ${area} м²`],
    ["Линия", CFG.type[cfgState.type].name],
    ["Профиль", CFG.profile[cfgState.profile].name],
    ["Стеклопакет", CFG.glass[cfgState.glass].name],
    ["Створки", String(cfgState.sashes)],
    ["Монтаж и откосы", "включено"],
  ];
  document.getElementById("cfgRows").innerHTML = rows.map(([l, n]) =>
    `<div class="calc__row"><span>${l}</span><span>${n}</span></div>`).join("");
  document.getElementById("cfgSum").textContent = RUB(cfgTotal());
}

/* ==================== DRAWER / TOAST ==================== */
function openDrawer(open, title, sub) {
  document.getElementById("orderDrawer").classList.toggle("open", open);
  document.getElementById("orderDrawer").setAttribute("aria-hidden", String(!open));
  document.getElementById("backdrop").classList.toggle("open", open);
  if (title) document.getElementById("drawerTitle").textContent = title;
  if (sub) document.getElementById("drawerSub").textContent = sub;
  if (open) document.getElementById("drawerClose").focus();
}

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
  if (opt) { cfgState[opt.dataset.group] = +opt.dataset.index; updateConfig(); return; }

  const order = t.closest("[data-order]");
  if (order) {
    const s = SERIES[order.dataset.order];
    openDrawer(`Заказать · ${s.title}`, `«${s.title}» — от ${RUB(s.price)} под ключ. Оставьте контакты, зафиксируем цену и предложим время замера.`);
    return;
  }

  if (t.closest("#cfgOrder")) {
    openDrawer("Зафиксировать цену", `Ваша конфигурация — ${RUB(cfgTotal())}. Оставьте контакты, зафиксируем цену на 14 дней и приедем на замер.`);
    return;
  }

  if (t.closest("[data-cta]")) {
    document.getElementById("mmenu").classList.remove("open");
    openDrawer(true, "Вызвать замерщика", "Оставьте контакты — инженер перезвонит в течение 15 минут и приедет в удобное время. Это ни к чему не обязывает.");
    return;
  }

  if (t.closest("#drawerClose") || t.closest("#backdrop")) { openDrawer(false); return; }

  if (t.closest("#burgerBtn")) { document.getElementById("mmenu").classList.add("open"); return; }
  if (t.closest("#mmenuClose") || t.closest("#mmenu a")) { document.getElementById("mmenu").classList.remove("open"); return; }
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

document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();
  openDrawer(false);
  toast("Заявка отправлена! Инженер перезвонит в течение 15 минут");
  e.target.reset();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    openDrawer(false);
    document.getElementById("mmenu").classList.remove("open");
  }
});

/* ==================== MOTION — SYSTEM 05 EDITORIAL ==================== */

/* Reveals: typography y32→0 (700ms), image mask (1000ms), hero settle.
   Scroll + rect checker — no IntersectionObserver dependency;
   above-fold elements reveal instantly on load. */
const revealEls = [...document.querySelectorAll(".rv-t, .rv-img, .rv-hero")];

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

/* Dim scroll-state (EDITORIAL signature):
   major headings fade to .25 when outside the focus band. */
const dimEls = [...document.querySelectorAll(".dim")];

function dimCheck() {
  const vh = window.innerHeight;
  dimEls.forEach(h => {
    const r = h.getBoundingClientRect();
    const center = r.top + r.height / 2;
    const inBand = center > vh * 0.18 && center < vh * 0.82;
    h.classList.toggle("dimmed", !inBand);
  });
}

/* ==================== INIT ==================== */
updateConfig();
document.querySelectorAll("main section").forEach(section => {
  section.querySelectorAll(".rv-t, .rv-img").forEach((el, i) => {
    if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", `${Math.min(i, 4) * 60}ms`);
  });
});
if (RM) { revealEls.forEach(el => el.classList.add("visible")); } else { revealCheck(); }
if (!RM) { dimCheck(); window.addEventListener("scroll", dimCheck, { passive: true }); }
