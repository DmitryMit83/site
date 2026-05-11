// ── Cursor-following gradient border ─────────────────────────────────────
(function () {
  /* Wrap cards so grid/flex layout is preserved (wrappers are neutral divs) */
  function wrapCards(selector, wrapClass) {
    document.querySelectorAll(selector).forEach(function (card) {
      if (card.parentElement.classList.contains(wrapClass)) return;
      var wrap = document.createElement('div');
      wrap.className = wrapClass;
      card.parentNode.insertBefore(wrap, card);
      wrap.appendChild(card);
    });
  }

  function init() {
    wrapCards('.darbi-home-grid .darbi-home-card', 'dhc-w');
    wrapCards('#pakalpojumiGrid .card',            'pak-w');
    wrapCards('.sub.has-img',                      'sub-w');
    wrapCards('.mesh-card',                        'mesh-w');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ── Cookie consent banner ─────────────────────────────────────────────────
(function () {
  if (localStorage.getItem('cookieConsent')) return;

  var POLICY_URL = (function () {
    var p = window.location.pathname;
    if (p.indexOf('/lv/') !== -1) return '../lv/privatuma-politika.html';
    if (p.indexOf('/ru/') !== -1) return '../lv/privatuma-politika.html';
    if (p.indexOf('/en/') !== -1) return '../lv/privatuma-politika.html';
    return 'lv/privatuma-politika.html';
  })();

  var css = [
    '#ck-banner{',
    '  position:fixed;bottom:0;left:0;right:0;z-index:9999;',
    '  background:#fff;border-top:2px solid #1E3A2E;',
    '  box-shadow:0 -4px 32px rgba(0,0,0,.14);',
    '  transform:translateY(110%);transition:transform .45s cubic-bezier(.4,0,.2,1);',
    '}',
    '#ck-banner.ck-visible{transform:translateY(0);}',
    '#ck-banner.ck-hiding{transform:translateY(110%);}',
    '.ck-inner{',
    '  max-width:1100px;margin:0 auto;',
    '  padding:18px 24px;',
    '  display:flex;align-items:center;gap:20px;flex-wrap:wrap;',
    '}',
    '.ck-text{flex:1;min-width:220px;font-size:.82rem;line-height:1.6;color:#333;}',
    '.ck-text a{color:#1E3A2E;font-weight:600;text-decoration:underline;}',
    '.ck-actions{display:flex;gap:10px;flex-shrink:0;flex-wrap:wrap;}',
    '.ck-btn{',
    '  display:inline-flex;align-items:center;',
    '  padding:.5rem 1.3rem;border-radius:8px;',
    '  font-size:.82rem;font-weight:700;cursor:pointer;',
    '  border:2px solid #1E3A2E;white-space:nowrap;',
    '  transition:background .2s,color .2s;',
    '}',
    '.ck-btn-accept{background:#1E3A2E;color:#fff;}',
    '.ck-btn-accept:hover{background:#2C5341;}',
    '.ck-btn-reject{background:transparent;color:#1E3A2E;}',
    '.ck-btn-reject:hover{background:rgba(30,58,46,.07);}',
    '@media(max-width:600px){',
    '  .ck-inner{padding:14px 16px;gap:12px;}',
    '  .ck-text{font-size:.78rem;}',
    '  .ck-btn{padding:.45rem 1rem;font-size:.78rem;}',
    '}',
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var banner = document.createElement('div');
  banner.id = 'ck-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Sīkdatņu piekrišana');
  banner.innerHTML = [
    '<div class="ck-inner">',
    '  <p class="ck-text">',
    '    Logu Apkope izmanto sīkdatnes un citas tehnoloģijas, lai mēs varētu droši un uzticami piedāvāt',
    '    mūsu lapas, pārbaudīt to veiktspēju un uzlabot tavu lietotāja pieredzi, tostarp atbilstošu saturu',
    '    un personalizētu reklāmu gan mūsu, gan trešo pušu vietnēs.',
    '    Noklikšķinot uz „Es piekrītu", tu piekrīti sīkdatņu un citu tehnoloģiju izmantošanai.',
    '    <a href="' + POLICY_URL + '">Privātuma politika →</a>',
    '  </p>',
    '  <div class="ck-actions">',
    '    <button class="ck-btn ck-btn-accept" id="ckAccept">Es piekrītu</button>',
    '    <button class="ck-btn ck-btn-reject" id="ckReject">Tikai būtiskās</button>',
    '  </div>',
    '</div>',
  ].join('');
  document.body.appendChild(banner);

  function hideBanner() {
    banner.classList.add('ck-hiding');
    setTimeout(function () { banner.remove(); }, 500);
  }

  document.getElementById('ckAccept').addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'accepted');
    hideBanner();
  });
  document.getElementById('ckReject').addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'rejected');
    hideBanner();
  });

  // Show after splash screens finish (~1.8s)
  setTimeout(function () {
    banner.classList.add('ck-visible');
  }, 1800);
})();

