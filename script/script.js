console.log("script.js подключен");

// Tiny UX: toggle active tab highlight (Stats / Messages)
document.addEventListener("click", (e) => {
  const btn = e.target instanceof Element ? e.target.closest(".tab") : null;
  if (!btn) return;
  const wrap = btn.closest(".sidecard__tabs");
  if (!wrap) return;
  for (const el of wrap.querySelectorAll(".tab")) el.classList.remove("tab--active");
  btn.classList.add("tab--active");
});

