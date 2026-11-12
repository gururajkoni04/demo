/**
 * blogs — "My Medium Blogs" band (source section.blogs): title, three article cards (image,
 * title, date, snippet, "Read article" — the whole card links to the post) and the
 * "See more articles" control. Document-first snapshot of the Medium feed
 * (stardust/dynamic-features.md row 3). Decode tier: reconstructive.
 * Schema: stardust/eds-schema/index.json.
 *
 * Section head (default content before the block, reabsorbed): the heading.
 * Rows: one per article — cell 1 image; cell 2 title heading, date paragraph, snippet paragraph,
 *   and the link paragraph ("Read article" → post URL; the card becomes the link, EW6).
 * Last row (no image): the "See more articles" paragraph.
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
  const grid = document.createElement('div');
  grid.className = 'blogs-grid';
  const tail = [];
  [...block.children].forEach((row) => {
    const media = row.querySelector('picture') || row.querySelector('img');
    if (!media) {
      tail.push(...row.querySelectorAll('h1, h2, h3, p'));
      return;
    }
    const linkP = [...row.querySelectorAll('p')].find((p) => p.querySelector('a'));
    const link = linkP ? linkP.querySelector('a') : null;
    const title = row.querySelector('h2, h3, h4');
    const texts = [...row.querySelectorAll('p')]
      .filter((p) => p !== linkP && !p.contains(media) && !p.querySelector('picture, img'));
    const [date, snippet, ...rest] = texts;

    const card = document.createElement(link ? 'a' : 'div');
    card.className = 'blogs-link';
    if (link) {
      card.href = link.href;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
    }
    const article = document.createElement('article');
    article.className = 'blogs-card';
    article.append(wrapNode(media, 'blogs-img'));
    if (title) article.append(wrapNode(title, 'blogs-card-title'));
    if (date) article.append(wrapNode(date, 'blogs-date'));
    if (snippet) article.append(wrapNode(snippet, 'blogs-snippet'));
    rest.forEach((n) => article.append(n));
    if (linkP) {
      const more = wrapNode(linkP, 'blogs-read-more');
      link.replaceWith(...link.childNodes);
      article.append(more);
    }
    card.append(article);
    grid.append(card);
  });

  const parts = [];
  const anchor = document.createElement('span');
  anchor.id = 'blogs';
  anchor.className = 'sec-anchor';
  anchor.innerHTML = '&nbsp;';
  parts.push(anchor);
  const inner = document.createElement('div');
  inner.className = 'blogs-inner';
  const heading = head.find((n) => /^H/.test(n.tagName));
  if (heading) inner.append(wrapNode(heading, 'sec-title blogs-title'));
  head.filter((n) => n !== heading).forEach((n) => inner.append(n));
  const box = document.createElement('div');
  box.className = 'blogs-box';
  box.append(grid);
  const moreP = tail.find((n) => n.tagName === 'P');
  if (moreP) {
    const more = wrapNode(moreP, 'blogs-more');
    more.setAttribute('role', 'button');
    more.setAttribute('tabindex', '0');
    more.setAttribute('aria-expanded', 'false');
    box.append(more);
  }
  tail.filter((n) => n !== moreP).forEach((n) => box.append(n));
  inner.append(box);
  parts.push(inner);
  block.classList.add('sec');
  block.replaceChildren(...parts);
}
