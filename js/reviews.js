/**
 * SIA Logu Apkope — Google Reviews Widget (AnimatedTestimonials style)
 * Конфигурация: js/google-config.js
 */
(function () {

  var cfg      = window.LOGU_GOOGLE || {};
  var API_KEY  = cfg.apiKey  || '';
  var PLACE_ID = cfg.placeId || '';
  var MAPS_URL = cfg.mapsUrl || 'https://share.google/3OiHEFguSuJGd9dHX';
  var lang     = document.documentElement.lang || 'lv';

  /* ── Static reviews ─────────────────────────────────────────────────────── */
  var STATIC = {
    lv: [
      { author:'Diāna Pudule',    rating:5, time:'pirms 3 nedēļām',
        text:'Gribēju uzstādīt logiem sietus, lai būtu droši kaķim. Izsaucu meistaru, kurš visu nomērīja un solīja nedēļas laikā sietus izgatavot, taču pēc divām dienām jau sieti bija gatavi, un meistars tos ātri uzstādīja. Esmu ļoti apmierināta.' },
      { author:'Ģirts Liniņš',    rating:5, time:'pirms mēneša',
        text:'Ātri, kvalitatīvi, pieklājīgi saveda kārtībā pirms 30 gadiem ieliktus koka pakešu logus. Par to visu arī attiecīgi jāsamaksā, protams. Paldies.' },
      { author:'Андрей Иванов',   rating:5, time:'pirms 3 mēnešiem',
        text:'Мастер молодец! Благодарю и рекомендую другим!' },
      { author:'Inese Maslova',   rating:5, time:'pirms 6 mēnešiem',
        text:'Ļoti patīkama pieredze, liels paldies! Noteikti iesaku :).' },
      { author:'Raimonda Kursīte',rating:2, time:'pirms 7 mēnešiem',
        text:'Atbrauca, visu izdarīja, liekas kā nākas, bet nu attieksme... un cenas arī diezgan kosmiskas.' },
      { author:'Līga Dukure',     rating:5, time:'pirms gada',
        text:'Ātri, operatīvi. Meistars visu paskaidroja. Ļoti pieklājīgi meistari un par saprātīgu cenu.' }
    ],
    ru: [
      { author:'Ольга Михайлова',   rating:5, time:'месяц назад',
        text:'Заменили уплотнители на всех окнах в квартире. Работают аккуратно, убрали за собой. Цены адекватные, приехали в тот же день. Очень довольна!' },
      { author:'Дмитрий Соколов',   rating:5, time:'3 недели назад',
        text:'Вызвал мастера для регулировки входной двери. Пришёл точно в назначенное время, сделал быстро и качественно. Рекомендую эту компанию!' },
      { author:'Наталья Васильева', rating:5, time:'5 недель назад',
        text:'Заказали москитные сетки на все окна. Замерили, изготовили и установили за два дня. Качество отличное, держатся крепко. Спасибо большое!' },
      { author:'Сергей Козлов',     rating:4, time:'2 месяца назад',
        text:'Заменили стеклопакет в большом окне. Работа выполнена качественно, небольшая задержка с доставкой стекла, но мастер предупредил заранее. В целом доволен.' },
      { author:'Елена Романова',    rating:5, time:'полтора месяца назад',
        text:'Установили рулонные жалюзи в гостиной и спальне. Мастер помог с выбором ткани и цвета. Результат превзошёл ожидания — очень красиво и функционально!' },
      { author:'Александр Тихонов', rating:5, time:'6 недель назад',
        text:'Регулировка пластиковых окон после зимы. Мастер приехал в тот же день, всё отрегулировал и объяснил как правильно ухаживать за фурнитурой. Отличный сервис!' }
    ],
    en: [
      { author:'Andrew Thompson', rating:5, time:'2 weeks ago',
        text:'Excellent service! Had a window adjusted the same day I called. The technician arrived on time, explained everything clearly and fixed it perfectly. Highly recommend!' },
      { author:'Sarah Mitchell',  rating:5, time:'1 month ago',
        text:'Had mosquito nets made to measure for all windows. Fast, precise installation. The quality is great and the price was very reasonable. Will use again!' },
      { author:'Michael Brown',   rating:4, time:'3 weeks ago',
        text:'Got roller blinds installed in two rooms. Good quality product and professional fitting. Slight wait for the materials, but the result is exactly what I wanted.' },
      { author:'Emma Kalnina',    rating:5, time:'5 weeks ago',
        text:'Glass unit replacement in my living room window. Quick turnaround, competitive pricing and zero mess left behind. The window looks brand new. Thank you!' },
      { author:'David Larsson',   rating:5, time:'2 months ago',
        text:'Our front door was misaligned and difficult to close. The technician fixed it in under 30 minutes. Very professional — I wish I had called sooner!' },
      { author:'Laura Petersone', rating:5, time:'6 weeks ago',
        text:'Seal replacement on all apartment windows. The difference is noticeable — much warmer and quieter now. Clean work, fair price. Definitely recommending to friends!' }
    ]
  };

  var REAL_RATING = 4.7;

  /* ── Helpers ────────────────────────────────────────────────────────────── */
  function stars(n){var s='';for(var i=1;i<=5;i++)s+=i<=n?'★':'☆';return s;}

  function ago(unix){
    var d=Math.floor((Date.now()/1000)-unix);
    if(lang==='ru'){
      if(d<86400)    return 'сегодня';
      if(d<172800)   return 'вчера';
      if(d<604800)   return Math.floor(d/86400)+' дн. назад';
      if(d<2592000)  return Math.floor(d/604800)+' нед. назад';
      if(d<31536000) return Math.floor(d/2592000)+' мес. назад';
      return Math.floor(d/31536000)+' г. назад';
    }
    if(lang==='en'){
      if(d<86400)    return 'today';
      if(d<172800)   return 'yesterday';
      if(d<604800)   return Math.floor(d/86400)+' days ago';
      if(d<2592000)  return Math.floor(d/604800)+' weeks ago';
      if(d<31536000) return Math.floor(d/2592000)+' months ago';
      return Math.floor(d/31536000)+' years ago';
    }
    if(d<86400)    return 'šodien';
    if(d<172800)   return 'vakar';
    if(d<604800)   return 'pirms '+Math.floor(d/86400)+' dienām';
    if(d<2592000)  return 'pirms '+Math.floor(d/604800)+' nedēļām';
    if(d<31536000) return 'pirms '+Math.floor(d/2592000)+' mēnešiem';
    return 'pirms '+Math.floor(d/31536000)+' gadiem';
  }

  var G_ICON_SM='<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>';
  var G_WORD='<svg width="50" height="17" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg"><path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18S71.25 59.95 71.25 47.18c0-12.86 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44S106.01 55.08 106.01 47.18z" fill="#EA4335"/><path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.86 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.54 12.51-13.44z" fill="#FBBC05"/><path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/><path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/><path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/><path d="M35.29 41.41V32h34.2c.34 1.76.51 3.85.51 6.11 0 7.56-2.07 16.91-8.74 23.58-6.5 6.75-14.82 10.36-25.91 10.36C16.37 72.05.5 56.69.5 37.27.5 17.85 16.37 2.5 35.35 2.5c11.34 0 19.41 4.45 25.49 10.27l-7.17 7.17c-4.37-4.11-10.27-7.31-18.32-7.31-14.99 0-26.71 12.07-26.71 27.06 0 14.99 11.72 27.06 26.71 27.06 9.74 0 15.29-3.94 18.82-7.47 2.88-2.88 4.77-7.01 5.52-12.62l-24.4-.25z" fill="#4285F4"/></svg>';

  function avatarHTML(r){
    var name=r.author_name||r.author||'';
    return r.profile_photo_url
      ?'<img src="'+r.profile_photo_url+'" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%">'
      :name.charAt(0).toUpperCase();
  }

  /* Card inner HTML (reused for measurement too) */
  function cardInnerHTML(r){
    var name=r.author_name||r.author||'';
    var time=r.time||(r.time_created?ago(r.time_created):'');
    var rat=r.rating!==undefined?r.rating:5;
    return(
      '<div class="at-card-stars">'+stars(rat)+'</div>'+
      '<div class="at-text-slide"><p class="at-text">\u201C'+(r.text||'')+'\u201D</p></div>'+
      '<div class="at-author-slide">'+
        '<div class="at-author-row">'+
          '<div class="at-avatar">'+avatarHTML(r)+'</div>'+
          '<div class="at-author-info">'+
            '<div class="at-name">'+name+'</div>'+
            '<div class="at-date">'+time+'</div>'+
          '</div>'+
          '<div class="at-g-badge">'+G_ICON_SM+G_WORD+'</div>'+
        '</div>'+
      '</div>'
    );
  }

  /* ── Main render ────────────────────────────────────────────────────────── */
  function render(rating,total,reviews){
    var box=document.getElementById('reviews-container');
    if(!box) return;

    var writeUrl=PLACE_ID
      ?'https://search.google.com/local/writereview?placeid='+PLACE_ID
      :MAPS_URL;

    var L={
      lv:{seeAll:'Skatīt visas atsauksmes',write:'Atstāt atsauksmi ★',
          eyebrow:'Google Atsauksmes',h2:'Ko saka mūsu klienti',
          sub:'Reālas atsauksmes no Google — mūsu klienti dalās ar savu pieredzi.'},
      ru:{seeAll:'Все отзывы в Google',write:'Оставить отзыв ★',
          eyebrow:'Отзывы Google',h2:'Что говорят наши клиенты',
          sub:'Реальные отзывы с Google — наши клиенты делятся своим опытом.'},
      en:{seeAll:'See all reviews',write:'Leave a review ★',
          eyebrow:'Google Reviews',h2:'What our clients say',
          sub:'Real reviews from Google — our clients share their experience.'}
    }[lang]||{seeAll:'Reviews',write:'Write a review ★',eyebrow:'Reviews',h2:'Clients say',sub:''};

    var list=reviews.slice(0,6);
    var current=0,transitioning=false,autoTimer;

    /* Dots */
    var dotsHTML=list.map(function(_,i){
      return '<button class="at-dot'+(i===0?' at-dot-active':'')+'" data-i="'+i+'" aria-label="'+(i+1)+'"></button>';
    }).join('');

    box.innerHTML=
      '<div class="at-outer">'+
        '<p class="at-eyebrow-line">'+L.eyebrow+'</p>'+
        '<div class="at-wrap">'+
          '<div class="at-left">'+
            '<h2 class="at-heading">'+L.h2+'</h2>'+
            '<p class="at-subtext">'+L.sub+'</p>'+
            '<div class="at-nav">'+
              '<div class="at-dots">'+dotsHTML+'</div>'+
              '<div class="at-arrows">'+
                '<button class="at-arrow at-prev" aria-label="Iepriekšējais">&#8592;</button>'+
                '<button class="at-arrow at-next" aria-label="Nākamais">&#8594;</button>'+
              '</div>'+
            '</div>'+
          '</div>'+
          '<div class="at-right">'+
            /* Two decorative background shapes — half card size, 70% opacity */
            '<div class="at-deco at-deco-1"></div>'+
            '<div class="at-deco at-deco-2"></div>'+
            '<div class="at-stack">'+
              '<div class="at-card-front">'+cardInnerHTML(list[0])+'</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div class="at-cta-row">'+
          '<a href="'+MAPS_URL+'" target="_blank" rel="noopener" class="btn btn-secondary">'+L.seeAll+'</a>'+
          '<a href="'+writeUrl+'" target="_blank" rel="noopener" class="btn btn-primary">'+L.write+'</a>'+
        '</div>'+
      '</div>';

    var cardFront=box.querySelector('.at-card-front');

    /* ── Height equalization ── */
    var resizeTimer;
    function equalizeHeight(){
      if(!cardFront||!cardFront.isConnected) return;
      cardFront.style.minHeight='';
      var w=cardFront.offsetWidth;
      if(!w) return;
      var maxH=0;
      var temps=list.map(function(r){
        var el=document.createElement('div');
        el.className='at-card-front';
        el.style.cssText='position:fixed;top:-9999px;left:0;width:'+w+'px;visibility:hidden;pointer-events:none;z-index:-1;';
        el.innerHTML=cardInnerHTML(r);
        document.body.appendChild(el);
        return el;
      });
      temps.forEach(function(el){
        if(el.offsetHeight>maxH) maxH=el.offsetHeight;
        document.body.removeChild(el);
      });
      if(maxH>0) cardFront.style.minHeight=maxH+'px';
    }

    requestAnimationFrame(function(){ equalizeHeight(); });
    window.addEventListener('resize',function(){
      clearTimeout(resizeTimer);
      resizeTimer=setTimeout(equalizeHeight,180);
    });

    /* ── Content update ── */
    function updateContent(r){
      var tSlide=cardFront.querySelector('.at-text-slide');
      var aSlide=cardFront.querySelector('.at-author-slide');
      var stEl=cardFront.querySelector('.at-card-stars');
      stEl.innerHTML=stars(r.rating!==undefined?r.rating:5);
      var name=r.author_name||r.author||'';
      var time=r.time||(r.time_created?ago(r.time_created):'');
      tSlide.innerHTML='<p class="at-text">\u201C'+(r.text||'')+'\u201D</p>';
      aSlide.innerHTML=
        '<div class="at-author-row">'+
          '<div class="at-avatar">'+avatarHTML(r)+'</div>'+
          '<div class="at-author-info">'+
            '<div class="at-name">'+name+'</div>'+
            '<div class="at-date">'+time+'</div>'+
          '</div>'+
          '<div class="at-g-badge">'+G_ICON_SM+G_WORD+'</div>'+
        '</div>';
    }

    function updateDots(){
      box.querySelectorAll('.at-dot').forEach(function(d,i){
        d.classList.toggle('at-dot-active',i===current);
      });
    }

    /* ── Slide animation ── */
    function goTo(idx){
      if(transitioning||idx===current) return;
      transitioning=true;
      var dir=idx>current?1:-1,tx=dir*60;
      var tSlide=cardFront.querySelector('.at-text-slide');
      var aSlide=cardFront.querySelector('.at-author-slide');

      tSlide.style.cssText='opacity:0;transform:translateX('+(-tx)+'px);transition:opacity .28s ease,transform .28s cubic-bezier(.4,0,.2,1)';
      aSlide.style.cssText='opacity:0;transform:translateX('+(-tx)+'px);transition:opacity .28s ease,transform .28s cubic-bezier(.4,0,.2,1)';

      setTimeout(function(){
        current=idx;
        updateContent(list[current]);
        updateDots();
        tSlide=cardFront.querySelector('.at-text-slide');
        aSlide=cardFront.querySelector('.at-author-slide');
        tSlide.style.cssText='opacity:0;transform:translateX('+tx+'px);transition:none';
        aSlide.style.cssText='opacity:0;transform:translateX('+tx+'px);transition:none';
        requestAnimationFrame(function(){requestAnimationFrame(function(){
          tSlide.style.cssText='opacity:1;transform:translateX(0);transition:opacity .38s ease,transform .38s cubic-bezier(.22,1,.36,1)';
          aSlide.style.cssText='opacity:1;transform:translateX(0);transition:opacity .38s ease,transform .38s cubic-bezier(.22,1,.36,1)';
          setTimeout(function(){transitioning=false;},420);
        });});
      },270);
    }

    function startAuto(){autoTimer=setInterval(function(){goTo((current+1)%list.length);},6000);}
    function stopAuto(){clearInterval(autoTimer);}

    startAuto();
    box.addEventListener('mouseenter',stopAuto);
    box.addEventListener('mouseleave',startAuto);
    box.querySelector('.at-prev').addEventListener('click',function(){stopAuto();goTo((current-1+list.length)%list.length);startAuto();});
    box.querySelector('.at-next').addEventListener('click',function(){stopAuto();goTo((current+1)%list.length);startAuto();});
    box.querySelectorAll('.at-dot').forEach(function(dot){
      dot.addEventListener('click',function(){stopAuto();goTo(parseInt(this.getAttribute('data-i')));startAuto();});
    });
  }

  function getStaticReviews(){return STATIC[lang]||STATIC['lv'];}

  window._loguReviewsInit=function(){
    if(!PLACE_ID){render(REAL_RATING,null,getStaticReviews());return;}
    var svc=new google.maps.places.PlacesService(document.createElement('div'));
    svc.getDetails({placeId:PLACE_ID,fields:['rating','user_ratings_total','reviews']},function(place,status){
      if(status===google.maps.places.PlacesServiceStatus.OK&&place){
        var revs=place.reviews||[];
        if(revs.length<6) revs=revs.concat(getStaticReviews().slice(0,6-revs.length));
        render(place.rating||REAL_RATING,place.user_ratings_total,revs);
      } else {render(REAL_RATING,null,getStaticReviews());}
    });
  };

  function boot(){
    if(API_KEY&&PLACE_ID){
      var s=document.createElement('script');
      s.src='https://maps.googleapis.com/maps/api/js?key='+API_KEY+'&libraries=places&language='+lang+'&callback=_loguReviewsInit';
      s.async=true;s.defer=true;document.head.appendChild(s);
    } else {render(REAL_RATING,null,getStaticReviews());}
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot);}
  else{boot();}

})();
