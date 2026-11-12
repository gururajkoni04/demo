/**
 * about — "About Me" band (source section.about): title, bio paragraph with the contact link,
 * framed portrait. Decode tier: template-slotted.
 * Schema: stardust/eds-schema/index.json.
 *
 * Authoring rows (one cell each): 1. heading (the page <h1>), 2. bio paragraph(s),
 *   3. portrait image.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

export default async function decorate(block) {
  const heading = block.querySelector('h1, h2, h3');
  const media = block.querySelector('picture') || block.querySelector('img');
  const paras = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));

  block.classList.add('sec');
  block.dataset.revealGroup = '';
  const anchor = document.createElement('span');
  anchor.id = 'about';
  anchor.className = 'sec-anchor';
  anchor.innerHTML = '&nbsp;';

  const parts = [anchor];
  if (heading) {
    const title = wrapNode(heading, 'sec-title about-title');
    title.dataset.reveal = 'drop';
    parts.push(title);
  }
  const content = document.createElement('div');
  content.className = 'about-content';
  const para = document.createElement('div');
  para.className = 'about-para';
  const text = document.createElement('div');
  text.className = 'about-text';
  text.dataset.reveal = 'fade';
  text.style.setProperty('--reveal-delay', '.5s');
  text.append(...paras);
  para.append(text);
  content.append(para);
  if (media) {
    const img = wrapNode(media, 'about-img-container');
    img.dataset.reveal = 'from-left';
    img.style.setProperty('--reveal-delay', '.5s');
    content.append(img);
  }
  parts.push(content);
  block.replaceChildren(...parts);
}
