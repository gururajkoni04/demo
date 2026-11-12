/**
 * contact — "Get in Touch!" band (source div.contact): title, subtitle, the contact form
 * (posts to the Formspree endpoint, stardust/dynamic-features.md row 1) and the illustration.
 * Decode tier: template-slotted. Schema: stardust/eds-schema/index.json.
 *
 * Section head (default content before the block, reabsorbed): heading + subtitle paragraph.
 * Rows (one cell each):
 *   1. form title heading ("Contact Me")
 *   2. field list — one <li> per field placeholder, in order: name, email, message
 *   3. submit label paragraph ("Get in touch")
 *   4. form endpoint — a link to the form service URL
 *   5. illustration image
 * @ew-exempt form-control — the placeholders and the submit label render inside <input>,
 *   <textarea> and <button> controls (EW7); the endpoint link is configuration
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

const FIELDS = [
  { tag: 'input', type: 'text', name: 'name' },
  { tag: 'input', type: 'email', name: 'email' },
  { tag: 'textarea', name: 'message' },
];

export default async function decorate(block) {
  const head = takeHead(block);
  const heading = head.find((n) => /^H/.test(n.tagName));
  const subtitle = head.find((n) => n.tagName === 'P');

  const media = block.querySelector('picture') || block.querySelector('img');
  const formTitle = block.querySelector('h2, h3, h4, h5');
  const list = block.querySelector('ul, ol');
  const endpoint = [...block.querySelectorAll('a')].find((a) => /^https?:/.test(a.href));
  const labelP = [...block.querySelectorAll('p')]
    .find((p) => !p.querySelector('a, picture, img') && p.textContent.trim());
  const placeholders = list ? [...list.querySelectorAll('li')].map((li) => li.textContent.trim()) : [];

  const section = document.createElement('div');
  section.className = 'sec contact-section';
  section.dataset.revealGroup = '';
  const anchor = document.createElement('span');
  anchor.id = 'contact';
  anchor.className = 'sec-anchor';
  anchor.innerHTML = '&nbsp;';
  section.append(anchor);
  if (heading) {
    const t = wrapNode(heading, 'sec-title contact-title');
    t.dataset.reveal = 'drop';
    section.append(t);
  }
  if (subtitle) {
    const s = wrapNode(subtitle, 'contact-subtitle');
    s.dataset.reveal = 'fade';
    s.style.setProperty('--reveal-delay', '.15s');
    section.append(s);
  }

  const box = document.createElement('div');
  box.className = 'contact-box';
  const form = document.createElement('form');
  form.className = 'contact-form-container';
  form.method = 'post';
  if (endpoint) form.action = endpoint.href;
  form.dataset.reveal = 'slide-left';
  const fields = document.createElement('div');
  fields.className = 'contact-form';
  if (formTitle) fields.append(wrapNode(formTitle, 'contact-form-title'));
  FIELDS.forEach((f, i) => {
    const el = document.createElement(f.tag);
    el.className = f.tag === 'textarea' ? 'contact-input contact-textarea' : 'contact-input';
    if (f.type) el.type = f.type;
    el.name = f.name;
    el.placeholder = placeholders[i] || '';
    fields.append(el);
  });
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'contact-btn';
  const label = labelP ? labelP.textContent.trim() : '';
  btn.dataset.label = label;
  const labelSpan = document.createElement('span');
  labelSpan.className = 'contact-btn-label';
  labelSpan.textContent = label;
  btn.append(labelSpan);
  fields.append(btn);
  form.append(fields);
  box.append(form);
  if (media) {
    const img = wrapNode(media, 'contact-img-container');
    img.dataset.reveal = 'slide-right';
    box.append(img);
  }
  section.append(box);
  head.filter((n) => n !== heading && n !== subtitle).forEach((n) => section.append(n));
  block.replaceChildren(section);
}
