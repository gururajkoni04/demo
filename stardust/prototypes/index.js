/* gururajkoni.dev replica prototype — minimal behaviour layer.
   Every value below is lifted from the source bundle (index-309750fa.js). */
(() => {
  const app = document.querySelector('.App');

  /* Nav: the bar sits below the hero and turns fixed once pageYOffset > 780 (source threshold). */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => navbar.classList.toggle('fixed', window.pageYOffset > 780);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Hamburger (< 768) opens the full-height mobile menu. */
  const burger = document.querySelector('.navbar__hamburger');
  const toggleMenu = () => navbar.classList.toggle('is-open');
  burger.addEventListener('click', toggleMenu);
  burger.addEventListener('keydown', (e) => { if (e.key === 'Enter') toggleMenu(); });
  navbar.querySelectorAll('.navbar__mobile-link').forEach((a) => a.addEventListener('click', toggleMenu));

  /* Theme toggle: dark <-> light (swaps the custom-property set and the toggle image). */
  const themeImgs = { dark: 'media/dark-3fe9091c.png', light: 'media/light-bef9af7e.png' };
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => btn.addEventListener('click', () => {
    const next = app.classList.contains('dark') ? 'light' : 'dark';
    app.classList.remove('dark', 'light');
    app.classList.add(next);
    document.querySelectorAll('.navbar__theme-img').forEach((img) => {
      img.src = themeImgs[next];
      img.alt = `${next} theme`;
    });
  }));

  /* Scroll helpers: logo + footer "back to home page" go to top; hero CTA scrolls one viewport. */
  document.querySelectorAll('[data-scroll-top]').forEach((el) => el.addEventListener('click', () => window.scrollTo(0, 0)));
  document.querySelectorAll('[data-scroll-viewport]').forEach((el) => el.addEventListener('click', () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }));

  /* Technology filter tabs: all / languages / frameworks / tools. */
  // Live re-renders the filtered list (non-matching items leave the DOM; the rest re-mount and
  // replay their staggered rise, delay = position × .15 s).
  const filters = document.querySelectorAll('.tech__filter');
  const grid = document.querySelector('.tech__grid');
  const techItems = [...grid.querySelectorAll('.tech__item')];
  filters.forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filters.forEach((b) => b.classList.toggle('is-active', b === btn));
    const shown = techItems.filter((item) => f === 'all' || item.dataset.stack === f);
    grid.replaceChildren(...shown);
    shown.forEach((item, i) => {
      item.classList.remove('is-inview');
      item.style.setProperty('--reveal-delay', `${(i * 0.15).toFixed(2)}s`);
    });
  }));

  /* Recent-works carousel — react-slick equivalent: infinite, centre mode, 500 ms slide.
     Responsive settings: >1400 → 3 shown + centre; 769–1400 → 2 + centre; ≤768 → 1, no centre. */
  const slider = document.querySelector('[data-carousel]');
  if (slider) {
    const track = slider.querySelector('[data-carousel-track]');
    const real = [...track.querySelectorAll('[data-slide]')];
    const n = real.length;
    const clone = (slide) => {
      // presentational loop clone: image only, no text nodes, no href, empty alt
      const img = slide.querySelector('img');
      const c = document.createElement('div');
      c.className = 'works__slide works__slide--clone';
      c.innerHTML = '<div class="works__card"><div class="works__link"><div class="works__img-container"><img class="works__img" alt=""></div></div></div>';
      c.querySelector('img').src = img.getAttribute('src');
      return c;
    };
    const settings = () => {
      const w = window.innerWidth;
      if (w > 1400) return { show: 3, center: true, arrows: true };
      if (w > 768) return { show: 2, center: true, arrows: true };
      if (w > 480) return { show: 1, center: false, arrows: true };
      return { show: 1, center: false, arrows: false };
    };
    let cfg = settings();
    let pre = 0;
    let index = 0;
    const prevBtn = slider.querySelector('[data-carousel-prev]');
    const nextBtn = slider.querySelector('[data-carousel-next]');
    const list = slider.querySelector('.works__list');
    const build = () => {
      // react-slick renders no arrow buttons at all when arrows:false (≤ 480)
      if (cfg.arrows) { slider.insertBefore(prevBtn, list); slider.appendChild(nextBtn); } else { prevBtn.remove(); nextBtn.remove(); }
      track.querySelectorAll('.works__slide--clone').forEach((c) => c.remove());
      pre = cfg.show + (cfg.center ? 1 : 0);
      real.slice(n - pre).forEach((s) => track.insertBefore(clone(s), real[0]));
      real.forEach((s) => track.appendChild(clone(s)));
    };
    const place = (animate) => {
      track.classList.toggle('is-animating', !!animate);
      const offset = cfg.center ? Math.floor(cfg.show / 2) : 0;
      const pos = pre + index - offset;
      track.style.setProperty('--pos', String(pos));
      // slick state classes (no styling attached): visible window, centre, current
      const all = [...track.children];
      const cur = pre + index;
      all.forEach((el, i) => {
        el.classList.toggle('slick-active', i >= pos && i < pos + cfg.show);
        el.classList.toggle('slick-center', cfg.center && (i === cur || (i - cur) % n === 0));
        el.classList.toggle('slick-current', i === cur);
      });
    };
    const go = (to) => {
      index = to;
      place(true);
      window.clearTimeout(go.t);
      go.t = window.setTimeout(() => {
        if (index >= n || index < 0) { index = (index + n) % n; place(false); }
      }, 500);
    };
    build();
    place(false);
    prevBtn.addEventListener('click', () => go(index - 1));
    nextBtn.addEventListener('click', () => go(index + 1));
    window.addEventListener('resize', () => {
      const next = settings();
      if (next.show !== cfg.show || next.center !== cfg.center || next.arrows !== cfg.arrows) { cfg = next; build(); }
      place(false);
    });
    /* autoplay: every 3000 ms, paused while hovered (react-slick autoplay + pauseOnHover; observed live) */
    let hovered = false;
    slider.addEventListener('mouseenter', () => { hovered = true; });
    slider.addEventListener('mouseleave', () => { hovered = false; });
    window.setInterval(() => { if (!hovered && !document.hidden) go(index + 1); }, 3000);
    slider.carousel = { go: (i) => go(i), get index() { return index; } };
  }

  /* Entrance reveal — framer-motion whileInView. Section groups: amount .25, replay on re-entry
     at >= 768 (once:false), once below 768; tech hexagons: own observer, any intersection, replay. */
  if ('IntersectionObserver' in window) {
    const desktop = window.matchMedia('(min-width: 768px)');
    const watch = (els, threshold, once) => {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-inview');
          if (once()) io.unobserve(e.target);
        } else if (!once()) {
          e.target.classList.remove('is-inview');
        }
      }), { threshold });
      els.forEach((el) => io.observe(el));
    };
    document.documentElement.classList.add('reveal-armed');
    const groups = [...document.querySelectorAll('[data-reveal-group]')];
    const footer = document.querySelector('.footer');
    watch(groups.filter((g) => g !== footer), 0.25, () => !desktop.matches);
    watch([footer], 0.25, () => false);
    watch([...document.querySelectorAll('[data-reveal="rise"]')], 0, () => false);
  }
})();
