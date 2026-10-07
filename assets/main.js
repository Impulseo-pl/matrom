/* MATROM - menu, karuzela usług, opinie, odsłanianie. Każdy blok w try/catch:
   awaria jednego nie zatrzymuje reszty, a bez JS strona wygląda normalnie. */
(function(){
  var html=document.documentElement;

  // nagłówek po przewinięciu
  try{
    var hdr=document.querySelector('.hdr');
    var onScroll=function(){ if(hdr) hdr.classList.toggle('is-scrolled', window.scrollY>40 && !html.classList.contains('menu-open')); };
    window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  }catch(e){}

  // menu na pełny ekran
  try{
    var pill=document.querySelector('.menu-pill');
    var menu=document.getElementById('menu');
    var setMenu=function(open){
      html.classList.toggle('menu-open',open);
      if(pill){ pill.setAttribute('aria-expanded',open?'true':'false'); pill.setAttribute('aria-label',open?'Zamknij menu':'Otwórz menu'); }
      if(menu) menu.setAttribute('aria-hidden',open?'false':'true');
      if(hdr) hdr.classList.toggle('is-scrolled', !open && window.scrollY>40);
    };
    if(pill) pill.addEventListener('click',function(){ setMenu(!html.classList.contains('menu-open')); });
    if(menu) menu.addEventListener('click',function(ev){ if(ev.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown',function(ev){ if(ev.key==='Escape') setMenu(false); });
  }catch(e){}

  // karuzela usług: strzałki + pasek postępu
  try{
    document.querySelectorAll('[data-karuzela]').forEach(function(box){
      var track=box.querySelector('.usl-track');
      var bar=box.parentNode.querySelector('.usl-bar i');
      var step=function(dir){
        var item=track.querySelector('.usl-item');
        var gap=parseFloat(getComputedStyle(track).columnGap)||40;
        track.scrollBy({left:dir*((item?item.getBoundingClientRect().width:320)+gap),behavior:'smooth'});
      };
      box.querySelectorAll('[data-kier]').forEach(function(b){
        b.addEventListener('click',function(){ step(parseInt(b.getAttribute('data-kier'),10)); });
      });
      var upd=function(){
        if(!bar) return;
        var max=track.scrollWidth-track.clientWidth;
        var w=Math.max(12,Math.min(100,track.clientWidth/track.scrollWidth*100));
        var p=max>0?track.scrollLeft/max:0;
        bar.style.width=w+'%'; bar.style.left=(p*(100-w))+'%';
      };
      track.addEventListener('scroll',upd,{passive:true}); window.addEventListener('resize',upd); upd();
    });
  }catch(e){}

  // opinie: przełączanie cytatów
  try{
    document.querySelectorAll('[data-opinie]').forEach(function(sec){
      var qs=sec.querySelectorAll('.op-q'); var i=0;
      var show=function(n){ qs[i].classList.remove('on'); i=(n+qs.length)%qs.length; qs[i].classList.add('on'); };
      sec.querySelectorAll('[data-op]').forEach(function(b){
        b.addEventListener('click',function(){ show(i+parseInt(b.getAttribute('data-op'),10)); });
      });
    });
  }catch(e){}

  // formularz: telefon albo e-mail musi być podany
  try{
    var f=document.querySelector('form.k-form-el');
    if(f) f.addEventListener('submit',function(ev){
      var tel=f.querySelector('[name="phone"]'), mail=f.querySelector('[name="email"]');
      if(tel && mail && !tel.value.trim() && !mail.value.trim()){ ev.preventDefault(); tel.focus(); alert('Podaj telefon albo e-mail, żebyśmy mogli odpowiedzieć.'); }
    });
  }catch(e){}

  // odsłanianie sekcji (twardy bezpiecznik: po 3 s wszystko widoczne)
  try{
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window){
      html.classList.add('js-on');
      var els=document.querySelectorAll('.rv');
      var io=new IntersectionObserver(function(en){ en.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } }); },{rootMargin:'0px 0px -8% 0px'});
      els.forEach(function(el){ io.observe(el); });
      setTimeout(function(){ els.forEach(function(el){ el.classList.add('is-in'); }); },3000);
    }
  }catch(e){ html.classList.remove('js-on'); }

  // okno na nieruchome zdjęcie: tło rysujemy tylko, gdy sekcja jest na ekranie
  try{
    if('IntersectionObserver' in window){
      var sio=new IntersectionObserver(function(en){ en.forEach(function(e){ e.target.classList.toggle('stk-off',!e.isIntersecting); }); },{rootMargin:'120px 0px'});
      document.querySelectorAll('.stopklatka').forEach(function(sec){ sec.classList.add('stk-off'); sio.observe(sec); });
    }
  }catch(e){}
})();

/* licznik otwarć dema */
(function(){try{if(String(location.protocol).indexOf('http')!==0)return;try{if(/[?&#]team=1/.test(location.search+location.hash)){localStorage.setItem('nb_team','1');}}catch(e){}try{if(localStorage.getItem('nb_team')==='1')return;}catch(e){}if(/crm-newbeginning|crm\.impulseo\.pl/.test(document.referrer||''))return;try{if(navigator.webdriver)return;}catch(e){}try{if(/^https?:\/\/(kris20032|impulseo-pl)\.github\.io\/?$/i.test(document.referrer||''))return;}catch(e){}if(sessionStorage.getItem('_dv'))return;sessionStorage.setItem('_dv','1');var seg=(location.pathname.split('/').filter(Boolean)[0])||'';var base=location.origin+(seg?('/'+seg):'');var ua='';try{ua=(navigator.userAgent||'').slice(0,300);}catch(e){}var EP='https://zngfubfinbojfgaxdrbf.supabase.co/functions/v1/demo-view';try{fetch(EP,{method:'POST',keepalive:true,headers:{'Content-Type':'text/plain'},body:JSON.stringify({demo_url:base,page:location.pathname,referrer:(document.referrer||null),user_agent:(ua||null)})}).catch(function(){});}catch(e){}}catch(e){}})();
