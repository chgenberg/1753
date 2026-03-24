// 1753 SKINCARE – scroll-reveal, nav-scroll, stagger (respekterar prefers-reduced-motion)

(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initNavScroll() {
    const nav = document.getElementById("site-nav") || document.querySelector(".nav");
    if (!nav) return;
    function tick() {
      nav.classList.toggle("nav--scrolled", window.scrollY > 16);
    }
    if (!prefersReduced) {
      window.addEventListener("scroll", tick, { passive: true });
    }
    tick();
  }

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
      { rootMargin: "0px 0px -32px 0px", threshold: 0.06 }
    );
    els.forEach(el => io.observe(el));
  }

  window.initStaggerCards = function (container) {
    if (!container || prefersReduced) return;
    container.querySelectorAll(".stagger-card").forEach((card, i) => {
      card.style.setProperty("--stagger", String(i));
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    initNavScroll();
    initReveal();
    const hero = document.querySelector(".hero");
    if (hero && !prefersReduced) hero.classList.add("hero--visible");
  });
})();
