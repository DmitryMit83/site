/* =========================================================
   Discount Game — "swat the bugs, get a discount" popup
   Mobile-only. Shown once per browser session on mosquito-net
   (plisse) pages. On finish, notifies info@loguapkope.lv via
   the same Web3Forms endpoint already used by the contact form.
   ========================================================= */
(function () {
  'use strict';
  if (window.innerWidth > 900) return; // mobile only, same breakpoint as rest of the site

  var LANG = (document.documentElement.lang || 'lv').slice(0, 2).toLowerCase();
  if (['lv', 'ru', 'en'].indexOf(LANG) === -1) LANG = 'lv';

  var SESSION_KEY = 'dgGameShownV1';
  if (sessionStorage.getItem(SESSION_KEY)) return;

  var WEB3FORMS_ACCESS_KEY = 'feab9df0-fe09-4fd9-a690-2e72aa11acd2'; // same key as the contact form (info@loguapkope.lv)
  var MAX_DISCOUNT   = 15;   // hard cap, %
  var PER_10_PERCENT = 1;    // 10 squashed bugs = 1%
  var ROUND_SECONDS  = 60;
  var CONCURRENT_BUGS = 3;
  var SHOW_AFTER_MS  = 8000;

  var DICT = {
    lv: {
      introTitle1: 'SAŅEM', introTitle2: 'ATLAIDI', introTitle3: 'SPĒLĒJOT SPĒLI!',
      introDesc: 'Nosit pēc iespējas vairāk mušu un odu!',
      bullet1: 'Sit mušas un odus', bullet2: 'Uzstādi rekordu', bullet3: 'Saņem atlaidi!',
      playMain: 'SPĒLĒT', playSub: 'UN SAŅEMT ATLAIDI',
      timeNote: 'Aizņems tikai pāris minūtes!',
      close: 'Aizvērt', quit: 'Beigt spēli', sec: 'sek.',
      timeUp: 'Laiks beidzies!',
      resultNone: 'Tu nositi {n} mušas un odus. Tas ir mazāk par 10 — mēģini vēlreiz, lai nopelnītu atlaidi!',
      resultCount: 'Tu nositi {n} mušas un odus!',
      discountLabel: 'Tava atlaide',
      emailLabel: 'Ievadi e-pastu, lai saglabātu promo kodu:',
      emailPlaceholder: 'tavs@epasts.lv',
      submitBtn: 'SAŅEMT PROMO KODU', sending: 'Sūta…',
      invalidEmail: 'Lūdzu, ievadi derīgu e-pasta adresi.',
      retryBtn: 'Spēlēt vēlreiz',
      promoTitle: 'Tavs promo kods!',
      promoNote: 'Uzrādi šo kodu, sazinoties ar mums, lai izmantotu {pct}% atlaidi pasūtījumam.',
      copyBtn: 'Kopēt kodu', copied: 'Nokopēts!'
    },
    ru: {
      introTitle1: 'ПОЛУЧИТЕ', introTitle2: 'СКИДКУ', introTitle3: 'СЫГРАВ В ИГРУ!',
      introDesc: 'Прибейте как можно больше мух и комаров!',
      bullet1: 'Бейте мух и комаров', bullet2: 'Установите рекорд', bullet3: 'Получите скидку!',
      playMain: 'ИГРАТЬ', playSub: 'И ПОЛУЧИТЬ СКИДКУ',
      timeNote: 'Это займёт всего пару минут!',
      close: 'Закрыть', quit: 'Завершить игру', sec: 'сек.',
      timeUp: 'Время вышло!',
      resultNone: 'Вы прибили {n} мух и комаров. Это меньше 10 — попробуйте ещё раз, чтобы заработать скидку!',
      resultCount: 'Вы прибили {n} мух и комаров!',
      discountLabel: 'Ваша скидка',
      emailLabel: 'Введите email, чтобы сохранить промокод:',
      emailPlaceholder: 'ваш@email.com',
      submitBtn: 'ПОЛУЧИТЬ ПРОМОКОД', sending: 'Отправка…',
      invalidEmail: 'Пожалуйста, введите корректный email.',
      retryBtn: 'Сыграть ещё раз',
      promoTitle: 'Ваш промокод!',
      promoNote: 'Покажите этот код при обращении к нам, чтобы использовать скидку {pct}% на заказ.',
      copyBtn: 'Скопировать код', copied: 'Скопировано!'
    },
    en: {
      introTitle1: 'GET A', introTitle2: 'DISCOUNT', introTitle3: 'BY PLAYING A GAME!',
      introDesc: 'Swat as many flies and mosquitoes as you can!',
      bullet1: 'Swat flies & mosquitoes', bullet2: 'Set a high score', bullet3: 'Get your discount!',
      playMain: 'PLAY', playSub: 'AND GET A DISCOUNT',
      timeNote: 'It only takes a couple of minutes!',
      close: 'Close', quit: 'End game', sec: 'sec',
      timeUp: "Time's up!",
      resultNone: "You swatted {n} bugs — that's under 10. Try again to earn a discount!",
      resultCount: 'You swatted {n} flies and mosquitoes!',
      discountLabel: 'Your discount',
      emailLabel: 'Enter your email to save your promo code:',
      emailPlaceholder: 'you@email.com',
      submitBtn: 'GET PROMO CODE', sending: 'Sending…',
      invalidEmail: 'Please enter a valid email address.',
      retryBtn: 'Play again',
      promoTitle: 'Your promo code!',
      promoNote: 'Show this code when contacting us to use your {pct}% discount on your order.',
      copyBtn: 'Copy code', copied: 'Copied!'
    }
  };
  var T = DICT[LANG];

  function fill(str, key, val) { return str.split('{' + key + '}').join(val); }

  /* ---------------- state ---------------- */
  var squashed = 0;
  var secondsLeft = ROUND_SECONDS;
  var timerId = null;
  var bugs = [];
  var spawnTimeouts = [];
  var playing = false;
  var scrollY = 0;
  var overlay, card, hud, blocker;

  function el(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  function lockPage() {
    scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = (-scrollY) + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.documentElement.classList.add('dg-locked');
  }
  function unlockPage() {
    document.documentElement.classList.remove('dg-locked');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  }

  /* ---------------- SVG art ---------------- */
  function flySVG(sz) {
    return '<svg viewBox="0 0 60 62" xmlns="http://www.w3.org/2000/svg" width="' + sz + '" height="' + sz + '">'
      + '<g class="dg-wings">'
      + '<ellipse cx="21" cy="24" rx="15" ry="6.5" fill="rgba(200,235,255,.72)" stroke="#8aaabb" stroke-width=".6" transform="rotate(-28,21,24)"/>'
      + '<ellipse cx="39" cy="24" rx="15" ry="6.5" fill="rgba(200,235,255,.72)" stroke="#8aaabb" stroke-width=".6" transform="rotate(28,39,24)"/>'
      + '</g>'
      + '<ellipse cx="30" cy="40" rx="5.5" ry="11.5" fill="#3b3b18"/>'
      + '<line x1="25" y1="35.5" x2="35" y2="35.5" stroke="#5c5c28" stroke-width="1.1"/>'
      + '<line x1="24.8" y1="39.5" x2="35.2" y2="39.5" stroke="#5c5c28" stroke-width="1.1"/>'
      + '<line x1="25.2" y1="44" x2="34.8" y2="44" stroke="#5c5c28" stroke-width="1.1"/>'
      + '<circle cx="30" cy="24" r="5" fill="#2a2a0d"/>'
      + '<circle cx="27.8" cy="23" r="1.4" fill="#dd1100"/>'
      + '<circle cx="32.2" cy="23" r="1.4" fill="#dd1100"/>'
      + '<line x1="30" y1="19" x2="30" y2="7" stroke="#2a2a0d" stroke-width="1.2" stroke-linecap="round"/>'
      + '<line x1="27.3" y1="20" x2="20" y2="12" stroke="#2a2a0d" stroke-width=".7"/>'
      + '<circle cx="20" cy="12" r="1.3" fill="#2a2a0d"/>'
      + '<line x1="32.7" y1="20" x2="40" y2="12" stroke="#2a2a0d" stroke-width=".7"/>'
      + '<circle cx="40" cy="12" r="1.3" fill="#2a2a0d"/>'
      + '<line x1="25" y1="36" x2="11" y2="41" stroke="#2a2a0d" stroke-width="1"/>'
      + '<line x1="24.8" y1="40" x2="10" y2="46" stroke="#2a2a0d" stroke-width="1"/>'
      + '<line x1="25.2" y1="45" x2="12" y2="54" stroke="#2a2a0d" stroke-width="1"/>'
      + '<line x1="35" y1="36" x2="49" y2="41" stroke="#2a2a0d" stroke-width="1"/>'
      + '<line x1="35.2" y1="40" x2="50" y2="46" stroke="#2a2a0d" stroke-width="1"/>'
      + '<line x1="34.8" y1="45" x2="48" y2="54" stroke="#2a2a0d" stroke-width="1"/>'
      + '</svg>';
  }

  function mosquitoSVG(sz) {
    return '<svg viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg" width="' + sz + '" height="' + sz + '">'
      + '<g class="dg-wings">'
      + '<ellipse cx="22" cy="26" rx="10" ry="4" fill="rgba(220,220,225,.55)" stroke="#8a8a8a" stroke-width=".5" transform="rotate(-18,22,26)"/>'
      + '<ellipse cx="38" cy="26" rx="10" ry="4" fill="rgba(220,220,225,.55)" stroke="#8a8a8a" stroke-width=".5" transform="rotate(18,38,26)"/>'
      + '</g>'
      + '<path d="M30,30 C28,40 27,52 30,62 C33,52 32,40 30,30 Z" fill="#4a4a4a"/>'
      + '<line x1="27" y1="38" x2="33" y2="38" stroke="#333" stroke-width=".8"/>'
      + '<line x1="27.5" y1="46" x2="32.5" y2="46" stroke="#333" stroke-width=".8"/>'
      + '<line x1="28" y1="54" x2="32" y2="54" stroke="#333" stroke-width=".8"/>'
      + '<circle cx="30" cy="22" r="4.2" fill="#2a2a2a"/>'
      + '<circle cx="27.8" cy="21" r="1.7" fill="#111"/>'
      + '<circle cx="32.2" cy="21" r="1.7" fill="#111"/>'
      + '<circle cx="28.3" cy="20.4" r=".5" fill="#fff"/>'
      + '<circle cx="32.7" cy="20.4" r=".5" fill="#fff"/>'
      + '<line x1="30" y1="18" x2="30" y2="2" stroke="#2a2a2a" stroke-width="1" stroke-linecap="round"/>'
      + '<line x1="27" y1="19" x2="19" y2="14" stroke="#2a2a2a" stroke-width=".6"/>'
      + '<line x1="33" y1="19" x2="41" y2="14" stroke="#2a2a2a" stroke-width=".6"/>'
      + '<polyline points="28,32 14,36 6,50" fill="none" stroke="#2a2a2a" stroke-width=".9"/>'
      + '<polyline points="28,37 12,44 4,60" fill="none" stroke="#2a2a2a" stroke-width=".9"/>'
      + '<polyline points="28,43 14,52 8,66" fill="none" stroke="#2a2a2a" stroke-width=".9"/>'
      + '<polyline points="32,32 46,36 54,50" fill="none" stroke="#2a2a2a" stroke-width=".9"/>'
      + '<polyline points="32,37 48,44 56,60" fill="none" stroke="#2a2a2a" stroke-width=".9"/>'
      + '<polyline points="32,43 46,52 52,66" fill="none" stroke="#2a2a2a" stroke-width=".9"/>'
      + '</svg>';
  }

  function splatSVG() {
    return '<svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" width="70" height="70">'
      + '<path d="M45,10 C58,2 75,11 79,25 C85,40 76,57 63,60 C68,72 60,82 47,82 C35,83 24,73 22,62 C10,67 2,57 3,44 C3,31 14,21 27,23 C22,10 34,2 45,10Z" fill="#4a1805" opacity=".9"/>'
      + '<circle cx="12" cy="24" r="4" fill="#4a1805" opacity=".72"/>'
      + '<circle cx="76" cy="17" r="3" fill="#4a1805" opacity=".68"/>'
      + '<circle cx="74" cy="76" r="3.5" fill="#4a1805" opacity=".72"/>'
      + '<circle cx="16" cy="78" r="3" fill="#4a1805" opacity=".68"/>'
      + '<circle cx="82" cy="48" r="2.5" fill="#4a1805" opacity=".6"/>'
      + '<circle cx="8" cy="58" r="2.5" fill="#4a1805" opacity=".6"/>'
      + '<ellipse cx="30" cy="38" rx="11" ry="4.5" fill="rgba(200,235,255,.38)" transform="rotate(-22,30,38)"/>'
      + '<ellipse cx="58" cy="34" rx="10" ry="4" fill="rgba(200,235,255,.32)" transform="rotate(18,58,34)"/>'
      + '</svg>';
  }

  /* ---------------- intro modal ---------------- */
  function showIntro() {
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
    lockPage();

    overlay = el('div', 'dg-overlay');
    card = el('div', 'dg-card');
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.innerHTML =
      '<button type="button" class="dg-close" aria-label="' + T.close + '">&times;</button>'
      + '<div class="dg-title-1">' + T.introTitle1 + '</div>'
      + '<div class="dg-title-2">' + T.introTitle2 + '</div>'
      + '<div class="dg-title-3">' + T.introTitle3 + '</div>'
      + '<p class="dg-desc">' + T.introDesc + '</p>'
      + '<ul class="dg-bullets">'
      + '<li><span class="dg-bullet-ico">🪰</span>' + T.bullet1 + '</li>'
      + '<li><span class="dg-bullet-ico">🏆</span>' + T.bullet2 + '</li>'
      + '<li><span class="dg-bullet-ico">%</span>' + T.bullet3 + '</li>'
      + '</ul>'
      + '<button type="button" class="dg-play-btn"><span class="dg-play-main">' + T.playMain + '</span><span class="dg-play-sub">' + T.playSub + '</span></button>'
      + '<p class="dg-note">⏱ ' + T.timeNote + '</p>';

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    card.querySelector('.dg-close').addEventListener('click', closeAll);
    card.querySelector('.dg-play-btn').addEventListener('click', startGame);
  }

  function closeAll() {
    stopRound();
    if (overlay && overlay.parentNode) overlay.remove();
    overlay = null;
    unlockPage();
  }

  /* ---------------- gameplay ---------------- */
  function startGame() {
    if (overlay && overlay.parentNode) overlay.remove();
    overlay = null;

    squashed = 0;
    secondsLeft = ROUND_SECONDS;
    playing = true;

    buildHud();
    buildBlocker();
    for (var i = 0; i < CONCURRENT_BUGS; i++) spawnBug(i * 180);

    timerId = setInterval(tick, 1000);
  }

  function buildBlocker() {
    blocker = el('div', 'dg-blocker');
    blocker.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
    document.body.appendChild(blocker);
  }

  function buildHud() {
    hud = el('div', 'dg-hud');
    hud.innerHTML =
      '<div class="dg-hud-counter">🪰 <span id="dgCount">0</span></div>'
      + '<div class="dg-hud-timer"><span id="dgTime">' + ROUND_SECONDS + '</span><small>' + T.sec + '</small></div>'
      + '<button type="button" class="dg-hud-quit" aria-label="' + T.quit + '">&times;</button>';
    document.body.appendChild(hud);
    hud.querySelector('.dg-hud-quit').addEventListener('click', closeAll);
  }

  function tick() {
    secondsLeft--;
    var t = document.getElementById('dgTime');
    if (t) t.textContent = secondsLeft;
    if (secondsLeft <= 0) endRound();
  }

  function spawnBug(delay) {
    var timeout = setTimeout(function () {
      spawnTimeouts = spawnTimeouts.filter(function (id) { return id !== timeout; });
      if (!playing) return;
      launchBug();
    }, delay || 0);
    spawnTimeouts.push(timeout);
  }

  function launchBug() {
    var kind = Math.random() < 0.5 ? 'fly' : 'mosquito';
    var SZ = 50;
    var W = window.innerWidth, H = window.innerHeight;
    var topPad = 60; // keep clear of the HUD bar

    var b = {
      alive: true, sz: SZ, frame: 0,
      x: Math.random() * (W - SZ - 20) + 10,
      y: Math.random() * (H - SZ - 20 - topPad) + topPad,
      vx: (Math.random() - .5) * 3,
      vy: (Math.random() - .5) * 3,
      ang: 0, raf: null
    };
    b.el = el('div', 'dg-bug');
    b.el.innerHTML = kind === 'mosquito' ? mosquitoSVG(SZ) : flySVG(SZ);
    b.el.style.width = SZ + 'px';
    b.el.style.height = SZ + 'px';
    b.el.style.left = b.x + 'px';
    b.el.style.top = b.y + 'px';
    document.body.appendChild(b.el);
    bugs.push(b);

    var tx = Math.random() * (W - 80) + 20;
    var ty = Math.random() * (H - 80 - topPad) + topPad;

    function frameFn() {
      if (!b.alive || !playing) return;
      b.frame++;

      if (b.frame % 150 === 0) {
        tx = Math.random() * (W - 80) + 20;
        ty = Math.random() * (H - 80 - topPad) + topPad;
      }

      var dx = tx - b.x, dy = ty - b.y;
      var d = Math.sqrt(dx * dx + dy * dy) || 1;
      b.vx += dx / d * 0.18;
      b.vy += dy / d * 0.18;

      b.vx += Math.sin(b.frame * 0.17) * 0.35;
      b.vy += Math.cos(b.frame * 0.13) * 0.35;

      var spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy), MAX = 3.8;
      if (spd > MAX) { b.vx = b.vx / spd * MAX; b.vy = b.vy / spd * MAX; }

      if (b.x < 4) { b.vx = Math.abs(b.vx) + 0.5; tx = W / 2; }
      if (b.x > W - SZ - 4) { b.vx = -Math.abs(b.vx) - 0.5; tx = W / 2; }
      if (b.y < topPad + 4) { b.vy = Math.abs(b.vy) + 0.5; ty = H / 2; }
      if (b.y > H - SZ - 4) { b.vy = -Math.abs(b.vy) - 0.5; ty = H / 2; }

      b.x += b.vx; b.y += b.vy;
      if (spd > .4) b.ang = Math.atan2(b.vy, b.vx) * 180 / Math.PI + 90;

      b.el.style.left = b.x + 'px';
      b.el.style.top = b.y + 'px';
      b.el.style.transform = 'rotate(' + b.ang + 'deg)';

      b.raf = requestAnimationFrame(frameFn);
    }
    frameFn();

    function squash(e) {
      if (e) e.preventDefault();
      if (!b.alive) return;
      b.alive = false;
      cancelAnimationFrame(b.raf);
      var cx = b.x + SZ / 2, cy = b.y + SZ / 2;
      if (b.el.parentNode) b.el.remove();
      bugs = bugs.filter(function (o) { return o !== b; });
      showSplat(cx, cy);

      squashed++;
      var c = document.getElementById('dgCount');
      if (c) c.textContent = squashed;

      if (playing) spawnBug(350 + Math.random() * 400);
    }
    b.el.addEventListener('touchstart', squash, { passive: false });
    b.el.addEventListener('click', squash);
  }

  function showSplat(cx, cy) {
    var SS = 70;
    var rot = Math.round(Math.random() * 360);
    var sp = el('div', 'dg-splat');
    sp.innerHTML = splatSVG();
    sp.style.width = SS + 'px';
    sp.style.height = SS + 'px';
    sp.style.left = (cx - SS / 2) + 'px';
    sp.style.top = (cy - SS / 2) + 'px';
    sp.style.setProperty('--dg-rot', rot + 'deg');
    document.body.appendChild(sp);
    setTimeout(function () {
      sp.style.transition = 'opacity .4s ease';
      sp.style.opacity = '0';
      setTimeout(function () { if (sp.parentNode) sp.remove(); }, 420);
    }, 900);
  }

  function stopRound() {
    playing = false;
    if (timerId) { clearInterval(timerId); timerId = null; }
    spawnTimeouts.forEach(clearTimeout);
    spawnTimeouts = [];
    bugs.forEach(function (b) {
      b.alive = false;
      if (b.raf) cancelAnimationFrame(b.raf);
      if (b.el && b.el.parentNode) b.el.remove();
    });
    bugs = [];
    if (hud && hud.parentNode) hud.remove();
    hud = null;
    if (blocker && blocker.parentNode) blocker.remove();
    blocker = null;
  }

  function endRound() {
    stopRound();
    showResults();
  }

  /* ---------------- results / promo ---------------- */
  function calcDiscount(n) {
    return Math.min(Math.floor(n / 10) * PER_10_PERCENT, MAX_DISCOUNT);
  }

  function genPromoCode(pct) {
    var rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    var ts = Date.now().toString(36).slice(-3).toUpperCase();
    return 'BUG' + pct + '-' + rand + ts;
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function showResults() {
    var pct = calcDiscount(squashed);

    overlay = el('div', 'dg-overlay');
    card = el('div', 'dg-card');
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');

    if (pct <= 0) {
      card.innerHTML =
        '<button type="button" class="dg-close" aria-label="' + T.close + '">&times;</button>'
        + '<div class="dg-title-1">' + T.timeUp + '</div>'
        + '<p class="dg-desc">' + fill(T.resultNone, 'n', squashed) + '</p>'
        + '<button type="button" class="dg-retry-btn">' + T.retryBtn + '</button>';
      overlay.appendChild(card);
      document.body.appendChild(overlay);
      card.querySelector('.dg-close').addEventListener('click', closeAll);
      card.querySelector('.dg-retry-btn').addEventListener('click', startGame);
      return;
    }

    card.innerHTML =
      '<button type="button" class="dg-close" aria-label="' + T.close + '">&times;</button>'
      + '<div class="dg-title-1">' + T.timeUp + '</div>'
      + '<p class="dg-desc">' + fill(T.resultCount, 'n', squashed) + '</p>'
      + '<div class="dg-discount-big">' + pct + '%</div>'
      + '<div class="dg-discount-label">' + T.discountLabel + '</div>'
      + '<form class="dg-email-form" novalidate>'
      + '<label class="dg-email-label">' + T.emailLabel + '</label>'
      + '<input type="email" class="dg-email-input" placeholder="' + T.emailPlaceholder + '" required>'
      + '<div class="dg-email-error" hidden></div>'
      + '<button type="submit" class="dg-submit-btn">' + T.submitBtn + '</button>'
      + '</form>'
      + '<button type="button" class="dg-retry-btn dg-retry-btn--ghost">' + T.retryBtn + '</button>';

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    card.querySelector('.dg-close').addEventListener('click', closeAll);
    card.querySelector('.dg-retry-btn').addEventListener('click', startGame);

    var form = card.querySelector('.dg-email-form');
    var input = card.querySelector('.dg-email-input');
    var errBox = card.querySelector('.dg-email-error');
    var submitBtn = card.querySelector('.dg-submit-btn');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = input.value.trim();
      if (!isValidEmail(value)) {
        errBox.hidden = false;
        errBox.textContent = T.invalidEmail;
        return;
      }
      errBox.hidden = true;
      submitBtn.disabled = true;
      submitBtn.textContent = T.sending;

      var code = genPromoCode(pct);
      var fd = new FormData();
      fd.append('access_key', WEB3FORMS_ACCESS_KEY);
      fd.append('subject', 'Discount game — promo code issued (' + LANG.toUpperCase() + ')');
      fd.append('from_name', 'loguapkope.lv — mušu/mosquito spēle');
      fd.append('customer_email', value);
      fd.append('squashed_count', squashed);
      fd.append('discount_percent', pct + '%');
      fd.append('promo_code', code);
      fd.append('page_url', window.location.href);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd
      }).catch(function () {}).then(function () {
        showPromoCode(pct, code);
      });
    });
  }

  function showPromoCode(pct, code) {
    card.innerHTML =
      '<button type="button" class="dg-close" aria-label="' + T.close + '">&times;</button>'
      + '<div class="dg-title-1">' + T.promoTitle + '</div>'
      + '<div class="dg-promo-box">' + code + '</div>'
      + '<button type="button" class="dg-copy-btn">' + T.copyBtn + '</button>'
      + '<p class="dg-desc">' + fill(T.promoNote, 'pct', pct) + '</p>'
      + '<button type="button" class="dg-retry-btn dg-retry-btn--ghost">' + T.retryBtn + '</button>';

    card.querySelector('.dg-close').addEventListener('click', closeAll);
    card.querySelector('.dg-retry-btn').addEventListener('click', startGame);

    var copyBtn = card.querySelector('.dg-copy-btn');
    copyBtn.addEventListener('click', function () {
      function done() {
        copyBtn.textContent = T.copied;
        setTimeout(function () { copyBtn.textContent = T.copyBtn; }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done).catch(done);
      } else {
        done();
      }
    });
  }

  /* ---------------- boot ---------------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && (overlay || playing)) closeAll();
  });

  setTimeout(function () {
    if (window.innerWidth <= 900) showIntro();
  }, SHOW_AFTER_MS);
})();
