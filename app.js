const PLATFORMS = [
  { id: 'milkyway', name: 'Milky Way', c1: '#1d2370', c2: '#7a4dff', logo: 'assets/logos/mw-icon.jpg', daily: 10, blurb: 'Space-themed slots, keno and fish games, with the Milky Way jackpot wheel.' },
  { id: 'firekirin', name: 'Fire Kirin', c1: '#0b4d26', c2: '#c99a14', logo: 'assets/logos/fk-icon.jpg', daily: 10, blurb: 'Fish tables and lucky slots. Home of Jade Fortune and Space Jet.' },
  { id: 'orion', name: 'Orion Stars', c1: '#7a2510', c2: '#f29a2e', daily: 15, blurb: 'The biggest catalogue: fish, slots and keno.' },
  { id: 'panda', name: 'Panda Master', c1: '#6e0f28', c2: '#e2486a', blurb: 'Lucky-themed slots with daily bonus drops.' },
  { id: 'juwa', name: 'Juwa', c1: '#05514a', c2: '#18b89a', daily: 10, blurb: 'Fast fish games and multiplier slots.' },
  { id: 'vegas', name: 'Vegas Sweeps', c1: '#4a3208', c2: '#d6a53a', blurb: 'Strip-style reels and classic sevens.' }
];

const ART = {
  'shooting-star': ['Shooting Star', 'Slots'], 'king-of-leopard': ['King of Leopard', 'Slots'], 'life-of-luxury': ['Life of Luxury', 'Slots'],
  'clover-fortune': ['Clover Fortune', 'Slots'], 'ocean-king': ['Ocean King', 'Fish'], 'dragon-sagas': ['Dragon Sagas', 'Fish'],
  'hexno-keno': ['Hexno Keno', 'Keno'], 'super-double-up': ['Super Double Up', 'Slots'], 'golden-fish-mw': ['Golden Fish', 'Fish'],
  'lucky-weekends': ['Lucky Weekends', 'Slots'], 'st-patricks': ["St. Patrick's Day", 'Slots'], 'neon-777': ['Neon 777', 'Slots'],
  'golden-fish': ['Golden Fish', 'Fish'], 'yun-cai-fa': ['Yun Cai Fa', 'Slots'], 'space-jet': ['Space Jet', 'Fish'], 'jade-fortune': ['Jade Fortune', 'Slots']
};
const MW_ART = ['shooting-star', 'king-of-leopard', 'life-of-luxury', 'clover-fortune', 'ocean-king', 'dragon-sagas', 'hexno-keno', 'super-double-up', 'golden-fish-mw'];
const FK_ART = ['lucky-weekends', 'st-patricks', 'neon-777', 'golden-fish', 'yun-cai-fa', 'space-jet', 'jade-fortune'];
const FILL = [...MW_ART, ...FK_ART];

const lineup = (pid, i) => pid === 'milkyway' ? MW_ART : pid === 'firekirin' ? FK_ART : Array.from({ length: 8 }, (_, k) => FILL[(i * 5 + k * 3) % FILL.length]);
const GAMES = PLATFORMS.flatMap((p, i) => lineup(p.id, i).map(a => ({ id: `${p.id}--${a}`, p: p.id, name: ART[a][0], cat: ART[a][1], img: `assets/games/${a}.jpg` })));
PLATFORMS.forEach(p => { p.games = GAMES.filter(g => g.p === p.id).length; });

const plat = id => PLATFORMS.find(p => p.id === id);
const game = id => GAMES.find(g => g.id === id);
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};

const MIN_DEPOSIT = 25;
const MIN_WITHDRAW = 20;
const now = () => new Date().toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const rid = () => Math.random().toString(36).slice(2, 9);

function normUser(u) {
  if (!u) return null;
  return {
    wallet: 0, accounts: {}, tx: [], twofa: false, limit: 0, coolUntil: 0, excluded: false,
    points: 0, lifetime: 0, cashable: 0, checkin: { last: '', streak: 0 }, claimed: [], pts: [], avatar: '', refCode: Math.random().toString(36).slice(2, 8).toUpperCase(), promos: [],
    ...u
  };
}

const S = {
  user: normUser(store.get('pp_user', null)),
  cat: 'All',
  q: '',
  showPw: false,
  bal: 'deposit',
  method: 'btc',
  actTab: 'done',
  actChip: 'All',
  chat: [{ t: 'Hi there. How can we help you today?' }],
  rw: 'today'
};

function save() {
  store.set('pp_user', S.user);
  store.set('pp_account', S.user);
}

/* ---------- sites ---------- */

const SITES = {
  a: { name: 'Loaded777', word: 'Loaded<b>777</b>', mark: '<path d="M10 9h12v3.2L15.8 23h-4.3l6.1-10.6H10Z" fill="var(--on-accent)"/>', theme: '#0b0f20' },
  b: { name: 'Lucky Lounge', word: 'Lucky<b>Lounge</b>', mark: '<path d="M16 7.5l2.4 5 5.4.6-4 3.7 1.1 5.4L16 19.5l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6Z" fill="var(--on-accent)"/>', theme: '#081310' }
};
S.site = null;
const site = () => SITES[S.site || 'a'];
const BRAND = () => site().name;
const logoInner = () => `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="2" width="28" height="28" rx="9" fill="var(--accent)"/>${site().mark}</svg><span>${site().word}</span>`;

function applySite(k) {
  S.site = k;
  document.documentElement.dataset.site = k;
  document.title = SITES[k].name;
  document.querySelectorAll('header .logo, .foot .logo').forEach(el => { el.innerHTML = logoInner(); el.setAttribute('aria-label', SITES[k].name + ' home'); });
  const c = document.querySelector('.copy'); if (c) c.innerHTML = `&copy; 2026 ${SITES[k].name}. All rights reserved.`;
  if (k === 'b') { const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = SITES.b.theme; }
}

/* ---------- demo feed data ---------- */

const FEED_USERS = ['mike77', 'luckyrae', 'jdog_44', 'tina.b', 'reelking', 'sam_k', 'goldie9', 'nate_x', 'bigfish', 'kayla22', 'dex808', 'mona_v'];
const FEED = Array.from({ length: 14 }, (_, i) => ({
  p: PLATFORMS[(i * 5) % PLATFORMS.length].id,
  user: FEED_USERS[(i * 7) % FEED_USERS.length],
  amt: [18, 100, 20, 210, 90, 45, 60, 150, 25, 300, 75, 40, 120, 35][i],
  ago: `${1 + (i % 4)}m ago`
}));
const BIG = [
  ['firekirin', 'luckyrae', '11/20/2026 02:00 PM', 2020], ['milkyway', 'reelking', '11/20/2026 12:06 PM', 2000],
  ['orion', 'goldie9', '11/19/2026 11:24 PM', 1000], ['juwa', 'nate_x', '11/19/2026 10:15 PM', 1166],
  ['panda', 'kayla22', '11/19/2026 07:40 PM', 1082], ['vegas', 'dex808', '11/19/2026 05:02 PM', 950]
];
const MONTHLY = [['milkyway', 'bigfish', 18293], ['firekirin', 'tina.b', 17232], ['orion', 'jdog_44', 13000], ['juwa', 'mona_v', 12796], ['panda', 'sam_k', 12399]];

function demoUser(name, password) {
  const base = name.split('@')[0];
  const acc = (pid, c) => ({ username: `${base.replace(/[^a-z0-9]/gi, '').slice(0, 8).toLowerCase()}_${pid.slice(0, 2)}${Math.floor(100 + Math.random() * 900)}`, password: makePw(), credits: c });
  return normUser({
    first: base, email: name.includes('@') ? name : `${name}@example.com`, username: name, password, since: new Date().toISOString().slice(0, 10),
    wallet: 120,
    accounts: { firekirin: acc('firekirin', 42.5), milkyway: acc('milkyway', 18) },
    tx: [
      { id: rid(), kind: 'Deposits', label: 'Deposit (Bitcoin)', amt: 100, when: '11/19/2026 06:30 PM', status: 'done' },
      { id: rid(), kind: 'Loads', label: 'Loaded credits', p: 'firekirin', amt: -50, when: '11/19/2026 06:41 PM', status: 'done' },
      { id: rid(), kind: 'Redeems', label: 'Redeemed credits', p: 'milkyway', amt: 32, when: '11/20/2026 11:02 AM', status: 'done' },
      { id: rid(), kind: 'Withdrawals', label: 'Withdrawal (Litecoin)', amt: -40, when: '11/20/2026 01:15 PM', status: 'pending' }
    ]
  });
}

/* ---------- small pieces ---------- */

const I = {
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="8" width="13" height="13" rx="2.5"/><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-8A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 10.5 12 4l8 6.5V20h-5v-5.5H9V20H4Z"/></svg>',
  key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9m-3 3 2 2m-4 0 2 2"/></svg>',
  dl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0Zm0 1H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 2v4m-4 3h8"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  arrowL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5m6-6-6 6 6 6"/></svg>',
  ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4Z"/><path d="M14 7v10" stroke-dasharray="2 2"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6Z"/><path d="m9 12 2 2 4-4" stroke-linecap="round"/></svg>',
  gift: '<svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="12" rx="2" fill="#e2483a"/><rect x="2" y="7" width="20" height="5" rx="1.5" fill="#ff6a52"/><rect x="10.5" y="7" width="3" height="14" fill="#ffd25a"/><path d="M12 7c-2-4-6-4-6-1.5S10 7 12 7c2 0 6-1 6-1.5S14 3 12 7Z" fill="#ffd25a"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6Z" fill="#ffc83d"/><path d="M9.5 18a2.5 2.5 0 0 0 5 0Z" fill="#e6a313"/></svg>'
};

const initials = p => p.name.split(' ').map(w => w[0]).join('').slice(0, 2);
const coin = (p, size = '') => `<span class="coin ${size}" style="--c1:${p.c1};--c2:${p.c2}">${p.logo ? `<img src="${p.logo}" alt="">` : `<i class="ini">${initials(p)}</i>`}</span>`;
const crumb = (...parts) => `<nav class="crumb"><a href="#/" aria-label="Home">${I.home}</a>${parts.map(([t, h]) => `<span class="sep">${I.chev}</span>${h ? `<a href="${h}">${t}</a>` : `<b>${t}</b>`}`).join('')}</nav>`;
const fmt = n => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usd = n => `$${fmt(n)}`;
const acct = pid => S.user && S.user.accounts[pid];
const todayKey = () => new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
const dailyUsed = pid => S.user && S.user.tx.some(t => t.kind === 'Bonus' && t.p === pid && t.when.startsWith(todayKey()));
const tags = p => `<span class="tags"><span class="tag live"><i></i>Active</span>${p.daily ? `<span class="tag daily ${dailyUsed(p.id) ? 'used' : ''}" title="Bonus on your first load each day">Daily 1st +${p.daily}%</span>` : ''}</span>`;
const unlockedCount = () => S.user ? Object.keys(S.user.accounts).length : 0;
const creditsTotal = () => S.user ? Object.values(S.user.accounts).reduce((s, a) => s + a.credits, 0) : 0;

function blocked() {
  if (!S.user) return '';
  if (S.user.excluded) return 'Your account is self-excluded. Contact support to discuss reopening it.';
  if (S.user.coolUntil > Date.now()) return `You're on a cool-off break until ${new Date(S.user.coolUntil).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}.`;
  return '';
}

function topRight() {
  if (!S.user) return `<button class="btn btn-ghost btn-sm" data-act="login">Log in</button><button class="btn btn-accent btn-sm" data-act="signup">Sign up</button>`;
  return `<a class="round-btn" href="#/rewards" aria-label="Rewards">${I.gift}${canCheckin() ? '<i class="dot"></i>' : ''}</a>
    <button class="round-btn" data-act="bell" aria-label="Notifications">${I.bell}<i class="dot"></i></button>
    <a class="bal" href="#/balance" data-bal-go="deposit" aria-label="Wallet"><span class="bal-plus">${I.plus}</span><span class="bal-num">${usd(S.user.wallet)}</span></a>`;
}

function credRow(label, value, copyVal, secret) {
  const shown = !secret || S.showPw;
  return `<div class="cred"><label>${label}</label>
    <div class="cred-row"><code>${shown ? esc(value) : '&bull;'.repeat(12)}</code>
      ${secret ? `<button class="icon-btn" data-act="pw" aria-label="${S.showPw ? 'Hide' : 'Show'} password">${S.showPw ? I.eyeOff : I.eye}</button>` : ''}
      <button class="icon-btn" data-copyval="${esc(copyVal)}" data-what="${label}" aria-label="Copy ${label.toLowerCase()}">${I.copy}</button>
    </div></div>`;
}

