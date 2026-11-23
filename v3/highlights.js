// The demo has no public results service. Only confirmed public redemptions
// supplied by an integration belong here; local wallet activity is private.
let publicRedemptions = [];
const highlightPeriods = ['2026-11','2026-10'];
const sampleRedemptions = [
  ['NovaAce','milkyway',19634,8820,3097], ['RiverFox','firekirin',14200,16830,1240],
  ['OrionRay','orion',13508,10960,980], ['LunaBee','panda',12796,9270,735],
  ['GoldFin','juwa',12739,14700,615], ['AceLane','vegas',12698,10210,540],
  ['RedComet','milkyway',12399,11300,420], ['BlueKoi','firekirin',8222,7850,315],
  ['StarMint','orion',8067,7930,275], ['VioletJ','juwa',7978,9020,160]
].map(([alias,id,nov,oct,latest])=>({alias,id,totals:{'2026-11':nov,'2026-10':oct},latest}));
const sampleTimes=['08:26','08:12','07:55','07:43','07:30','07:16','07:04','06:51','06:38','06:20'];
const sampleWins=[
  {platform:'milkyway',player:'StarMint',amount:15,time:'8:29 AM'},
  {platform:'firekirin',player:'BlueKoi',amount:130,time:'8:28 AM'}
];
// Archived demo snapshots stay separate from confirmed public results.
const sampleLatest = sampleRedemptions.map((row,i)=>({
  alias:row.alias,platform:row.id,usdCents:row.latest*100,at:'2026-11-22T'+sampleTimes[i]+':00-06:00'
}));
function latestHighlights() {return publicRedemptions.length?publicRedemptions.slice(0,10):sampleLatest;}
let highlightPeriod = highlightPeriods[0];
let payoutIndex = 0;
let showAllRanks = false;
const highlightMoney = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:0,maximumFractionDigits:2});
function highlightBadge(platform) {
  const index=PLATFORMS.findIndex(p=>p.id===platform);
  return `<i class="highlight-badge" aria-hidden="true" style="--badge:${index}"></i>`;
}
function replacePublicRedemptions(records) {
  if (!Array.isArray(records)) return;
  const byId = new Map();
  for (const record of records) {
    if (!record || typeof record.id !== 'string' || !record.id || typeof record.publicPlayerId !== 'string' || !record.publicPlayerId || typeof record.alias !== 'string' || !record.alias || !plat(record.platform) ||
        !Number.isSafeInteger(record.usdCents) || record.usdCents<=0 || !Number.isFinite(Date.parse(record.at))) continue;
    const {id,publicPlayerId,alias,platform,usdCents}=record;
    byId.set(id,{id,publicPlayerId,alias,platform,usdCents,at:new Date(record.at).toISOString()});
  }
  const oldIds = new Set(publicRedemptions.map(row=>row.id));
  const active = publicRedemptions[payoutIndex]?.id;
  const nextRecords = [...byId.values()].sort((a,b)=>b.at.localeCompare(a.at)||a.id.localeCompare(b.id));
  if (JSON.stringify(nextRecords)===JSON.stringify(publicRedemptions)) return;
  publicRedemptions = nextRecords;
  const latest=publicRedemptions.slice(0,10);
  payoutIndex=Math.max(0,latest.findIndex(row=>row.id===active));
  if (!publicRedemptions.some(row=>row.at.startsWith(highlightPeriod)) || !highlightPeriod)
    highlightPeriod=publicRedemptions[0]?.at.slice(0,7)||highlightPeriods[0];
  const panel=document.querySelector('.member-standings');
  if (!panel) return;
  const ranks=panel.querySelector('#ranked-players');
  const fresh=document.createElement('template');
  fresh.innerHTML=activitySpotlight();
  const next=fresh.content.firstElementChild;
  // Keep the table mounted so changes in player position can be measured.
  const nextRows=next.querySelector('#ranked-players');
  if(ranks && nextRows) {
    const newBody=nextRows.innerHTML;
    nextRows.replaceWith(ranks);
    panel.replaceWith(next);
    RechargeMotion.updatePositions(ranks,()=>{ranks.innerHTML=newBody;});
  } else panel.replaceWith(next);
  next.querySelectorAll('[data-event-id]').forEach(el=>{
    if(!oldIds.has(el.dataset.eventId)) el.classList.add('motion-entry');
  });
  RechargeMotion.mount();
}
document.addEventListener('DOMContentLoaded',()=>{
  replacePublicRedemptions(window.RECHARGE_CONTENT?.publicRedemptions);
},{once:true});
function winnerBody() {
  const row=latestHighlights()[payoutIndex];
  return `${highlightBadge(row.platform)}<div class="winning-player"><b>${esc(row.alias)}</b><span>${esc(plat(row.platform).name)}</span><time datetime="${row.at}">${new Date(row.at).toLocaleString()}</time></div><div class="winning-sum"><small>Redeemed</small><strong>${highlightMoney.format(row.usdCents/100)}</strong></div>`;
}
function monthlyLeaders() {
  if (!publicRedemptions.length) return sampleRedemptions.map(row=>({alias:row.alias,platform:row.id,publicPlayerId:row.alias,total:row.totals[highlightPeriod]*100})).sort((a,b)=>b.total-a.total);
  const players=new Map();
  for(const row of publicRedemptions.filter(row=>row.at.startsWith(highlightPeriod))){
    const total=players.get(row.publicPlayerId)||{...row,total:0};
    total.total+=row.usdCents;
    players.set(row.publicPlayerId,total);
  }
  return [...players.values()].sort((a,b)=>b.total-a.total);
}
function monthlyRows(){
  return monthlyLeaders().slice(0,showAllRanks?10:6).map((row,i)=>`<tr data-motion-key="${esc(row.publicPlayerId)}"><td><span class="standing-rank" data-rank="${i+1}">${i+1}</span></td><th scope="row"><span class="standing-player">${highlightBadge(row.platform)}${esc(row.alias)}</span></th><td>${highlightMoney.format(row.total/100)}</td></tr>`).join('');
}
function winnerChoices() {
  const latest=latestHighlights(), count=latest.length;
  const first=count<3?0:(payoutIndex+count-1)%count;
  return Array.from({length:Math.min(3,count)},(_,offset)=>{
    const index=(first+offset)%count, row=latest[index];
    return `<button type="button" data-highlight-action="pick" data-index="${index}" aria-pressed="${index===payoutIndex}">${highlightBadge(row.platform)}<b>${esc(row.alias)}</b><span>${highlightMoney.format(row.usdCents/100)}</span></button>`;
  }).join('');
}
function winnerDots() {
  const latest=latestHighlights();
  const start=Math.max(0,Math.min(Math.floor(payoutIndex/3)*3,latest.length-3));
  return latest.slice(start,start+3).map((row,offset)=>{
    const index=start+offset;
    return `<button class="winner-dot" data-highlight-action="pick" data-index="${index}" aria-pressed="${index===payoutIndex}" aria-label="${esc(row.alias)}, ${index+1} / ${latest.length}"></button>`;
  }).join('');
}
function sampleActivity() {
  return `<div class="standings-feed">${sampleWins.map(win=>`<a href="#/platform/${win.platform}">${highlightBadge(win.platform)}<div><b>${plat(win.platform).name}</b><small>${win.player} · Won</small></div><div class="feed-sum"><strong>${highlightMoney.format(win.amount)}</strong><small>${win.time}</small></div></a>`).join('')}</div>`;
}
function activitySpotlight(){
  const latest=latestHighlights();
  const preview=!publicRedemptions.length;
  const months=preview?highlightPeriods:[...new Set(publicRedemptions.map(row=>row.at.slice(0,7)))];
  return `<section class="member-standings" aria-labelledby="highlights-title">
    <header class="standings-cover"><div><h1 id="highlights-title">Activity &amp; <em>Highlights</em></h1><p>Recent highlights and monthly standings.</p>${preview?'<span class="standings-tag">Sample data</span>':''}</div></header>
    <div class="standings-content">
    <section><header class="standings-heading"><h2>${I.trophy} Latest big winners</h2>${latest.length?`<button class="standings-pill" data-highlight-action="latest">Latest ${latest.length}</button>`:''}</header>
    ${latest.length?`<div class="winning-card" aria-live="polite">${winnerBody()}</div>${latest.length>1?`<div class="winning-controls"><button data-highlight-action="prev" aria-label="Previous winner">${I.arrowL}</button><div class="winner-choices">${winnerChoices()}</div><button data-highlight-action="next" aria-label="Next winner">${I.chev}</button></div><div class="winner-footer"><div class="winner-dots">${winnerDots()}</div><span data-winner-position>${payoutIndex+1} / ${latest.length}</span></div>`:''}`:'<p class="results-empty">No verified redemptions to show.</p>'}</section>
    <section><header class="standings-heading"><h2 id="monthly-title">${I.trophy} Monthly leaderboard</h2>${months.length?`<select class="standings-pill" id="leader-month" aria-label="Leaderboard month">${months.map(m=>`<option value="${m}" ${m===highlightPeriod?'selected':''}>${new Date(m+'-15').toLocaleDateString(undefined,{month:'long',year:'numeric'})}</option>`).join('')}</select>`:''}</header>
    ${months.length?`<table class="standings-table" aria-labelledby="monthly-title"><thead><tr><th>Rank</th><th>Player</th><th>Redeemed</th></tr></thead><tbody id="ranked-players">${monthlyRows()}</tbody></table><button class="standings-expand" data-highlight-action="ranks" ${monthlyLeaders().length<=6?'hidden':''}>${showAllRanks?'Show top 6':'View all '+Math.min(10,monthlyLeaders().length)+' standings'}</button>`:'<p class="results-empty">Monthly standings are unavailable.</p>'}</section>
    <section><header class="standings-heading feed-title"><h2>Live activity</h2>${preview?'<span class="standings-tag">Preview</span>':''}</header>${preview?sampleActivity():`<div class="results-ticker"  aria-label="Recent activity">${latest.length?latest.map(row=>`<a href="#/platform/${row.platform}" data-event-id="${esc(row.id)}">${highlightBadge(row.platform)}<span><b>${esc(row.alias)}</b> · ${esc(plat(row.platform).name)}</span><strong>${highlightMoney.format(row.usdCents/100)}</strong></a>`).join(''):'<p class="results-empty">The live activity feed is offline.</p>'}</div>`}</section>
    <footer class="standings-footer"><a href="#/balance" data-bal-go="deposit">Deposit now</a><span>21+ · <button data-act="foot-doc" data-doc="Responsible play">Play responsibly</button></span></footer></div></section>`;
}


