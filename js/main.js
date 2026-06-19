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

  var CK_LNG = (document.documentElement.lang || 'lv').slice(0, 2).toLowerCase();
  var POLICY_URL = (function () {
    var p = window.location.pathname;
    if (p.indexOf('/ru/') !== -1) return '../ru/politika-konfidencialnosti.html';
    if (p.indexOf('/en/') !== -1) return '../lv/privatuma-politika.html';
    if (p.indexOf('/lv/') !== -1) return '../lv/privatuma-politika.html';
    return 'lv/privatuma-politika.html';
  })();
  var CK = (CK_LNG === 'ru') ? {
    aria: 'Согласие на использование cookie',
    text: 'Logu Apkope использует cookie-файлы и другие технологии, чтобы безопасно и надёжно предлагать наши страницы, проверять их работу и улучшать ваш пользовательский опыт, включая релевантный контент и персонализированную рекламу как на наших, так и на сторонних сайтах. Нажимая «Я согласен», вы соглашаетесь на использование cookie и других технологий.',
    policy: 'Политика конфиденциальности →', accept: 'Я согласен', reject: 'Только необходимые'
  } : {
    aria: 'Sīkdatņu piekrišana',
    text: 'Logu Apkope izmanto sīkdatnes un citas tehnoloģijas, lai mēs varētu droši un uzticami piedāvāt mūsu lapas, pārbaudīt to veiktspēju un uzlabot tavu lietotāja pieredzi, tostarp atbilstošu saturu un personalizētu reklāmu gan mūsu, gan trešo pušu vietnēs. Noklikšķinot uz „Es piekrītu", tu piekrīti sīkdatņu un citu tehnoloģiju izmantošanai.',
    policy: 'Privātuma politika →', accept: 'Es piekrītu', reject: 'Tikai būtiskās'
  };

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
  banner.setAttribute('aria-label', CK.aria);
  banner.innerHTML = [
    '<div class="ck-inner">',
    '  <p class="ck-text">',
    '    ' + CK.text + ' ',
    '    <a href="' + POLICY_URL + '">' + CK.policy + '</a>',
    '  </p>',
    '  <div class="ck-actions">',
    '    <button class="ck-btn ck-btn-accept" id="ckAccept">' + CK.accept + '</button>',
    '    <button class="ck-btn ck-btn-reject" id="ckReject">' + CK.reject + '</button>',
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

// ── Site search index (language-aware) ─────────────────────────────────────
var SITE_LANG = (document.documentElement.lang || 'lv').slice(0, 2).toLowerCase();
const SEARCH_IDX_LV = [
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
const SEARCH_IDX_RU = [
  { t:'Главная',                     u:'index.html',                            k:'ремонт окон обслуживание латвия пвх дерево алюминий москитные сетки жалюзи' },
  { t:'Ремонт окон и дверей',        u:'remont.html',                           k:'ремонт регулировка окно дверь пвх дерево алюминий' },
  { t:'Регулировка окон',            u:'remont-regulirovka.html',               k:'регулировка открывание окно настройка створка' },
  { t:'Замена стеклопакета',         u:'remont-steklopaket.html',               k:'стеклопакет замена термопакет двойное стекло конденсат запотевание' },
  { t:'Замена уплотнителя',          u:'remont-uplotnitel.html',                k:'уплотнитель замена тепло шумоизоляция резина сквозняк' },
  { t:'Замена фурнитуры',            u:'remont-furnitura.html',                 k:'фурнитура ручка петли замок механизм' },
  { t:'Ремонт дверей',               u:'remont-dverej.html',                    k:'двери ремонт регулировка замок заклинило петли' },
  { t:'Москитные сетки',             u:'moskitnye-setki.html',                  k:'москитные сетки насекомые мухи комары' },
  { t:'Рамочные москитные сетки',    u:'moskitnye-setki-ramochnye.html',        k:'рамочные сетки алюминиевая рама стандарт окно заказ' },
  { t:'Рулонные москитные сетки',    u:'moskitnye-setki-rulonnye.html',         k:'рулонные сетки кассета балкон двери' },
  { t:'Москитные сетки плиссе',      u:'moskitnye-setki-plisse.html',           k:'плиссе сетки складные элегантные большие окна гармошка' },
  { t:'Жалюзи',                      u:'zhalyuzi.html',                         k:'жалюзи шторы горизонтальные вертикальные рулонные римские' },
  { t:'Горизонтальные жалюзи',       u:'zhalyuzi-gorizontalnye.html',           k:'горизонтальные алюминий дерево пластик ламели' },
  { t:'Рулонные жалюзи',             u:'zhalyuzi-rulonnye.html',                k:'рулонные жалюзи полотно кассета blackout затемнение' },
  { t:'Жалюзи день-ночь',            u:'zhalyuzi-den-noch.html',                k:'день ночь зебра прозрачный затемнение' },
  { t:'Римские жалюзи',              u:'zhalyuzi-rimskie.html',                 k:'римские полотно элегантные складки' },
  { t:'Аксессуары',                  u:'aksessuary.html',                       k:'аксессуары комплектующие ручка проставки уплотнитель' },
  { t:'Подоконники',                 u:'podokonniki.html',                      k:'подоконники пвх дерево камень мрамор установка' },
  { t:'Вентиляция',                  u:'ventilyaciya.html',                     k:'вентиляция приточный клапан окно двери свежий воздух' },
  { t:'Утепление окон',              u:'remont-uteplenie.html',                 k:'утепление уплотнитель герметизация сквозняк холодное окно тепло' },
  { t:'Модернизация окон',           u:'remont-modernizaciya.html',             k:'модернизация стеклопакет энергоэффективный фурнитура обновление' },
  { t:'Тепловизор',                  u:'remont-teplovizor.html',                k:'тепловизор термография теплопотери влага диагностика' },
  { t:'Плёнка',                      u:'plenka.html',                           k:'плёнка оконная солнцезащитная теплоизоляция матовая декоративная уф защита тонировка' },
  { t:'Статьи',                      u:'stati.html',                            k:'статьи блог советы конденсат регулировка уплотнитель подоконник вентиляция' },
  { t:'Интернет-магазин',            u:'internet-magazin.html',                 k:'интернет магазин торговля аксессуары покупка заказ' },
  { t:'Советы и рекомендации',       u:'sovety.html',                           k:'советы рекомендации уход потеют тепло конденсат' },
  { t:'Транспортные расходы',        u:'transportnye-rashody.html',             k:'транспорт выезд цена за пределами риги города расстояние саласпилс юрмала валмиера даугавпилс' },
  { t:'Контакты',                    u:'kontakty.html',                         k:'контакты телефон email адрес рига latgales iela' },
];
const SEARCH_IDX = (SITE_LANG === 'ru') ? SEARCH_IDX_RU : SEARCH_IDX_LV;

function hlMatch(text, q) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return text.slice(0, i) + '<mark>' + text.slice(i, i + q.length) + '</mark>' + text.slice(i + q.length);
}

// Case-insensitive substring match with a light stemming fallback.
// Russian (and Latvian) word endings change between singular/plural/case/
// gender forms (e.g. "сетка"→"сетки", "дверь"→"двери", "окно"→"окна",
// "москитные"→"москитная"), so a plain .includes() check misses many
// natural one-word queries. Some of these forms differ by more than one
// trailing character (e.g. adjective gender endings "-ные"/"-ная"/"-ный"),
// so for queries of 5+ characters we progressively try the query with its
// last 1, 2 or 3 characters dropped (never shorter than a 4-character
// stem) as a word-prefix. This catches the vast majority of inflected
// forms without needing a full morphological analyzer.
// We also normalize ё→е, since most Russian speakers type "е" instead of
// "ё" (e.g. "пленка" instead of "плёнка") and would otherwise get no hits.
function searchTextMatches(text, q) {
  const t  = text.toLowerCase().replace(/ё/g, 'е');
  const ql = q.toLowerCase().replace(/ё/g, 'е');
  if (t.includes(ql)) return true;
  if (ql.length < 5) return false;
  const words   = t.split(/[\s,.\-/]+/);
  const minStem = 4;
  const maxDrop = Math.min(3, ql.length - minStem);
  for (let drop = 1; drop <= maxDrop; drop++) {
    const stem = ql.slice(0, ql.length - drop);
    if (words.some(w => w.length >= stem.length && w.indexOf(stem) === 0)) return true;
  }
  return false;
}

// ── Mobile nav toggle + multi-level dropdown support
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  if (!btn || !nav) return;

  // ── Hamburger toggle ──────────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    if (!nav.classList.contains('open')) {
      nav.querySelectorAll('.dropdown.open, .dropdown-sub.open')
         .forEach(d => d.classList.remove('open'));
    }
  });

  // ── Mobile: level-1 dropdowns (SNM nav: .snm-trig; legacy: .has-dropdown > a)
  nav.querySelectorAll('.snm-trig, .has-dropdown > a:not(.snm-trig)').forEach(trigger => {
    trigger.addEventListener('click', e => {
      if (window.innerWidth > 900) return;
      e.preventDefault();
      const parent   = trigger.closest('.snm-item, .has-dropdown');
      const dropdown = parent.querySelector(':scope > .snm-mob-dd, :scope > .dropdown');
      if (!dropdown) return;
      const isOpen   = dropdown.classList.contains('open');
      nav.querySelectorAll('.snm-mob-dd.open, .has-dropdown > .dropdown.open')
         .forEach(d => d.classList.remove('open'));
      nav.querySelectorAll('.dropdown-sub.open').forEach(d => d.classList.remove('open'));
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
      if (!sub) return;
      const isOpen = sub.classList.contains('open');
      parent.closest('.dropdown-inner').querySelectorAll('.dropdown-sub')
            .forEach(d => d.classList.remove('open'));
      if (!isOpen) sub.classList.add('open');
    });
  });

  // ── Close nav when a leaf link is clicked ────────────────────────────────
  nav.querySelectorAll('a:not(.snm-trig):not(.has-dropdown > a):not(.has-dropdown-sub > a):not(.social-trigger)')
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

    // Position search results below the input wrap (fixed, escapes overflow:hidden)
    function positionSearchRes() {
      const wrap = searchInp.closest('.util-search-wrap');
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      searchRes.style.top   = (r.bottom + 6) + 'px';
      searchRes.style.left  = r.left + 'px';
      searchRes.style.width = r.width + 'px';
    }

    searchInp.addEventListener('input', () => {
      const q = searchInp.value.trim();
      if (q.length < 4) { searchRes.classList.remove('visible'); searchRes.innerHTML = ''; return; }

      const hits = SEARCH_IDX.filter(item =>
        searchTextMatches(item.t, q) ||
        searchTextMatches(item.k, q)
      ).slice(0, 6);

      if (!hits.length) {
        searchRes.innerHTML = '<div class="sr-empty">' + (SITE_LANG === 'ru' ? 'Нет результатов по „' : 'Nav rezultātu priekš „') + q + '"</div>';
        positionSearchRes();
        searchRes.classList.add('visible');
        return;
      }

      searchRes.innerHTML = hits.map(item => {
        const keyHit = searchTextMatches(item.k, q);
        const sub    = keyHit ? (item.k.split(' ').find(w => w.toLowerCase().includes(q.toLowerCase())) || item.k.split(' ').find(w => searchTextMatches(w, q)) || '') : '';
        return `<a class="sr-item" href="${basePath}${item.u}">
          <div class="sr-item-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
          <div>
            <div class="sr-item-title">${hlMatch(item.t, q)}</div>
            ${sub ? `<div class="sr-item-sub">…${hlMatch(sub, q)}…</div>` : ''}
          </div>
        </a>`;
      }).join('');
      positionSearchRes();
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
      const msg = form.getAttribute('data-success') || (SITE_LANG === 'ru' ? 'Спасибо! Мы свяжемся с вами.' : 'Paldies! Mēs sazināsimies ar Jums.');
      alert(msg);
      form.reset();
    });
  }

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