// ── Chrome mobile: reduce font size + fix service-detail-grid ────────────
(function(){
  var ua = navigator.userAgent;
  var isChrome = /Chrome\//.test(ua) && /Google Inc/.test(navigator.vendor);
  var isMobile = window.innerWidth <= 900;
  if(isChrome && isMobile){
    document.documentElement.classList.add('chrome-ua');
    // Force single-column layout for service detail grids (overrides inline style)
    function fixGrids(){
      document.querySelectorAll('.service-detail-grid').forEach(function(g){
        g.style.setProperty('grid-template-columns','1fr','important');
        g.style.setProperty('gap','1.5rem','important');
        var first = g.querySelector('div:first-child');
        if(first) first.style.order = '-1';
      });
    }
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', fixGrids);
    } else {
      fixGrids();
    }
  }
})();

// ── Site search index (all LV pages) ─────────────────────────────────────
const SEARCH_IDX = [
  { t:'Sākumlapa',              u:'index.html',                      k:'logu remonts apkope latvija pvc koka aluminja moskitu tikli zaluzijas' },
  { t:'Logu un durvju remonts', u:'remonts.html',                    k:'remonts regulesana logs durvis pvc koka alumins' },
  { t:'Logu regulēšana',        u:'remonts-regulesana.html',         k:'regulesana atverams logs pieregulasana' },
  { t:'Stikla pakešu maiņa',    u:'remonts-stiklu-paketes.html',     k:'stikla paketes maina termopakete dubultais stikls kondensats' },
  { t:'Blīvgumiju maiņa',       u:'remonts-blivgumija.html',         k:'blivgumija maina siltums trokšņu izolacija gumija' },
  { t:'Furnitūras maiņa',       u:'remonts-furnitura.html',          k:'furnitura rokturis enges sledzene uzgriezi' },
  { t:'Durvju remonts',         u:'remonts-durvis.html',             k:'durvis remonts regulesana sledzene iesprūdusi' },
  { t:'Moskītu tīkli',          u:'moskitu-tikli.html',              k:'moskitu tikli seti insekti musu odi pikomari' },
  { t:'Rāmju moskītu tīkli',    u:'moskitu-tikli-rama.html',         k:'ramu tikli aluminja ramis standarta logs pasutijums' },
  { t:'Rullu moskītu tīkli',    u:'moskitu-tikli-rullu.html',        k:'rullu tikli kasetne balkons durvis ritinams' },
  { t:'Plisē moskītu tīkli',    u:'moskitu-tikli-plise.html',        k:'plise plisseti tikli bidams elegants lielie logi' },
  { t:'Žalūzijas',              u:'zaluzijas.html',                  k:'zaluzijas aizkari horizontalas vertikalas rullu romiesu' },
  { t:'Horizontālās žalūzijas', u:'zaluzijas-horizontalas.html',     k:'horizontalas aluminja koks plastmasa' },
  { t:'Rullu žalūzijas',        u:'zaluzijas-rullu.html',            k:'rullu zaluzijas audums kasetne saullietussargs' },
  { t:'Dienas–Nakts žalūzijas', u:'zaluzijas-dienas-nakts.html',     k:'dienas nakts caurspidigs necaurspidigs gaisms' },
  { t:'Romiešu žalūzijas',      u:'zaluzijas-romiesu.html',          k:'romiesu audums elegants krokas' },
  { t:'Mūsu darbi — Logu remonts',  u:'#',                           k:'musu darbi logu remonts foto galerija' },
  { t:'Mūsu darbi — Durvju remonts',u:'#',                          k:'musu darbi durvis remonts galerija' },
  { t:'Mūsu darbi — Moskītu tīkli', u:'#',                          k:'musu darbi moskitu tikli galerija' },
  { t:'Mūsu darbi — Žalūzijas',     u:'#',                          k:'musu darbi zaluzijas galerija' },
  { t:'Aksesuāri',               u:'aksesuari.html',                 k:'aksesuari piederumi rokturis tapas starplikas blivgumija' },
  { t:'Palodzes',               u:'palodzes.html',                   k:'palodzes logu palodze pvc koka marmors uzstadisana' },
  { t:'Ventilācija',            u:'ventilacija.html',                k:'ventilacija piepludes varts logs durvis svaigs gaiss' },
  { t:'Logu siltināšana',        u:'remonts-siltinasana.html',        k:'siltinasana blivgumija hermētizācija caurvejs auksts logs siltums' },
  { t:'Logu modernizācija',      u:'remonts-modernizacija.html',      k:'modernizacija stikla pakete energoefektivs furnitura jauninasana' },
  { t:'Termokamera',             u:'remonts-termokamera.html',        k:'termokamera termografija siltuma zudumi mitrums diagnostika' },
  { t:'Plēve',                   u:'pleve.html',                      k:'pleve logu pleve saules aizsargpleve siltuma izolacija mateta dekorativa uv aizsardziba' },
  { t:'Raksti',                 u:'raksti.html',                     k:'raksti blogs padomi kondensats regulesana blivgumija palodze ventilacija' },
  { t:'Interneta veikals',      u:'interneta-veikals.html',          k:'interneta veikals tirdznieciba aksesuari pirkums pasutijums' },
  { t:'Padomi un ieteikumi',    u:'padomi.html',                     k:'padomi ieteikumi kopšana trisana siltums kondensats' },
  { t:'Transporta izmaksas',     u:'transporta-izmaksas.html',        k:'transports brauciens cena arpus rigas pilsetas attālums salaspils jurmala valmiera daugavpils' },
  { t:'Kontakti',               u:'kontakti.html',                   k:'kontakti talrunis epasts adrese riga latgales iela' },
];

