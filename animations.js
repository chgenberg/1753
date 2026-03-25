// 1753 SKINCARE – animations, sidebar, reveal, breathing (respects prefers-reduced-motion)

(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (prefersReduced) {
      els.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.08 }
    );
    els.forEach(el => io.observe(el));
  }

  window.initStaggerCards = function (container) {
    if (!container || prefersReduced) return;
    container.querySelectorAll(".stagger-card").forEach((card, i) => {
      card.style.setProperty("--stagger", String(i));
    });
  };

  function initHeroParallax() {
    const hero = document.querySelector(".hero");
    const media = hero && hero.querySelector(".hero-media");
    if (!hero || !media || prefersReduced) return;
    let ticking = false;
    function frame() {
      ticking = false;
      const r = hero.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const y = Math.min(0.05 * window.scrollY, 28);
      media.style.transform = "translate3d(0, " + y + "px, 0)";
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(frame);
        }
      },
      { passive: true }
    );
  }

  function initHeroIntro() {
    const hero = document.querySelector(".hero");
    if (hero && !prefersReduced) {
      setTimeout(() => hero.classList.add("hero--visible"), 80);
    } else if (hero) {
      hero.classList.add("hero--visible");
    }
  }

  function initCustomSelects() {
    document.querySelectorAll(".custom-select").forEach(sel => {
      const trigger = sel.querySelector(".custom-select-trigger");
      const dropdown = sel.querySelector(".custom-select-dropdown");
      const options = sel.querySelectorAll(".custom-select-option");
      const valueEl = sel.querySelector(".custom-select-value");
      if (!trigger || !dropdown) return;

      trigger.addEventListener("click", () => {
        const open = sel.classList.contains("open");
        closeAllSelects();
        if (!open) {
          sel.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });

      options.forEach(opt => {
        opt.addEventListener("click", () => {
          options.forEach(o => o.classList.remove("selected"));
          opt.classList.add("selected");
          if (valueEl) valueEl.textContent = opt.textContent;
          sel.classList.remove("open");
          trigger.setAttribute("aria-expanded", "false");
          sel.dispatchEvent(new CustomEvent("change", { detail: { value: opt.dataset.value } }));
        });
      });

      trigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          trigger.click();
        } else if (e.key === "Escape") {
          sel.classList.remove("open");
          trigger.setAttribute("aria-expanded", "false");
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".custom-select")) {
        closeAllSelects();
      }
    });
  }

  function closeAllSelects() {
    document.querySelectorAll(".custom-select.open").forEach(s => {
      s.classList.remove("open");
      const t = s.querySelector(".custom-select-trigger");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initReveal();
    initHeroParallax();
    initHeroIntro();
    initCustomSelects();
  });
})();