const homeWorldIds = ['milkyway','firekirin','golden-treasure'];
let homeWorldIndex = 1;

function homeWorldCards() {
  return [-1,0,1].map(offset => {
    const id = homeWorldIds[(homeWorldIndex + offset + homeWorldIds.length) % homeWorldIds.length];
    const platform = featuredPlatforms.find(p => p.id === id);
    const tag = offset === 0 && !platform.preview ? 'a' : 'button';
    const action = offset === 0 ? featuredDestination(platform) : `data-act="spotlight-${offset < 0 ? 'prev' : 'next'}"`;
    return `<${tag} class="home-world-card" data-offset="${offset}" data-world="${id}" aria-label="${platform.name}" ${action}><span class="home-card-face" aria-hidden="true"></span><span class="home-card-name" aria-hidden="true">${platform.name}</span>${offset===0?flowEdge(false):''}</${tag}>`;
  }).join('');
}
function advanceHomeWorld(step) {
  homeWorldIndex = (homeWorldIndex + step + homeWorldIds.length) % homeWorldIds.length;
  const stage = document.querySelector('.home-world-stage');
  const restoreFocus = stage.contains(document.activeElement);
  stage.dataset.original = homeWorldIndex === 1;
  RechargeMotion.updatePositions(stage,()=>{stage.innerHTML=homeWorldCards();});
  if (restoreFocus) stage.querySelector('[data-offset="0"]').focus({preventScroll:true});
  document.querySelectorAll('.home-world-position i').forEach((mark,index) => mark.classList.toggle('current',index === homeWorldIndex));
  document.querySelector('.home-world-status').textContent = stage.querySelector('[data-offset="0"]').ariaLabel;
}
/* Signed-in home, built like Recharge777: a welcome hero and a plain Winners card. */
let winnersTab = 'latest';
function memberHero() {
  const u = S.user, hot = ['firekirin', 'milkyway', 'orion'].map(id => PLATFORMS.find(p => p.id === id)).filter(Boolean);
  return `<section class="sh-hero">
    <div class="sh-hero-txt">
      <h1>Welcome back, <span>${esc(u.first || u.username)}</span></h1>
      <p>Fish games and slots from every platform, all in one place.</p>
      <div class="sh-hero-acts"><a class="sh-btn" href="#/games">Play now</a><a class="sh-btn ghost" href="#/balance" data-bal-go="deposit">Deposit</a></div>
      <div class="sh-hot"><small>Hot right now</small><div>${hot.map((p, i) => `<a href="#/platform/${p.id}">${coin(p, 'xs')}<span><b>${p.name}</b><em>${[1240, 986, 712][i].toLocaleString('en-US')} playing</em></span></a>`).join('')}</div></div>
    </div>
    <div class="sh-hero-art"><img src="assets/landing/welcome-host.jpg" alt=""></div>
  </section>`;
}
function winnersRows() {
  const rows = winnersTab === 'latest'
    ? latestHighlights().slice(0, 5).map(r => ({ alias: r.alias, platform: r.platform, amount: r.usdCents / 100, when: new Date(r.at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }))
    : monthlyLeaders().slice(0, 5).map(r => ({ alias: r.alias, platform: r.platform, amount: r.total / 100 }));
  return rows.map((r, i) => { const p = PLATFORMS.find(x => x.id === r.platform); return `<div class="sh-win ${winnersTab === 'month' && i === 0 ? 'top' : ''}">
    ${winnersTab === 'month' ? `<span class="sh-rank">#${i + 1}</span>` : ''}${p ? coin(p, 'xs') : ''}
    <span class="sh-win-txt"><b>${esc(r.alias)}</b><small>${p ? p.name : ''}${r.when ? ` &middot; ${r.when}` : ''}</small></span>
    <em>${highlightMoney.format(r.amount)}</em></div>`; }).join('');
}
function winnersCard() {
  return `<section class="sh-winners" id="shWinners">
    <div class="sh-winners-h"><h2>${I.trophy}Winners</h2><div class="sh-seg"><button class="${winnersTab === 'latest' ? 'on' : ''}" data-sh-tab="latest">Latest</button><button class="${winnersTab === 'month' ? 'on' : ''}" data-sh-tab="month">This month</button></div></div>
    <div class="sh-win-list">${winnersRows()}</div>
  </section>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-sh-tab]');
  if (!b) return;
  winnersTab = b.dataset.shTab;
  const card = document.getElementById('shWinners');
  if (card) card.outerHTML = winnersCard();
});

function highlightsHome() {
  return `<div class="page member-highlights member-worlds">
    ${memberHero()}
    <section class="member-world-hero" aria-labelledby="home-world-title">
      <header><p>Featured platforms</p><h2 id="home-world-title">Your next world awaits.</h2></header>
      <div class="home-world-stage" data-original="${homeWorldIndex === 1}">${homeWorldCards()}</div>
      <div class="home-world-controls"><button type="button" data-act="spotlight-prev" aria-label="Previous platform">${I.chev}</button>
        <span class="home-world-position" aria-hidden="true">${homeWorldIds.map((_,i)=>`<i class="${i === homeWorldIndex ? 'current' : ''}"></i>`).join('')}</span>
        <button type="button" data-act="spotlight-next" aria-label="Next platform">${I.chev}</button>${carouselPause()}</div>
      <span class="home-world-status" aria-live="polite"></span>
      <a class="home-world-all" href="#/games"><span>View all games</span><span aria-hidden="true">→</span></a>
    </section>
    ${winnersCard()}
    ${typeof extrasSection === 'function' ? extrasSection() : ''}</div>`;
}
let deferredInstall;
let justInstalled=false;
window.addEventListener('beforeinstallprompt',event=>{
  if (S.site==='b') return;
  event.preventDefault();
  deferredInstall=event;
});
window.addEventListener('appinstalled',()=>{
  deferredInstall=null;
  justInstalled=true;
  if (!$('#modal').hidden && $('#modalBox .install-invite')) closeModal();
});
function finishRechargeLogin() {
  const show=()=>{
    if (!S.user || S.site==='b' || route().name!=='home') return;
    if (justInstalled || matchMedia('(display-mode: standalone)').matches || navigator.standalone || store.get('r777_hide_install',false)) showVerificationOffer();
    else showInstallInvite();
  };
  if (location.hash==='#/' || !location.hash) {render();show();return;}
  window.addEventListener('hashchange',show,{once:true});
  location.hash='#/';
}
function promoBrand() {
  return '<div class="invite-brand"><img src="assets/logos/recharge-mark.svg" alt=""><span>Skilland<b>slots</b></span></div>';
}
function promoOptOut(kind) {
  return `<label class="invite-optout"><input type="checkbox" data-hide-invite="${kind}"><span>Don’t show again</span></label>`;
}
function showInstallInvite() {
  openModal(`<section class="login-invite install-invite" data-route="${esc(location.hash)}">
    ${promoBrand()}<div class="install-copy"><h2>Install the Skillandslots app</h2><p>Open your wallet and game platforms straight from your home screen.</p></div>
    <img class="invite-phone" src="assets/install-phone.jpg" alt="">
    <button class="invite-primary" type="button" data-highlight-action="install">${I.dl}<span>Install app now</span></button>
    <p class="install-guide" role="status" hidden></p>${promoOptOut('install')}</section>`);
  $('#modalBox .invite-primary').focus({preventScroll:true});
}
async function requestWebInstall(button) {
  const guide=$('#modalBox .install-guide');
  if (deferredInstall) {
    const request=deferredInstall;
    deferredInstall=null; button.disabled=true;
    try {
      await request.prompt();
      const choice=await request.userChoice;
      if (guide.isConnected && !$('#modal').hidden && choice.outcome==='accepted') {closeModal();return;}
    } catch { /* Offer the manual installation path. */ }
    finally {button.disabled=false;}
  }
  const ios=/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  guide.hidden=false;
  guide.textContent=ios?'In Safari, tap Share, then Add to Home Screen.':'Open your browser menu and choose Install app or Add to Home screen if available. You can also bookmark this page.';
}
function showVerificationOffer() {
  if (!S.user || S.user.verified || S.user.demoVerificationBonus || store.get('r777_hide_verification',false)) return;
  openModal(`<section class="login-invite bonus-invite" data-chest="closed"><div class="verification-chest" aria-hidden="true">
    <img class="chest-aura" src="assets/verification-chest.webp" width="510" height="430" alt=""><i class="chest-lid"></i><i class="chest-shield"></i><i class="chest-front"></i></div>
    ${promoBrand()}<h2><em>$5.00</em> <span>verification bonus</span></h2>
    <p>Try the verification demo to add $5.00 in sample credit to this wallet.</p>
    <button class="invite-primary" type="button" data-highlight-action="verify">${I.shield}<span>Try verification</span></button>
    <div class="invite-options"><button data-close type="button">Not now</button>${promoOptOut('verification')}</div></section>`);
  openVerificationChest($('#modalBox .bonus-invite'));
  $('#modalBox .invite-primary').focus({preventScroll:true});
}

function openVerificationChest(card) {
  const image=card.querySelector('.chest-aura');
  image.decode().catch(()=>{}).then(()=>{
    if (!card.isConnected || $('#modal').hidden || card.dataset.chest!=='closed') return;
    // Commit the resting pose before starting the hinge transition.
    card.querySelector('.chest-lid').getBoundingClientRect();
    card.dataset.chest='open';
  });
}
function leaveVerification(next) {
  const card=$('#modalBox .bonus-invite');
  if (!card || $('#modal').hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) return next();
  if (card.dataset.chest==='closing') return;
  card.dataset.chest='closing';
  const lid=card.querySelector('.chest-lid');
  const transitions=lid.getAnimations();
  Promise.allSettled(transitions.map(animation=>animation.finished)).then(()=>{
    if(card.isConnected && !$('#modal').hidden && card.dataset.chest==='closing') next();
  });
}
function confirmDemoBonus() {
  openModal(`<section class="login-invite bonus-confirm">${promoBrand()}<h2>Demo verification</h2>
    <p>This preview uses a sample identity. No documents are needed. The $5.00 credit has no cash value.</p>
    <button type="button" class="invite-primary" data-highlight-action="claim">Claim demo credit</button><button type="button" class="invite-later" data-close>Not now</button></section>`);
}
document.addEventListener('change',event=>{
  const el=event.target;
  if (el.matches('[data-hide-invite]')) store.set('r777_hide_'+el.dataset.hideInvite,el.checked);
  if (el.id==='leader-month') {
    highlightPeriod=el.value;
    showAllRanks=false;
    $('#ranked-players').innerHTML=monthlyRows();
    const more=$('.standings-expand');
    more.hidden=monthlyLeaders().length<=6;
    more.textContent='View all '+Math.min(10,monthlyLeaders().length)+' standings';
  }
});
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-highlight-action]');
  if (!button) return;
  const action=button.dataset.highlightAction;
  const latest=latestHighlights();
  if (['prev','next','pick'].includes(action) && latest.length) {
    payoutIndex=action==='pick'?Number(button.dataset.index):(payoutIndex+(action==='next'?1:-1)+latest.length)%latest.length;
    const card=$('.winning-card');
    card.dataset.changing='';
    card.innerHTML=winnerBody();
    const pickedDot=button.classList.contains('winner-dot');
    $('.winner-choices').innerHTML=winnerChoices();
    $('.winner-dots').innerHTML=winnerDots();
    if(action==='pick') $(pickedDot?'.winner-dot[aria-pressed=true]':'.winner-choices [aria-pressed=true]').focus({preventScroll:true});
    $('[data-winner-position]').textContent=(payoutIndex+1)+' / '+latest.length;
  }
  if(action==='latest') openModal(`<h2>Latest big winners</h2>${publicRedemptions.length?'':'<span class="standings-tag">Sample data</span>'}<ol class="latest-payouts">${latest.map(row=>`<li>${highlightBadge(row.platform)}<div><b>${esc(row.alias)}</b><small>${esc(plat(row.platform).name)}</small><time datetime="${row.at}">${new Date(row.at).toLocaleString()}</time></div><strong>${highlightMoney.format(row.usdCents/100)}</strong></li>`).join('')}</ol>`);
  if(action==='ranks'){
    showAllRanks=!showAllRanks;
    $('#ranked-players').innerHTML=monthlyRows();
    button.setAttribute('aria-expanded',String(showAllRanks));
    button.textContent=showAllRanks?'Show top 6':'View all '+Math.min(10,monthlyLeaders().length)+' standings';
  }
  if (action==='install') requestWebInstall(button);
  if (action==='verify') leaveVerification(confirmDemoBonus);
  if (action==='claim' && S.user && !S.user.demoVerificationBonus) {
    S.user.demoVerificationBonus=true;
    S.user.wallet+=5;
    addTx({kind:'Bonus',label:'Demo verification bonus',amt:5,status:'done'});
    closeModal();refresh();toast(document.documentElement.lang==='es'?'Crédito de prueba añadido':'Demo credit added');
  }
});
