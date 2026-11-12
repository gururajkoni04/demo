import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * header — the source nav bar (template-slotted from the /nav document).
 * /nav sections: 1. logo image (scrolls to the top), 2. the link list, 3. the theme toggle
 * images (dark first, light second). Behaviour (source index.js): the bar turns fixed once
 * pageYOffset > 780, the hamburger (< 768) opens the full-height mobile menu, the theme toggle
 * swaps body.dark / body.light and the toggle image.
 */

const FIXED_AT = 780;

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  return el;
}

function themeButton(pictures) {
  const btn = document.createElement('div');
  btn.className = 'navbar-theme-btn';
  btn.setAttribute('role', 'button');
  btn.setAttribute('tabindex', '0');
  btn.setAttribute('aria-label', 'Toggle dark / light theme');
  pictures.forEach((pic, i) => {
    pic.dataset.themeImg = i === 0 ? 'dark' : 'light';
    btn.append(pic);
  });
  return btn;
}

function toggleTheme() {
  const next = document.body.classList.contains('light') ? 'dark' : 'light';
  document.body.classList.remove('dark', 'light');
  document.body.classList.add(next);
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  document.body.classList.add('dark');

  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const pick = (i) => (sections[i] ? sections[i].querySelector('.default-content-wrapper') || sections[i] : null);
  const brand = pick(0);
  const links = pick(1);
  const tools = pick(2);

  const logo = brand ? brand.querySelector('picture') || brand.querySelector('img') : null;
  const list = links ? links.querySelector('ul, ol') : null;
  const toggles = tools ? [...tools.querySelectorAll('picture')] : [];

  const box = document.createElement('div');
  box.className = 'navbar-box';
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'nav';
  box.append(nav);

  if (logo) {
    const logoBtn = wrapNode(logo, 'navbar-logo-btn');
    const logoImg = logo.querySelector('img') || logo;
    logoBtn.setAttribute('role', 'button');
    logoBtn.setAttribute('tabindex', '0');
    logoBtn.setAttribute('aria-label', logoImg.getAttribute('alt') || '');
    const toTop = () => window.scrollTo(0, 0);
    logoBtn.addEventListener('click', toTop);
    logoBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toTop();
      }
    });
    nav.append(logoBtn);
  }

  let mobile = null;
  if (list) {
    list.querySelectorAll(':scope > li > p').forEach((p) => p.replaceWith(...p.childNodes));
    const linksBox = wrapNode(list, 'navbar-links');
    if (toggles.length) {
      const li = document.createElement('li');
      li.append(themeButton(toggles));
      list.append(li);
    }
    nav.append(linksBox);

    mobile = document.createElement('ul');
    mobile.className = 'navbar-mobile-menu';
    if (toggles.length) {
      const li = document.createElement('li');
      li.append(themeButton(toggles.map((t) => stripInstrumentation(t.cloneNode(true)))));
      mobile.append(li);
    }
    [...list.querySelectorAll(':scope > li > a')].forEach((a) => {
      const li = document.createElement('li');
      li.append(stripInstrumentation(a.cloneNode(true)));
      mobile.append(li);
    });
  }

  const burger = document.createElement('div');
  burger.className = 'navbar-hamburger';
  burger.setAttribute('role', 'button');
  burger.setAttribute('tabindex', '0');
  burger.setAttribute('aria-expanded', 'false');
  burger.innerHTML = '<span class="navbar-line"></span><span class="navbar-line"></span>'
    + '<span class="navbar-line"></span>';
  nav.append(burger);
  if (mobile) nav.append(mobile);

  const toggleMenu = () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', toggleMenu);
  burger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') toggleMenu();
  });
  if (mobile) mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', toggleMenu));
  nav.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) toggleMenu();
  });

  nav.querySelectorAll('.navbar-theme-btn').forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  });

  const onScroll = () => nav.classList.toggle('fixed', window.pageYOffset > FIXED_AT);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  block.replaceChildren(box);
}