function tile(g) {
  const p = plat(g.p);
  return `<button class="tile" data-game="${g.id}">
    <div class="tile-art"><img src="${g.img}" alt="" loading="lazy"><div class="tile-play"><span>${I.play}</span></div></div>
    <div class="tile-name">${esc(g.name)}</div>
    <div class="tile-sub">${g.cat} &middot; ${p.name}</div>
  </button>`;
}

function platRow(p) {
  const a = acct(p.id);
  const actions = a
    ? `<span class="credits"><small>Credits</small><b>${usd(a.credits)}</b></span>
       <button class="btn btn-outline" data-act="load" data-plat="${p.id}">Load</button>
       <button class="btn btn-accent" data-act="play" data-plat="${p.id}">Play</button>
       <button class="sq-btn" data-act="gcreds" data-plat="${p.id}" aria-label="${p.name} login">${I.key}</button>`
    : `<button class="btn btn-outline" data-act="unlock" data-plat="${p.id}">Unlock Account</button>
       <button class="sq-btn" data-act="download" data-plat="${p.id}" aria-label="Download ${p.name}">${I.dl}</button>`;
  return `<div class="row-card">
    <a class="row-main" href="#/platform/${p.id}">${coin(p)}<span><b>${p.name}${a ? `<em class="linked">${I.check}Unlocked</em>` : ''}</b>${tags(p)}<small>${p.games} games &middot; ${p.blurb}</small></span></a>
    <div class="row-acts">${actions}</div>
  </div>`;
}

function ticker() {
  const card = f => { const p = plat(f.p); return `<div class="tick">${coin(p, 'xs')}
    <span class="tick-txt"><b>${esc(f.user)}</b> redeemed on ${p.name}</span><em>${usd(f.amt)}</em><small>${f.ago}</small></div>`; };
  const cards = FEED.map(card).join('');
  return `<div class="ticker" aria-label="Live activity"><div class="ticker-label"><i></i>Live Activity</div>
    <div class="ticker-track"><div class="ticker-run">${cards}${cards}</div></div></div>`;
}

/* ---------- views ---------- */

function viewHome() {
  const hot = ['firekirin', 'milkyway', 'orion'].map(plat);
  const guest = !S.user;
  return `<div class="page home">
    <section class="hero">
      <div class="hero-txt">
        ${guest
          ? `<h1>One wallet for <span>every game</span></h1>
             <p class="hero-sub">Make one account, fund it once, and unlock Milky Way, Fire Kirin, Orion Stars and more. Load credits into any game and redeem them back to your wallet.</p>
             <form class="hl-form" data-form="quick">
               <input class="field" type="email" name="email" placeholder="Your email address" required autocomplete="email">
               <button class="btn btn-accent btn-lg" type="submit">Create account</button>
             </form>
             <p class="hl-note">Already have one? <a href="#" data-act="login">Log in</a></p>`
          : `<h1>Welcome back, <span>${esc(S.user.first)}</span></h1>
             <p class="hero-sub">${unlockedCount() ? `You have ${unlockedCount()} of ${PLATFORMS.length} game accounts unlocked.` : `Unlock your first game account to start playing.`}</p>
             <div class="hero-acts"><a class="btn btn-accent btn-lg" href="#/balance" data-bal-go="deposit">Deposit</a><a class="btn btn-outline btn-lg" href="#/games">${unlockedCount() ? 'My games' : 'Unlock a game'}</a></div>`}
        <div class="hero-stats">
          ${guest
            ? `<div><b>${PLATFORMS.length}</b><span>game platforms</span></div><div><b>${GAMES.length}</b><span>games</span></div><div><b>$${MIN_DEPOSIT}</b><span>min deposit</span></div>`
            : `<div><b>${usd(S.user.wallet)}</b><span>wallet</span></div><div><b>${usd(creditsTotal())}</b><span>in games</span></div><div><b>${unlockedCount()}/${PLATFORMS.length}</b><span>unlocked</span></div>`}
        </div>
        <div class="hot-strip">
          <div class="hot-label">${I.bolt}Hot right now</div>
          <div class="hot-chips">${hot.map((p, i) => `<a class="hot-chip" href="#/platform/${p.id}">
            ${coin(p, 'xs')}<span><b>${p.name}</b><small><i></i>${[1240, 986, 712][i].toLocaleString('en-US')} playing</small></span>
          </a>`).join('')}</div>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <img src="assets/mascot.jpg" alt="">
        <div class="art-badge"><b>Daily 1st bonus</b><span>Up to +15% on your first load</span></div>
      </div>
    </section>

    ${guest ? `<section class="steps3 four">
      <div><span>1</span><b>Create your account</b><p>Email and a 6-digit code. That's your ${BRAND()} login.</p></div>
      <div><span>2</span><b>Deposit to your wallet</b><p>Send crypto. Your wallet shows it once confirmed.</p></div>
      <div><span>3</span><b>Unlock a game, load credits</b><p>Each game gets its own login. Move money from your wallet into it.</p></div>
      <div><span>4</span><b>Play, then redeem</b><p>Redeem credits back to your wallet, then withdraw.</p></div>
    </section>` : ''}

    <section class="boards">
      <div class="board">
        <div class="board-h"><h2>${I.trophy}Latest Big Winners</h2><span class="pill">LATEST ${BIG.length}</span></div>
        <div class="win-list">${BIG.map(([pid, u, d, a]) => `<div class="win">
          ${coin(plat(pid), 'sm')}
          <div><small>USER</small><b>${esc(u)}</b></div>
          <div class="win-date"><small>DATE</small><span>${d}</span></div>
          <div class="win-amt"><small>REDEEM</small><b>$${a.toLocaleString('en-US')}</b></div>
        </div>`).join('')}</div>
      </div>
      <div class="board">
        <div class="board-h"><h2>${I.trophy}Top Monthly Winners</h2><span class="pill">NOVEMBER</span></div>
        <div class="rank-head"><span>RANK</span><span>USER</span><span>REDEEM</span></div>
        <div class="rank-list">${MONTHLY.map(([pid, u, a], i) => `<div class="rank ${i === 0 ? 'first' : ''}">
          <span class="rank-n r${i}">${i < 3 ? I.trophy : `#${i + 1}`}</span>
          <span class="rank-user">${coin(plat(pid), 'sm')}<span><small>User</small><b>${esc(u)}</b></span></span>
          <b class="rank-amt">$${a.toLocaleString('en-US')}</b>
        </div>`).join('')}</div>
      </div>
    </section>
    ${blogVideoSection()}
  </div>
  ${ticker()}`;
}

