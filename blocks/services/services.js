/**
 * services — "My Services" band (source section.services): title, subtitle and three tilt cards
 * (animated illustration + service name; the description overlays the card on hover).
 * Decode tier: reconstructive (repeat group). Schema: stardust/eds-schema/index.json.
 *
 * Section head (default content before the block, reabsorbed): heading + subtitle paragraph.
 * Rows: one per service — cell 1 illustration, cell 2 service name, cell 3 description,
 *   cell 4 size word.
 * @variants cell 4: small — mapped to .services-img-small; empty = full-size illustration
 * @ew-exempt metadata — the size word (cell 4) is never displayed
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

export default async function decorate(block) {
  const head = takeHead(block);
  const cards = [];
  [...block.children].forEach((row) => {
    const media = row.querySelector('picture') || row.querySelector('img');
    const cells = [...row.children];
    if (!media) {
      head.push(...row.querySelectorAll('h1, h2, h3, p'));
      return;
    }
    const texts = cells.filter((c) => !c.contains(media))
      .flatMap((c) => [...c.querySelectorAll('h2, h3, h4, p')]);
    const small = cells.some((c) => c.textContent.trim().toLowerCase() === 'small');
    const prose = texts.filter((t) => t.textContent.trim().toLowerCase() !== 'small');
    const name = prose.find((t) => /^H/.test(t.tagName)) || prose[0];
    const desc = prose.find((t) => t !== name);
    cards.push({
      media, name, desc, small, leftovers: prose.filter((t) => t !== name && t !== desc),
    });
  });

  const heading = head.find((n) => /^H/.test(n.tagName));
  const subtitle = head.find((n) => n.tagName === 'P');

  block.classList.add('sec');
  block.dataset.revealGroup = '';
  const anchor = document.createElement('span');
  anchor.id = 'service';
  anchor.className = 'sec-anchor';
  anchor.innerHTML = '&nbsp;';
  const box = document.createElement('div');
  box.className = 'services-box';
  if (heading) {
    const t = wrapNode(heading, 'sec-title services-title');
    t.dataset.reveal = 'drop';
    box.append(t);
  }
  if (subtitle) {
    const s = wrapNode(subtitle, 'services-subtitle');
    s.dataset.reveal = 'fade';
    s.style.setProperty('--reveal-delay', '.15s');
    box.append(s);
  }
  head.filter((n) => n !== heading && n !== subtitle).forEach((n) => box.append(n));
  const list = document.createElement('div');
  list.className = 'services-cards';
  cards.forEach((c, i) => {
    const tilt = document.createElement('div');
    tilt.className = 'services-tilt';
    const shadow = document.createElement('div');
    shadow.className = 'services-card-shadow';
    shadow.dataset.reveal = 'from-left';
    shadow.style.setProperty('--reveal-delay', `${(i * 0.8).toFixed(1)}s`);
    shadow.style.setProperty('--reveal-duration', '.5s');
    const overlay = document.createElement('div');
    overlay.className = 'services-overlay';
    if (c.desc) overlay.append(wrapNode(c.desc, 'services-text'));
    const card = document.createElement('div');
    card.className = 'services-card';
    const img = wrapNode(c.media, 'services-img-container');
    if (c.small) img.classList.add('services-img-small');
    card.append(img);
    if (c.name) card.append(wrapNode(c.name, 'services-name'));
    c.leftovers.forEach((n) => card.append(n));
    shadow.append(overlay, card);
    tilt.append(shadow);
    list.append(tilt);
  });
  box.append(list);
  block.replaceChildren(anchor, box);
}
