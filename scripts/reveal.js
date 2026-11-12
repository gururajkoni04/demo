/*
 * Entrance reveal — the source's framer-motion `whileInView`, re-implemented as CSS transitions
 * (styles.css `.reveal-armed …`) driven by IntersectionObserver.
 * Section groups ([data-reveal-group]): amount .25, replay on re-entry at >= 768px, once below.
 * Footer group: replay always. Tech hexagons ([data-reveal="rise"]): any intersection, replay.
 */
const desktop = window.matchMedia('(min-width: 768px)');
const seen = new WeakSet();

function watch(els, threshold, once) {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('is-inview');
      if (once()) io.unobserve(e.target);
    } else if (!once()) {
      e.target.classList.remove('is-inview');
    }
  }), { threshold });
  els.forEach((el) => io.observe(el));
}

/**
 * Arms the reveal observers for every not-yet-watched reveal element under root.
 * @param {Element|Document} root
 */
export default function armReveal(root = document) {
  if (!('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('reveal-armed');
  const fresh = (els) => els.filter((el) => {
    if (seen.has(el)) return false;
    seen.add(el);
    return true;
  });
  const groups = fresh([...root.querySelectorAll('[data-reveal-group]')]);
  const footerGroups = groups.filter((g) => g.closest('footer'));
  watch(groups.filter((g) => !g.closest('footer')), 0.25, () => !desktop.matches);
  watch(footerGroups, 0.25, () => false);
  watch(fresh([...root.querySelectorAll('[data-reveal="rise"]')]), 0, () => false);
}
