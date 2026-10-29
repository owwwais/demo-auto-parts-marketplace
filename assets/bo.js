/* صامولة — هيكل اللوحات الخلفية المشترك (المورد والإدارة) */
(function () {
  const U = UI, { fmt } = Store;
  function shell({ product, scope, nav, current, title, body, bottom = '' }) {
    return `<div class="bo">
      <aside class="bo-side" id="side" aria-label="القائمة الرئيسية">
        <button class="btn ghost icon close-side" type="button" data-side-close aria-label="إغلاق القائمة">${U.icon('x')}</button>
        <a class="brand" href="index.html">${U.mark()}<span>صامولة<span class="scope">${product}</span></span></a>
        <button class="scope-btn" type="button" data-act="scope">${U.avatar(scope.name, scope.initial)}<span class="t"><b>${scope.name}</b><span>${scope.sub}</span></span>${U.icon('down')}</button>
        <nav>${nav.map((g) => `${g.label ? `<div class="nav-group">${g.label}</div>` : ''}${g.items.map((it) => `<a class="nav-item" href="#${it.id}" ${current === it.id ? 'aria-current="page"' : ''}>${U.icon(it.icon)}<span>${it.name}</span>${it.count ? `<span class="count ${it.calm ? 'calm' : ''}" aria-label="${it.count} بانتظار إجراء">${it.count}</span>` : ''}</a>`).join('')}`).join('')}</nav>
        <div class="bottom">${bottom}</div>
      </aside>
      <div class="bo-main">
        <header class="bo-top">
          <button class="btn ghost icon menu-btn" type="button" data-side-open aria-label="فتح القائمة">${U.icon('menu')}</button>
          <span class="phone-only">${title}</span>
          <form class="search" role="search" data-form="top-search">${U.icon('search')}<input name="q" placeholder="ابحث برقم الطلب أو القطعة" aria-label="بحث"><kbd>/</kbd></form>
          <span class="stamp desk-only"><span class="dot"></span>متصل · محدث ${fmt.time(Date.now())}</span>
        </header>
        <main class="bo-sheet" id="main">${body}</main>
      </div></div>`;
  }
  document.addEventListener('click', (e) => {
    const side = document.getElementById('side'); if (!side) return;
    if (e.target.closest('[data-side-open]')) side.classList.add('open');
    else if (e.target.closest('[data-side-close]') || e.target.closest('.bo-side .nav-item')) side.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => { if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { const i = document.querySelector('.bo-top .search input'); if (i) { e.preventDefault(); i.focus(); } } });
  window.BO = { shell };
})();
