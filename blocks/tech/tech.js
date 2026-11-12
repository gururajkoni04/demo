/**
 * tech — "technologies I've been working with" band (source section.tech): intro line, the
 * filter tabs (all / languages / frameworks / tools) and the hexagon grid of technology logos.
 * Decode tier: reconstructive (repeat group). Schema: stardust/eds-schema/index.json.
 *
 * Section head (default content before the block, reabsorbed): the intro paragraph and the
 * filter list (<ul>, first item = show everything, the others = stack words below).
 * Rows: one per technology — cell 1 the logo image (alt = the technology name),
 *   cell 2 the stack word.
 * @variants cell 2: languages | frameworks | tools
 * @ew-exempt metadata — the stack word (cell 2) is never displayed; an empty or unknown word
 *   shows the logo under the first filter (everything) only
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

const STACKS = ['languages', 'frameworks', 'tools'];

export default async function decorate(block) {
  const head = takeHead(block);
  const rows = [...block.children];
  const items = [];
  rows.forEach((row) => {
    const media = row.querySelector('picture') || row.querySelector('img');
    if (!media) {
      head.push(...row.querySelectorAll('p, ul, ol'));
      return;
    }
    const word = [...row.children].map((c) => c.textContent.trim().toLowerCase())
      .find((t) => STACKS.includes(t)) || '';
    const img = media.querySelector('img') || media;
    const item = document.createElement('abbr');
    item.className = 'tech-item';
    item.title = img.getAttribute('alt') || '';
    item.dataset.stack = word;
    item.dataset.reveal = 'rise';
    item.style.setProperty('--reveal-delay', `${(items.length * 0.15).toFixed(2)}s`);
    item.append(media);
    items.push(item);
  });

  const intro = head.find((n) => n.tagName === 'P');
  const list = head.find((n) => n.tagName === 'UL' || n.tagName === 'OL');

  block.classList.add('sec');
  block.dataset.revealGroup = '';
  const anchor = document.createElement('span');
  anchor.className = 'sec-anchor';
  anchor.innerHTML = '&nbsp;';
  const parts = [anchor];
  if (intro) {
    const title = wrapNode(intro, 'tech-title');
    title.dataset.reveal = 'fade';
    title.style.setProperty('--reveal-delay', '.5s');
    parts.push(title);
  }
  const grid = document.createElement('div');
  grid.className = 'tech-grid';
  grid.append(...items);
  if (list) {
    const filters = wrapNode(list, 'tech-filters');
    filters.dataset.reveal = 'drop';
    const tabs = [...list.querySelectorAll('li')];
    const select = (tab) => {
      const word = tab.textContent.trim().toLowerCase();
      tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
      const shown = items.filter((it) => !STACKS.includes(word) || it.dataset.stack === word);
      grid.replaceChildren(...shown);
      shown.forEach((it, i) => {
        it.classList.remove('is-inview');
        it.style.setProperty('--reveal-delay', `${(i * 0.15).toFixed(2)}s`);
      });
    };
    tabs.forEach((tab, i) => {
      tab.setAttribute('role', 'button');
      tab.setAttribute('tabindex', '0');
      tab.setAttribute('aria-pressed', String(i === 0));
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select(tab);
        }
      });
    });
    parts.push(filters);
  }
  head.filter((n) => n !== intro && n !== list).forEach((n) => parts.push(n));
  parts.push(grid);
  block.replaceChildren(...parts);
}