// ── SNM NavigationMenu viewport (desktop dropdowns) ──────────────────────────
(function () {
  var nav      = document.getElementById('siteNav');
  var vpWrap   = document.getElementById('snmVPWrap');
  var viewport = document.getElementById('snmViewport');
  var indEl    = document.getElementById('snmIndicator');
  if (!nav || !vpWrap || !viewport || !indEl) return;

  var items      = Array.from(nav.querySelectorAll('.snm-has-menu'));
  var activeId   = null;
  var closeTimer = null;

  function itemIdx(id) {
    return items.findIndex(function (el) { return el.id === 'snmi-' + id; });
  }

  function open(id) {
    clearTimeout(closeTimer);
    var prevId  = activeId;
    var prevIdx = prevId ? itemIdx(prevId) : -1;
    var newIdx  = itemIdx(id);
    var dir     = prevId ? (newIdx > prevIdx ? 1 : -1) : 0;
    activeId = id;

    items.forEach(function (it) {
      var t = it.querySelector('.snm-trig');
      if (t) t.dataset.state = (it.id === 'snmi-' + id) ? 'open' : '';
    });

    viewport.querySelectorAll('.snm-panel').forEach(function (p) {
      var pid = p.id.replace('snmp-', '');
      p.classList.remove('is-active', 'from-right', 'from-left', 'fade-in');
      if (pid === id) {
        p.classList.add('is-active');
        if (dir > 0)      p.classList.add('from-right');
        else if (dir < 0) p.classList.add('from-left');
        else              p.classList.add('fade-in');
      }
    });

    vpWrap.classList.add('is-open');
    positionVP(id);
  }

  function positionVP(id) {
    var item    = document.getElementById('snmi-' + id);
    var trigger = item ? item.querySelector('.snm-trig') : null;
    if (!trigger) return;

    var navRect  = nav.getBoundingClientRect();
    var trigRect = trigger.getBoundingClientRect();
    var trigCx   = trigRect.left - navRect.left + trigRect.width / 2;

    var panel = document.getElementById('snmp-' + id);
    if (panel) {
      vpWrap.style.minWidth  = '';
      panel.style.display    = 'block';
      panel.style.width      = 'fit-content';
      var pw = panel.scrollWidth;
      panel.style.width      = '';
      panel.style.display    = '';
      vpWrap.style.minWidth  = Math.max(180, pw) + 'px';
    }

    var vpW    = vpWrap.offsetWidth || 220;
    var rawLeft = trigCx - vpW / 2;
    var maxLeft = nav.offsetWidth - vpW;
    var left    = Math.max(0, Math.min(rawLeft, maxLeft));
    vpWrap.style.left = left + 'px';

    var indLeft = trigCx - left;
    indEl.style.left = indLeft + 'px';
    indEl.classList.add('is-visible');
  }

  function close() {
    activeId = null;
    vpWrap.classList.remove('is-open');
    indEl.classList.remove('is-visible');
    items.forEach(function (it) {
      var t = it.querySelector('.snm-trig');
      if (t) t.dataset.state = '';
    });
    viewport.querySelectorAll('.snm-panel').forEach(function (p) {
      p.classList.remove('is-active', 'from-right', 'from-left', 'fade-in');
    });
  }

  items.forEach(function (item) {
    var id = item.id.replace('snmi-', '');
    item.addEventListener('mouseenter', function () { open(id); });
  });

  nav.querySelectorAll('.snm-item:not(.snm-has-menu)').forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      clearTimeout(closeTimer);
      close();
    });
  });

  vpWrap.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });

  [nav, vpWrap].forEach(function (el) {
    el.addEventListener('mouseleave', function () {
      closeTimer = setTimeout(close, 100);
    });
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !vpWrap.contains(e.target)) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();

// ── Active nav highlight — runs independently of all other nav logic ──────────
document.addEventListener('DOMContentLoaded', function () {
  var page = window.location.pathname.split('/').pop() || 'index.html';

  // ── LV pages: SNM nav (snmi-* IDs) ────────────────────────────────────────
  var snmNav = document.querySelector('nav.snm');
  if (snmNav) {
    var pageMap = {
      // Pakalpojumi
      'remonts.html':'pakalpojumi','remonts-regulesana.html':'pakalpojumi',
      'remonts-stiklu-paketes.html':'pakalpojumi','remonts-blivgumija.html':'pakalpojumi',
      'remonts-furnitura.html':'pakalpojumi','remonts-durvis.html':'pakalpojumi',
      'remonts-siltinasana.html':'pakalpojumi','remonts-modernizacija.html':'pakalpojumi',
      'remonts-termokamera.html':'pakalpojumi',
      'moskitu-tikli.html':'pakalpojumi','moskitu-tikli-rama.html':'pakalpojumi',
      'moskitu-tikli-rullu.html':'pakalpojumi','moskitu-tikli-plise.html':'pakalpojumi',
      'moskitu-tikli-durvis.html':'pakalpojumi','moskitu-tikli-slidamie.html':'pakalpojumi',
      'moskitu-tikli-magnetiskie.html':'pakalpojumi',
      'zaluzijas.html':'pakalpojumi','zaluzijas-kasesu.html':'pakalpojumi',
      'zaluzijas-rullu.html':'pakalpojumi','zaluzijas-plise.html':'pakalpojumi',
      'zaluzijas-vertikalas.html':'pakalpojumi','zaluzijas-horizontalas.html':'pakalpojumi',
      'zaluzijas-dienas-nakts.html':'pakalpojumi','zaluzijas-romiesu.html':'pakalpojumi',
      'aksesuari.html':'pakalpojumi','palodzes.html':'pakalpojumi',
      'ventilacija.html':'pakalpojumi','pleve.html':'pakalpojumi',
      // Portfolio
      'darbi-logu-remonts.html':'portfolio','darbi-durvis.html':'portfolio',
      'darbi-moskitu-tikli.html':'portfolio','darbi-zaluzijas.html':'portfolio',
      'darbi-aksesuari.html':'portfolio','darbi-stikla-paketes.html':'portfolio',
      // Jaunumi
      'padomi.html':'jaunumi','raksti.html':'jaunumi',
      // Info
      'kontakti.html':'info','transporta-izmaksas.html':'info',
      'privatuma-politika.html':'info',
      // ── RU pages (same sections, translated filenames) ──────────────────────
      'remont.html':'pakalpojumi',
      'remont-regulirovka.html':'pakalpojumi',
      'remont-steklopaket.html':'pakalpojumi',
      'remont-uplotnitel.html':'pakalpojumi',
      'remont-furnitura.html':'pakalpojumi',
      'remont-dverej.html':'pakalpojumi',
      'remont-uteplenie.html':'pakalpojumi',
      'remont-modernizaciya.html':'pakalpojumi',
      'remont-teplovizor.html':'pakalpojumi',
      'moskitnye-setki.html':'pakalpojumi',
      'moskitnye-setki-ramochnye.html':'pakalpojumi',
      'moskitnye-setki-rulonnye.html':'pakalpojumi',
      'moskitnye-setki-plisse.html':'pakalpojumi',
      'moskitnye-setki-dvernye.html':'pakalpojumi',
      'moskitnye-setki-razdvizhnye.html':'pakalpojumi',
      'moskitnye-setki-magnitnye.html':'pakalpojumi',
      'zhalyuzi.html':'pakalpojumi',
      'zhalyuzi-kassetnye.html':'pakalpojumi',
      'zhalyuzi-rulonnye.html':'pakalpojumi',
      'zhalyuzi-plisse.html':'pakalpojumi',
      'zhalyuzi-vertikalnye.html':'pakalpojumi',
      'zhalyuzi-gorizontalnye.html':'pakalpojumi',
      'zhalyuzi-den-noch.html':'pakalpojumi',
      'zhalyuzi-rimskie.html':'pakalpojumi',
      'aksessuary.html':'pakalpojumi',
      'podokonniki.html':'pakalpojumi',
      'ventilyaciya.html':'pakalpojumi',
      'plenka.html':'pakalpojumi',
      'nashi-raboty-remont-okon.html':'portfolio',
      'nashi-raboty-dveri.html':'portfolio',
      'nashi-raboty-moskitnye-setki.html':'portfolio',
      'nashi-raboty-zhalyuzi.html':'portfolio',
      'nashi-raboty-aksessuary.html':'portfolio',
      'nashi-raboty-steklopakety.html':'portfolio',
      'sovety.html':'jaunumi',
      'stati.html':'jaunumi',
      'kontakty.html':'info',
      'transportnye-rashody.html':'info',
      'politika-konfidencialnosti.html':'info',
      // ── EN pages (same sections, translated filenames) ──────────────────────
      'repair.html':'pakalpojumi',
      'repair-adjustment.html':'pakalpojumi',
      'repair-glass-unit.html':'pakalpojumi',
      'repair-seal.html':'pakalpojumi',
      'repair-hardware.html':'pakalpojumi',
      'repair-doors.html':'pakalpojumi',
      'repair-insulation.html':'pakalpojumi',
      'repair-modernization.html':'pakalpojumi',
      'repair-thermal-imaging.html':'pakalpojumi',
      'mosquito-nets.html':'pakalpojumi',
      'mosquito-nets-frame.html':'pakalpojumi',
      'mosquito-nets-roll.html':'pakalpojumi',
      'mosquito-nets-pleated.html':'pakalpojumi',
      'mosquito-nets-door.html':'pakalpojumi',
      'mosquito-nets-sliding.html':'pakalpojumi',
      'mosquito-nets-magnetic.html':'pakalpojumi',
      'blinds.html':'pakalpojumi',
      'blinds-cassette.html':'pakalpojumi',
      'blinds-roller.html':'pakalpojumi',
      'blinds-pleated.html':'pakalpojumi',
      'blinds-vertical.html':'pakalpojumi',
      'blinds-horizontal.html':'pakalpojumi',
      'blinds-day-night.html':'pakalpojumi',
      'blinds-roman.html':'pakalpojumi',
      'accessories.html':'pakalpojumi',
      'windowsills.html':'pakalpojumi',
      'ventilation.html':'pakalpojumi',
      'film.html':'pakalpojumi',
      'our-works-window-repair.html':'portfolio',
      'our-works-doors.html':'portfolio',
      'our-works-mosquito-nets.html':'portfolio',
      'our-works-blinds.html':'portfolio',
      'our-works-accessories.html':'portfolio',
      'our-works-glass-units.html':'portfolio',
      'tips.html':'jaunumi',
      'articles.html':'jaunumi',
      'contacts.html':'info',
      'transport-costs.html':'info',
      'privacy-policy.html':'info'
    };
    var section = pageMap[page];
    if (section) {
      var navItem = document.getElementById('snmi-' + section);
      if (navItem) {
        var trig = navItem.querySelector('a');
        if (trig) trig.classList.add('active');
      }
    }
  }

  // ── RU / EN pages: old-style nav (no snm class) ───────────────────────────
  var oldNav = document.querySelector('nav.nav:not(.snm)');
  if (oldNav) {
    // Remove hardcoded active (except lang-dd / social-dd)
    oldNav.querySelectorAll('a.active').forEach(function (a) {
      if (!a.closest('.lang-dd') && !a.closest('.social-dd')) {
        a.classList.remove('active');
      }
    });

    var matched = false;
    Array.from(oldNav.children).forEach(function (child) {
      if (matched) return;
      if (child.tagName === 'A') {
        if ((child.getAttribute('href') || '') === page) {
          child.classList.add('active');
          matched = true;
        }
      } else if (child.classList.contains('has-dropdown') &&
                 !child.classList.contains('lang-dd') &&
                 !child.classList.contains('social-dd')) {
        var anyMatch = Array.from(child.querySelectorAll('.dropdown a')).some(function (a) {
          return (a.getAttribute('href') || '') === page;
        });
        if (anyMatch) {
          var t = child.querySelector('a');
          if (t) { t.classList.add('active'); matched = true; }
        }
      }
    });

    if (!matched && (page === 'index.html' || page === '')) {
      var homeLink = oldNav.querySelector('a[href="index.html"]');
      if (homeLink) homeLink.classList.add('active');
    }
  }
});
