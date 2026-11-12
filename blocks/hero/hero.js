/**
 * hero — full-viewport intro band (source .hero): greeting with the highlighted name, one-line
 * role, the "Check out my work" CTA (scrolls one viewport) and the rotating star field behind it.
 * Decode tier: template-slotted (fixed composition). Schema: stardust/eds-schema/index.json.
 *
 * Authoring rows (one cell each, any order is tolerated):
 *   1. greeting paragraph — the name in <strong> ("Hi, I'm <strong>Gururaj Koni</strong>")
 *   2. role paragraph
 *   3. CTA label paragraph ("Check out my work") — the block turns it into the source's button
 *      that scrolls one viewport down (no link: the source control is a button, not a link)
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const ARROW = '<svg class="hero-arrow" stroke="currentColor" fill="currentColor" stroke-width="0" '
  + 'viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
  + '<path fill="none" d="M0 0h24v24H0V0z"></path>'
  + '<path d="M6.23 20.23L8 22l10-10L8 2 6.23 3.77 14.46 12z"></path></svg>';

/* Star field — the source's three.js <Points> (5200 floats = 1733 points uniformly inside a
   sphere of radius 1.2, size .002 with size attenuation, camera fov 75 at z = 1, group rotated
   PI/4 on z, points rotating x -= dt/10, y -= dt/15; white on dark, black on light). */
function starField(holder) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  holder.append(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const n = Math.floor(5200 / 3);
  const pts = new Float32Array(n * 3);
  for (let i = 0; i < n; i += 1) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2 * Math.PI;
    const phi = Math.acos(2 * v - 1);
    const r = 1.2 * Math.cbrt(Math.random());
    pts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pts[i * 3 + 2] = r * Math.cos(phi);
  }
  const tanHalf = Math.tan((75 / 2) * (Math.PI / 180));
  const cz = Math.cos(Math.PI / 4);
  const sz = Math.sin(Math.PI / 4);
  let ax = 0;
  let ay = 0;
  let w = 0;
  let h = 0;
  let dpr = 1;
  const resize = () => {
    dpr = window.devicePixelRatio || 1;
    w = holder.clientWidth;
    h = holder.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  };
  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = document.body.classList.contains('light') ? '#000000' : '#ffffff';
    const aspect = w / (h || 1);
    const cx = Math.cos(ax);
    const sx = Math.sin(ax);
    const cy = Math.cos(ay);
    const sy = Math.sin(ay);
    for (let i = 0; i < n; i += 1) {
      const x0 = pts[i * 3];
      const y0 = pts[i * 3 + 1];
      const z0 = pts[i * 3 + 2];
      // R = Rx(ax) * Ry(ay) (three.js Euler XYZ), then the group's Rz(PI/4)
      const x1 = x0 * cy + z0 * sy;
      const z1 = -x0 * sy + z0 * cy;
      const y2 = y0 * cx - z1 * sx;
      const z2 = y0 * sx + z1 * cx;
      const x3 = x1 * cz - y2 * sz;
      const y3 = x1 * sz + y2 * cz;
      const depth = 1 - z2;
      if (depth > 0.1) {
        const px = ((x3 / depth / (tanHalf * aspect)) + 1) * 0.5 * w;
        const py = (1 - (y3 / depth / tanHalf)) * 0.5 * h;
        const s = Math.max((0.002 * (h / 2)) / depth, 1 / dpr);
        ctx.fillRect(px - s / 2, py - s / 2, s, s);
      }
    }
  };
  resize();
  draw();
  new ResizeObserver(() => {
    resize();
    draw();
  }).observe(holder);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    ax -= dt / 10;
    ay -= dt / 15;
    draw();
    window.requestAnimationFrame(tick);
  };
  window.requestAnimationFrame(tick);
}

export default async function decorate(block) {
  const ps = [...block.querySelectorAll('p')];
  const cta = ps.find((p) => p.querySelector('a')) || (ps.length > 2 ? ps[ps.length - 1] : null);
  const intro = ps.find((p) => p !== cta && p.querySelector('strong, em')) || ps.find((p) => p !== cta);
  const desc = ps.find((p) => p !== cta && p !== intro);

  const section = document.createElement('div');
  section.className = 'hero-section';
  section.dataset.revealGroup = '';
  const box = document.createElement('div');
  box.className = 'hero-box';
  section.append(box);

  if (intro) {
    const name = intro.querySelector('strong, em');
    if (name) {
      name.dataset.reveal = 'fade';
      name.style.setProperty('--reveal-delay', '.1s');
    }
    box.append(wrapNode(intro, 'hero-intro'));
  }
  if (desc) {
    const d = wrapNode(desc, 'hero-desc');
    d.dataset.reveal = 'fade';
    d.style.setProperty('--reveal-delay', '.5s');
    box.append(d);
  }
  if (cta) {
    const link = cta.querySelector('a');
    if (link) link.replaceWith(...link.childNodes);
    const btn = wrapNode(cta, 'hero-btn');
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    btn.dataset.reveal = 'fade';
    btn.style.setProperty('--reveal-delay', '.6s');
    // the source button carries a second, hover-only copy of its label: presentational (EW4)
    const hover = cta.cloneNode(true);
    hover.removeAttribute('data-prose-index');
    hover.className = 'hero-btn-hover';
    hover.setAttribute('aria-hidden', 'true');
    btn.prepend(hover);
    btn.insertAdjacentHTML('beforeend', ARROW);
    const scroll = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    btn.addEventListener('click', scroll);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scroll();
      }
    });
    box.append(btn);
  }

  const bg = document.createElement('div');
  bg.className = 'hero-bg';
  const stars = document.createElement('div');
  stars.className = 'star-canvas';
  bg.append(stars);

  block.replaceChildren(section, bg);
  starField(stars);
}