function hlMatch(text, q) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return text.slice(0, i) + '<mark>' + text.slice(i, i + q.length) + '</mark>' + text.slice(i + q.length);
}

// ── Mobile nav toggle + multi-level dropdown support
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  if (!btn || !nav) return;

  // ── Hamburger toggle ──────────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    // Close all open dropdowns when closing nav
    if (!nav.classList.contains('open')) {
      nav.querySelectorAll('.dropdown.open, .dropdown-sub.open')
         .forEach(d => d.classList.remove('open'));
    }
  });

  // ── Mobile: level-1 dropdowns (.has-dropdown > a) ─────────────────────────
  nav.querySelectorAll('.has-dropdown > a').forEach(trigger => {
    trigger.addEventListener('click', e => {
      if (window.innerWidth > 900) return;
      e.preventDefault();
      const parent   = trigger.closest('.has-dropdown');
      const dropdown = parent.querySelector(':scope > .dropdown');
      const isOpen   = dropdown.classList.contains('open');
      // Close all level-1 dropdowns
      nav.querySelectorAll('.has-dropdown > .dropdown').forEach(d => d.classList.remove('open'));
      nav.querySelectorAll('.dropdown-sub').forEach(d => d.classList.remove('open'));
      if (!isOpen) dropdown.classList.add('open');
    });
  });

  // ── Mobile: level-2 sub-dropdowns (.has-dropdown-sub > a) ────────────────
  nav.querySelectorAll('.has-dropdown-sub > a').forEach(trigger => {
    trigger.addEventListener('click', e => {
      if (window.innerWidth > 900) return;
      e.preventDefault();
      const parent = trigger.closest('.has-dropdown-sub');
      const sub    = parent.querySelector(':scope > .dropdown-sub');
      const isOpen = sub.classList.contains('open');
      // Close siblings
      parent.closest('.dropdown-inner').querySelectorAll('.dropdown-sub')
            .forEach(d => d.classList.remove('open'));
      if (!isOpen) sub.classList.add('open');
    });
  });

  // ── Close nav when a leaf link is clicked (not a dropdown trigger) ────────
  nav.querySelectorAll('a:not(.has-dropdown > a):not(.has-dropdown-sub > a):not(.social-trigger)')
     .forEach(a => a.addEventListener('click', () => {
       nav.classList.remove('open');
       nav.querySelectorAll('.dropdown.open, .dropdown-sub.open')
          .forEach(d => d.classList.remove('open'));
     }));

  // ── Utility panel (contacts + search) ────────────────────────────────────
  const utilPanel  = document.getElementById('utilPanel');
  const infoBtn    = document.getElementById('infoToggle');
  const searchBtn  = document.getElementById('searchToggle');
  const searchInp  = document.getElementById('siteSearchInput');
  const searchRes  = document.getElementById('searchResults');

  function openPane(paneId) {
    document.querySelectorAll('.util-pane').forEach(p => p.classList.add('hidden'));
    document.getElementById(paneId)?.classList.remove('hidden');
    document.querySelectorAll('.util-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.pane === paneId));
    if (!utilPanel.classList.contains('open')) {
      utilPanel.style.overflow = 'hidden';
      utilPanel.classList.add('open');
      utilPanel.setAttribute('aria-hidden', 'false');
      utilPanel.addEventListener('transitionend', function onEnd() {
        if (utilPanel.classList.contains('open')) utilPanel.style.overflow = 'visible';
        utilPanel.removeEventListener('transitionend', onEnd);
      });
    }
    if (paneId === 'utilPaneSearch') setTimeout(() => searchInp?.focus(), 360);
    infoBtn?.classList.toggle('is-active',   paneId === 'utilPaneInfo');
    searchBtn?.classList.toggle('is-active', paneId === 'utilPaneSearch');
  }

  function closePanel() {
    utilPanel.style.overflow = 'hidden';
    utilPanel.classList.remove('open');
    utilPanel.setAttribute('aria-hidden', 'true');
    infoBtn?.classList.remove('is-active');
    searchBtn?.classList.remove('is-active');
    if (searchRes) { searchRes.classList.remove('visible'); searchRes.innerHTML = ''; }
  }

  function togglePane(paneId, btn) {
    const pane = document.getElementById(paneId);
    const isOpen  = utilPanel.classList.contains('open');
    const isSame  = pane && !pane.classList.contains('hidden');
    if (isOpen && isSame) { closePanel(); } else { openPane(paneId); }
  }

  function closeNav() {
    nav.classList.remove('open');
    nav.querySelectorAll('.dropdown.open, .dropdown-sub.open')
       .forEach(d => d.classList.remove('open'));
  }

  infoBtn?.addEventListener('click', () => {
    closeNav();
    togglePane('utilPaneInfo', infoBtn);
  });
  searchBtn?.addEventListener('click', () => {
    closeNav();
    togglePane('utilPaneSearch', searchBtn);
  });

  // Tab buttons inside the panel
  document.querySelectorAll('.util-tab').forEach(tab =>
    tab.addEventListener('click', () => openPane(tab.dataset.pane)));

  // Close panel when clicking outside
  document.addEventListener('click', e => {
    if (utilPanel?.classList.contains('open') &&
        !utilPanel.contains(e.target) &&
        e.target !== infoBtn && !infoBtn?.contains(e.target) &&
        e.target !== searchBtn && !searchBtn?.contains(e.target)) {
      closePanel();
    }
  });

  // ── Live search ───────────────────────────────────────────────────────────
  if (searchInp && searchRes) {
    // Resolve base URL (works from any depth: lv/, ru/, etc.)
    const basePath = window.location.pathname.includes('/lv/') ? '../lv/' : './';

    searchInp.addEventListener('input', () => {
      const q = searchInp.value.trim();
      if (q.length < 4) { searchRes.classList.remove('visible'); searchRes.innerHTML = ''; return; }

      const hits = SEARCH_IDX.filter(item =>
        item.t.toLowerCase().includes(q.toLowerCase()) ||
        item.k.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 6);

      if (!hits.length) {
        searchRes.innerHTML = '<div class="sr-empty">Nav rezultātu priekš „' + q + '"</div>';
        searchRes.classList.add('visible');
        return;
      }

      searchRes.innerHTML = hits.map(item => {
        const keyHit = item.k.toLowerCase().includes(q.toLowerCase());
        const sub    = keyHit ? item.k.split(' ').find(w => w.toLowerCase().includes(q.toLowerCase())) || '' : '';
        return `<a class="sr-item" href="${basePath}${item.u}">
          <div class="sr-item-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
          <div>
            <div class="sr-item-title">${hlMatch(item.t, q)}</div>
            ${sub ? `<div class="sr-item-sub">…${hlMatch(sub, q)}…</div>` : ''}
          </div>
        </a>`;
      }).join('');
      searchRes.classList.add('visible');
    });

    // Close search results on Escape
    searchInp.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
  }

  // ── Form submission stub ──────────────────────────────────────────────────
  const form = document.querySelector('form[data-contact]');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const msg = form.getAttribute('data-success') || 'Paldies! Mēs sazināsimies ar Jums.';
      alert(msg);
      form.reset();
    });
  }

  // ── Auto-highlight active nav item based on current page ─────────────────
  (function() {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    // Pages that belong under "Pakalpojumi" dropdown
    const servicePages = [
      'remonts', 'remonts-regulesana', 'remonts-stiklu-paketes',
      'remonts-blivgumija', 'remonts-furnitura', 'remonts-durvis',
      'moskitu-tikli', 'moskitu-tikli-rama', 'moskitu-tikli-rullu',
      'moskitu-tikli-plise',       'zaluzijas', 'zaluzijas-horizontalas', 'zaluzijas-rullu',
      'zaluzijas-dienas-nakts', 'zaluzijas-romiesu',
      'aksesuari',
      'palodzes',
      'ventilacija'
    ];

    const isService = servicePages.some(p => page === p + '.html');
    if (!isService) return;

    // Find the "Pakalpojumi" trigger — first .has-dropdown that is NOT lang-dd or social-dd
    const pakTrigger = nav.querySelector(
      '.has-dropdown:not(.lang-dd):not(.social-dd) > a'
    );
    if (pakTrigger) pakTrigger.classList.add('active');
  })();

  // ── Mobile contact widget (bookmark tab) ───────────────────────────────
  (function () {
    var widget = document.getElementById('mobContactWidget');
    var tab    = document.getElementById('mobContactTab');
    if (!widget || !tab) return;

    // Position widget exactly below the header (updates on resize too)
    var siteHeader = document.querySelector('.site-header');
    function placeWidget() {
      if (window.innerWidth >= 1200) return;
      if (siteHeader) {
        widget.style.top = siteHeader.offsetHeight + 'px';
      }
    }
    placeWidget();
    window.addEventListener('resize', placeWidget);

    // justOpened flag prevents Chrome's document-click from closing immediately
    var justOpened = false;

    tab.addEventListener('click', function () {
      var wasOpen = widget.classList.contains('open');
      widget.classList.toggle('open');
      tab.setAttribute('aria-expanded', wasOpen ? 'false' : 'true');
      if (!wasOpen) {
        // Block the document-click handler briefly so it can't close immediately
        // (needed for Chrome and Safari mobile where tap fires click on document too)
        justOpened = true;
        setTimeout(function () { justOpened = false; }, 120);
      }
    });

    document.addEventListener('click', function (e) {
      if (justOpened) return;
      if (widget.classList.contains('open') && !widget.contains(e.target)) {
        widget.classList.remove('open');
        tab.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  // ── Service navigation bookmark tab (left side) ───────────────────────────
  (function () {
    var nav = document.getElementById('svcNav');
    var tab = document.getElementById('svcNavTab');
    if (!nav || !tab) return;

    var siteHeader = document.querySelector('.site-header');
    function placeNav() {
      if (window.innerWidth >= 1200) return;
      if (siteHeader) nav.style.top = siteHeader.offsetHeight + 'px';
    }
    placeNav();
    window.addEventListener('resize', placeNav);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeNav);

    var justOpened = false;
    tab.addEventListener('click', function () {
      var wasOpen = nav.classList.contains('open');
      nav.classList.toggle('open');
      tab.setAttribute('aria-expanded', wasOpen ? 'false' : 'true');
      if (!wasOpen) {
        justOpened = true;
        setTimeout(function () { justOpened = false; }, 120);
      }
    });

    document.addEventListener('click', function (e) {
      if (justOpened) return;
      if (nav.classList.contains('open') && !nav.contains(e.target)) {
        nav.classList.remove('open');
        tab.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  // ── Hide header on scroll-down, reveal on scroll-up ───────────────────────
  (function () {
    var hdr = document.querySelector('.site-header');
    if (!hdr) return;

    var lastY   = window.pageYOffset;
    var ticking = false;
    var DELTA   = 6;    /* minimum px delta to trigger */
    var MIN_TOP = 80;   /* always show header within first 80px */

    function hide() {
      if (document.body.classList.contains('hdr--hidden')) return;
      document.body.classList.add('hdr--hidden');
    }

    function show() {
      document.body.classList.remove('hdr--hidden');
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y     = window.pageYOffset;
        var delta = y - lastY;

        if (y < MIN_TOP) {
          show();
        } else if (delta >  DELTA) {
          hide();
        } else if (delta < -DELTA) {
          show();
        }

        lastY   = y;
        ticking = false;
      });
    }, { passive: true });

    /* Also show header when any dropdown/panel opens */
    document.addEventListener('focusin', function (e) {
      if (e.target.closest('.site-header')) show();
    });
  })();
});
