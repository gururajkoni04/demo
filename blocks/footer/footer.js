import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import armReveal from '../../scripts/reveal.js';

/**
 * footer — the source's fixed reveal band (template-slotted from the /footer document).
 * /footer sections: 1. the band title paragraph ("My Social Networks"); 2. the social list —
 *   one <li> per network: hover icon image, resting icon image, and the profile link (its text
 *   names the network; the icons become the link); 3. the credit lines — one paragraph per
 *   link (the link title becomes the tooltip).
 * The floating "back to home page" control is presentational (scrolls to the top).
 */

const UP_PATHS = '<path fill-rule="evenodd" d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 '
  + '3.707 2.354 9.354a.5.5 0 1 1-.708-.708l6-6z"></path><path fill-rule="evenodd" d="M7.646 6.646a.5.5 0 '
  + '0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"></path>';
const upIcon = (cls) => `<svg class="${cls}" stroke="currentColor" fill="currentColor" stroke-width="0" `
  + `viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${UP_PATHS}</svg>`;

function wrapNode(node, className, tag = 'div') {
  const w = document.createElement(tag);
  w.className = className;
  w.append(node);
  return w;
}

function markCopyright(link) {
  const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const at = node.data.indexOf('©');
    if (at >= 0) {
      const sign = node.splitText(at);
      sign.splitText(1);
      const span = document.createElement('span');
      span.className = 'footer-copy';
      sign.replaceWith(span);
      span.append(sign);
      return;
    }
    node = walker.nextNode();
  }
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .map((s) => s.querySelector('.default-content-wrapper') || s);
  const all = sections.flatMap((s) => [...s.children]);
  const list = all.find((n) => n.tagName === 'UL' || n.tagName === 'OL');
  const paras = all.filter((n) => n.tagName === 'P');
  const title = paras.find((p) => !p.querySelector('a'));
  const lines = paras.filter((p) => p.querySelector('a'));

  block.dataset.revealGroup = '';
  const up = document.createElement('div');
  up.className = 'footer-up';
  up.dataset.reveal = 'fade';
  up.style.setProperty('--reveal-delay', '1s');
  const upBtn = document.createElement('button');
  upBtn.type = 'button';
  upBtn.className = 'footer-overlay footer-up-btn';
  upBtn.setAttribute('aria-label', 'back to home page');
  upBtn.innerHTML = upIcon('footer-icon-hover footer-up-icon-hover') + upIcon('footer-icon footer-up-icon');
  upBtn.addEventListener('click', () => window.scrollTo(0, 0));
  const abbr = document.createElement('abbr');
  abbr.title = 'back to home page';
  abbr.append(upBtn);
  up.append(abbr);

  const parts = [up];
  if (title) parts.push(wrapNode(title, 'footer-title'));
  if (list) {
    const icons = document.createElement('div');
    icons.className = 'footer-icons';
    [...list.querySelectorAll(':scope > li')].forEach((li) => {
      const link = li.querySelector('a');
      const pics = [...li.querySelectorAll('picture')];
      const a = document.createElement('a');
      a.className = 'footer-overlay';
      if (link) {
        a.href = link.href;
        a.target = '_blank';
        a.rel = 'noreferrer';
        a.setAttribute('aria-label', link.textContent.trim());
      }
      if (pics[0]) a.append(wrapNode(pics[0], 'footer-icon-hover', 'span'));
      if (pics[1]) a.append(wrapNode(pics[1], 'footer-icon', 'span'));
      icons.append(a);
    });
    parts.push(icons);
  }
  lines.forEach((p, i) => {
    const link = p.querySelector('a');
    const line = wrapNode(p, i === 0 ? 'footer-line footer-line-first' : 'footer-line', 'abbr');
    if (link) {
      line.title = link.title || link.textContent.trim();
      link.target = '_blank';
      link.rel = 'noreferrer';
      markCopyright(link);
    }
    parts.push(line);
  });
  block.replaceChildren(...parts);
  armReveal(block.closest('footer') || block);
}
