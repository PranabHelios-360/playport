function flowEdge(round) {
  return `<svg class="flow-led" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"><rect x="1.5" y="1.5" width="97" height="97" rx="${round?48.5:8}" pathLength="100"/></svg>`;
}
function carouselPause() {
  return '<button type="button" class="motion-pause" aria-label="Automatic carousel rotation" aria-pressed="true">Ⅱ</button>';
}
/* Motion belongs to the mounted view. A route change disconnects its observers. */
const RechargeMotion = (() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let cleanup = () => {};
  const ease = 'cubic-bezier(.2,.72,.22,1)';
  function updatePositions(parent, replace) {
    if (reduced.matches || !parent.getClientRects().length) { replace(); return; }
    const key = el => el.dataset.motionKey || el.dataset.world || el.dataset.platform;
    const before = new Map(Array.from(parent.children, el => [key(el), el.getBoundingClientRect()]));
    replace();
    for (const el of parent.children) {
      const prior = before.get(key(el)), next = el.getBoundingClientRect();
      if (!next.width || !next.height) continue;
      if (!prior) { el.animate([{opacity:0},{opacity:1}],{duration:240}); continue; }
      const dx = prior.x-next.x, dy = prior.y-next.y;
      if (Math.abs(dx)+Math.abs(dy)<1 && prior.width===next.width) continue;
      el.animate([{translate:dx+'px '+dy+'px',scale:prior.width/next.width+' '+prior.height/next.height,transformOrigin:'top left'},
        {translate:'0 0',scale:'1',transformOrigin:'top left'}],{duration:480,easing:ease});
    }
  }
  function mount() {
    cleanup();
    if (document.documentElement.dataset.site !== 'a') return;
    const stage = document.querySelector('.home-world-stage,.collection-stage');
    const section = stage?.closest('section');
    const grid = document.querySelector('.charged-grid');
    const intro = grid?.closest('.charged-directory')?.querySelector('.charged-intro');
    const trophy = document.querySelector('.standings-cover');
    const ticker = document.querySelector('.ticker-run');
    const visible = new Set(), events = new AbortController(), opts = {signal:events.signal};
    const pause = section?.querySelector('.motion-pause');
    let timer, paused=pause?.getAttribute('aria-pressed')==='false', hovering=false, preferred=null;
    function refresh() {
      clearTimeout(timer);
      const blocked = reduced.matches || document.hidden || !document.querySelector('#modal').hidden ||
        !document.querySelector('#loader').hidden || document.body.matches('.chat-open,.menu-open');
      const stageVisible = !blocked && visible.has(stage);
      intro?.classList.toggle('motion-visible',!blocked && visible.has(intro));
      stage?.classList.toggle('motion-visible',stageVisible);
      ticker?.classList.toggle('motion-visible',!blocked && visible.has(ticker));
      trophy?.classList.toggle('motion-visible',!blocked && visible.has(trophy));
      const cards=Array.from(grid?.children || []).filter(el=>el.matches('.charged-card') && visible.has(el));
      const chosen=cards.includes(preferred)?preferred:cards[0];
      for(const card of grid?.children || []) card.classList.toggle('motion-art',!blocked && card===chosen);
      if(pause){
        pause.hidden=reduced.matches;
        const glyph=paused?'▶':'Ⅱ';
        if(pause.textContent!==glyph) pause.textContent=glyph;
        pause.setAttribute('aria-pressed',String(!paused));
        section.querySelector('[aria-live]')?.setAttribute('aria-live',paused?'polite':'off');
      }
      if(stageVisible && !paused && !hovering) timer=setTimeout(()=>{advanceSpotlight(1);refresh();},4500);
    }
    const observer=new IntersectionObserver(entries=>{
      for(const {target,isIntersecting,intersectionRatio} of entries){
        if(isIntersecting && intersectionRatio>=.15) visible.add(target); else visible.delete(target);
      }
      refresh();
    },{threshold:[0,.15]});
    for(const el of [stage,intro,trophy,ticker,...(grid?.querySelectorAll('.charged-card')||[])]) if(el) observer.observe(el);
    if(section){
      function manual(e){if(e.target.closest('.motion-pause'))return;paused=true;refresh();}
      for(const type of ['pointerdown','touchstart','focusin','keydown','click']) section.addEventListener(type,manual,{...opts,passive:true});
      section.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovering=true;refresh();}},opts);
      section.addEventListener('pointerleave',()=>{hovering=false;refresh();},opts);
      pause.addEventListener('click',()=>{paused=!paused;refresh();},opts);
    }
    if(grid) {
      for(const type of ['pointerover','focusin','pointerdown']) grid.addEventListener(type,e=>{
        const card=e.target.closest('.charged-card');if(card!==preferred){preferred=card;refresh();}
      },opts);
    }
    const overlay=new MutationObserver(refresh);
    for(const el of [document.body,document.querySelector('#modal'),document.querySelector('#loader')])
      overlay.observe(el,{attributes:true,attributeFilter:['hidden','class']});
    document.addEventListener('visibilitychange',refresh,opts);
    reduced.addEventListener('change',refresh,opts);
    refresh();
    cleanup=()=>{clearTimeout(timer);observer.disconnect();overlay.disconnect();events.abort();};
  }
  return {mount,updatePositions};
})();
