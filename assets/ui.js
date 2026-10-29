/* صامولة — أدوات واجهة مشتركة: أيقونات، رسوم القطع، خريطة الرياض، المؤقتات، النوافذ */
(function () {
  const { fmt, S } = window.Store;

  /* أيقونات خطية 24px بسماكة 1.6 */
  const P = {
    home: 'M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z', search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4.2-4.2',
    cart: 'M3 4h2.2l2.3 10.6a1.2 1.2 0 0 0 1.2 1h8.9a1.2 1.2 0 0 0 1.2-.9L20.6 8H6.1M9.5 20.5h.01M17.5 20.5h.01',
    box: 'M3.5 7.5 12 3.2l8.5 4.3v9L12 20.8l-8.5-4.3zm0 0L12 12l8.5-4.5M12 12v8.8', user: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4.5 20.5c1.4-3.6 4.2-5.5 7.5-5.5s6.1 1.9 7.5 5.5',
    truck: 'M2.5 6.5h11v9.5h-11zM13.5 10h4l3 3.2V16h-7M7 18.5a1.6 1.6 0 1 0 0-.01M17 18.5a1.6 1.6 0 1 0 0-.01', clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4.5V12l3 2',
    check: 'm5 12.5 4.5 4.5L19 7.5', x: 'M6 6l12 12M18 6 6 18', fwd: 'm14.5 6-6 6 6 6', back: 'm9.5 6 6 6-6 6', down: 'm6 9.5 6 6 6-6',
    pin: 'M12 21s6.8-6 6.8-11.6a6.8 6.8 0 1 0-13.6 0C5.2 15 12 21 12 21zm0-14a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
    phone: 'M5.5 4h3.3l1.7 4.4-2.1 1.3a10.5 10.5 0 0 0 5.9 5.9l1.3-2.1 4.4 1.7v3.3a1.8 1.8 0 0 1-1.9 1.8A15.6 15.6 0 0 1 3.7 5.9 1.8 1.8 0 0 1 5.5 4z',
    camera: 'M4 8h3.2l1.8-2.6h6l1.8 2.6H20v11H4zM12 10a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z', scan: 'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M7 12h10',
    alert: 'M12 3.5 2.8 19.5h18.4zM12 10v4M12 16.8h.01', list: 'M8.5 6h12M8.5 12h12M8.5 18h12M4 6h.01M4 12h.01M4 18h.01',
    shield: 'M12 3 4.5 6v5.7c0 4.6 3.2 7.9 7.5 9.3 4.3-1.4 7.5-4.7 7.5-9.3V6z', file: 'M6 3h8.5L19 7.5V21H6zM14 3v5h5', upload: 'M12 15.5V4M7 8.5 12 4l5 4.5M4.5 20h15',
    wallet: 'M3.5 7.5h15.5a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5zM3.5 7.5 15 4v3.5M16.5 13.8h.01',
    store: 'M4 9.5h16L18.8 4H5.2zM5.2 9.5V20h13.6V9.5M10 20v-5.5h4V20', car: 'M5 13.5 6.8 8h10.4l1.8 5.5V18H5zM5 13.5h14M7.5 18v2M16.5 18v2M8 15.8h.01M16 15.8h.01',
    filter: 'M3.5 5h17l-6.5 7.6V19l-4 2v-8.4z', refresh: 'M19.5 11.5a7.5 7.5 0 1 0-2.2 5.3M19.5 4.5v7h-7', menu: 'M4 7h16M4 12h16M4 17h16',
    map: 'M9 4.5 3.5 6.5v13l5.5-2 6 2 5.5-2v-13l-5.5 2zM9 4.5v13M15 6.5v13', nav: 'M12 3 19 20.5 12 16.6 5 20.5z', grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    chart: 'M5 20V11M11 20V5M17 20v-6M3 20h18', users: 'M9 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM2.5 20c1-3.5 3.6-5.5 6.5-5.5s5.5 2 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.6M18 14.6c1.8.8 3 2.6 3.5 5.4',
    history: 'M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5M3.5 3.5v5h5M12 7.5V12l3 2', plus: 'M12 5v14M5 12h14', minus: 'M5 12h14',
    trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3', wifi: 'M2.5 9a14 14 0 0 1 19 0M5.5 12.3a9.5 9.5 0 0 1 13 0M8.6 15.6a5 5 0 0 1 6.8 0M12 19h.01',
    info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 8v5.5M12 7.8h.01', lock: 'M6 11h12v9.5H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3', tag: 'M3.5 12.5V4h8.5l8.5 8.5-8 8zM8 8h.01',
    chat: 'M4 5h16v11H9l-5 4z', bolt: 'M13 3 5 13.5h6L10 21l8-10.5h-6z', link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
    door: 'M5 21V4h10v17M15 6h4v15M11.5 12.5h.01', sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4',
  };
  const icon = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[name] || P.info}"/></svg>`;
  const mark = () => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.6 21 6.8v10.4L12 22.4 3 17.2V6.8z" fill="var(--accent)"/><circle cx="12" cy="12" r="4.3" fill="var(--surface)"/></svg>';

  /* رسوم القطع: لغة واحدة مسطحة، خط بلون الحبر وتعبئة واحدة */
  const T = {
    'oil-filter': '<rect x="19" y="15" width="26" height="36" rx="5"/><rect x="19" y="25" width="26" height="15" class="f"/><path d="M23 15v-3.5h18V15M23 51v3h18v-3M27 31.5h10"/>',
    'filter-element': '<ellipse cx="32" cy="14" rx="11" ry="3.5"/><path d="M21 14v36M43 14v36"/><ellipse cx="32" cy="50" rx="11" ry="3.5"/><path class="fs" d="M25 17v31M29 18v32M33 18v32M37 18v31M41 17v31"/><circle cx="32" cy="14" r="3.5" class="f"/>',
    'air-filter': '<rect x="9" y="18" width="46" height="28" rx="3"/><path class="fs" d="M14 22l3 20 3-20 3 20 3-20 3 20 3-20 3 20 3-20 3 20 3-20 3 20 3-20"/><rect x="9" y="18" width="46" height="5" class="f"/>',
    'cabin-filter': '<rect x="11" y="16" width="42" height="32" rx="2"/><rect x="15" y="20" width="34" height="24" class="f"/><path d="M19 20v24M24 20v24M29 20v24M34 20v24M39 20v24M44 20v24"/>',
    'spark-plug': '<path d="M29 6h6v6h-6zM26 12h12v7H26z"/><path d="M28.5 19h7l1.5 4v9h-10v-9z" class="f"/><path d="M27 32h10v8H27zM29.5 40h5v8h-5zM32 48v6M32 54h5"/><path d="M27 15.5h10"/>',
    'brake-pads': '<path d="M10 40c4-14 14-22 26-22 8 0 14 3 18 8l-6 6c-3-3-7-5-12-5-9 0-16 6-19 15z" class="f"/><path d="M10 40c4-14 14-22 26-22 8 0 14 3 18 8l-6 6c-3-3-7-5-12-5-9 0-16 6-19 15z"/><path d="M14 46c4-12 13-19 23-19 6 0 10 2 13 5"/><circle cx="20" cy="43" r="2"/><circle cx="46" cy="30" r="2"/>',
    'brake-disc': '<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="22" class="f" opacity=".5"/><circle cx="32" cy="32" r="10"/><circle cx="32" cy="32" r="3"/><circle cx="32" cy="25" r="1.5"/><circle cx="38.6" cy="29.8" r="1.5"/><circle cx="36.1" cy="37.6" r="1.5"/><circle cx="27.9" cy="37.6" r="1.5"/><circle cx="25.4" cy="29.8" r="1.5"/><path d="M32 13v4M48.5 22.5l-3.4 2M48.5 41.5l-3.4-2M32 51v-4M15.5 41.5l3.4-2M15.5 22.5l3.4 2"/>',
    'battery': '<rect x="10" y="20" width="44" height="30" rx="3"/><rect x="10" y="20" width="44" height="9" class="f"/><path d="M17 20v-4h7v4M40 20v-4h7v4M18 37.5h5M20.5 35v5M41 37.5h5"/>',
    'oil-can': '<path d="M20 14h16l8 8v28a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3z"/><path d="M17 30h27v13H17z" class="f"/><path d="M38 14v-4h-6v4M44 22h3a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-3"/>',
    'coolant': '<path d="M24 10h10v6l7 6v29a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2V22l7-6z"/><path d="M17 31h24v14H17z" class="f"/><path d="M29 35c-2 3-3 4.5-3 6a3 3 0 0 0 6 0c0-1.5-1-3-3-6z"/>',
    'shock': '<path d="M28 6h8v6h-8zM26 12h12v22H26z" class="f"/><path d="M28 6h8v6h-8zM26 12h12v22H26zM30 34v14M27 52h10M32 48v4"/><path d="M22 16l20 4-20 4 20 4-20 4 20 4-20 4 20 4"/>',
    'mirror': '<path d="M14 18c0-4 3-7 7-7h22c4 0 7 3 7 7v16c0 4-3 7-7 7H24c-6 0-10-4-10-10z" class="f"/><path d="M14 18c0-4 3-7 7-7h22c4 0 7 3 7 7v16c0 4-3 7-7 7H24c-6 0-10-4-10-10z"/><path d="M50 26h5v10h-5M30 41v8h-6"/>',
    'compressor': '<rect x="22" y="16" width="32" height="32" rx="6"/><path d="M22 24h32M22 40h32" class="fs"/><circle cx="17" cy="32" r="10" class="f"/><circle cx="17" cy="32" r="10"/><circle cx="17" cy="32" r="3"/><path d="M40 16v-5h6v5"/>',
    'belt': '<circle cx="18" cy="22" r="8"/><circle cx="46" cy="18" r="6"/><circle cx="40" cy="46" r="9"/><path d="M12 27c-2 10 6 25 22 27 8 1 14-4 15-9M23.5 15.5 41 12.5M51 21l-3 17" class="b"/><circle cx="40" cy="46" r="3" class="f"/>',
    'bulb': '<path d="M26 8h12v6l4 6v14a10 10 0 0 1-20 0V20l4-6z" class="f"/><path d="M26 8h12v6l4 6v14a10 10 0 0 1-20 0V20l4-6z"/><path d="M27 44h10v5H27zM29 49v7M35 49v7M32 24v12M28 30h8"/>',
    'pump': '<circle cx="28" cy="34" r="14" class="f"/><circle cx="28" cy="34" r="14"/><circle cx="28" cy="34" r="5"/><path d="M42 30h12v8H42M28 20v-8M22 12h12"/><path d="M28 29v-6M33 35h6M24 38l-4 4"/>',
  };
  /* صور القطع: لقطات استوديو مولّدة بـ Higgsfield (assets/img/parts)؛ الرسم الخطي احتياط لما لا صورة له */
  const PHOTOS = new Set(['air-filter', 'battery', 'belt', 'brake-disc', 'brake-pads', 'bulb', 'cabin-filter', 'compressor', 'coolant', 'filter-element', 'mirror', 'oil-can', 'oil-filter', 'pump', 'shock', 'spark-plug']);
  const photo = (name) => (PHOTOS.has(name) ? `assets/img/parts/${name}.webp` : '');
  const thumb = (name, cls = '') => PHOTOS.has(name) ? `<span class="thumb photo ${cls}" aria-hidden="true"><img src="${photo(name)}" alt="" loading="lazy" decoding="async"></span>` : svgThumb(name, cls);
  const svgThumb = (name, cls = '') => `<span class="thumb ${cls}" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" stroke="var(--thumb-ink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${(T[name] || T['oil-filter']).replace(/class="f"/g, 'fill="var(--thumb-fill)" stroke="none"').replace(/class="fs"/g, 'stroke-width="1.4"').replace(/class="b"/g, 'stroke-width="3"')}</svg></span>`;

  /* خريطة تخطيطية للرياض: الدائري الشمالي والشرقي وطريق الملك فهد ووادي حنيفة */
  const ROADS = [
    ['M40 70H362', 7, 'ring'], ['M330 70V286', 7, 'ring'], ['M70 286H330', 7, 'ring'],
    ['M190 8V296', 5], ['M240 8V206', 4], ['M58 130H364', 5], ['M46 200H384', 5], ['M262 70 300 8', 4], ['M120 70V8', 3], ['M120 200V286', 3], ['M280 130V286', 3],
  ];
  const DIST = [['الياسمين', 236, 38], ['الملقا', 150, 40], ['النرجس', 286, 22], ['حطين', 104, 96], ['العليا', 214, 160], ['الملز', 262, 186], ['السلي', 360, 236],
    ['النسيم', 362, 150], ['الصناعية القديمة', 218, 226], ['الصناعية الجديدة', 236, 266], ['الروضة', 300, 108], ['الدرعية', 38, 112]];
  function route(from, to) {
    const xs = [190, 240, 330]; const cx = xs.reduce((a, x) => (Math.abs(x - from.x) < Math.abs(a - from.x) ? x : a), xs[0]);
    const ys = [70, 130, 200]; const cy = ys.reduce((a, y) => (Math.abs(y - to.y) < Math.abs(a - to.y) ? y : a), ys[0]);
    return [from, { x: cx, y: from.y }, { x: cx, y: cy }, { x: to.x, y: cy }, to];
  }
  function map({ from, to, progress = null, transit = null, label = '', pins = null, me = null } = {}) {
    const pts = from && to ? route(from, to) : null; const d = pts ? 'M' + pts.map((p) => `${p.x} ${p.y}`).join('L') : '';
    let courier = '';
    if (pts && transit) progress = Math.min(0.98, (Date.now() - transit.at) / (transit.dur * 1000));
    if (pts && progress != null) {
      const p = along(pts, progress); const live = transit ? ` data-transit="${transit.at}" data-dur="${transit.dur}" data-route="${from.x},${from.y},${to.x},${to.y}"` : '';
      courier = `<g class="courier"${live} style="transform:translate(${p.x}px,${p.y}px)"><circle r="8" fill="var(--surface)"/><circle r="5.5" fill="var(--text)"/></g>`;
    }
    return `<svg class="map" data-ui viewBox="0 0 400 300" role="img" aria-label="${label || 'خريطة تخطيطية لمسار التوصيل في الرياض'}">
      <rect width="400" height="300" fill="var(--map-ground)"/>
      <path d="M78 0C64 50 96 92 74 140S86 230 104 300" stroke="var(--map-water)" stroke-width="9" fill="none" stroke-linecap="round"/>
      ${ROADS.map(([dd, w, k]) => `<path d="${dd}" stroke="${k ? 'var(--map-ring)' : 'var(--map-road)'}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`).join('')}
      <g fill="var(--map-label)" font-size="11" text-anchor="middle">${DIST.map(([n, x, y]) => `<text x="${x}" y="${y}">${n}</text>`).join('')}</g>
      <g fill="var(--map-label)" font-size="11" text-anchor="middle" opacity=".8"><text x="112" y="63">الدائري الشمالي</text><text x="183" y="112" transform="rotate(-90 183 112)">طريق الملك فهد</text><text x="321" y="246" transform="rotate(-90 321 246)">الدائري الشرقي</text><text x="96" y="194">طريق مكة</text></g>
      ${pts ? `<path d="${d}" stroke="var(--accent)" stroke-width="3.5" fill="none" stroke-linejoin="round" stroke-linecap="round" ${progress == null ? 'stroke-dasharray="2 7"' : ''}/>
      <g transform="translate(${from.x},${from.y})"><rect x="-8" y="-8" width="16" height="16" rx="3" fill="var(--text)"/><path d="M-4 -1h8v5h-8zM-4.5 -1l1-3h7l1 3" stroke="var(--surface)" stroke-width="1.3" fill="none"/></g>
      <g transform="translate(${to.x},${to.y})"><circle r="9" fill="var(--accent)"/><circle r="3.2" fill="var(--surface)"/></g>${courier}` : ''}
      ${pins ? pins.map((p) => `<g transform="translate(${p.x},${p.y})"><rect x="-8" y="-8" width="16" height="16" rx="3" fill="var(--text)"/><text y="4" font-size="10" font-weight="600" text-anchor="middle" fill="var(--surface)">${p.n}</text></g>`).join('') : ''}
      ${me ? `<g transform="translate(${me.x},${me.y})"><circle r="11" fill="var(--accent)" opacity=".18"/><circle r="6" fill="var(--accent)"/><circle r="2.4" fill="var(--surface)"/></g>` : ''}
    </svg>`;
  }
  function along(pts, t) {
    const segs = []; let total = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); segs.push(l); total += l; }
    let dist = Math.max(0, Math.min(1, t)) * total; for (let i = 0; i < segs.length; i++) { if (dist <= segs[i]) { const k = segs[i] ? dist / segs[i] : 0; return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * k, y: pts[i].y + (pts[i + 1].y - pts[i].y) * k }; } dist -= segs[i]; }
    return pts[pts.length - 1];
  }

  /* حالات ونصوص */
  const pill = (text, tone = 'neutral', ic) => `<span class="pill ${tone}">${ic ? icon(ic) : ''}${text}</span>`;
  const FIT = { confirmed: ['متوافق مع سيارتك', 'pos', 'check'], likely: ['توافق محتمل', 'warn', 'info'], unknown: ['التوافق غير معروف', 'neutral', 'info'] };
  const fitPill = (status) => { const [t, tone, ic] = FIT[status] || FIT.unknown; return pill(t, tone, ic); };
  const tierPill = (brandId) => { const b = Store.D.brands[brandId]; return `<span class="tier tier-${b.tier}">${Store.D.tiers[b.tier].short}</span>`; };
  const avatar = (name, initial, h) => `<span class="avatar" style="--h:${h ?? hue(name)}" aria-hidden="true">${initial || name.trim()[0]}</span>`;
  const hue = (s) => { let x = 0; for (const ch of s) x = (x * 31 + ch.charCodeAt(0)) % 360; return x; };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const countdown = (deadline, total) => `<span class="countdown" data-deadline="${deadline}">${fmt.clock((deadline - Date.now()) / 1000)}</span>`;
  const ttl = (deadline, totalSec) => `<div class="ttl" data-ttl="${deadline}" data-total="${totalSec}"><span style="width:${Math.max(0, Math.min(100, ((deadline - Date.now()) / 1000 / totalSec) * 100))}%"></span></div>`;

  /* مؤقت واحد يحدّث العدادات وموقع المندوب كل ثانية دون إعادة رسم الشاشة */
  function tickTimers() {
    const now = Date.now();
    document.querySelectorAll('[data-deadline]').forEach((el) => { const left = (Number(el.dataset.deadline) - now) / 1000; el.textContent = fmt.clock(left); el.classList.toggle('late', left < 30); });
    document.querySelectorAll('[data-ttl]').forEach((el) => { const left = (Number(el.dataset.ttl) - now) / 1000; const pct = Math.max(0, Math.min(100, (left / Number(el.dataset.total)) * 100)); el.firstElementChild.style.width = pct + '%'; el.classList.toggle('late', left < 30); });
    document.querySelectorAll('[data-transit]').forEach((el) => {
      const [fx, fy, tx, ty] = el.dataset.route.split(',').map(Number); const t = (now - Number(el.dataset.transit)) / (Number(el.dataset.dur) * 1000);
      const p = along(route({ x: fx, y: fy }, { x: tx, y: ty }), Math.min(t, 0.98)); el.style.transform = `translate(${p.x}px,${p.y}px)`;
    });
    document.querySelectorAll('[data-ago]').forEach((el) => { el.textContent = fmt.ago((now - Number(el.dataset.ago)) / 60000); });
  }
  setInterval(tickTimers, 1000);

  /* نافذة وإشعار */
  function dialog(html, { onClose } = {}) {
    const d = document.createElement('dialog'); d.className = 'sheet'; d.innerHTML = html; document.body.appendChild(d);
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
    d.addEventListener('close', () => { d.remove(); onClose && onClose(); });
    d.showModal(); return d;
  }
  let toastTimer;
  function toast(text) { document.querySelectorAll('.toast').forEach((t) => t.remove()); const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = text; document.body.appendChild(t); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), 2600); }

  /* إعادة رسم آمنة: لا نقاطع من يكتب في حقل */
  function renderer(root, fn) {
    let pending = false;
    const run = () => { const a = document.activeElement; if (a && root.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName) && a.type !== 'checkbox' && a.type !== 'radio') { pending = true; return; } pending = false; const y = window.scrollY; root.innerHTML = fn(); window.scrollTo(0, y); tickTimers(); };
    root.addEventListener('focusout', () => { if (pending) setTimeout(run, 0); });
    return run;
  }

  /* صورة إثبات محاكاة: الكاميرا غير متاحة في العرض، فنرسم لقطة بختم الوقت والرمز */
  const proof = (code, at, kind = 'استلام') => `<figure class="proof" aria-label="صورة إثبات ${kind}"><svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#3b3f42"/><rect x="38" y="22" width="84" height="60" rx="3" fill="#c9a877"/><path d="M38 40h84M80 22v18" stroke="#a88a5e" stroke-width="2"/><rect x="58" y="50" width="44" height="22" fill="#fff"/><path d="M62 55h2M66 55h1M69 55h3M74 55h1M77 55h2M81 55h3M86 55h1M89 55h2M93 55h3" stroke="#111" stroke-width="7"/><text x="80" y="70" font-size="5" text-anchor="middle" fill="#111" font-family="monospace">${code}</text><rect y="92" width="160" height="18" fill="rgba(0,0,0,.55)"/><text x="6" y="104" font-size="7" fill="#fff" font-family="monospace">${new Date(at).toISOString().slice(0, 16).replace('T', ' ')} UTC</text></svg><figcaption>${kind} · ${fmt.time(at)}</figcaption></figure>`;

  /* المظهر: يتبع النظام افتراضيًا، ويحفظ اختيار الزائر محليًا فقط */
  const THEME_KEY = 'samoola-theme';
  function applyTheme() { let t = 'system'; try { t = localStorage.getItem(THEME_KEY) || 'system'; } catch (e) { /* لا تخزين */ } if (t === 'system') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t; return t; }
  function setTheme(t) { try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* لا تخزين */ } applyTheme(); }
  applyTheme(); window.addEventListener('storage', (e) => { if (e.key === THEME_KEY) applyTheme(); });
  const themeSeg = () => { const t = applyTheme(); return `<div class="seg" role="group" aria-label="المظهر">${[['system', 'تلقائي'], ['light', 'فاتح'], ['dark', 'داكن']].map(([k, n]) => `<button type="button" data-theme-set="${k}" aria-pressed="${t === k}">${n}</button>`).join('')}</div>`; };
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-theme-set]'); if (b) { setTheme(b.dataset.themeSet); b.parentElement.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); } });

  window.UI = { themeSeg, setTheme, icon, mark, thumb, photo, map, route, along, pill, fitPill, tierPill, avatar, hue, esc, countdown, ttl, dialog, toast, renderer, proof, tickTimers };
})();
