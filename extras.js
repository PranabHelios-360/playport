/* Free-to-play games + "Today's free game" (one feature per 24 hours).
   Shared by all three sites (root app.js for Recharge777 / Gamewallet777, v3 for Skillslots777).
   Uses each site's own helpers: S, openModal, closeModal, toast, requireLogin, save, refresh, addTx. */
(() => {
  const F2P = [
    { id: 'arthur', name: 'Arthur Fortunes', sub: 'Slots, fish and table games', url: 'https://arthurfortunes.com', art: '/assets/f2p/arthur-king.webp', logo: '/assets/f2p/arthur-logo.png', c1: '#0c6b35', c2: '#e9b628' },
    { id: 'bossvegas', name: 'Boss Vegas', url: '', sub: 'Classic Vegas reels', mark: 'BV', c1: '#1b1b22', c2: '#d4a63a' },
    { id: 'soon', name: 'Coming soon', sub: 'A third free game is on the way', soon: true, c1: '#23233a', c2: '#6c6c90' }
  ];

  const FEATURES = [
    { id: 'wheel', name: 'Lucky Wheel', sub: 'Spin once for a free cash prize.', cta: 'Spin now' },
    { id: 'bonus', name: 'Pick a Bonus', sub: 'Pick one of three bags. One holds the top prize.', cta: 'Open now' },
    { id: 'archery', name: 'Archery', sub: 'One arrow. Hit the bullseye for the top prize.', cta: 'Shoot' },
    { id: 'darts', name: 'Darts', sub: 'One dart. The closer to the centre, the bigger the prize.', cta: 'Throw' },
    { id: 'cashback', name: 'Cashback', sub: 'Get back part of yesterday’s play, free.', cta: 'Claim' }
  ];

  const money = n => (typeof scv === 'function' ? scv(n) : typeof usd === 'function' ? usd(n) : '$' + n.toFixed(2));
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = () => FEATURES[Math.floor(new Date(dayKey() + 'T00:00:00').getTime() / 864e5) % FEATURES.length];
  const played = () => !!(typeof S !== 'undefined' && S.user && S.user.featureDay === dayKey());
  function untilMidnight() {
    const n = new Date(), m = new Date(n); m.setHours(24, 0, 0, 0);
    const s = Math.max(0, Math.floor((m - n) / 1000));
    return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(v => String(v).padStart(2, '0')).join(':');
  }

  /* ---------- Gold Coins: main balance + one pile per free game ---------- */
  const GC_KEY = () => ('gc' in S.user ? 'gc' : 'goldCoins');
  function gcBal() {
    const k = GC_KEY();
    if (!Number.isFinite(S.user[k])) S.user[k] = 10000; /* demo starting coins where a site has none yet */
    return S.user[k];
  }
  const gcSet = n => { S.user[GC_KEY()] = Math.max(0, Math.round(n)); };
  const pile = id => ((S.user.f2p || {})[id] || 0);
  const pileSet = (id, n) => { S.user.f2p = S.user.f2p || {}; S.user.f2p[id] = Math.max(0, Math.round(n)); };
  const gcFmt = n => `${Math.round(n).toLocaleString('en-US')} GC`;
  const gcTx = (label, amt) => { if (typeof gcv === 'function' && typeof addTx === 'function') addTx({ kind: 'Loads', label, amt, cur: 'gc', status: 'done' }); };

  /* ---------- art (inline SVG, no image files) ---------- */
  const WHEEL = [0.05, 0, 0.15, 0.5, 0, 1.5, 0.05, 5];
  const WHEEL_COL = ['#e53bd0', '#7b2ff2', '#3b6cf2', '#1fb6d9', '#16c47f', '#a6d61c', '#f2a21c', '#ef4444'];
  function wheelSvg(size = 220) {
    const r = 100, n = WHEEL.length, seg = 360 / n;
    const pt = (a, rr) => [100 + rr * Math.cos((a - 90) * Math.PI / 180), 100 + rr * Math.sin((a - 90) * Math.PI / 180)];
    const slices = WHEEL.map((v, i) => {
      const a0 = i * seg, a1 = a0 + seg, [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r), [tx, ty] = pt(a0 + seg / 2, 64);
      return `<path d="M100 100L${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z" fill="${WHEEL_COL[i]}" stroke="#1b0b2a" stroke-width="1.5"/>
        <text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" transform="rotate(${a0 + seg / 2} ${tx.toFixed(1)} ${ty.toFixed(1)})" text-anchor="middle" dominant-baseline="middle" font-family="Arial Black,Arial" font-weight="900" font-size="${v ? 13 : 9}" fill="#fff">${v ? v.toFixed(2) : 'GOOD LUCK'}</text>`;
    }).join('');
    return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" aria-hidden="true"><circle cx="100" cy="100" r="100" fill="#f2b82e"/><g class="x-wheel-rot">${slices}</g><circle cx="100" cy="100" r="104" fill="none" stroke="#f2b82e" stroke-width="8"/></svg>`;
  }
  const SACK = `<svg viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="108" rx="38" ry="6" fill="#0004"/><path d="M38 40c-18 16-26 38-20 54 5 13 20 18 42 18s37-5 42-18c6-16-2-38-20-54Z" fill="#d6262f"/><path d="M38 40c6 4 38 4 44 0l-6-14c-8 3-24 3-32 0Z" fill="#b51d25"/><path d="M42 30c-6-10 4-18 18-12 14-6 24 2 18 12" fill="#f2c14b"/><path d="M40 40c8 5 32 5 40 0" stroke="#f2c14b" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="44" y="56" width="32" height="32" rx="6" transform="rotate(45 60 72)" fill="#f2c14b"/><text x="60" y="80" text-anchor="middle" font-family="Arial Black,Arial" font-size="24" font-weight="900" fill="#7a1d12">?</text></svg>`;
  const TARGET = `<svg viewBox="0 0 120 120" aria-hidden="true">${[56, 46, 36, 26, 16, 7].map((r, i) => `<circle cx="60" cy="60" r="${r}" fill="${['#fff', '#1b1b22', '#2a6bd9', '#e0333f', '#f2c14b', '#f2c14b'][i]}" stroke="#0003"/>`).join('')}<path d="M104 14 64 56" stroke="#7a4a1f" stroke-width="4" stroke-linecap="round"/><path d="M104 14l-4 12 12-4Z" fill="#e0333f"/></svg>`;
  const DARTBOARD = `<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" fill="#141414"/>${Array.from({ length: 20 }, (_, i) => { const a = i * 18 * Math.PI / 180, b = (i + 1) * 18 * Math.PI / 180; return `<path d="M60 60L${60 + 50 * Math.sin(a)} ${60 - 50 * Math.cos(a)}A50 50 0 0 1 ${60 + 50 * Math.sin(b)} ${60 - 50 * Math.cos(b)}Z" fill="${i % 2 ? '#f1e6c8' : '#1d1d1d'}"/>`; }).join('')}<circle cx="60" cy="60" r="31" fill="none" stroke="#d6262f" stroke-width="5" stroke-dasharray="4.9 4.9"/><circle cx="60" cy="60" r="48" fill="none" stroke="#1a8f4b" stroke-width="4" stroke-dasharray="7.5 7.5"/><circle cx="60" cy="60" r="7" fill="#1a8f4b"/><circle cx="60" cy="60" r="3.5" fill="#d6262f"/><path d="M98 18 64 55" stroke="#c9c9d6" stroke-width="3" stroke-linecap="round"/><path d="M98 18l10-4-4 10Z" fill="#e0333f"/></svg>`;
  const CASH = `<svg viewBox="0 0 120 120" aria-hidden="true">${[0, 1, 2, 3].map(i => `<ellipse cx="54" cy="${92 - i * 12}" rx="34" ry="10" fill="#e9a91c" stroke="#9c6a05" stroke-width="2"/>`).join('')}<circle cx="86" cy="40" r="24" fill="#16c47f" stroke="#0d7a4d" stroke-width="3"/><text x="86" y="48" text-anchor="middle" font-family="Arial Black,Arial" font-size="22" font-weight="900" fill="#fff">%</text></svg>`;
  const ART = { wheel: () => `<div class="x-wheel-peek">${wheelSvg(320)}<span class="x-spin-hub">SPIN</span></div>`, bonus: () => SACK, archery: () => TARGET, darts: () => DARTBOARD, cashback: () => CASH };

  /* ---------- section ---------- */
  function f2pCard(g) {
    return `<button type="button" class="f2p-card ${g.soon ? 'soon' : ''}" data-x-act="f2p" data-x-id="${g.id}" style="--c1:${g.c1};--c2:${g.c2}" ${g.soon ? 'disabled' : ''}>
      ${g.art ? `<img class="f2p-art" src="${g.art}" alt="" loading="lazy">` : `<span class="f2p-mark">${g.mark || '?'}</span>`}
      <span class="f2p-txt">${g.logo ? `<img class="f2p-logo" src="${g.logo}" alt="">` : ''}<b>${g.name}</b><small>${g.sub}</small></span>
      <span class="f2p-tag">${g.soon ? 'Soon' : 'Free · GC'}</span>
      ${!g.soon && typeof S !== 'undefined' && S.user && pile(g.id) ? `<span class="f2p-pile">${gcFmt(pile(g.id))} sent</span>` : ''}
    </button>`;
  }
  function dailyCard() {
    const f = today(), done = played(), user = typeof S !== 'undefined' && S.user;
    return `<div class="daily-card daily-${f.id}">
      <div class="daily-art">${ART[f.id]()}</div>
      <div class="daily-body">
        <small class="daily-kicker">Today's free game</small>
        <h3>${f.name}</h3><p>${f.sub}</p>
        <button type="button" class="daily-go" data-x-act="daily" ${done ? 'disabled' : ''}>${done ? 'Played today' : user ? f.cta : 'Sign up to play'}</button>
        <small class="daily-next">${done ? 'Come back tomorrow for a new game.' : 'One try per player.'} Next game in <b data-x-countdown>${untilMidnight()}</b></small>
      </div>
    </div>`;
  }
  window.extrasSection = function () {
    return `<section class="xtra" aria-label="Free games">
      <div class="xtra-h"><h2>Free to play</h2><span>Play with Gold Coins. No purchase needed.</span></div>
      <div class="f2p-row">${F2P.map(f2pCard).join('')}</div>
      <div class="xtra-h"><h2>Free game of the day</h2><span>A different game every 24 hours. Win and the cash is yours.</span></div>
      ${dailyCard()}
    </section>`;
  };

  window.f2pSection = function () {
    return `<section class="xtra xtra-games" aria-label="Free to play">
      <div class="xtra-h"><h2>Free to play</h2><span>Play with Gold Coins. No purchase needed.</span></div>
      <div class="f2p-row">${F2P.map(f2pCard).join('')}</div>
    </section>`;
  };
  const SIGNUP_GC = 50000;
  function launchGame(g, coins) {
    const from = typeof BRAND === 'function' ? BRAND() : document.title.split('|')[0].trim();
    const link = g.url ? `${g.url}${g.url.includes('?') ? '&' : '?'}gc=${Math.round(coins || 0)}&from=${encodeURIComponent(from)}` : '';
    if (link) { window.open(link, '_blank', 'noopener'); toast(`Opening ${g.name}${coins ? ` with ${gcFmt(coins)}` : ''}`); }
    else toast(`${g.name} opens here in the live site${coins ? `, with ${gcFmt(coins)}` : ''}`);
  }

  /* ---------- playing ---------- */
  function award(f, amt) {
    S.user.featureDay = dayKey();
    if (amt > 0) {
      S.user.wallet = Math.round((S.user.wallet + amt) * 100) / 100;
      if (typeof addTx === 'function') addTx({ kind: 'Bonus', label: `${f.name} prize`, amt, status: 'done' });
    }
    if (typeof refresh === 'function') refresh(); else if (typeof save === 'function') save();
  }
  function resultHtml(f, amt) {
    return `<div class="x-result ${amt ? 'win' : ''}"><b>${amt ? `You won ${money(amt)}!` : 'No prize this time'}</b><span>${amt ? 'It’s in your balance now.' : 'Come back tomorrow for a new game.'}</span></div>
      <button class="btn btn-accent btn-block" data-close>Done</button>`;
  }
  const pick = list => { let r = Math.random() * list.reduce((s, x) => s + x[1], 0); for (const [v, w] of list) { if ((r -= w) <= 0) return v; } return list[0][0]; };

  const playLabel = n => (n > 0 ? `Play free with ${gcFmt(n)}` : 'Play free');
  function openF2P(id) {
    const g = F2P.find(x => x.id === id);
    if (!g || g.soon) return;
    if (typeof S === 'undefined' || !S.user) {
      openModal(`<div class="f2p-modal" style="--c1:${g.c1};--c2:${g.c2}">${g.art ? `<img src="${g.art}" alt="">` : `<span class="f2p-mark big">${g.mark}</span>`}</div>
        <h2 class="gc-offer-h">Sign up or log in to get <span>${gcFmt(SIGNUP_GC)}</span> free on us</h2>
        <p class="x-sub">Use them in ${g.name} and our other free games. Gold Coins have no cash value.</p>
        <div class="gc-offer-acts"><button class="btn btn-accent btn-block" data-act="signup">Sign up</button><button class="btn btn-outline btn-block" data-act="login">Log in</button></div>
        <button class="gc-skip" data-x-act="f2p-guest" data-x-id="${g.id}">Continue to ${g.name} with 0 coins</button>`);
      $('#modalBox').classList.add('x-box', 'gc-box');
      return;
    }
    const bal = gcBal(), start = Math.min(bal, 10000);
    openModal(`<div class="f2p-modal" style="--c1:${g.c1};--c2:${g.c2}">${g.art ? `<img src="${g.art}" alt="">` : `<span class="f2p-mark big">${g.mark}</span>`}</div>
      <h2>${g.name}</h2><p class="x-sub">Free to play with Gold Coins. Gold Coins have no cash value.</p>
      <div class="gc-split one"><div><small>Your Gold Coins</small><b>${gcFmt(bal)}</b></div></div>
      <label class="lbl" for="gcAmt">How many Gold Coins do you want to take to ${g.name}?</label>
      <div class="gc-amt"><input id="gcAmt" class="field" type="number" inputmode="numeric" min="0" step="100" max="${bal}" value="${start}" data-x-id="${g.id}"><span>GC</span></div>
      <div class="gc-chips">${[1000, 5000, 10000].map(v => `<button type="button" class="chip" data-x-act="gc-chip" data-v="${v}" ${v > bal ? 'disabled' : ''}>${v.toLocaleString('en-US')}</button>`).join('')}<button type="button" class="chip" data-x-act="gc-chip" data-v="all" ${bal < 1 ? 'disabled' : ''}>All</button></div>
      <button class="btn btn-accent btn-block gc-play" data-x-act="f2p-play" data-x-id="${g.id}">${playLabel(start)}</button>
      <p class="gc-bonus">${g.name} adds its own sign-in bonus on top when you get there.</p>
      <p class="gc-others">Gold Coins you take to ${g.name} stay there. Keep some here to play our other free games.</p>`);
    $('#modalBox').classList.add('x-box', 'gc-box');
  }

  function openFeature() {
    if (typeof requireLogin === 'function' && !requireLogin()) return;
    const f = today();
    if (played()) { toast('You already played today. Come back tomorrow.'); return; }
    const head = `<h2 class="x-title">${f.name}</h2><p class="x-sub">${f.sub}</p>`;
    if (f.id === 'wheel') {
      openModal(`${head}<div class="x-stage"><div class="x-wheel">${wheelSvg(250)}<i class="x-pointer"></i></div></div><div id="xOut"><button class="btn btn-accent btn-block" data-x-act="spin">Spin</button></div>`);
    } else if (f.id === 'bonus') {
      openModal(`${head}<div class="x-bags">${[0, 1, 2].map(i => `<button type="button" class="x-bag" data-x-act="bag" data-x-i="${i}">${SACK}</button>`).join('')}</div><div id="xOut"></div>`);
    } else if (f.id === 'archery' || f.id === 'darts') {
      openModal(`${head}<div class="x-stage x-aim">${f.id === 'archery' ? TARGET : DARTBOARD}<i class="x-hit" hidden></i></div><div id="xOut"><button class="btn btn-accent btn-block" data-x-act="shoot">${f.cta}</button></div>`);
    } else {
      openModal(`${head}<div class="x-stage x-cash">${CASH}</div><p class="x-sub">Cashback is 10% of yesterday's net play, up to ${money(5)}.</p><div id="xOut"><button class="btn btn-accent btn-block" data-x-act="cash">Claim cashback</button></div>`);
    }
    $('#modalBox').classList.add('x-box');
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-x-act]');
    if (!t) return;
    const a = t.dataset.xAct, f = today();
    if (a === 'f2p') { openF2P(t.dataset.xId); return; }
    if (a === 'gc-chip') { const inp = document.getElementById('gcAmt'); const v = t.dataset.v === 'all' ? gcBal() : Number(t.dataset.v); inp.value = Math.min(gcBal(), v); const pb = document.querySelector('#modalBox .gc-play'); if (pb) pb.textContent = playLabel(Number(inp.value)); return; }
    if (a === 'f2p-play') {
      const g = F2P.find(x => x.id === t.dataset.xId), inp = document.getElementById('gcAmt');
      const n = Math.max(0, Math.round(Number(inp && inp.value) || 0));
      if (n > gcBal()) { toast(`You have ${gcFmt(gcBal())}`); return; }
      if (n) { gcSet(gcBal() - n); pileSet(g.id, pile(g.id) + n); gcTx(`Gold Coins to ${g.name}`, -n); }
      if (typeof refresh === 'function') refresh(); else if (typeof save === 'function') save();
      closeModal(); launchGame(g, n);
      return;
    }
    if (a === 'f2p-guest') { const g = F2P.find(x => x.id === t.dataset.xId); closeModal(); launchGame(g, 0); return; }
    if (a === 'daily') { openFeature(); return; }
    if (played()) return;
    if (a === 'spin') {
      const i = pick(WHEEL.map((v, k) => [k, v === 5 ? 1 : v === 1.5 ? 3 : v === 0.5 ? 8 : v ? 14 : 16]));
      const seg = 360 / WHEEL.length, turn = 360 * 5 + (360 - (i * seg + seg / 2));
      const rot = document.querySelector('#modalBox .x-wheel-rot');
      t.disabled = true;
      rot.style.transformOrigin = '100px 100px';
      rot.style.transition = 'transform 3.2s cubic-bezier(.17,.67,.2,1)';
      rot.style.transform = `rotate(${turn}deg)`;
      setTimeout(() => { award(f, WHEEL[i]); const o = document.getElementById('xOut'); if (o) o.innerHTML = resultHtml(f, WHEEL[i]); }, 3300);
      return;
    }
    if (a === 'bag') {
      const prizes = [pick([[5, 1], [1.5, 4], [0.5, 10]]), pick([[0.25, 6], [0.1, 8], [0, 4]]), pick([[0.05, 6], [0, 8]])].sort(() => Math.random() - .5);
      const mine = prizes[+t.dataset.xI];
      document.querySelectorAll('#modalBox .x-bag').forEach((b, k) => { b.disabled = true; b.classList.toggle('mine', k === +t.dataset.xI); b.insertAdjacentHTML('beforeend', `<span class="x-bag-amt">${prizes[k] ? money(prizes[k]) : 'Empty'}</span>`); });
      award(f, mine); document.getElementById('xOut').innerHTML = resultHtml(f, mine);
      return;
    }
    if (a === 'shoot') {
      const ring = pick([[0, 4], [1, 22], [2, 34], [3, 28], [4, 12]]);
      const prize = [3, 1, 0.25, 0.1, 0][ring];
      const dist = [0, 12, 24, 36, 52][ring] + Math.random() * 6, ang = Math.random() * Math.PI * 2;
      const hit = document.querySelector('#modalBox .x-hit');
      hit.hidden = false; hit.style.left = `${50 + dist * Math.cos(ang) * 0.75}%`; hit.style.top = `${50 + dist * Math.sin(ang) * 0.75}%`;
      t.disabled = true;
      award(f, prize); document.getElementById('xOut').innerHTML = resultHtml(f, prize);
      return;
    }
    if (a === 'cash') { award(f, 1.25); document.getElementById('xOut').innerHTML = resultHtml(f, 1.25); }
  });

  document.addEventListener('input', e => { if (e.target.id === 'gcAmt') { const pb = document.querySelector('#modalBox .gc-play'); if (pb) pb.textContent = playLabel(Math.max(0, Math.round(Number(e.target.value) || 0))); } });
  setInterval(() => { document.querySelectorAll('[data-x-countdown]').forEach(el => { el.textContent = untilMidnight(); }); }, 1000);
})();
