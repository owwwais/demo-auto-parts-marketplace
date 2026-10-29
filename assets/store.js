/* صامولة — محرك حالة العرض
 * يحاكي الخادم داخل المتصفح: الاقتباس والتحقق والحجز والدفع والتجهيز والتوصيل.
 * الحالة مشتركة بين الواجهات الأربع عبر localStorage + BroadcastChannel، فيظهر رد المورد
 * في تبويب العميل فورًا. الساعة هنا ساعة المتصفح وتمثل «ساعة الخادم» في العرض فقط.
 * الانتقالات أوامر مسماة بحراسة (INV-10)، والمبالغ بالهللة (INV-06).
 */
(function () {
  const D = window.DATA;
  const KEY = 'samoola-demo-v1';
  const POLICY = { verifySec: 180, holdSec: 600, lowQty: 3, staleMin: 120, commission: 0.08, vat: 0.15, feeBase: 1500, feePerKm: 60, transitSec: 90 };
  const DEMO_SUPPLIER = D.meta.demoSupplier, DEMO_COURIER = D.meta.demoCourier;

  const index = (arr) => Object.fromEntries(arr.map((x) => [x.id, x]));
  const V = index(D.vehicles), P = index(D.parts), S = index(D.suppliers), C = index(D.couriers), BASE_OFFERS = index(D.offers);

  /* ---------- تنسيق ---------- */
  const nf2 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const nf0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
  const tf = new Intl.DateTimeFormat('ar-SA-u-nu-latn-ca-gregory', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Riyadh' });
  const df = new Intl.DateTimeFormat('ar-SA-u-nu-latn-ca-gregory', { day: 'numeric', month: 'long', timeZone: 'Asia/Riyadh' });
  const fmt = {
    sar: (h) => nf2.format(h / 100),
    money: (h, cls = '') => `<span class="money ${cls}"><bdi>${nf2.format(h / 100)}</bdi> <span class="cur">ر.س</span></span>`,
    int: (n) => nf0.format(n),
    time: (t) => tf.format(new Date(t)),
    date: (t) => df.format(new Date(t)),
    clock: (sec) => { sec = Math.max(0, Math.ceil(sec)); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`; },
    ago: (min) => { min = Math.round(min); if (min < 1) return 'الآن'; if (min < 60) return `قبل ${min}\u00a0د`; const h = Math.round(min / 60); if (h < 24) return `قبل ${h}\u00a0س`; return `قبل ${Math.round(h / 24)}\u00a0يوم`; },
    dur: (sec) => { sec = Math.round(sec); if (sec < 60) return `${sec} ث`; const m = Math.floor(sec / 60), s = sec % 60; return s ? `${m} د ${s} ث` : `${m} د`; },
    pct: (x, d = 0) => `${(x * 100).toFixed(d)}%`,
    // forms: [مفرد, مثنى, جمع 3–10, تمييز 11+]
    count: (n, forms) => n === 1 ? forms[0] : n === 2 ? forms[1] : n >= 3 && n <= 10 ? `${n} ${forms[2]}` : `${nf0.format(n)} ${forms[3]}`,
    ltr: (s) => `<bdi dir="ltr" class="ref">${s}</bdi>`,
  };

  /* ---------- قواعد مشتقة ---------- */
  function effectiveOffer(st, id) {
    const b = BASE_OFFERS[id]; if (!b) return null;
    const e = (st.offerEdits && st.offerEdits[id]) || {};
    const updatedAt = e.updatedAt || st.seededAt - b.ageMin * 60000;
    const committed = (st.committed && st.committed[id]) || 0;
    return { ...b, price: e.price ?? b.price, qty: Math.max(0, (e.qty ?? b.qty) - committed), updatedAt, ageMin: (Date.now() - updatedAt) / 60000, revisions: e.revisions || 0 };
  }
  // محرك شروط قابل للتفسير (D-05): يعيد الأسباب لا قرارًا مخفيًا
  function verifyReasons(o) {
    const r = [];
    if (o.qty <= POLICY.lowQty) r.push(`الكمية المعلنة ${o.qty} فقط`);
    if (o.ageMin > POLICY.staleMin) r.push(`آخر تحديث للمخزون ${fmt.ago(o.ageMin)}`);
    return r;
  }
  function fitment(partId, vehicleId) {
    const p = P[partId]; const f = p && p.fits.find((x) => x.v === vehicleId);
    if (f) return { status: f.s, src: f.src };
    return { status: 'unknown', src: 'لا يوجد مصدر توافق لهذه المركبة' };
  }
  function eta(supplierId) {
    const s = S[supplierId]; const prep = s.integration === 'manual' ? 30 : 18; const travel = Math.round(s.km * 1.5 + 8);
    const from = Math.round((prep + travel) / 5) * 5; return { from, to: from + 25 };
  }
  const fee = (supplierId) => POLICY.feeBase + Math.max(0, S[supplierId].km - 5) * POLICY.feePerKm;
  const vatOf = (total) => Math.round((total * POLICY.vat) / (1 + POLICY.vat));

  const groupTotal = (g) => g.lines.reduce((a, l) => a + l.price * l.qty, 0);
  function orderTotals(o) {
    const items = o.groups.reduce((a, g) => a + groupTotal(g), 0);
    const delivery = o.groups.reduce((a, g) => a + g.fee, 0);
    const total = items + delivery; return { items, delivery, total, vat: vatOf(total) };
  }
  const PAID_STATES = ['PAID', 'PREPARING', 'READY', 'ASSIGNED', 'AT_PICKUP', 'IN_TRANSIT', 'AT_DROPOFF', 'DELIVERED'];
  const MOVING = ['ASSIGNED', 'AT_PICKUP', 'IN_TRANSIT', 'AT_DROPOFF'];
  function orderStatus(o) {
    if (o.cancelled) return 'CANCELLED';
    if (o.payment.state === 'REVIEW') return 'PAYMENT_REVIEW';
    if (o.payment.state === 'PROCESSING') return 'PAYMENT_PROCESSING';
    if (o.payment.state === 'CAPTURED') {
      if (o.groups.every((g) => g.state === 'DELIVERED')) return 'DELIVERED';
      if (o.groups.some((g) => MOVING.includes(g.state) || g.state === 'DELIVERED')) return 'IN_DELIVERY';
      return 'PREPARING';
    }
    if (o.groups.some((g) => ['REJECTED', 'EXPIRED', 'HOLD_EXPIRED'].includes(g.state))) return 'ACTION_REQUIRED';
    if (o.groups.every((g) => g.state === 'HELD')) return 'READY_TO_PAY';
    return 'VERIFYING';
  }
  const ORDER_LABEL = {
    VERIFYING: 'نتحقق من التوفر', READY_TO_PAY: 'جاهز للدفع', ACTION_REQUIRED: 'يحتاج قرارك', PAYMENT_PROCESSING: 'بانتظار تأكيد الدفع',
    PAYMENT_REVIEW: 'دفع قيد المراجعة', PREPARING: 'قيد التجهيز', IN_DELIVERY: 'في الطريق', DELIVERED: 'تم التسليم', CANCELLED: 'أُلغي',
  };
  const GROUP_LABEL = {
    VERIFYING: 'بانتظار تأكيد المورد', HELD: 'محجوز لك', REJECTED: 'رفض المورد', EXPIRED: 'انتهت مهلة المورد', HOLD_EXPIRED: 'انتهى الحجز',
    PAID: 'تم الدفع', PREPARING: 'قيد التجهيز', READY: 'جاهز للاستلام', ASSIGNED: 'المندوب في طريقه للفرع', AT_PICKUP: 'المندوب في الفرع',
    IN_TRANSIT: 'في الطريق إليك', AT_DROPOFF: 'المندوب عند العنوان', DELIVERED: 'تم التسليم',
  };
  const tone = (state) => ({
    HELD: 'pos', DELIVERED: 'pos', READY_TO_PAY: 'pos', REJECTED: 'neg', EXPIRED: 'neg', HOLD_EXPIRED: 'neg', ACTION_REQUIRED: 'neg', PAYMENT_REVIEW: 'warn',
    VERIFYING: 'warn', PAYMENT_PROCESSING: 'warn', CANCELLED: 'neutral',
  }[state] || 'info');

  /* ---------- البذرة: سجل اليوم + طلب تحقق حي ---------- */
  const OTHERS = ['سارة العتيبي', 'فيصل المطيري', 'نورة القحطاني', 'ماجد الحربي', 'ريم الزهراني', 'سلطان الدوسري', 'هيفاء الغامدي', 'تركي الشمري', 'لمى السبيعي', 'بندر العمري'];
  const DISTRICTS = ['الملقا', 'النرجس', 'حطين', 'العليا', 'الربوة', 'الملز', 'النسيم', 'الروضة', 'القيروان', 'الصحافة', 'المروج', 'الغدير'];
  function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

  function makeLine(st, offerId, qty) {
    const o = effectiveOffer(st, offerId), p = P[o.part];
    return { offer: offerId, part: o.part, brand: o.brand, qty, price: o.price, name: p.name, oem: p.oem[0] || null, thumb: p.thumb };
  }
  function makeGroup(st, orderId, letter, supplierId, lines, now) {
    return { id: `${orderId}-${letter}`, supplier: supplierId, lines, fee: fee(supplierId), eta: eta(supplierId), state: 'HELD',
      verify: { required: false, reasons: [], requestedAt: now, deadline: now + POLICY.verifySec * 1000 }, hold: { at: now, until: now + POLICY.holdSec * 1000, ref: `H-${orderId.slice(3)}${letter}` }, pkg: null, job: null };
  }

  function seed() {
    const now = Date.now(); const st = { v: 1, rev: 1, seededAt: now, seq: 24817, orders: [], cart: [{ offer: 'o001', qty: 1 }, { offer: 'o007', qty: 1 }],
      offerEdits: {}, committed: {}, courier: { available: true, earnings: 0, done: [] }, admin: { suppliers: {}, mappings: {}, resolved: {} }, demo: { autoVendor: false, autoCourier: false, network: 'online' }, audit: [] };
    const r = rng(7);
    const offersBy = (sid) => D.offers.filter((o) => o.supplier === sid).map((o) => o.id);
    // 26 طلبًا خلال 11 ساعة مضت: الأحدث ما زال جاريًا، والأقدم سُلّم
    for (let i = 0; i < 26; i++) {
      const id = `SM-${24781 + i}`; const ageMin = Math.round((25 - i) * 25 + r() * 18 + 6);
      const created = now - ageMin * 60000; const sids = r() > 0.72 ? ['S2', 'S3'] : [['S1', 'S2', 'S3', 'S4'][Math.floor(r() * 4)]];
      const groups = sids.map((sid, gi) => {
        const pool = offersBy(sid); const lines = [makeLine(st, pool[Math.floor(r() * pool.length)], r() > 0.8 ? 2 : 1)];
        const g = makeGroup(st, id, 'AB'[gi], sid, lines, created);
        g.verify.respondedAt = created + 60000; g.hold.until = created + POLICY.holdSec * 1000;
        if (ageMin > 95) g.state = 'DELIVERED'; else if (ageMin > 60) g.state = 'IN_TRANSIT'; else if (ageMin > 35) g.state = 'READY'; else g.state = 'PREPARING';
        g.pkg = { code: `PKG-${id.slice(3)}-${'AB'[gi]}`, proofAt: g.state === 'PREPARING' ? null : created + 20 * 60000 };
        if (['IN_TRANSIT', 'DELIVERED'].includes(g.state)) g.job = { courier: ['C2', 'C3'][i % 2], state: g.state, acceptedAt: created + 28 * 60000, transitAt: created + 40 * 60000, deliveredAt: g.state === 'DELIVERED' ? created + 70 * 60000 : null, otp: '0000', payout: 1800 };
        if (g.state === 'READY') g.job = { courier: null, state: 'OPEN', createdAt: created + 30 * 60000, otp: String(1000 + Math.floor(r() * 9000)), payout: 1500 + Math.round(S[sid].km * 40) };
        return g;
      });
      st.orders.push({ id, createdAt: created, customer: OTHERS[i % OTHERS.length], district: DISTRICTS[i % DISTRICTS.length], vehicle: D.vehicles[i % D.vehicles.length].id, addressId: null,
        payment: { state: 'CAPTURED', method: ['مدى', 'Apple Pay', 'STC Pay'][i % 3], at: created + 4 * 60000 }, groups, timeline: [{ at: created, actor: 'العميل', text: 'أنشأ اقتباسًا' }, { at: created + 4 * 60000, actor: 'بوابة الدفع', text: 'تأكيد الدفع' }], seeded: true });
    }
    const last = st.orders[st.orders.length - 1]; // أحدث طلب مؤرشف: دفع بنتيجة غير معروفة
    last.payment.state = 'REVIEW'; last.payment.note = 'انقطعت الاستجابة بعد إرسال طلب التحصيل؛ نستعلم من البوابة قبل أي محاولة جديدة';
    last.groups.forEach((g) => { g.state = 'HELD'; g.pkg = null; g.job = null; });
    const expired = st.orders[st.orders.length - 4]; // مورد لم يرد في المهلة
    expired.payment = { state: 'NONE' }; expired.cancelled = true;
    expired.groups.forEach((g) => { g.state = 'EXPIRED'; g.verify.required = true; g.verify.reasons = ['آخر تحديث للمخزون قبل 5 س']; g.pkg = null; g.job = null; });
    expired.timeline.push({ at: expired.createdAt + POLICY.verifySec * 1000, actor: 'النظام', text: 'انتهت مهلة المورد دون رد؛ لم يُخصم شيء' });
    const exc = st.orders.find((o) => o.groups.some((g) => g.state === 'IN_TRANSIT'));
    if (exc) { exc.exception = { kind: 'العميل لا يرد', at: now - 9 * 60000, by: 'ياسر القحطاني' }; }
    // طلب للمورد التجريبي ينتظر التجهيز، وآخر قيد التجهيز
    const forDemo = (id, ageMin, state, offerId) => {
      const created = now - ageMin * 60000; const g = makeGroup(st, id, 'A', DEMO_SUPPLIER, [makeLine(st, offerId, 1)], created);
      g.state = state; g.verify.respondedAt = created + 70000; if (state === 'PREPARING') g.pkg = { code: `PKG-${id.slice(3)}-A`, proofAt: null };
      st.orders.push({ id, createdAt: created, customer: 'منيرة الرشيد', district: 'الروضة', vehicle: 'hilux-2019', payment: { state: 'CAPTURED', method: 'مدى', at: created + 3 * 60000 }, groups: [g],
        timeline: [{ at: created, actor: 'العميل', text: 'أنشأ اقتباسًا' }, { at: created + 3 * 60000, actor: 'بوابة الدفع', text: 'تأكيد الدفع' }], seeded: true });
    };
    forDemo('SM-24814', 7, 'PAID', 'o044'); forDemo('SM-24815', 16, 'PREPARING', 'o033');
    // طلب تحقق حي من عميل آخر: مهلته تبدأ مع أول فتح للعرض
    const vid = 'SM-24816'; const vg = makeGroup(st, vid, 'A', DEMO_SUPPLIER, [makeLine(st, 'o041', 1)], now - 25000);
    vg.state = 'VERIFYING'; vg.verify = { required: true, reasons: verifyReasons(effectiveOffer(st, 'o041')), requestedAt: now - 25000, deadline: now - 25000 + POLICY.verifySec * 1000 }; vg.hold = null;
    st.orders.push({ id: vid, createdAt: now - 25000, customer: 'بدر السهلي', district: 'الملقا', vehicle: 'hilux-2019', payment: { state: 'NONE' }, groups: [vg], timeline: [{ at: now - 25000, actor: 'العميل', text: 'أنشأ اقتباسًا' }], seeded: true });
    // مهمة مفتوحة سبقه إليها مندوب آخر (T-19): تختفي عند محاولة قبولها
    const ready = st.orders.filter((o) => o.groups.some((g) => g.state === 'READY'));
    if (ready[1]) ready[1].groups.forEach((g) => { if (g.job) g.job.raceLost = true; });
    // طلبان سابقان للعميل نفسه، مسلّمان
    [['SM-24412', 6 * 1440 + 190, 'camry-2021', ['o006', 'o009'], 'S2'], ['SM-23987', 19 * 1440 + 75, 'hilux-2019', ['o042'], 'S3']].forEach(([id, ageMin, vehicle, offerIds, sid]) => {
      const created = now - ageMin * 60000; const g = makeGroup(st, id, 'A', sid, offerIds.map((x) => makeLine(st, x, 1)), created);
      g.state = 'DELIVERED'; g.pkg = { code: `PKG-${id.slice(3)}-A`, proofAt: created + 22 * 60000 }; g.job = { courier: 'C3', state: 'DELIVERED', acceptedAt: created + 25 * 60000, pickupAt: created + 34 * 60000, deliveredAt: created + 61 * 60000, otp: '0000', payout: 1700 };
      st.orders.push({ id, createdAt: created, customer: D.customer.name, district: 'الياسمين', addressId: 'a1', vehicle, payment: { state: 'CAPTURED', method: 'مدى', at: created + 3 * 60000 }, groups: [g],
        timeline: [{ at: created, actor: 'العميل', text: 'أنشأ اقتباسًا' }, { at: created + 61 * 60000, actor: C.C3.name, text: 'سلّم الحزمة برمز التسليم' }], seeded: true, mine: true });
    });
    st.orders.sort((a, b) => b.createdAt - a.createdAt);
    st.audit.push({ at: now, actor: 'النظام', text: 'تهيئة بيانات العرض' });
    return st;
  }

  /* ---------- التخزين والمزامنة ---------- */
  let st = null; const listeners = new Set(); let bc = null;
  function readStored() { try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* تخزين غير متاح: نعمل في الذاكرة */ } try { bc && bc.postMessage({ rev: st.rev, st }); } catch (e) { /* لا قناة */ } }
  function emit() { listeners.forEach((fn) => { try { fn(st); } catch (e) { console.error(e); } }); }
  function adopt(next) { if (next && next.v === 1 && (!st || next.rev > st.rev || next.seededAt !== st.seededAt)) { st = next; emit(); } }
  function init() {
    st = readStored(); if (!st || st.v !== 1) { st = seed(); persist(); }
    try { bc = new BroadcastChannel(KEY); bc.onmessage = (e) => adopt(e.data && e.data.st); } catch (e) { bc = null; }
    window.addEventListener('storage', (e) => { if (e.key === KEY) adopt(readStored()); });
    setInterval(tick, 1000);
  }
  function mutate(fn) {
    const fresh = readStored(); if (fresh && fresh.v === 1 && fresh.rev > st.rev) st = fresh;
    const result = fn(st); st.rev += 1; persist(); emit(); return result;
  }
  const findOrder = (s, id) => s.orders.find((o) => o.id === id);
  const findGroup = (s, gid) => { for (const o of s.orders) { const g = o.groups.find((x) => x.id === gid); if (g) return [o, g]; } return [null, null]; };
  const log = (o, actor, text) => { const e = { at: Date.now(), actor, text }; o.timeline.push(e); st.audit.unshift({ ...e, order: o.id }); };

  /* ---------- الساعة: انتقالات زمنية ومحاكاة الأطراف غير المفتوحة ---------- */
  function due(s, now) {
    const jobs = [];
    for (const o of s.orders) {
      if (o.seeded && o.id !== 'SM-24816' && !['SM-24814', 'SM-24815'].includes(o.id)) continue;
      for (const g of o.groups) {
        const sim = g.supplier !== DEMO_SUPPLIER || s.demo.autoVendor;
        const simAt = g.verify.simAt || (s.demo.autoVendor ? g.verify.requestedAt + 8000 : null);
        if (g.state === 'VERIFYING' && sim && simAt && now >= simAt) jobs.push(['simAccept', o.id, g.id]);
        else if (g.state === 'VERIFYING' && now > g.verify.deadline) jobs.push(['expireVerify', o.id, g.id]);
        else if (g.state === 'HELD' && o.payment.state === 'NONE' && g.hold && now > g.hold.until) jobs.push(['expireHold', o.id, g.id]);
        else if (g.state === 'PAID' && sim && now >= (g.simPrepAt || 0)) jobs.push(['simPrep', o.id, g.id]);
        else if (g.state === 'PREPARING' && sim && g.simReadyAt && now >= g.simReadyAt) jobs.push(['simReady', o.id, g.id]);
        else if (g.state === 'READY' && s.demo.autoCourier && !o.seeded) jobs.push(['simAssign', o.id, g.id]);
        else if (g.job && g.job.auto && ['ASSIGNED', 'AT_PICKUP'].includes(g.state) && now >= g.job.nextAt) jobs.push(['simStep', o.id, g.id]);
        else if (g.job && g.job.auto && g.state === 'IN_TRANSIT' && now >= g.job.transitAt + POLICY.transitSec * 1000) jobs.push(['simStep', o.id, g.id]);
        else if (g.job && g.job.auto && g.state === 'AT_DROPOFF' && now >= g.job.nextAt) jobs.push(['simStep', o.id, g.id]);
      }
      if (o.payment.state === 'PROCESSING' && now >= o.payment.captureAt) jobs.push(['capture', o.id]);
    }
    return jobs;
  }
  function tick() {
    const now = Date.now(); if (!due(st, now).length) return;
    mutate((s) => {
      for (const [kind, oid, gid] of due(s, now)) {
        const o = findOrder(s, oid); const g = gid && o.groups.find((x) => x.id === gid); const sup = g && S[g.supplier].name;
        if (kind === 'simAccept') { g.state = 'HELD'; g.verify.respondedAt = now; g.hold = { at: now, until: now + POLICY.holdSec * 1000, ref: `H-${oid.slice(3)}${g.id.slice(-1)}` }; log(o, sup, 'أكد التوفر وعزل القطعة (مورد محاكى)'); }
        if (kind === 'expireVerify') { g.state = 'EXPIRED'; log(o, 'النظام', `انتهت مهلة ${sup} دون رد؛ لم يُخصم شيء`); }
        if (kind === 'expireHold') { g.state = 'HOLD_EXPIRED'; log(o, 'النظام', `انتهى حجز ${sup} قبل الدفع وأُعيدت الكمية`); }
        if (kind === 'capture') {
          const ok = o.groups.every((x) => x.state === 'HELD' && x.hold && now <= x.hold.until + 5000);
          if (ok) {
            o.payment.state = 'CAPTURED'; o.payment.at = now;
            o.groups.forEach((x) => { x.state = 'PAID'; x.simPrepAt = now + 4000; x.lines.forEach((l) => { s.committed[l.offer] = (s.committed[l.offer] || 0) + l.qty; }); });
            log(o, 'بوابة الدفع', 'تأكيد التحصيل (حدث موقّع من البوابة)'); log(o, 'النظام', 'تحويل كل الحجوزات إلى التزامات وإنشاء طلبات الموردين');
          } else { o.payment.state = 'REVIEW'; o.payment.note = 'وصل التحصيل بعد انتهاء حجز؛ يلزم استرداد أو قرار يدوي'; log(o, 'النظام', 'تحويل غير مكتمل؛ أُحيل الدفع للمراجعة دون إنشاء طلب جزئي'); }
        }
        if (kind === 'simPrep') { g.state = 'PREPARING'; g.pkg = { code: `PKG-${oid.slice(3)}-${g.id.slice(-1)}`, proofAt: null }; g.simReadyAt = now + 15000; log(o, sup, 'بدأ تجهيز الطلب'); }
        if (kind === 'simReady') { g.pkg.proofAt = now; g.state = 'READY'; g.job = { courier: null, state: 'OPEN', createdAt: now, otp: g.job?.otp || otpFor(oid), payout: 1500 + Math.round(S[g.supplier].km * 40) }; log(o, sup, 'جاهز للاستلام مع صورة الإثبات'); }
        if (kind === 'simAssign') { g.state = 'ASSIGNED'; Object.assign(g.job, { courier: 'C2', state: 'ASSIGNED', acceptedAt: now, auto: true, nextAt: now + 6000 }); log(o, C.C2.name, 'قبل مهمة التوصيل (مندوب محاكى)'); }
        if (kind === 'simStep') {
          if (g.state === 'ASSIGNED') { g.state = 'AT_PICKUP'; g.job.nextAt = now + 6000; log(o, C[g.job.courier].name, 'وصل إلى الفرع'); }
          else if (g.state === 'AT_PICKUP') { g.state = 'IN_TRANSIT'; g.job.transitAt = now; g.job.pickupAt = now; log(o, C[g.job.courier].name, `استلم الحزمة ${g.pkg.code} بعد مسحها وتصويرها`); }
          else if (g.state === 'IN_TRANSIT') { g.state = 'AT_DROPOFF'; g.job.nextAt = now + 8000; log(o, C[g.job.courier].name, 'وصل إلى عنوان العميل'); }
          else if (g.state === 'AT_DROPOFF') { g.state = 'DELIVERED'; g.job.deliveredAt = now; log(o, C[g.job.courier].name, 'سلّم الطلب برمز التسليم'); }
        }
      }
    });
  }
  const otpFor = (oid) => String(1000 + ((Number(oid.slice(3)) * 7919) % 9000));

  /* ---------- أوامر مسماة ---------- */
  const A = {
    addToCart: (offer, qty = 1) => mutate((s) => { const l = s.cart.find((x) => x.offer === offer); if (l) l.qty += qty; else s.cart.push({ offer, qty }); }),
    setQty: (offer, qty) => mutate((s) => { const l = s.cart.find((x) => x.offer === offer); if (!l) return; if (qty <= 0) s.cart = s.cart.filter((x) => x.offer !== offer); else l.qty = Math.min(qty, 9); }),
    clearCart: () => mutate((s) => { s.cart = []; }),
    createQuote: (addressId, vehicleId) => mutate((s) => {
      const now = Date.now(); const id = `SM-${s.seq++}`; const bySup = {};
      s.cart.forEach((c) => { const o = effectiveOffer(s, c.offer); (bySup[o.supplier] = bySup[o.supplier] || []).push(makeLine(s, c.offer, c.qty)); });
      const groups = Object.entries(bySup).map(([sid, lines], i) => {
        const g = makeGroup(s, id, 'ABCDEFG'[i], sid, lines, now);
        const reasons = [...new Set(lines.flatMap((l) => verifyReasons(effectiveOffer(s, l.offer))))];
        const short = lines.some((l) => effectiveOffer(s, l.offer).qty < l.qty);
        if (short) reasons.push('الكمية المطلوبة أكبر من المعلن');
        if (reasons.length) { g.state = 'VERIFYING'; g.hold = null; g.verify = { required: true, reasons, requestedAt: now, deadline: now + POLICY.verifySec * 1000, simAt: sid === DEMO_SUPPLIER ? null : now + 6000 + i * 2500 }; }
        g.job = { otp: otpFor(id) };
        return g;
      });
      const order = { id, createdAt: now, customer: D.customer.name, district: (D.customer.addresses.find((a) => a.id === addressId) || {}).district, addressId, vehicle: vehicleId, payment: { state: 'NONE' }, quoteVersion: 1, groups, timeline: [], live: true };
      s.orders.unshift(order); s.cart = [];
      log(order, 'العميل', `أنشأ اقتباسًا بـ ${fmt.count(groups.length, ['مورد واحد', 'موردين', 'موردين', 'موردًا'])}`);
      groups.forEach((g) => log(order, 'النظام', g.state === 'HELD' ? `حجز تلقائي لدى ${S[g.supplier].name} حتى ${fmt.time(g.hold.until)}` : `طلب تأكيد من ${S[g.supplier].name}: ${g.verify.reasons.join('، ')}`));
      return id;
    }),
    respond: (gid, accept, reason) => mutate((s) => {
      const [o, g] = findGroup(s, gid); if (!g || g.state !== 'VERIFYING') return 'stale';
      const now = Date.now(); if (now > g.verify.deadline) { g.state = 'EXPIRED'; log(o, 'النظام', 'وصل رد المورد بعد انتهاء المهلة؛ لم يُعتمد'); return 'late'; }
      g.verify.respondedAt = now;
      if (accept) { g.state = 'HELD'; g.hold = { at: now, until: now + POLICY.holdSec * 1000, ref: `H-${o.id.slice(3)}${g.id.slice(-1)}` }; log(o, S[g.supplier].name, `أكد التوفر وعزل الكمية فعليًا (${fmt.dur((now - g.verify.requestedAt) / 1000)})`); }
      else { g.state = 'REJECTED'; g.verify.reason = reason; log(o, S[g.supplier].name, `رفض: ${reason}`); }
      return 'ok';
    }),
    dropGroup: (oid, gid) => mutate((s) => { const o = findOrder(s, oid); const g = o.groups.find((x) => x.id === gid); o.groups = o.groups.filter((x) => x.id !== gid); o.quoteVersion = (o.quoteVersion || 1) + 1; log(o, 'العميل', `وافق على اقتباس جديد (نسخة ${o.quoteVersion}) دون قطع ${S[g.supplier].name}`); if (!o.groups.length) o.cancelled = true; }),
    retryGroup: (oid, gid) => mutate((s) => { const o = findOrder(s, oid); const g = o.groups.find((x) => x.id === gid); const now = Date.now(); g.state = 'VERIFYING'; g.hold = null; g.verify = { ...g.verify, requestedAt: now, deadline: now + POLICY.verifySec * 1000, simAt: g.supplier === DEMO_SUPPLIER ? null : now + 5000, respondedAt: null }; o.quoteVersion = (o.quoteVersion || 1) + 1; log(o, 'العميل', `طلب تحققًا جديدًا من ${S[g.supplier].name} (نسخة ${o.quoteVersion})`); }),
    cancelQuote: (oid) => mutate((s) => { const o = findOrder(s, oid); o.cancelled = true; o.groups.forEach((g) => { if (g.state === 'HELD') g.state = 'HOLD_EXPIRED'; }); log(o, 'العميل', 'ألغى الاقتباس وأُطلقت الحجوزات'); }),
    pay: (oid, method) => mutate((s) => {
      const o = findOrder(s, oid); if (orderStatus(o) !== 'READY_TO_PAY') return 'blocked';
      if (o.payment.state !== 'NONE') return 'dup'; // INV-05: نية دفع نشطة واحدة
      o.payment = { state: 'PROCESSING', method, intent: `pi_${o.id.slice(3)}_1`, captureAt: Date.now() + 2200 }; log(o, 'العميل', `بدأ الدفع عبر ${method}`); return 'ok';
    }),
    startPrep: (gid) => mutate((s) => { const [o, g] = findGroup(s, gid); if (g.state !== 'PAID') return; g.state = 'PREPARING'; g.pkg = { code: `PKG-${o.id.slice(3)}-${g.id.slice(-1)}`, proofAt: null }; log(o, S[g.supplier].name, 'بدأ التجهيز وطبع ملصق الحزمة'); }),
    prepProof: (gid) => mutate((s) => { const [o, g] = findGroup(s, gid); if (!g.pkg) return; g.pkg.proofAt = Date.now(); log(o, S[g.supplier].name, 'رفع صورة القطعة والتغليف'); }),
    markReady: (gid) => mutate((s) => { const [o, g] = findGroup(s, gid); if (g.state !== 'PREPARING' || !g.pkg.proofAt) return 'blocked'; g.state = 'READY'; g.job = { ...(g.job || {}), courier: null, state: 'OPEN', createdAt: Date.now(), otp: (g.job && g.job.otp) || otpFor(o.id), payout: 1500 + Math.round(S[g.supplier].km * 40) }; log(o, S[g.supplier].name, 'جاهز للاستلام؛ أُنشئت مهمة توصيل'); return 'ok'; }),
    accept: (gid, cid) => mutate((s) => {
      const [o, g] = findGroup(s, gid); if (!g || g.state !== 'READY') return 'gone';
      if (g.job.raceLost) { g.state = 'ASSIGNED'; Object.assign(g.job, { courier: 'C3', state: 'ASSIGNED', acceptedAt: Date.now() }); log(o, C.C3.name, 'قبل المهمة قبل غيره'); return 'lost'; }
      g.state = 'ASSIGNED'; Object.assign(g.job, { courier: cid, state: 'ASSIGNED', acceptedAt: Date.now() }); log(o, C[cid].name, 'قبل مهمة التوصيل'); return 'ok';
    }),
    arrivePickup: (gid) => mutate((s) => { const [o, g] = findGroup(s, gid); if (g.state !== 'ASSIGNED') return; g.state = 'AT_PICKUP'; log(o, C[g.job.courier].name, `وصل إلى ${S[g.supplier].branch}`); }),
    pickup: (gid) => mutate((s) => { const [o, g] = findGroup(s, gid); if (g.state !== 'AT_PICKUP') return; const now = Date.now(); g.state = 'IN_TRANSIT'; g.job.pickupAt = now; g.job.transitAt = now; log(o, C[g.job.courier].name, `استلم الحزمة ${g.pkg.code} بعد مسحها وتصويرها`); }),
    arriveDrop: (gid) => mutate((s) => { const [o, g] = findGroup(s, gid); if (g.state !== 'IN_TRANSIT') return; g.state = 'AT_DROPOFF'; log(o, C[g.job.courier].name, 'وصل إلى عنوان العميل'); }),
    deliver: (gid, otp) => mutate((s) => {
      const [o, g] = findGroup(s, gid); if (g.state !== 'AT_DROPOFF') return 'blocked'; if (otp !== g.job.otp) { log(o, 'النظام', 'رمز تسليم غير صحيح'); return 'otp'; }
      g.state = 'DELIVERED'; g.job.deliveredAt = Date.now(); s.courier.earnings += g.job.payout; s.courier.done.unshift({ gid, at: Date.now(), payout: g.job.payout, supplier: g.supplier, district: o.district });
      log(o, C[g.job.courier].name, 'سلّم الحزمة برمز التسليم وصورة الإثبات'); return 'ok';
    }),
    exception: (gid, kind) => mutate((s) => { const [o, g] = findGroup(s, gid); o.exception = { kind, at: Date.now(), by: C[g.job.courier].name }; log(o, C[g.job.courier].name, `سجّل استثناء: ${kind}`); }),
    setAvailable: (v) => mutate((s) => { s.courier.available = v; }),
    updateOffer: (offerId, price, qty) => mutate((s) => { const prev = s.offerEdits[offerId] || {}; s.offerEdits[offerId] = { price, qty: qty + ((s.committed[offerId]) || 0), updatedAt: Date.now(), revisions: (prev.revisions || 0) + 1 }; s.audit.unshift({ at: Date.now(), actor: S[BASE_OFFERS[offerId].supplier].name, text: `حدّث العرض ${offerId}: السعر ${fmt.sar(price)} والكمية ${qty}` }); }),
    supplierDecision: (sid, decision, reason) => mutate((s) => { s.admin.suppliers[sid] = { decision, reason, at: Date.now() }; s.audit.unshift({ at: Date.now(), actor: 'الإدارة', text: `${decision === 'approved' ? 'اعتمد' : 'رفض'} المورد ${S[sid].name}${reason ? `: ${reason}` : ''}` }); }),
    mappingDecision: (mid, decision) => mutate((s) => { s.admin.mappings[mid] = { decision, at: Date.now() }; s.audit.unshift({ at: Date.now(), actor: 'فريق الكتالوج', text: `قرار ربط ${mid}: ${decision}` }); }),
    resolve: (key, text) => mutate((s) => { s.admin.resolved[key] = { at: Date.now(), text }; s.audit.unshift({ at: Date.now(), actor: 'الإدارة', text }); }),
    setDemo: (k, v) => mutate((s) => { s.demo[k] = v; }),
    reset: () => { st = seed(); st.rev = Date.now(); persist(); emit(); },
  };

  window.Store = {
    get: () => st, on: (fn) => { listeners.add(fn); return () => listeners.delete(fn); }, A, POLICY, fmt, V, P, S, C, D,
    effectiveOffer: (id) => effectiveOffer(st, id), verifyReasons, fitment, eta, fee, vatOf, groupTotal, orderTotals, orderStatus, ORDER_LABEL, GROUP_LABEL, tone, PAID_STATES, MOVING,
    offersFor: (partId) => D.offers.filter((o) => o.part === partId && S[o.supplier].status === 'approved').map((o) => effectiveOffer(st, o.id)),
    findGroup: (gid) => findGroup(st, gid), findOrder: (id) => findOrder(st, id),
    // زمن رد المورد: خط الأساس من بياناته + ردود جلسة العرض (قيمة واحدة تُعرض في لوحتي المورد والإدارة)
    responseStats: (sid) => {
      const live = []; let timeouts = S[sid].timeouts || 0;
      st.orders.forEach((o) => o.groups.forEach((g) => { if (g.supplier !== sid || !g.verify || !g.verify.required) return; if (g.verify.respondedAt && !o.seeded) live.push((g.verify.respondedAt - g.verify.requestedAt) / 1000); if (g.state === 'EXPIRED' && !o.seeded) timeouts += 1; }));
      const base = S[sid].responseMedianSec; const all = base == null ? live : [...Array(9).fill(base), ...live].sort((a, b) => a - b);
      return { median: all.length ? all[Math.floor(all.length / 2)] : null, live: live.length, timeouts };
    },
  };
  init();
})();