function viewGames() {
  const n = unlockedCount();
  return `<div class="page">
    ${crumb(['Games'])}
    <p class="lede">Here you'll find your <b>Gaming Accounts</b>. ${S.user && n ? `You have ${n} unlocked. Load credits from your wallet and tap Play.` : `Don't have one yet? Unlock it now!`}</p>
    ${S.user && n ? `<div class="list-h"><h2>My Games</h2><span>${n} unlocked</span></div>
      <div class="rows">${PLATFORMS.filter(p => acct(p.id)).map(platRow).join('')}</div>` : ''}
    ${PLATFORMS.length - n ? `<div class="list-h"><h2>${n ? 'More Games' : 'Games'}</h2><span>${PLATFORMS.length - n} available</span></div>
      <div class="rows">${PLATFORMS.filter(p => !acct(p.id)).map(platRow).join('')}</div>` : ''}
  </div>`;
}

function gameGrid(list) {
  const q = S.q.trim().toLowerCase();
  const shown = list.filter(g => (S.cat === 'All' || g.cat === S.cat) && (!q || g.name.toLowerCase().includes(q)));
  return shown.length ? shown.map(tile).join('') : '<p class="empty">No games match that search.</p>';
}

function viewPlatform(id) {
  const p = plat(id);
  if (!p) return viewGames();
  const a = acct(p.id);
  const list = GAMES.filter(g => g.p === p.id);
  return `<div class="page">
    ${crumb(['Games', '#/games'], [p.name])}
    <div class="plat-top">
      ${coin(p, 'lg')}
      <div class="plat-top-txt"><h1>${p.name}</h1>${tags(p)}<p>${p.blurb}</p>
        <p class="signed">${a ? `Your ${p.name} login: <code>${esc(a.username)}</code> &middot; ${usd(a.credits)} credits` : `You need a ${p.name} account to play these games.`}</p></div>
      <div class="plat-top-acts">${a
        ? `<button class="btn btn-outline" data-act="load" data-plat="${p.id}">Load credits</button><button class="btn btn-accent" data-act="play" data-plat="${p.id}">Play</button>`
        : `<button class="btn btn-accent" data-act="unlock" data-plat="${p.id}">Unlock Account</button><button class="btn btn-outline" data-act="download" data-plat="${p.id}">${I.dl}Get the app</button>`}</div>
    </div>
    <div class="filters">
      ${['All', 'Fish', 'Slots', 'Keno'].map(c => `<button class="chip ${S.cat === c ? 'on' : ''}" data-cat="${c}">${c}</button>`).join('')}
      <label class="search">${I.search}<input type="search" placeholder="Search games" value="${esc(S.q)}" data-search aria-label="Search games"></label>
    </div>
    <div class="grid" id="gameGrid" data-plat="${p.id}">${gameGrid(list)}</div>
  </div>`;
}

const BAL_ITEMS = [
  { id: 'deposit', label: 'Deposit', color: '#1fbf8f', icon: I.plus },
  { id: 'withdraw', label: 'Withdraw', color: '#e0334f', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14m-6-6 6 6 6-6"/></svg>' },
  { id: 'transfer', label: 'Load a game', color: '#3b82f6', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>' },
  { id: 'redeem', label: 'Redeem', color: '#e0709e', icon: I.arrowL },
  { id: 'p2p', label: 'P2P', color: '#c9961a', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M14.5 15.2c.8-.5 1.6-.7 2.5-.7 2.1 0 3.6 1.2 4 3.5"/></svg>' },
  { id: 'voucher', label: 'Voucher', color: '#0ea5b7', icon: I.ticket, plus: true }
];

const CRYPTO = [
  { id: 'btc', name: 'Bitcoin', code: 'BTC', bg: '#f7931a', sym: '&#8383;', pre: 'bc1q' },
  { id: 'btcln', name: 'Bitcoin Lightning', code: 'BTCLightning', bg: '#f7931a', sym: '&#8383;', bolt: true, pre: 'lnbc' },
  { id: 'sol', name: 'Solana', code: 'SOL', bg: 'linear-gradient(135deg,#9945ff,#14f195)', sym: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M6 7h13l-2 2H4Zm0 4h13l-2 2H4Zm2 4h13l-2 2H6Z"/></svg>', pre: '7Gx' },
  { id: 'ltc', name: 'Litecoin', code: 'LTC', bg: '#345d9d', sym: '&#321;', pre: 'ltc1q' },
  { id: 'bch', name: 'Bitcoin Cash', code: 'BCH', bg: '#0ac18e', sym: '&#8383;', pre: 'qp' },
  { id: 'eth', name: 'Ethereum', code: 'ETH', bg: '#627eea', sym: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 3 6.5 12 12 15.2 17.5 12Zm0 13.4L6.5 13.2 12 21l5.5-7.8Z"/></svg>', pre: '0x' },
  { id: 'trx', name: 'Tron', code: 'TRX', bg: '#e5262f', sym: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><path d="M4 5l16 3-8 12Zm0 0 8 15m-8-15 13 6"/></svg>', pre: 'T' },
  { id: 'bnb', name: 'Binance Coin', code: 'BNB', bg: '#f3ba2f', sym: '<svg viewBox="0 0 24 24" fill="#fff"><path d="m12 4 3 3-3 3-3-3Zm-5 5 3 3-3 3-3-3Zm10 0 3 3-3 3-3-3Zm-5 5 3 3-3 3-3-3Z"/></svg>', pre: 'bnb1' },
  { id: 'usdt', name: 'Tether', code: 'USDT', bg: '#26a17b', sym: '&#8366;', pre: 'T' }
];
const cryptoIco = c => `<span class="cry" style="background:${c.bg}">${c.sym}${c.bolt ? `<i>${I.bolt}</i>` : ''}</span>`;

function balPanel(id) {
  const it = BAL_ITEMS.find(b => b.id === id);
  const head = (t, s) => `<div class="panel-h"><span class="mini-ico" style="background:${it.color}">${it.icon}</span><div><h2>${t}</h2><p>${s}</p></div></div>`;
  const walletLine = `<div class="wallet-line">Wallet balance <b>${usd(S.user.wallet)}</b></div>`;
  const cryptoList = () => `<div class="opt-list">${CRYPTO.map(c => `<button class="opt cry-opt ${S.method === c.id ? 'on' : ''}" data-method="${c.id}">${cryptoIco(c)}<b>${c.name}</b><small>(${c.code})</small>${S.method === c.id ? `<span class="tick-ok">${I.check}</span>` : ''}</button>`).join('')}</div>`;
  const unlocked = PLATFORMS.filter(p => acct(p.id));
  const noGames = `<div class="card soft"><b>No game accounts yet</b><p class="card-sub">Unlock a game first. Each game gets its own login.</p><a class="btn btn-accent" href="#/games">Unlock a game</a></div>`;
  const stop = blocked();
  if (id === 'deposit') return head('Deposit', `Choose the crypto you want to deposit. Minimum $${MIN_DEPOSIT}.`) + walletLine + (stop ? `<div class="warn">${stop}</div>` : cryptoList() +
    `<div class="sticky-cta"><button class="btn btn-accent btn-lg" data-act="deposit-now">Deposit Now</button></div>`);
  if (id === 'withdraw') return head('Withdraw', `Send money from your wallet to your crypto address. Minimum $${MIN_WITHDRAW}.`) + walletLine +
    `<p class="hint">Credits inside a game must be redeemed to your wallet first.</p>` + cryptoList() +
    `<div class="sticky-cta"><button class="btn btn-accent btn-lg" data-act="withdraw-now">Withdraw Now</button></div>`;
  if (id === 'transfer') return head('Load a game', 'Move money from your wallet into a game account as credits.') + walletLine + (stop ? `<div class="warn">${stop}</div>` : unlocked.length ?
    `<form class="form-row narrow" data-form="load">
      <label class="lbl">Game</label><select class="field" name="plat">${unlocked.map(p => `<option value="${p.id}" ${S.loadPlat === p.id ? 'selected' : ''}>${p.name} (${usd(acct(p.id).credits)} credits)</option>`).join('')}</select>
      <label class="lbl">Amount ($)</label><input class="field" name="amt" type="number" min="1" step="0.01" placeholder="0.00" required>
      <button class="btn btn-accent" type="submit">Load credits</button>
    </form>` : noGames);
  if (id === 'redeem') return head('Redeem', 'Bring credits from a game back to your wallet.') + walletLine + (unlocked.length ?
    `<div class="opt-list">${unlocked.map(p => `<button class="opt" data-act="redeem" data-plat="${p.id}" ${acct(p.id).credits < 1 ? 'disabled' : ''}>${coin(p, 'sm')}<b>${p.name}</b><small>${usd(acct(p.id).credits)} credits</small>${I.chev}</button>`).join('')}</div>` : noGames);
  if (id === 'p2p') return head('P2P', `Send money from your wallet to another ${BRAND()} player.`) + walletLine +
    `<form class="form-row narrow" data-form="p2p">
      <label class="lbl">Player username</label><input class="field" name="to" placeholder="e.g. mike77" required>
      <label class="lbl">Amount ($)</label><input class="field" name="amt" type="number" min="1" step="0.01" placeholder="0.00" required>
      <button class="btn btn-accent" type="submit">Send</button>
    </form>`;
  return head('Voucher', 'Got a voucher code? It goes straight to your wallet.') +
    `<form class="form-row narrow" data-form="voucher"><input class="field" name="code" placeholder="Voucher code (try WELCOME5)" required><button class="btn btn-accent" type="submit">Apply voucher</button></form>`;
}

function viewBalance() {
  if (!S.user) return needLogin('Balance');
  return `<div class="page split">
    <aside class="split-left">
      ${crumb(['Balance'])}
      <p class="lede">Here you can manage your Deposits, Withdrawals and Transfers!</p>
      <div class="wallet-card"><small>Wallet</small><b>${usd(S.user.wallet)}</b><span>${usd(creditsTotal())} in game credits</span></div>
      <div class="acc">${BAL_ITEMS.map(b => `<button class="acc-item ${S.bal === b.id ? 'on' : ''}" data-bal="${b.id}" style="--ic:${b.color}">
        <span class="mini-ico" style="background:${b.color}">${b.icon}</span><b>${b.label}</b>${b.plus ? I.plus : S.bal === b.id ? I.chev : I.down}</button>`).join('')}</div>
    </aside>
    <section class="split-right" id="balPanel">${balPanel(S.bal)}</section>
  </div>`;
}

function viewActivity() {
  if (!S.user) return needLogin('Activity');
  const chips = ['All', 'Deposits', 'Withdrawals', 'Loads', 'Redeems', 'P2P', 'Vouchers', 'Bonus'];
  const rows = S.user.tx.filter(t => (S.actTab === 'done' ? t.status === 'done' : t.status === 'pending') && (S.actChip === 'All' || t.kind === S.actChip));
  return `<div class="page">
    ${crumb(['Activity'])}
    <div class="tabs">
      <button class="${S.actTab === 'done' ? 'on' : ''}" data-tab="done">Finished</button>
      <button class="${S.actTab === 'pending' ? 'on' : ''}" data-tab="pending">In progress</button>
    </div>
    <div class="filters">${chips.map(c => `<button class="chip ${S.actChip === c ? 'on' : ''}" data-chip="${c}">${c}</button>`).join('')}</div>
    ${rows.length ? `<div class="rows tx">${rows.map(t => { const p = t.p && plat(t.p); return `<div class="row-card slim">
        <div class="row-main">${p ? coin(p, 'sm') : `<span class="tx-ico">${t.amt >= 0 ? I.plus : I.arrowL}</span>`}<span><b>${t.label}</b><small>${p ? p.name + ' &middot; ' : ''}${t.when}</small></span></div>
        <div class="row-acts"><b class="${t.amt >= 0 ? 'pos' : 'neg'}">${t.amt >= 0 ? '+' : '-'}${usd(Math.abs(t.amt))}</b>${t.status === 'pending' ? '<span class="pend">Processing</span>' : ''}</div>
      </div>`; }).join('')}</div>`
      : '<p class="empty big">No transactions found for the selected filter</p>'}
  </div>`;
}

function viewAccount() {
  if (!S.user) return needLogin('My account');
  const u = S.user;
  const games = PLATFORMS.filter(p => acct(p.id));
  return `<div class="page">
    ${crumb(['My account'])}
    <p class="lede">${esc(u.email)} &middot; member since ${new Date(u.since).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
    <div class="acct">
      <div class="card">
        <h2>${BRAND()} login</h2>
        <p class="card-sub">For this site: your wallet, deposits and withdrawals.</p>
        ${credRow('Username', u.username, u.username)}
        ${credRow('Password', u.password, u.password, true)}
      </div>
      <div class="card">
        <h2>Change username</h2>
        <p class="card-sub">4 to 20 letters, numbers or underscores.</p>
        <form class="form-row" data-form="user">
          <input class="field" name="next" placeholder="New username" value="${esc(u.username)}" pattern="[A-Za-z0-9_]{4,20}" title="4 to 20 letters, numbers or _" autocomplete="username" required>
          <input class="field" type="password" name="cur" placeholder="Current password" autocomplete="current-password" required>
          <button class="btn btn-accent btn-block" type="submit">Save username</button>
        </form>
      </div>
      <div class="card">
        <h2>Change password</h2>
        <p class="card-sub">Your game logins are separate and don't change.</p>
        <form class="form-row" data-form="pw">
          <input class="field" type="password" name="cur" placeholder="Current password" autocomplete="current-password" required>
          <input class="field" type="password" name="next" placeholder="New password (8+ characters)" minlength="8" autocomplete="new-password" required>
          <button class="btn btn-accent btn-block" type="submit">Update password</button>
        </form>
      </div>
    </div>

    <div class="list-h"><h2>Game accounts</h2><span>${games.length} of ${PLATFORMS.length} unlocked</span></div>
    ${games.length ? `<table class="tbl"><thead><tr><th>Game</th><th>Username</th><th>Password</th><th class="num">Credits</th></tr></thead>
      <tbody>${games.map(p => { const a = acct(p.id); return `<tr><td><span class="pname">${coin(p, 'xs')}${p.name}</span></td>
        <td><span class="mono-cell">${esc(a.username)}<button class="icon-btn" data-copyval="${esc(a.username)}" data-what="Username">${I.copy}</button></span></td>
        <td><span class="mono-cell">${S.showPw ? esc(a.password) : '&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;'}<button class="icon-btn" data-act="pw" aria-label="Show passwords">${S.showPw ? I.eyeOff : I.eye}</button><button class="icon-btn" data-copyval="${esc(a.password)}" data-what="Password">${I.copy}</button></span></td>
        <td class="num">${usd(a.credits)}</td></tr>`; }).join('')}</tbody></table>`
      : `<div class="card soft"><p class="card-sub">No game accounts yet.</p><a class="btn btn-accent" href="#/games">Unlock a game</a></div>`}

    <div class="list-h"><h2>Security &amp; responsible play</h2><span></span></div>
    <div class="acct">
      <div class="card">
        <h2>${I.shield}Two-step login</h2>
        <p class="card-sub">Ask for a code from your email every time you log in.</p>
        <button class="switch ${u.twofa ? 'on' : ''}" data-act="twofa" role="switch" aria-checked="${u.twofa}"><i></i><span>${u.twofa ? 'On' : 'Off'}</span></button>
      </div>
      <div class="card">
        <h2>Daily deposit limit</h2>
        <p class="card-sub">Lower it any time. Raising it takes 24 hours.</p>
        <form class="form-row" data-form="limit">
          <select class="field" name="limit">${[0, 50, 100, 250, 500, 1000].map(v => `<option value="${v}" ${u.limit === v ? 'selected' : ''}>${v ? `$${v} per day` : 'No limit'}</option>`).join('')}</select>
          <button class="btn btn-ghost btn-block" type="submit">Save limit</button>
        </form>
      </div>
      <div class="card">
        <h2>Take a break</h2>
        <p class="card-sub">${blocked() || 'Pause deposits and loading credits for a while.'}</p>
        <div class="break-btns">
          <button class="btn btn-ghost btn-sm" data-act="cool" data-h="24">24 hours</button>
          <button class="btn btn-ghost btn-sm" data-act="cool" data-h="168">7 days</button>
          <button class="btn btn-ghost btn-sm" data-act="cool" data-h="720">30 days</button>
        </div>
        <button class="btn btn-outline btn-block danger" data-act="exclude" style="margin-top:12px">Self-exclude</button>
      </div>
    </div>
    <button class="btn btn-ghost" data-act="logout" style="margin-top:26px">Sign out</button>
  </div>`;
}

/* ---------- rewards ---------- */

const CHECKIN = [10, 15, 20, 30, 40, 60, 100];
const LEVELS = [['Bronze', 500], ['Silver', 1500], ['Gold', 4000], ['Platinum', 10000]];
const AVATARS = ['#f6a9c3', '#7a4dff', '#1fbf8f', '#f29a2e', '#3b82f6', '#e0334f'];
const SHOP = [
  { id: 'c1', name: '$1 cashable', cost: 100, cash: 1 },
  { id: 'c5', name: '$5 cashable', cost: 450, cash: 5 },
  { id: 'c10', name: '$10 cashable', cost: 850, cash: 10 },
  { id: 'c25', name: '$25 cashable', cost: 2000, cash: 25 }
];
const PROMO_CODES = { BONUS50: 50, LOADED100: 100 };

const yesterdayKey = () => { const d = new Date(Date.now() - 864e5); return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }); };
const countTx = (kind, status = 'done') => S.user.tx.filter(t => t.kind === kind && t.status === status).length;
const QUESTS = [
  { id: 'deposit1', name: 'Make your first deposit', desc: 'Top up your wallet for the first time.', pts: 200, goal: 1, now: () => countTx('Deposits') },
  { id: 'game1', name: 'Get your first game', desc: 'Unlock any game account and start playing.', pts: 100, goal: 1, now: () => unlockedCount() },
  { id: 'streak3', name: 'Play 3 days in a row', desc: 'Keep a 3-day check-in streak going.', pts: 150, goal: 3, now: () => S.user.checkin.streak },
  { id: 'deposit5', name: 'Deposit 5 times', desc: 'Make 5 successful deposits.', pts: 300, goal: 5, now: () => countTx('Deposits') },
  { id: 'games3', name: 'Unlock 3 games', desc: 'Have three game accounts ready to play.', pts: 150, goal: 3, now: () => unlockedCount() },
  { id: 'secure', name: 'Turn on two-step login', desc: 'Protect your wallet with a login code.', pts: 50, goal: 1, now: () => S.user.twofa ? 1 : 0 },
  { id: 'profile', name: 'Complete your profile', desc: 'Pick a photo so we can serve you better.', pts: 50, goal: 1, now: () => S.user.avatar ? 1 : 0 },
  { id: 'refer', name: 'Refer a friend', desc: 'Invite a friend who makes their first deposit.', pts: 250, goal: 1, now: () => 0 }
];

function addPts(label, amt) {
  S.user.points += amt;
  if (amt > 0) S.user.lifetime += amt;
  S.user.pts.unshift({ label, amt, when: now() });
}

function syncQuests() {
  if (!S.user) return;
  const got = [];
  QUESTS.forEach(q => {
    if (!S.user.claimed.includes(q.id) && Math.min(q.now(), q.goal) >= q.goal) {
      S.user.claimed.push(q.id);
      addPts(q.name, q.pts);
      got.push(`+${q.pts} pts: ${q.name}`);
    }
  });
  if (got.length) { store.set('pp_user', S.user); store.set('pp_account', S.user); setTimeout(() => toast(got.join(' · ')), 300); }
}

function levelInfo() {
  const lt = S.user.lifetime;
  let cur = null, next = LEVELS[0];
  LEVELS.forEach((l, i) => { if (lt >= l[1]) { cur = l; next = LEVELS[i + 1] || null; } });
  return { cur, next, lt };
}

function checkinState() {
  const c = S.user.checkin, today = todayKey();
  const done = c.last === today;
  const cont = c.last === yesterdayKey();
  const streakNow = done ? c.streak : cont ? c.streak : 0;
  const nextStreak = done ? c.streak : (cont ? c.streak + 1 : 1);
  const pos = (nextStreak - 1) % 7;
  return { done, streakNow, nextStreak, pos, reward: CHECKIN[pos] };
}

const canCheckin = () => S.user && !checkinState().done;

function rwToday() {
  const st = checkinState();
  const days = CHECKIN.map((v, i) => {
    const collected = i < st.pos || (st.done && i === st.pos);
    const isToday = i === st.pos;
    return `<div class="ck-day ${isToday ? 'today' : ''} ${collected ? 'got' : ''}"><small>${isToday ? 'TODAY' : `DAY ${i + 1}`}</small><b>${collected ? I.check : v}</b></div>`;
  }).join('');
  return `<section class="ck">
      <div class="ck-h"><h3>DAILY CHECK-IN</h3><span class="streak">${st.streakNow ? `<i>&#128293;</i>${st.streakNow}-day streak` : 'Start a streak today'}</span></div>
      <div class="ck-days">${days}</div>
      <div class="ck-cta">${st.done
        ? `<button class="btn btn-ghost btn-lg" disabled>Collected. Come back tomorrow</button>`
        : `<button class="btn btn-accent btn-lg" data-act="checkin">Collect +${st.reward} pts</button>`}</div>
    </section>
    <section class="panel-card">
      <h3 class="rw-h">QUESTS</h3>
      <div class="quests">${QUESTS.map(q => {
        const n = Math.min(q.now(), q.goal), done = S.user.claimed.includes(q.id);
        return `<div class="quest">
          <div class="q-top"><div><b>${q.name}</b><p>${q.desc}</p></div><span class="q-pts">+${q.pts} pts</span></div>
          <div class="q-bar"><div class="bar-track"><i style="width:${done ? 100 : (n / q.goal) * 100}%" class="${done ? 'done' : ''}"></i></div>
            ${done ? `<span class="claimed">${I.check}Claimed</span>` : `<span class="q-n">${n} / ${q.goal}</span>`}</div>
        </div>`;
      }).join('')}</div>
    </section>`;
}

function rwPromos() {
  return `<section class="promo-box">
      <h3 class="rw-h">GOT A PROMO CODE?</h3>
      <p>Codes from emails, posts or your host unlock extra offers.</p>
      <form class="promo-form" data-form="promo"><input class="field" name="code" placeholder="ENTER A CODE" autocomplete="off" required><button class="btn btn-accent" type="submit">Unlock</button></form>
      <p class="note">Demo codes: BONUS50, LOADED100</p>
    </section>
    <section class="panel-card">
      <h3 class="rw-h">OFFERS FOR YOU</h3>
      <div class="offers">
        <div class="offer"><span class="offer-ico">${I.bolt}</span><div><b>Daily 1st load bonus</b><p class="o-amt">Up to +15% credits &middot; first load each day</p><p>Milky Way, Fire Kirin and Juwa give +10%, Orion Stars +15%.</p></div><a class="btn btn-outline btn-sm" href="#/games">Load a game</a></div>
        <div class="offer"><span class="offer-ico">${I.plus}</span><div><b>Points on every load</b><p class="o-amt">1 pt for every $1 you load</p><p>Spend them in the Shop for cashable money.</p></div><button class="btn btn-outline btn-sm" data-rw="shop">Open shop</button></div>
        <div class="offer"><span class="offer-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M14.5 15.2c.8-.5 1.6-.7 2.5-.7 2.1 0 3.6 1.2 4 3.5"/></svg></span><div><b>Refer a friend</b><p class="o-amt">250 pts &middot; when a friend you invited deposits</p><p>You earn points when your friend makes a first deposit.</p></div><button class="btn btn-outline btn-sm" data-rw="you">Get my code</button></div>
      </div>
    </section>`;
}

function rwCompete() {
  const names = ['luckyrae', 'reelking', 'goldie9', 'bigfish', 'tina.b', 'nate_x', 'kayla22', 'dex808', 'mona_v'];
  const base = [4820, 4210, 3650, 3100, 2480, 1920, 1400, 980, 610];
  const me = { n: S.user.username, v: S.user.lifetime, me: true };
  const rows = names.map((n, i) => ({ n, v: base[i] })).concat(me).sort((a, b) => b.v - a.v);
  const prize = ['1,000 pts', '500 pts', '250 pts'];
  return `<section class="panel-card">
      <div class="rw-row"><h3 class="rw-h">WEEKLY LEADERBOARD</h3><span class="pill">RESETS MONDAY</span></div>
      <p class="card-sub">Earn points from check-ins, quests and loads. Top 3 win bonus points.</p>
      <div class="lb">${rows.map((x, i) => `<div class="lb-row ${x.me ? 'me' : ''} ${i < 3 ? 'top' : ''}">
        <span class="lb-n">#${i + 1}</span><span class="lb-u">${esc(x.n)}${x.me ? ' <em>you</em>' : ''}</span>${i < 3 ? `<span class="lb-prize">${prize[i]}</span>` : '<span></span>'}<b>${x.v.toLocaleString('en-US')} pts</b></div>`).join('')}</div>
    </section>`;
}

function rwShop() {
  return `<section class="panel-card">
      <h3 class="rw-h">SHOP</h3>
      <p class="card-sub">Swap points for cashable money, then move it to your wallet.</p>
      <div class="shop">${SHOP.map(it => `<div class="shop-item"><b>${it.name}</b><span>${it.cost.toLocaleString('en-US')} pts</span>
        <button class="btn ${S.user.points >= it.cost ? 'btn-accent' : 'btn-ghost'} btn-sm" data-act="buy-item" data-item="${it.id}" ${S.user.points >= it.cost ? '' : 'disabled'}>${S.user.points >= it.cost ? 'Get it' : `Need ${(it.cost - S.user.points).toLocaleString('en-US')} more`}</button></div>`).join('')}</div>
    </section>`;
}

function rwYou() {
  const lv = levelInfo();
  const link = `https://loaded777.com/r/${S.user.refCode}`;
  return `<section class="panel-card">
      <h3 class="rw-h">INVITE FRIENDS</h3>
      <p>Earn <b>+250 points</b> when a friend signs up with your code and makes their first deposit.</p>
      <div class="invite"><div class="field code-box">${S.user.refCode}</div>
        <button class="btn btn-outline" data-copyval="${link}" data-what="Invite link">${I.copy}Copy link</button>
        <button class="btn btn-accent" data-act="share" data-link="${link}">Share</button></div>
    </section>
    <section class="panel-card">
      <h3 class="rw-h">YOUR LEVEL</h3>
      <div class="lv"><b>${lv.cur ? lv.cur[0] : 'No level yet'}</b><span>${lv.next ? `${(lv.next[1] - lv.lt).toLocaleString('en-US')} pts to ${lv.next[0]}` : 'Top level reached'}</span></div>
      <div class="bar-track lv-bar"><i style="width:${lv.next ? Math.min(100, (lv.lt / lv.next[1]) * 100) : 100}%"></i></div>
      <div class="lv-steps">${LEVELS.map(l => `<span class="${lv.lt >= l[1] ? 'on' : ''}">${l[0]}<small>${l[1].toLocaleString('en-US')}</small></span>`).join('')}</div>
    </section>
    <section class="panel-card">
      <h3 class="rw-h">PROFILE PHOTO</h3>
      <p class="card-sub">Pick one to complete your profile (+50 pts).</p>
      <div class="avatars">${AVATARS.map(c => `<button class="av ${S.user.avatar === c ? 'on' : ''}" style="background:${c}" data-act="avatar" data-c="${c}" aria-label="Pick colour">${esc((S.user.first[0] || 'P').toUpperCase())}</button>`).join('')}</div>
    </section>
    <section class="panel-card">
      <h3 class="rw-h">HISTORY</h3>
      ${S.user.pts.length ? `<div class="hist">${S.user.pts.map(h => `<div class="hist-row"><div><b>${esc(h.label)}</b><small>${h.when}</small></div><div class="hist-amt"><b class="${h.amt >= 0 ? 'pos' : 'neg'}">${h.amt >= 0 ? '+' : ''}${h.amt.toLocaleString('en-US')} pts</b><span class="credited">${h.amt >= 0 ? 'Credited' : 'Spent'}</span></div></div>`).join('')}</div>` : '<p class="card-sub">No points yet. Collect your daily check-in to start.</p>'}
    </section>`;
}

function viewRewards() {
  if (!S.user) return needLogin('Rewards');
  syncQuests();
  const lv = levelInfo();
  const tabs = [['today', 'Today'], ['promos', 'Promos'], ['compete', 'Compete'], ['shop', 'Shop'], ['you', 'You']];
  const body = { today: rwToday, promos: rwPromos, compete: rwCompete, shop: rwShop, you: rwYou }[S.rw]();
  return `<div class="page rewards">
    ${crumb(['Rewards'])}
    <section class="pts-card">
      <div class="pts-top"><div><small>YOUR POINTS</small><b class="pts-num">${S.user.points.toLocaleString('en-US')}</b></div><span class="pts-lv">${lv.cur ? `${lv.cur[0]} level` : 'No level yet'}</span></div>
      <div class="pts-bot"><span>Cashable <b>${usd(S.user.cashable)}</b></span>${S.user.cashable > 0 ? `<button class="btn btn-accent btn-sm" data-act="cash-move">Move to wallet</button>` : ''}</div>
    </section>
    <nav class="rw-tabs">${tabs.map(([k, t]) => `<button class="${S.rw === k ? 'on' : ''}" data-rw="${k}">${t}${k === 'today' && canCheckin() && S.rw !== 'today' ? '<i class="rw-dot"></i>' : ''}</button>`).join('')}</nav>
    ${body}
  </div>`;
}

function needLogin(title) {
  return `<div class="page">${crumb([title])}
    <div class="card gate"><h2>Log in to see this page</h2><p class="card-sub">Don't have an account yet? Sign up with your email. It takes about a minute.</p>
      <div class="gate-acts"><button class="btn btn-accent" data-act="signup">Sign up</button><button class="btn btn-outline" data-act="login">Log in</button></div></div>
  </div>`;
}

/* ---------- menu + chat ---------- */

const LOGO = () => logoInner();

function menuHtml() {
  const links = [['#/', 'Home'], ['#/games', 'Games'], ['#/rewards', 'Rewards'], ['#/balance', 'Balance'], ['#/activity', 'Activity'], ['#/account', 'My account']];
  return `<div class="drawer-h"><a class="logo" href="#/">${LOGO()}</a><button class="icon-btn" data-close-menu aria-label="Close menu">${I.x}</button></div>
    ${S.user ? `<div class="drawer-user"><span class="avatar" ${S.user.avatar ? `style="background:${S.user.avatar}"` : ''}>${esc((S.user.first[0] || 'P').toUpperCase())}</span><div><b>${esc(S.user.first)}</b><small>Wallet ${usd(S.user.wallet)}</small></div></div>` : ''}
    <nav class="drawer-nav">${links.map(([h, t]) => `<a href="${h}">${t}${I.chev}</a>`).join('')}
      <a href="#" data-act="foot-doc" data-doc="How it works">How it works${I.chev}</a>
      <a href="#" data-act="chat">Help &amp; chat${I.chev}</a>
      <a href="#" data-act="choose-site">Switch site${I.chev}</a></nav>
    <div class="theme-pick" data-theme-pick>${themePick()}</div>
    <div class="drawer-foot">${S.user
      ? `<button class="btn btn-ghost btn-block" data-act="logout">Sign out</button>`
      : `<button class="btn btn-accent btn-block" data-act="signup">Sign up</button><button class="btn btn-ghost btn-block" data-act="login">Log in</button>`}</div>`;
}

function chatHtml() {
  return `<div class="chat-h"><button class="icon-btn" data-act="chat-close" aria-label="Close chat">${I.x}</button><span class="chat-av">L</span><b>${BRAND()} support</b></div>
    <div class="chat-body" id="chatBody">
      ${S.chat.map(m => `<div class="msg ${m.me ? 'me' : ''}">${esc(m.t)}</div>`).join('')}
      ${S.chat.length === 1 ? `<form class="chat-reason" data-form="reason"><label>Contact reason</label>
        <select class="field" name="r"><option>Account / login issues</option><option>Deposit not showing</option><option>Redeem or withdrawal</option><option>Game account / credits</option><option>Something else</option></select>
        <button class="btn btn-accent btn-sm" type="submit">Send</button></form>` : ''}
    </div>
    <form class="chat-in" data-form="chat"><input class="field" name="m" placeholder="Type a message" autocomplete="off" required><button class="btn btn-accent btn-sm" type="submit">Send</button></form>`;
}

const DOCS = () => ({
  'How it works': `<ol class="doc-steps">
      <li><b>Create your ${BRAND()} account.</b> Email plus a 6-digit code. This login is for the site: your wallet, deposits and withdrawals.</li>
      <li><b>Deposit to your wallet.</b> Pick a crypto, send at least $${MIN_DEPOSIT} to the address we show you. It appears once the network confirms it.</li>
      <li><b>Unlock a game account.</b> Each game (Milky Way, Fire Kirin and the rest) has its own app and its own login. We create it for you and show the username and password.</li>
      <li><b>Load credits.</b> Move money from your wallet into that game. Credits stay in the game you loaded them into.</li>
      <li><b>Play</b> in the game's web version or app, using that game's login.</li>
      <li><b>Redeem, then withdraw.</b> Redeem credits from the game back to your wallet, then withdraw from your wallet to your crypto address.</li>
    </ol>`,
  FAQ: `<div class="faq">
      <details open><summary>Is my ${BRAND()} login the same as my game logins?</summary><p>No. ${BRAND()} is for your wallet. Each game has its own username and password, shown under My account.</p></details>
      <details><summary>Why are my credits split between games?</summary><p>Each game runs its own balance. Redeem from one game to your wallet, then load another.</p></details>
      <details><summary>How long do withdrawals take?</summary><p>You can see each one under Activity, In progress, until it is sent.</p></details>
      <details><summary>What is the Daily 1st bonus?</summary><p>Games tagged Daily 1st add bonus credits to your first load of the day in that game.</p></details>
      <details><summary>I already play one of these games. Can I use my account?</summary><p>Yes. Choose "I have an Account" when you unlock the game and enter your existing login.</p></details>
      <details><summary>Can I limit my spending?</summary><p>Yes. Set a daily deposit limit, take a break, or self-exclude under My account.</p></details>
    </div>`
});

/* ---------- theme ---------- */

const THEMES = [['navy', 'Navy', '#0f1428', '#0b0f20'], ['plum', 'Plum', '#1d1022', '#170c1b'], ['wine', 'Wine', '#210d16', '#1a0911'], ['charcoal', 'Charcoal', '#17181c', '#141518']];
const curTheme = () => document.documentElement.dataset.theme || 'navy';
const themePick = () => `<span>Colour</span>${THEMES.map(([k, n, bg]) => `<button class="${curTheme() === k ? 'on' : ''}" style="background:${bg}" data-theme-set="${k}" title="${n}" aria-label="${n} theme"></button>`).join('')}`;
function setTheme(k) {
  document.documentElement.dataset.theme = k;
  try { localStorage.setItem('pp_theme', k); } catch (e) {}
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.content = THEMES.find(t => t[0] === k)[3];
  document.querySelectorAll('[data-theme-pick]').forEach(el => { el.innerHTML = themePick(); });
}

/* ---------- blog + videos ---------- */

const POSTS = [
  { id: 'load', cat: 'Guide', img: 'assets/games/jade-fortune.jpg', date: 'Nov 19, 2026', read: '3 min', title: 'How to load credits into a game',
    excerpt: 'Move money from your wallet into any game account in a few taps.',
    body: ['Every game has its own balance. Your wallet is where deposits land; credits are what you play with inside a game.', 'Open Games, tap Load on the game you want, pick an amount and confirm. The credits show on that game straight away.', 'Tip: the first load of the day on games tagged Daily 1st adds bonus credits on top.'] },
  { id: 'daily', cat: 'Promos', img: 'assets/games/lucky-weekends.jpg', date: 'Nov 17, 2026', read: '2 min', title: 'The Daily 1st bonus, explained',
    excerpt: 'Get extra credits on your first load of the day in selected games.',
    body: ['Games with the Daily 1st tag add a percentage on top of your first load each day.', 'Milky Way, Fire Kirin and Juwa give +10%. Orion Stars gives +15%.', 'The tag greys out once you have used it for the day and resets the next day.'] },
  { id: 'fish', cat: 'Tips', img: 'assets/games/ocean-king.jpg', date: 'Nov 14, 2026', read: '4 min', title: '5 fish table tips for beginners',
    excerpt: 'Pick your targets, pace your shots and know when to switch tables.',
    body: ['Start on a low bet to learn how each fish moves before raising it.', 'Big targets pay more but take more shots. Mix small, steady targets in between.', 'Set a budget before you start and use the deposit limit under My account to stick to it.'] },
  { id: 'redeem', cat: 'Guide', img: 'assets/games/neon-777.jpg', date: 'Nov 10, 2026', read: '3 min', title: 'How redeeming and withdrawing work',
    excerpt: 'Bring credits back to your wallet, then send them to your crypto address.',
    body: ['Redeem first: open Balance, choose Redeem, pick the game and the amount. It lands in your wallet once processed.', 'Then withdraw: choose Withdraw, pick a crypto, enter your address and the amount.', 'You can follow every step under Activity, In progress.'] }
];
const VIDEOS = [
  { id: 'start', img: 'assets/games/shooting-star.jpg', len: '1:02', title: 'Getting started in 60 seconds', sub: 'Sign up, deposit, unlock a game' },
  { id: 'jade', img: 'assets/games/jade-fortune.jpg', len: '4:18', title: 'Jade Fortune gameplay', sub: 'Fire Kirin' },
  { id: 'ocean', img: 'assets/games/ocean-king.jpg', len: '5:40', title: 'Ocean King boss hunt', sub: 'Milky Way' },
  { id: 'redeem', img: 'assets/games/super-double-up.jpg', len: '2:05', title: 'How to redeem to your wallet', sub: 'Step by step' }
];

function blogVideoSection() {
  return `<section class="bv">
      <div class="bv-h"><h2>From the blog</h2><a href="#" data-act="foot-doc" data-doc="How it works">How it works ${I.chev}</a></div>
      <div class="bv-posts">${POSTS.map(p => `<article class="post" data-post="${p.id}" tabindex="0">
        <div class="post-img"><img src="${p.img}" alt="" loading="lazy"><span class="post-cat">${p.cat}</span></div>
        <div class="post-body"><small>${p.date} &middot; ${p.read} read</small><h3>${p.title}</h3><p>${p.excerpt}</p><span class="post-more">Read more ${I.chev}</span></div>
      </article>`).join('')}</div>
    </section>
    <section class="bv">
      <div class="bv-h"><h2>Videos</h2></div>
      <div class="bv-vids">${VIDEOS.map(v => `<button class="vid" data-video="${v.id}">
        <div class="vid-img"><img src="${v.img}" alt="" loading="lazy"><span class="vid-play">${I.play}</span><span class="vid-len">${v.len}</span></div>
        <b>${v.title}</b><small>${v.sub}</small>
      </button>`).join('')}</div>
    </section>`;
}

function postModal(id) {
  const p = POSTS.find(x => x.id === id);
  openModal(`<div class="art-img"><img src="${p.img}" alt=""></div>
    <small class="art-meta">${p.cat} &middot; ${p.date} &middot; ${p.read} read</small>
    <h2>${p.title}</h2>${p.body.map(t => `<p class="art-p">${t}</p>`).join('')}
    <button class="btn btn-ghost btn-block" data-close style="margin-top:12px">Back</button>`);
}

function videoModal(id) {
  const v = VIDEOS.find(x => x.id === id);
  openModal(`<div class="launch-stage"><div class="launch-blur" style="background-image:url(${v.img})"></div>
      <div class="launch-mid"><span class="vid-play big">${I.play}</span><h3>${v.title}</h3><p>${v.sub} &middot; ${v.len}</p><p class="note">The video player goes here once the clip is uploaded.</p></div></div>
    <div class="launch-foot"><span>${BRAND()} videos</span><button class="btn btn-ghost btn-sm" data-close>Close</button></div>`, true);
}

/* ---------- Lucky Lounge (site b) ---------- */

const B_SLIDES = [
  { g: 'milkyway--shooting-star', t: 'Shooting Star', s: 'Rubies, cherries and a Grand jackpot. New on Milky Way.' },
  { g: 'firekirin--jade-fortune', t: 'Jade Fortune', s: 'The jade dragon pays up to 2,000x on Fire Kirin.' },
  { g: 'milkyway--ocean-king', t: 'Ocean King', s: 'Hunt the great white for the boss bonus.' }
];
S.bslide = 0;

const navIco = {
  home: I.home,
  games: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>',
  rewards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="9" width="18" height="12" rx="2"/><path d="M2 9h20M12 9v12M12 9c-2-4-6-4-6-1.5S10 9 12 9c2 0 6-1 6-1.5S14 5 12 9Z"/></svg>',
  balance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="5" width="18" height="15" rx="2.5"/><path d="M15 10h6v5h-6a2.5 2.5 0 0 1 0-5Z"/></svg>',
  activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="m6 15 4-4 3 3 5-6" stroke-linecap="round"/></svg>',
  account: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 4-6 8-6s7.2 2 8 6"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4Z"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h11l-3-3M17 17H6l3 3"/></svg>'
};

function sideHtml(name) {
  const items = [['home', '#/', 'Lobby'], ['games', '#/games', 'My Games'], ['rewards', '#/rewards', 'Rewards'], ['balance', '#/balance', 'Wallet'], ['activity', '#/activity', 'Activity'], ['account', '#/account', 'Account']];
  return `<a class="logo" href="#/">${logoInner()}</a>
    <nav class="side-nav">${items.map(([k, h, t]) => `<a href="${h}" class="${name === k ? 'on' : ''}">${navIco[k]}<span>${t}</span>${k === 'rewards' && canCheckin() ? '<i class="side-dot"></i>' : ''}</a>`).join('')}
      <a href="#" data-act="chat">${navIco.chat}<span>Help &amp; chat</span></a>
      <a href="#" data-act="choose-site">${navIco.swap}<span>Switch site</span></a></nav>
    <div class="side-foot">${S.user
      ? `<a class="side-user" href="#/account"><span class="avatar" ${S.user.avatar ? `style="background:${S.user.avatar}"` : ''}>${esc((S.user.first[0] || 'L').toUpperCase())}</span><span><b>${esc(S.user.first)}</b><small>${usd(S.user.wallet)} wallet</small></span></a>`
      : `<button class="btn btn-accent btn-block" data-act="signup">Join now</button><button class="btn btn-ghost btn-block" data-act="login">Log in</button>`}</div>`;
}

function platCardB(p) {
  const a = acct(p.id);
  return `<div class="b-plat">
    <a class="b-plat-top" href="#/platform/${p.id}">${coin(p, 'lg')}<b>${p.name}</b>${tags(p)}<small>${p.games} games</small></a>
    ${a
      ? `<div class="b-plat-cr"><span>Credits</span><b>${usd(a.credits)}</b></div>
         <div class="b-plat-acts"><button class="btn btn-ghost btn-sm" data-act="load" data-plat="${p.id}">Load</button><button class="btn btn-accent btn-sm" data-act="play" data-plat="${p.id}">Play</button><button class="icon-btn" data-act="gcreds" data-plat="${p.id}" aria-label="Login">${I.key}</button></div>`
      : `<div class="b-plat-acts"><button class="btn btn-accent btn-sm" data-act="unlock" data-plat="${p.id}">Unlock</button><button class="icon-btn" data-act="download" data-plat="${p.id}" aria-label="Download">${I.dl}</button></div>`}
  </div>`;
}

function walletBoxB() {
  if (!S.user) return `<aside class="b-wallet join">
      <small>NEW HERE?</small><h2>Join ${BRAND()}</h2>
      <p>One wallet for Milky Way, Fire Kirin, Orion Stars and more.</p>
      <form class="form-row" data-form="quick"><input class="field" type="email" name="email" placeholder="Email address" required autocomplete="email"><button class="btn btn-accent btn-block" type="submit">Create account</button></form>
      <p class="hl-note">Have an account? <a href="#" data-act="login">Log in</a></p>
    </aside>`;
  const st = checkinState();
  return `<aside class="b-wallet">
      <small>MY WALLET</small><b class="b-bal">${usd(S.user.wallet)}</b>
      <span class="b-sub">${usd(creditsTotal())} in ${unlockedCount()} game${unlockedCount() === 1 ? '' : 's'}</span>
      <div class="b-wal-acts"><a class="btn btn-accent" href="#/balance" data-bal-go="deposit">Deposit</a><a class="btn btn-ghost" href="#/balance" data-bal-go="withdraw">Withdraw</a></div>
      <div class="b-ck"><div><b>Daily check-in</b><small>${st.streakNow ? `${st.streakNow}-day streak` : 'Start a streak'}</small></div>
        ${st.done ? '<span class="b-ck-done">' + I.check + 'Done</span>' : `<button class="btn btn-accent btn-sm" data-act="checkin">+${st.reward} pts</button>`}</div>
      <a class="b-pts" href="#/rewards"><span>Points</span><b>${S.user.points.toLocaleString('en-US')}</b>${I.chev}</a>
    </aside>`;
}

function viewHomeB() {
  const mine = PLATFORMS.filter(p => acct(p.id));
  return `<div class="page b-home">
    <div class="b-top">
      <section class="b-hero">
        ${B_SLIDES.map((x, i) => { const g = game(x.g), p = plat(g.p); return `<div class="b-slide ${i === S.bslide ? 'on' : ''}">
          <div class="b-slide-bg" style="background-image:url(${g.img})"></div>
          <div class="b-slide-txt"><span class="b-kicker">${coin(p, 'xs')}${p.name}</span><h1>${x.t}</h1><p>${x.s}</p>
            <button class="btn btn-accent btn-lg" data-game="${g.id}">Play now</button></div>
          <img class="b-slide-art" src="${g.img}" alt="">
        </div>`; }).join('')}
        <div class="b-dots">${B_SLIDES.map((_, i) => `<button class="${i === S.bslide ? 'on' : ''}" data-bslide="${i}" aria-label="Slide ${i + 1}"></button>`).join('')}</div>
      </section>
      ${walletBoxB()}
    </div>
    ${mine.length ? `<section class="b-sec"><div class="b-sec-h"><h2>My Games</h2><a href="#/games">Manage ${I.chev}</a></div><div class="b-plats">${mine.map(platCardB).join('')}</div></section>` : ''}
    <section class="b-sec"><div class="b-sec-h"><h2>${mine.length ? 'More platforms' : 'Platforms'}</h2><a href="#/games">See all ${I.chev}</a></div><div class="b-plats">${PLATFORMS.filter(p => !acct(p.id)).map(platCardB).join('')}</div></section>
    <section class="b-sec"><div class="b-sec-h"><h2>Popular games</h2></div><div class="grid">${GAMES.slice(0, 8).map(tile).join('')}</div></section>
    <section class="b-sec"><div class="b-sec-h"><h2>Recent big wins</h2></div>
      <div class="b-wins">${BIG.map(([pid, u, d, a]) => `<div class="b-win">${coin(plat(pid), 'xs')}<b>${esc(u)}</b><span>${plat(pid).name}</span><small>${d}</small><em>$${a.toLocaleString('en-US')}</em></div>`).join('')}</div></section>
    ${blogVideoSection()}
  </div>`;
}

function viewGamesB() {
  const mine = PLATFORMS.filter(p => acct(p.id)), rest = PLATFORMS.filter(p => !acct(p.id));
  return `<div class="page">
    ${crumb(['My Games'])}
    <p class="lede">${mine.length ? `${mine.length} game account${mine.length === 1 ? '' : 's'} ready. Load credits and play.` : 'Unlock a game to get its own login. It only takes a tap.'}</p>
    ${mine.length ? `<div class="b-sec-h"><h2>Unlocked</h2></div><div class="b-plats">${mine.map(platCardB).join('')}</div>` : ''}
    ${rest.length ? `<div class="b-sec-h"><h2>Available</h2></div><div class="b-plats">${rest.map(platCardB).join('')}</div>` : ''}
  </div>`;
}

function startBSlides() {
  clearInterval(S.bTimer);
  if (S.site !== 'b' || !document.querySelector('.b-hero')) return;
  S.bTimer = setInterval(() => setBSlide((S.bslide + 1) % B_SLIDES.length), 6000);
}
function setBSlide(i) {
  S.bslide = i;
  document.querySelectorAll('.b-slide').forEach((el, k) => el.classList.toggle('on', k === i));
  document.querySelectorAll('.b-dots button').forEach((el, k) => el.classList.toggle('on', k === i));
}

/* ---------- site chooser ---------- */

function showChooser() {
  const ch = document.getElementById('chooser');
  ch.innerHTML = `<div class="ch-box">
      <h2>Choose your site</h2><p>Same games, same wallet. Pick the look you like.</p>
      <div class="ch-opts">
        <button class="ch-opt a" data-site-pick="a">
          <div class="ch-prev"><i class="p-top"></i><i class="p-hero"></i><i class="p-rows"></i><i class="p-rows"></i><i class="p-bar"></i></div>
          <b>Loaded777</b><span>Pink &amp; navy &middot; bottom menu &middot; list layout</span></button>
        <button class="ch-opt b" data-site-pick="b">
          <div class="ch-prev"><i class="p-side"></i><i class="p-hero"></i><i class="p-wallet"></i><i class="p-cards"></i></div>
          <b>Lucky Lounge</b><span>Gold &amp; emerald &middot; side menu &middot; card layout</span></button>
      </div>
    </div>`;
  ch.hidden = false;
  document.body.style.overflow = 'hidden';
}
function pickSite(k) {
  applySite(k);
  document.getElementById('chooser').hidden = true;
  document.body.style.overflow = '';
  render();
}

/* ---------- router ---------- */

function route() {
  const [r, arg] = location.hash.replace(/^#\/?/, '').split('/');
  const name = { '': 'home', games: 'games', platform: 'games', balance: 'balance', activity: 'activity', account: 'account', rewards: 'rewards' }[r] || 'home';
  return { name, r, arg };
}

function render(keepScroll) {
  const { name, r, arg } = route();
  const isB = S.site === 'b';
  const views = { home: isB ? viewHomeB : viewHome, games: r === 'platform' ? () => viewPlatform(arg) : (isB ? viewGamesB : viewGames), balance: viewBalance, activity: viewActivity, account: viewAccount, rewards: viewRewards };
  $('#app').innerHTML = views[name]();
  $('#topRight').innerHTML = topRight();
  document.body.classList.toggle('has-ticker', name === 'home' && !isB);
  const side = $('#side'); if (side) side.innerHTML = isB ? sideHtml(name) : '';
  startBSlides();
  document.querySelectorAll('.tabbar [data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === name));
  if (!keepScroll) window.scrollTo(0, 0);
  document.querySelectorAll('[data-theme-pick]').forEach(el => { el.innerHTML = themePick(); });
  if (S.user && name !== 'rewards') syncQuests();
}

function goHome() { if (location.hash.length > 2) location.hash = '#/'; else render(); }
function refresh() { save(); render(true); }


/* ---------- modal ---------- */

function openModal(html, wide) {
  const box = $('#modalBox');
  box.className = 'modal-box' + (wide ? ' wide' : '');
  box.innerHTML = `<button class="icon-btn modal-x" data-close aria-label="Close">${I.x}</button>` + html;
  $('#modal').hidden = false;
  document.body.style.overflow = 'hidden';
  const f = box.querySelector('input:not([readonly])');
  if (f) setTimeout(() => f.focus(), 50);
}
function closeModal() {
  $('#modal').hidden = true;
  document.body.style.overflow = '';
  clearInterval(S.launchTimer);
}

const pending = {};
function signupStep(step) {
  const bar = n => `<div class="dots-steps">${[1, 2, 3].map(k => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</div>`;
  if (step === 1) {
    openModal(`${bar(1)}<h2>Create your account</h2><p>This is your ${BRAND()} login for your wallet. Game accounts come later, one per game.</p>
      <form class="form-row" data-form="email">
        <input class="field" name="first" placeholder="First name" autocomplete="given-name" required value="${esc(pending.first || '')}">
        <input class="field" type="email" name="email" placeholder="Email address" autocomplete="email" required value="${esc(pending.email || '')}">
        <label class="check"><input type="checkbox" required> I'm 21 or older and agree to the terms and sweepstakes rules.</label>
        <button class="btn btn-accent btn-block" type="submit">Send code</button>
      </form>`);
  } else if (step === 2) {
    openModal(`${bar(2)}<h2>Check your email</h2><p>We sent a 6-digit code to <b>${esc(pending.email)}</b>. Any 6 digits work in this demo.</p>
      <form data-form="code">
        <div class="code-in">${Array.from({ length: 6 }, () => '<input inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]" aria-label="Digit" required>').join('')}</div>
        <button class="btn btn-accent btn-block" type="submit" style="margin-top:16px">Verify and create account</button>
      </form>
      <p class="note">No email? <a href="#" data-act="resend">Send a new code</a> or <a href="#" data-act="signup">change the email</a></p>`);
  } else {
    const u = S.user;
    openModal(`${bar(3)}<div class="done-mark">${I.check}</div><h2>You're in, ${esc(u.first)}</h2>
      <p>Here is your ${BRAND()} login. Next, deposit to your wallet and unlock your first game.</p>
      ${credRow('Username', u.username, u.username)}
      ${credRow('Password', u.password, u.password, true)}
      <div class="warn">We also emailed these to ${esc(u.email)}. You can change both under My account.</div>
      <div class="modal-acts"><a class="btn btn-accent" href="#/balance" data-bal-go="deposit" data-close-after>Deposit</a><a class="btn btn-outline" href="#/games" data-close-after>Unlock a game</a></div>`);
  }
}

function makePw() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const chunk = () => Array.from({ length: 4 }, () => abc[Math.floor(Math.random() * abc.length)]).join('');
  return `${chunk()}-${chunk()}-${Math.floor(10 + Math.random() * 89)}`;
}
function makeCreds(first) {
  const base = first.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8) || 'player';
  return { username: `ld_${base}${Math.floor(1000 + Math.random() * 9000)}`, password: makePw() };
}

function requireLogin() { if (!S.user) { signupStep(1); return false; } return true; }

function unlockModal(pid) {
  if (!requireLogin()) return;
  const p = plat(pid);
  openModal(`<div class="modal-coin">${coin(p, 'md')}</div><h2>Unlock ${p.name}</h2>
    <p>${p.name} runs in its own app with its own login. Choose how you want to sign in.</p>
    <div class="login-choice">
      <button class="opt" data-act="unlock-go" data-plat="${pid}"><span class="mini-ico" style="background:var(--accent);color:var(--on-accent)">${I.plus}</span><span><b>Auto Create Account</b><small>We make a new ${p.name} login for you.</small></span>${I.chev}</button>
      <button class="opt" data-act="unlock-link" data-plat="${pid}"><span class="mini-ico" style="background:#3b82f6">${I.key}</span><span><b>I have an Account</b><small>Link the ${p.name} login you already use.</small></span>${I.chev}</button>
    </div>
    <p class="note">Free. Your ${p.name} credits are kept separate from your other games.</p>`);
}

function gameCredsModal(pid, fresh) {
  const p = plat(pid), a = acct(pid);
  openModal(`<div class="modal-coin">${coin(p, 'md')}</div><h2>${fresh ? `${p.name} account ready` : `${p.name} login`}</h2>
    <p>${a.linked ? `Linked to your existing ${p.name} account.` : `Use this username and password inside the ${p.name} app or web version.`}</p>
    ${credRow('Username', a.username, a.username)}
    ${credRow('Password', a.password, a.password, true)}
    <div class="wallet-line">Credits <b>${usd(a.credits)}</b></div>
    <div class="modal-acts"><button class="btn btn-outline" data-act="load" data-plat="${pid}">Load credits</button><button class="btn btn-accent" data-act="play" data-plat="${pid}">Play ${p.name}</button></div>`);
}

function downloadModal(pid) {
  const p = plat(pid);
  openModal(`<div class="modal-coin">${coin(p, 'md')}</div><h2>Get ${p.name}</h2><p>Play in your browser or install the app. Log in with your ${p.name} username and password.</p>
    <div class="dl-list">
      <button class="opt" data-act="web" data-plat="${pid}"><b>Web version</b><small>Opens in a new tab</small>${I.chev}</button>
      <button class="opt" data-act="store" data-store="Android"><b>Android</b><small>Download the APK</small>${I.dl}</button>
      <button class="opt" data-act="store" data-store="iPhone"><b>iPhone</b><small>Install from the link</small>${I.dl}</button>
    </div>`);
}

function playModal(pid, gameId) {
  if (!requireLogin()) return;
  const p = plat(pid), a = acct(pid);
  if (!a) return unlockModal(pid);
  const g = gameId ? game(gameId) : null;
  openModal(`<div class="modal-coin">${coin(p, 'md')}</div><h2>${g ? esc(g.name) : `Play ${p.name}`}</h2>
    <p>${g ? `${esc(g.name)} is in the ${p.name} app. ` : ''}Open ${p.name} and log in with this account.</p>
    ${credRow('Username', a.username, a.username)}
    ${credRow('Password', a.password, a.password, true)}
    <div class="wallet-line">Credits <b>${usd(a.credits)}</b>${a.credits < 1 ? ` <a href="#" data-act="load" data-plat="${pid}">Load credits first</a>` : ''}</div>
    <div class="modal-acts"><button class="btn btn-accent" data-act="web" data-plat="${pid}" ${g ? `data-game-id="${g.id}"` : ''}>Open web version</button><button class="btn btn-outline" data-act="download" data-plat="${pid}">${I.dl}Get the app</button></div>`);
}

function launch(pid, gameId) {
  const p = plat(pid), a = acct(pid), g = gameId ? game(gameId) : GAMES.find(x => x.p === pid);
  openModal(`<div class="launch-stage"><div class="launch-blur" style="background-image:url(${g.img})"></div>
      <div class="launch-mid"><img class="launch-art" src="${g.img}" alt=""><h3>${p.name}</h3><p id="lmsg">Opening ${p.name}&hellip;</p><div class="bar"><i id="lbar"></i></div></div></div>
    <div class="launch-foot">${coin(p, 'xs')}<span>${p.name}</span><span>as <code>${esc(a.username)}</code></span><span>${usd(a.credits)} credits</span>
      <button class="btn btn-ghost btn-sm" data-close>Back</button></div>`, true);
  let pct = 0;
  S.launchTimer = setInterval(() => {
    pct = Math.min(100, pct + 10);
    const bar = $('#lbar'), msg = $('#lmsg');
    if (!bar) return clearInterval(S.launchTimer);
    bar.style.width = pct + '%';
    if (pct >= 100) { clearInterval(S.launchTimer); msg.textContent = `In the live site this opens the ${p.name} web version in a new tab.`; }
  }, 140);
}

function loadModal(pid) {
  if (!requireLogin()) return;
  const stop = blocked();
  if (stop) return openModal(`<h2>Loading is paused</h2><p>${stop}</p>`);
  const p = plat(pid), a = acct(pid);
  if (!a) return unlockModal(pid);
  openModal(`<div class="modal-coin">${coin(p, 'md')}</div><h2>Load ${p.name}</h2><p>Move money from your wallet into your ${p.name} account.</p>
    <div class="wallet-line">Wallet <b>${usd(S.user.wallet)}</b> &middot; ${p.name} credits <b>${usd(a.credits)}</b></div>
    ${p.daily && !dailyUsed(pid) ? `<div class="bonus-note">${I.bolt}Your first load today gets +${p.daily}% bonus credits.</div>` : ''}
    <form class="form-row" data-form="load"><input type="hidden" name="plat" value="${pid}">
      <div class="quick-amts">${[10, 25, 50, 100].map(v => `<button type="button" class="chip" data-amt="${v}">$${v}</button>`).join('')}</div>
      <input class="field" name="amt" type="number" min="1" step="0.01" placeholder="Amount ($)" required>
      <button class="btn btn-accent btn-block" type="submit">Load credits</button>
    </form>
    ${S.user.wallet < 1 ? `<p class="note">Your wallet is empty. <a href="#/balance" data-bal-go="deposit" data-close-after>Deposit first</a></p>` : ''}`);
}

function redeemModal(pid) {
  const p = plat(pid), a = acct(pid);
  openModal(`<div class="modal-coin">${coin(p, 'md')}</div><h2>Redeem from ${p.name}</h2><p>Credits go back to your ${BRAND()} wallet. You can then withdraw or load another game.</p>
    <div class="wallet-line">${p.name} credits <b>${usd(a.credits)}</b></div>
    <form class="form-row" data-form="redeem"><input type="hidden" name="plat" value="${pid}">
      <input class="field" name="amt" type="number" min="1" step="0.01" max="${a.credits}" value="${a.credits.toFixed(2)}" required>
      <button class="btn btn-accent btn-block" type="submit">Redeem to wallet</button>
    </form>`);
}

function addTx(t) { S.user.tx.unshift({ id: rid(), when: now(), ...t }); }
function settleLater(id, fn, ms = 4000) {
  setTimeout(() => {
    if (!S.user) return;
    const t = S.user.tx.find(x => x.id === id);
    if (!t || t.status !== 'pending') return;
    t.status = 'done';
    fn();
    refresh();
  }, ms);
}

function toast(t) {
  const el = $('#toast');
  el.textContent = t;
  el.classList.add('on');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove('on'), 2400);
}

