/**
 * works — "My Recent Works" band (source section.works): title and the centre-mode project
 * carousel (react-slick equivalent: infinite, 500 ms slide, autoplay 3 s paused on hover;
 * > 1400: 3 shown + centre, 769–1400: 2 + centre, <= 768: 1, arrows hidden <= 480).
 * Decode tier: reconstructive (repeat group). Schema: stardust/eds-schema/index.json.
 *
 * Section head (default content before the block, reabsorbed): the heading.
 * Rows: one per project — cell 1 screenshot, cell 2 project name heading and the link paragraph
 *   ("View Project" → project URL; the card becomes the link, EW6).
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function takeHead(block) {
  const wrapper = block.parentElement && block.parentElement.previousElementSibling;
  if (!wrapper || !wrapper.classList.contains('default-content-wrapper')) return [];
  const nodes = [...wrapper.children];
  wrapper.remove();
  return nodes;
}

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  return el;
}

const VIEW_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" '
  + 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" '
  + 'aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>'
  + '<polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';

function settings() {
  const w = window.innerWidth;
  if (w > 1400) return { show: 3, center: true, arrows: true };
  if (w > 768) return { show: 2, center: true, arrows: true };
  if (w > 480) return { show: 1, center: false, arrows: true };
  return { show: 1, center: false, arrows: false };
}

function carousel(slider, track, real, list, prevBtn, nextBtn) {
  const n = real.length;
  if (!n) return;
  const clone = (slide) => {
    // loop clone as react-slick renders it: the whole card (image, name, "View Project", link),
    // hidden from assistive tech and the tab order; editor indices stripped (EW4)
    const c = stripInstrumentation(slide.cloneNode(true));
    c.classList.add('works-slide-clone');
    delete c.dataset.slide;
    c.setAttribute('aria-hidden', 'true');
    c.querySelectorAll('a, button').forEach((el) => el.setAttribute('tabindex', '-1'));
    c.querySelectorAll('img').forEach((img) => {
      img.alt = '';
    });
    c.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    return c;
  };
  let cfg = settings();
  let pre = 0;
  let index = 0;
  const build = () => {
    if (cfg.arrows) {
      slider.insertBefore(prevBtn, list);
      slider.append(nextBtn);
    } else {
      prevBtn.remove();
      nextBtn.remove();
    }
    track.querySelectorAll('.works-slide-clone').forEach((c) => c.remove());
    pre = cfg.show + (cfg.center ? 1 : 0);
    real.slice(n - pre).forEach((s) => track.insertBefore(clone(s), real[0]));
    real.forEach((s) => track.append(clone(s)));
  };
  const place = (animate) => {
    track.classList.toggle('is-animating', !!animate);
    const offset = cfg.center ? Math.floor(cfg.show / 2) : 0;
    const pos = pre + index - offset;
    track.style.setProperty('--pos', String(pos));
    const all = [...track.children];
    const cur = pre + index;
    all.forEach((el, i) => {
      el.classList.toggle('slick-active', i >= pos && i < pos + cfg.show);
      el.classList.toggle('slick-center', cfg.center && (i === cur || (i - cur) % n === 0));
      el.classList.toggle('slick-current', i === cur);
    });
  };
  let settle;
  const go = (to) => {
    index = to;
    place(true);
    window.clearTimeout(settle);
    settle = window.setTimeout(() => {
      if (index >= n || index < 0) {
        index = (index + n) % n;
        place(false);
      }
    }, 500);
  };
  build();
  place(false);
  prevBtn.addEventListener('click', () => go(index - 1));
  nextBtn.addEventListener('click', () => go(index + 1));
  window.addEventListener('resize', () => {
    const next = settings();
    if (next.show !== cfg.show || next.center !== cfg.center || next.arrows !== cfg.arrows) {
      cfg = next;
      build();
    }
    place(false);
  });
  let hovered = false;
  slider.addEventListener('mouseenter', () => {
    hovered = true;
  });
  slider.addEventListener('mouseleave', () => {
    hovered = false;
  });
  window.setInterval(() => {
    if (!hovered && !document.hidden) go(index + 1);
  }, 3000);
}

export default async function decorate(block) {
  const head = takeHead(block);
  const slides = [];
  const extra = [];
  [...block.children].forEach((row) => {
    const media = row.querySelector('picture') || row.querySelector('img');
    if (!media) {
      extra.push(...row.querySelectorAll('h1, h2, h3, p'));
      return;
    }
    const linkP = [...row.querySelectorAll('p')].find((p) => p.querySelector('a'));
    const link = linkP ? linkP.querySelector('a') : null;
    const name = row.querySelector('h2, h3, h4');
    const rest = [...row.querySelectorAll('p')]
      .filter((p) => p !== linkP && !p.querySelector('picture, img'));

    const slide = document.createElement('div');
    slide.className = 'works-slide';
    slide.dataset.slide = '';
    const card = document.createElement('div');
    card.className = 'works-card';
    const a = document.createElement(link ? 'a' : 'div');
    a.className = 'works-link';
    if (link) {
      a.href = link.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    const imgBox = wrapNode(media, 'works-img-container');
    const overlay = document.createElement('div');
    overlay.className = 'works-overlay';
    if (name) overlay.append(wrapNode(name, 'works-name'));
    rest.forEach((p) => overlay.append(p));
    if (linkP) {
      const view = document.createElement('div');
      view.className = 'works-view';
      view.innerHTML = VIEW_ICON;
      view.append(linkP);
      link.replaceWith(...link.childNodes);
      overlay.append(view);
    }
    imgBox.append(overlay);
    a.append(imgBox);
    card.append(a);
    slide.append(card);
    slides.push(slide);
  });

  block.classList.add('sec');
  block.dataset.revealGroup = '';
  const anchor = document.createElement('span');
  anchor.id = 'work';
  anchor.className = 'sec-anchor';
  anchor.innerHTML = '&nbsp;';
  const inner = document.createElement('div');
  inner.className = 'works-inner';
  const heading = head.find((n) => /^H/.test(n.tagName));
  if (heading) {
    const t = wrapNode(heading, 'sec-title works-title');
    t.dataset.reveal = 'drop';
    inner.append(t);
  }
  head.filter((n) => n !== heading).forEach((n) => inner.append(n));
  extra.forEach((n) => inner.append(n));

  const wrap = document.createElement('div');
  wrap.className = 'works-carousel';
  const slider = document.createElement('div');
  slider.className = 'works-slider';
  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'works-arrow works-arrow-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'works-arrow works-arrow-next';
  nextBtn.setAttribute('aria-label', 'Next');
  const list = document.createElement('div');
  list.className = 'works-list';
  const track = document.createElement('div');
  track.className = 'works-track';
  track.append(...slides);
  list.append(track);
  slider.append(prevBtn, list, nextBtn);
  wrap.append(slider);
  inner.append(wrap);
  block.replaceChildren(anchor, inner);
  carousel(slider, track, slides, list, prevBtn, nextBtn);
}
