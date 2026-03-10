// Tiny UX: toggle active tab highlight (Stats / Messages)
document.addEventListener("click", (e) => {
  const btn = e.target instanceof Element ? e.target.closest(".tab") : null;
  if (!btn) return;
  const wrap = btn.closest(".sidecard__tabs");
  if (!wrap) return;
  for (const el of wrap.querySelectorAll(".tab")) el.classList.remove("tab--active");
  btn.classList.add("tab--active");
});

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function toInt(v) {
  const n = Number.parseInt(String(v ?? "").replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function applySuccessRateCard() {
  const donut = document.querySelector(".donut");
  if (!donut) return;

  const card = donut.closest(".card");
  const successfulEl = card?.querySelector(".statsRow [data-successful]") ?? null;
  const unsuccessfulEl = card?.querySelector(".statsRow [data-unsuccessful]") ?? null;
  const valueEl = donut.querySelector("[data-donut-value]") ?? null;
  const fgCircle = donut.querySelector(".donutSvg__fg");

  const successful = toInt(donut.getAttribute("data-successful") ?? successfulEl?.textContent);
  const unsuccessful = toInt(donut.getAttribute("data-unsuccessful") ?? unsuccessfulEl?.textContent);
  const total = successful + unsuccessful;

  const rateOverride = donut.getAttribute("data-success-rate");
  const computed = total > 0 ? (successful / total) * 100 : 0;
  const percent = clamp(
    Number.isFinite(Number(rateOverride)) ? Number(rateOverride) : Math.round(computed),
    0,
    100,
  );

  donut.setAttribute("aria-label", `Success rate ${percent}%`);

  if (valueEl) valueEl.textContent = `${percent}%`;
  if (successfulEl) successfulEl.textContent = String(successful);
  if (unsuccessfulEl) unsuccessfulEl.textContent = String(unsuccessful);

  if (fgCircle instanceof SVGCircleElement) {
    const r = fgCircle.r.baseVal.value;
    const c = 2 * Math.PI * r;
    const pct = percent / 100;
    // Из‑за круглых концов линии почти 100% визуально закрывают разрыв.
    // Поэтому чуть уменьшаем дугу, чтобы на 98% щель оставалась заметной, как в макете.
    const capCompensationPx = 14;
    const arc = Math.max(0, c * pct - capCompensationPx);
    const gap = Math.max(0, c - arc);
    fgCircle.style.strokeDasharray = `${arc} ${gap}`;
    fgCircle.style.strokeDashoffset = "0";
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applySuccessRateCard);
} else {
  applySuccessRateCard();
}