function setMenu(open) {
  if (open) $('#drawer').innerHTML = menuHtml();
  document.body.classList.toggle('menu-open', open);
}
function setChat(open) {
  if (open) $('#chat').innerHTML = chatHtml();
  document.body.classList.toggle('chat-open', open);
  if (open) { const b = $('#chatBody'); b.scrollTop = b.scrollHeight; }
}

function todayDeposits() {
  const d = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  return S.user.tx.filter(t => t.kind === 'Deposits' && t.when.startsWith(d)).reduce((s, t) => s + t.amt, 0);
}

/* ---------- events ---------- */

document.addEventListener('click', e => {
  const t = e.target.closest('[data-game],[data-act],[data-copyval],[data-cat],[data-close],[data-close-menu],[data-bal],[data-tab],[data-chip],[data-menu],[data-method],[data-amt],[data-rw],[data-theme-set],[data-site-pick],[data-bslide],[data-post],[data-video],[data-bal-go],[data-close-after],.drawer-nav a');
  if (!t) return;
  if (t.dataset.balGo) S.bal = t.dataset.balGo;
  if (t.dataset.closeAfter !== undefined) closeModal();
  if (t.dataset.balGo && !t.dataset.act) { if (location.hash === '#/balance') render(true); return; }
  if (t.dataset.closeAfter !== undefined && !t.dataset.act) return;
  if (t.matches('.drawer-nav a') && !t.dataset.act) { setMenu(false); return; }
  if (t.dataset.menu !== undefined) { e.preventDefault(); setChat(false); return setMenu(!document.body.classList.contains('menu-open')); }
  if (t.dataset.closeMenu !== undefined) return setMenu(false);
  if (t.dataset.close !== undefined) return closeModal();
  if (t.dataset.post) { postModal(t.dataset.post); return; }
  if (t.dataset.video) { videoModal(t.dataset.video); return; }
  if (t.dataset.sitePick) { pickSite(t.dataset.sitePick); return; }
  if (t.dataset.bslide) { setBSlide(+t.dataset.bslide); startBSlides(); return; }
  if (t.dataset.themeSet) { setTheme(t.dataset.themeSet); toast(`${THEMES.find(x => x[0] === t.dataset.themeSet)[1]} theme`); return; }
  if (t.dataset.amt) { t.closest('form').amt.value = t.dataset.amt; return; }
  if (t.dataset.game) { const g = game(t.dataset.game); return playModal(g.p, g.id); }
  if (t.dataset.cat) {
    S.cat = t.dataset.cat;
    const grid = $('#gameGrid');
    grid.innerHTML = gameGrid(GAMES.filter(g => g.p === grid.dataset.plat));
    document.querySelectorAll('[data-cat]').forEach(b => b.classList.toggle('on', b.dataset.cat === S.cat));
    return;
  }
  if (t.dataset.bal) { S.bal = t.dataset.bal; return render(true); }
  if (t.dataset.method) { S.method = t.dataset.method; $('#balPanel').innerHTML = balPanel(S.bal); return; }
  if (t.dataset.tab) { S.actTab = t.dataset.tab; return render(true); }
  if (t.dataset.rw) { S.rw = t.dataset.rw; if (location.hash !== '#/rewards') location.hash = '#/rewards'; else render(true); return; }
  if (t.dataset.chip) { S.actChip = t.dataset.chip; return render(true); }
  if (t.dataset.copyval) {
    if (navigator.clipboard) navigator.clipboard.writeText(t.dataset.copyval).catch(() => {});
    return toast(`${t.dataset.what || 'Text'} copied`);
  }
  const a = t.dataset.act;
  if (t.tagName === 'A' && t.getAttribute('href') === '#') e.preventDefault();
  const pid = t.dataset.plat;
  if (a === 'pw') {
    S.showPw = !S.showPw;
    if ($('#modal').hidden) render(true);
    else document.querySelectorAll('#modalBox .cred').forEach(c => { const b = c.querySelector('[data-act="pw"]'); if (b) { const v = c.querySelector('[data-copyval]').dataset.copyval; c.outerHTML = credRow('Password', v, v, true); } });
  }
  if (a === 'signup') { setMenu(false); signupStep(1); }
  if (a === 'resend') toast(`New code sent to ${pending.email}`);
  if (a === 'login') {
    setMenu(false);
    openModal(`<h2>Log in</h2><p>Use your ${BRAND()} username and password.</p>
      <form class="form-row" data-form="login">
        <input class="field" name="u" placeholder="Username or email" autocomplete="username" required>
        <input class="field" type="password" name="p" placeholder="Password" autocomplete="current-password" required>
        <button class="btn btn-accent btn-block" type="submit">Log in</button>
      </form>
      <p class="note">New here? <a href="#" data-act="signup">Create an account</a></p>`);
  }
  if (a === 'logout') { setMenu(false); S.user = null; store.set('pp_user', null); S.showPw = false; goHome(); toast('Signed out'); }
  if (a === 'unlock') unlockModal(pid);
  if (a === 'unlock-go') {
    S.user.accounts[pid] = { username: `${S.user.username.replace(/^(pp|ld)_/, '').slice(0, 10)}_${pid.slice(0, 2)}${Math.floor(100 + Math.random() * 900)}`, password: makePw(), credits: 0 };
    S.showPw = true;
    refresh();
    gameCredsModal(pid, true);
  }
  if (a === 'unlock-link') {
    const p = plat(pid);
    openModal(`<div class="modal-coin">${coin(p, 'md')}</div><h2>Link your ${p.name} account</h2><p>Enter the username and password you use in the ${p.name} app.</p>
      <form class="form-row" data-form="link"><input type="hidden" name="plat" value="${pid}">
        <input class="field" name="u" placeholder="${p.name} username" autocomplete="off" required>
        <input class="field" type="password" name="p" placeholder="${p.name} password" autocomplete="off" required>
        <button class="btn btn-accent btn-block" type="submit">Link account</button>
      </form>
      <p class="note"><a href="#" data-act="unlock" data-plat="${pid}">Back</a> &middot; Don't have one? <a href="#" data-act="unlock-go" data-plat="${pid}">Auto create it</a></p>`);
  }
  if (a === 'gcreds') gameCredsModal(pid);
  if (a === 'download') downloadModal(pid);
  if (a === 'play') playModal(pid);
  if (a === 'web') launch(pid, t.dataset.gameId);
  if (a === 'store') toast(`${t.dataset.store} download link goes here in the live site`);
  if (a === 'load') loadModal(pid);
  if (a === 'redeem') redeemModal(pid);
  if (a === 'checkin') {
    const st = checkinState();
    if (st.done) return;
    S.user.checkin = { last: todayKey(), streak: st.nextStreak };
    addPts(`Daily check-in (day ${st.pos + 1})`, st.reward);
    refresh(); syncQuests(); toast(`+${st.reward} pts collected`);
  }
  if (a === 'buy-item') {
    const it = SHOP.find(x => x.id === t.dataset.item);
    if (S.user.points < it.cost) return;
    addPts(`Shop: ${it.name}`, -it.cost);
    S.user.cashable += it.cash;
    refresh(); toast(`${usd(it.cash)} added to cashable`);
  }
  if (a === 'cash-move') {
    const c = S.user.cashable;
    S.user.wallet += c; S.user.cashable = 0;
    addTx({ kind: 'Bonus', label: 'Rewards cash to wallet', amt: c, status: 'done' });
    refresh(); toast(`${usd(c)} moved to your wallet`);
  }
  if (a === 'avatar') { S.user.avatar = t.dataset.c; refresh(); syncQuests(); render(true); }
  if (a === 'share') {
    const link = t.dataset.link;
    if (navigator.share) navigator.share({ title: BRAND(), text: `Join me on ${BRAND()}`, url: link }).catch(() => {});
    else { if (navigator.clipboard) navigator.clipboard.writeText(link).catch(() => {}); toast('Invite link copied'); }
  }
  if (a === 'bell') toast('No new notifications');
  if (a === 'choose-site') { setMenu(false); showChooser(); return; }
  if (a === 'chat') { closeModal(); setMenu(false); setChat(true); }
  if (a === 'chat-close') setChat(false);
  if (a === 'foot-doc') {
    setMenu(false);
    const body = DOCS()[t.dataset.doc];
    openModal(`<h2>${esc(t.dataset.doc)}</h2>${body || '<p>This page is coming soon. For help now, use live chat.</p>'}<button class="btn ${body ? 'btn-ghost' : 'btn-accent'} btn-block" data-act="chat" style="margin-top:16px">Open live chat</button>`);
  }
  if (a === 'deposit-now') {
    const c = CRYPTO.find(x => x.id === S.method);
    openModal(`<div class="modal-coin">${cryptoIco(c)}</div><h2>Deposit with ${c.name}</h2><p>How much do you want to add to your wallet? Minimum $${MIN_DEPOSIT}.</p>
      <form class="form-row" data-form="deposit">
        <div class="quick-amts">${[25, 50, 100, 250].map(v => `<button type="button" class="chip" data-amt="${v}">$${v}</button>`).join('')}</div>
        <input class="field" name="amt" type="number" min="${MIN_DEPOSIT}" step="1" placeholder="Amount ($)" required>
        <button class="btn btn-accent btn-block" type="submit">Get deposit address</button>
      </form>`);
  }
  if (a === 'sent') {
    const amt = Number(t.dataset.amount), c = CRYPTO.find(x => x.id === S.method);
    const id = rid();
    S.user.tx.unshift({ id, kind: 'Deposits', label: `Deposit (${c.name})`, amt, when: now(), status: 'pending' });
    settleLater(id, () => { S.user.wallet += amt; toast(`Deposit confirmed: ${usd(amt)} added to your wallet`); });
    closeModal(); refresh(); toast('Waiting for network confirmation (demo: about 4 seconds)');
  }
  if (a === 'withdraw-now') {
    const c = CRYPTO.find(x => x.id === S.method);
    openModal(`<div class="modal-coin">${cryptoIco(c)}</div><h2>Withdraw to ${c.name}</h2><p>From your wallet (${usd(S.user.wallet)}). Minimum $${MIN_WITHDRAW}.</p>
      <form class="form-row" data-form="withdraw">
        <input class="field" name="amt" type="number" min="${MIN_WITHDRAW}" step="0.01" max="${S.user.wallet}" placeholder="Amount ($)" required>
        <input class="field" name="addr" placeholder="Your ${c.code} address" required>
        <button class="btn btn-accent btn-block" type="submit">Request withdrawal</button>
      </form>
      ${S.user.wallet < MIN_WITHDRAW ? `<p class="note">Your wallet has less than $${MIN_WITHDRAW}. Redeem credits from a game first.</p>` : ''}`);
  }
  if (a === 'twofa') { S.user.twofa = !S.user.twofa; refresh(); toast(`Two-step login ${S.user.twofa ? 'on' : 'off'}`); }
  if (a === 'cool') { S.user.coolUntil = Date.now() + Number(t.dataset.h) * 3600e3; refresh(); toast('Break started. Deposits and loading are paused.'); }
  if (a === 'exclude') openModal(`<h2>Self-exclude?</h2><p>This closes deposits and loading on your account. You can still redeem and withdraw what you have. To reopen, you will need to contact support.</p><button class="btn btn-outline btn-block danger" data-act="exclude-go">Yes, self-exclude me</button>`);
  if (a === 'exclude-go') { S.user.excluded = true; closeModal(); refresh(); toast('Self-exclusion is on'); }
});

document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]');
  if (!f) return;
  e.preventDefault();
  const d = Object.fromEntries(new FormData(f));
  const k = f.dataset.form;
  const amt = Number(d.amt);
  if (k === 'quick') { pending.email = d.email; signupStep(1); }
  if (k === 'email') { pending.first = d.first.trim(); pending.email = d.email.trim(); signupStep(2); }
  if (k === 'code') {
    S.user = normUser({ first: pending.first, email: pending.email, since: new Date().toISOString().slice(0, 10), ...makeCreds(pending.first) });
    S.showPw = true;
    save();
    location.hash = '#/';
    render();
    signupStep(3);
  }
  if (k === 'login') {
    const saved = normUser(store.get('pp_account', null));
    const name = d.u.trim();
    const match = saved && (name.toLowerCase() === saved.username.toLowerCase() || name.toLowerCase() === saved.email.toLowerCase());
    S.user = match ? saved : demoUser(name, d.p);
    save();
    closeModal(); goHome(); toast(`Welcome back, ${S.user.first}`);
  }
  if (k === 'pw') {
    if (d.cur !== S.user.password) { toast('Current password is wrong'); return; }
    S.user.password = d.next; f.reset(); refresh(); toast('Password updated');
  }
  if (k === 'user') {
    if (d.cur !== S.user.password) { toast('Current password is wrong'); return; }
    const next = d.next.trim();
    if (next === S.user.username) { toast('That is already your username'); return; }
    S.user.username = next; refresh(); toast(`Username changed to ${next}`);
  }
  if (k === 'deposit') {
    const stop = blocked();
    if (stop) { toast(stop); return; }
    if (S.user.limit && todayDeposits() + amt > S.user.limit) { toast(`That would pass your $${S.user.limit} daily limit`); return; }
    const c = CRYPTO.find(x => x.id === S.method);
    const addr = c.pre + Array.from({ length: 30 }, () => 'abcdefghjkmnpqrstuvwxyz023456789'[Math.floor(Math.random() * 32)]).join('');
    openModal(`<div class="modal-coin">${cryptoIco(c)}</div><h2>Send ${usd(amt)} in ${c.code}</h2><p>Send to this address. Only send ${c.code} on the ${c.name} network.</p>
      <div class="addr"><div class="qr" aria-hidden="true">${Array.from({ length: 49 }, (_, i) => `<i class="${(i * 7 + addr.charCodeAt(i % addr.length)) % 3 ? '' : 'on'}"></i>`).join('')}</div>
        <div class="cred"><label>Deposit address (demo)</label><div class="cred-row"><code>${addr}</code><button class="icon-btn" data-copyval="${addr}" data-what="Address">${I.copy}</button></div></div></div>
      <div class="warn">This address is for this deposit only. Your wallet updates after the network confirms it.</div>
      <button class="btn btn-accent btn-block" data-act="sent" data-amount="${amt}" style="margin-top:16px">I've sent it</button>`);
  }
  if (k === 'withdraw') {
    if (amt > S.user.wallet) { toast('More than your wallet balance'); return; }
    const c = CRYPTO.find(x => x.id === S.method);
    S.user.wallet -= amt;
    addTx({ kind: 'Withdrawals', label: `Withdrawal (${c.name})`, amt: -amt, status: 'pending' });
    closeModal(); refresh(); toast(`Withdrawal of ${usd(amt)} requested. Track it under Activity.`);
  }
  if (k === 'load') {
    const stop = blocked();
    if (stop) { toast(stop); return; }
    if (amt > S.user.wallet) { toast(`Not enough in your wallet (${usd(S.user.wallet)})`); return; }
    S.user.wallet -= amt;
    S.user.accounts[d.plat].credits += amt;
    S.loadPlat = d.plat;
    addTx({ kind: 'Loads', label: 'Loaded credits', p: d.plat, amt: -amt, status: 'done' });
    if (Math.floor(amt) > 0) addPts(`Loaded ${plat(d.plat).name}`, Math.floor(amt));
    const lp = plat(d.plat);
    if (lp.daily && !dailyUsed(d.plat)) {
      const bonus = Math.round(amt * lp.daily) / 100;
      S.user.accounts[d.plat].credits += bonus;
      addTx({ kind: 'Bonus', label: `Daily 1st bonus (+${lp.daily}%)`, p: d.plat, amt: bonus, status: 'done' });
      closeModal(); refresh(); toast(`${usd(amt)} loaded into ${lp.name} + ${usd(bonus)} daily first-load bonus`);
    } else { closeModal(); refresh(); toast(`${usd(amt)} loaded into ${lp.name}`); }
  }
  if (k === 'link') {
    S.user.accounts[d.plat] = { username: d.u.trim(), password: d.p, credits: 0, linked: true };
    S.showPw = false;
    refresh();
    gameCredsModal(d.plat, true);
    toast(`${plat(d.plat).name} account linked`);
  }
  if (k === 'redeem') {
    const a = S.user.accounts[d.plat];
    if (amt > a.credits) { toast('More than your credits'); return; }
    a.credits -= amt;
    const id = rid();
    S.user.tx.unshift({ id, kind: 'Redeems', label: 'Redeemed credits', p: d.plat, amt, when: now(), status: 'pending' });
    settleLater(id, () => { S.user.wallet += amt; toast(`${usd(amt)} from ${plat(d.plat).name} is in your wallet`); });
    closeModal(); refresh(); toast('Redeem requested. It lands in your wallet shortly (demo: 4 seconds).');
  }
  if (k === 'p2p') {
    if (amt > S.user.wallet) { toast('More than your wallet balance'); return; }
    S.user.wallet -= amt;
    addTx({ kind: 'P2P', label: `Sent to ${d.to}`, amt: -amt, status: 'done' });
    f.reset(); refresh(); toast(`Sent ${usd(amt)} to ${d.to}`);
  }
  if (k === 'voucher') {
    if (d.code.trim().toUpperCase() === 'WELCOME5' && !S.user.tx.some(t => t.label === 'Voucher WELCOME5')) {
      S.user.wallet += 5;
      addTx({ kind: 'Vouchers', label: 'Voucher WELCOME5', amt: 5, status: 'done' });
      refresh(); toast('$5.00 added to your wallet');
    } else { f.reset(); toast('That voucher code is not valid'); }
  }
  if (k === 'promo') {
    const code = d.code.trim().toUpperCase();
    if (!PROMO_CODES[code]) { toast('That code is not valid'); return; }
    if (S.user.promos.includes(code)) { toast('You already used that code'); return; }
    S.user.promos.push(code);
    addPts(`Promo code ${code}`, PROMO_CODES[code]);
    refresh(); toast(`+${PROMO_CODES[code]} pts unlocked`);
  }
  if (k === 'limit') { S.user.limit = Number(d.limit); refresh(); toast(S.user.limit ? `Daily deposit limit set to $${S.user.limit}` : 'Daily deposit limit removed'); }
  if (k === 'reason' || k === 'chat') {
    S.chat.push({ me: true, t: k === 'reason' ? d.r : d.m });
    S.chat.push({ t: 'Thanks. An agent will reply here shortly.' });
    setChat(true);
  }
});

document.addEventListener('input', e => {
  if (e.target.matches('[data-search]')) {
    S.q = e.target.value;
    const grid = $('#gameGrid');
    grid.innerHTML = gameGrid(GAMES.filter(g => g.p === grid.dataset.plat));
  }
  if (e.target.closest('.code-in')) {
    const boxes = [...e.target.parentNode.children];
    let i = boxes.indexOf(e.target);
    const digits = e.target.value.replace(/\D/g, '').split('');
    e.target.value = '';
    digits.forEach(dg => { if (boxes[i]) boxes[i++].value = dg; });
    if (digits.length) boxes[Math.min(i, boxes.length - 1)].focus();
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (!$('#modal').hidden) closeModal(); setMenu(false); setChat(false); }
  if (e.key === 'Backspace' && e.target.closest('.code-in') && !e.target.value && e.target.previousElementSibling) e.target.previousElementSibling.focus();
});

window.addEventListener('hashchange', () => { S.cat = 'All'; S.q = ''; closeModal(); setMenu(false); render(); });
applySite('a');
render();
showChooser();
