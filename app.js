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
    wallet: 0, gc: 0, accounts: {}, tx: [], twofa: false, limit: 0, coolUntil: 0, excluded: false,
    points: 0, lifetime: 0, cashable: 0, phone: '', kyc: 'none', music: true, volume: 40, lang: 'English', checkin: { last: '', streak: 0 }, claimed: [], pts: [], avatar: '', refCode: Math.random().toString(36).slice(2, 8).toUpperCase(), promos: [],
    ...u
  };
}

const S = {
  user: normUser(store.get('pp_user', null)),
  cat: 'All',
  q: '',
  showPw: false,
  bal: 'deposit',
  method: null,
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
  a: { name: 'Recharge777', word: 'Recharge<b>777</b>', mark: '<path d="M10 9h12v3.2L15.8 23h-4.3l6.1-10.6H10Z" fill="var(--on-accent)"/>', theme: '#0b0f20', img: 'assets/logos/r777-logo.png' },
  b: { name: 'Gamewallet777', word: 'Gamewallet<b>777</b>', svg: '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="l7g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe7a1"/><stop offset=".45" stop-color="#e3a21a"/><stop offset=".75" stop-color="#ffd25a"/><stop offset="1" stop-color="#b9780c"/></linearGradient><radialGradient id="l7c" cx=".5" cy=".38" r=".65"><stop offset="0" stop-color="#3d1418"/><stop offset="1" stop-color="#120607"/></radialGradient></defs><circle cx="32" cy="32" r="31" fill="url(#l7g)"/><circle cx="32" cy="32" r="25.5" fill="url(#l7c)" stroke="#7a4a08" stroke-width="1.2"/><path d="M20.5 17.5h24v6.2L33.6 46.5h-8.4l10.6-21.2H20.5Z" fill="#e2343f" stroke="#ffd36b" stroke-width="2.2" stroke-linejoin="round"/><path d="M23 20.4h18.5" stroke="#ff9aa0" stroke-width="1.6" stroke-linecap="round" opacity=".75"/></svg>', mark: '<path d="M16 7.5l2.4 5 5.4.6-4 3.7 1.1 5.4L16 19.5l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6Z" fill="var(--on-accent)"/>', theme: '#0c0809' }
};
S.site = null;
const site = () => SITES[S.site || 'a'];
const BRAND = () => site().name;
const logoInner = () => site().img
  ? `<img class="logo-img" src="${site().img}" alt=""><span>${site().word}</span>`
  : site().svg ? `<span class="logo-svg">${site().svg}</span><span>${site().word}</span>`
  : `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="2" width="28" height="28" rx="9" fill="var(--accent)"/>${site().mark}</svg><span>${site().word}</span>`;

function applySite(k) {
  S.site = k;
  document.documentElement.dataset.site = k;
  let saved = null; try { saved = localStorage.getItem('pp_theme_' + k); } catch (e) {}
  setTheme(saved || SITE_THEMES[k][0][0], true);
  document.title = SITES[k].name;
  document.querySelectorAll('header .logo, .foot .logo').forEach(el => { el.innerHTML = logoInner(); el.setAttribute('aria-label', SITES[k].name + ' home'); });
  const c = document.querySelector('.copy'); if (c) c.innerHTML = `&copy; 2026 ${SITES[k].name}. All rights reserved.`;
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
    wallet: 120, gc: 25000,
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
  eyeO: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  lockO: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7"/></svg>',
  bellO: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 16V10a6 6 0 0 1 12 0v6l2 2H4Z"/><path d="M10 20a2 2 0 0 0 4 0" stroke-linecap="round"/></svg>',
  tg: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#2aa3e0"/><path d="m6 11.6 10.7-4.2c.5-.2.9.1.8.8l-1.8 8.6c-.1.6-.5.7-1 .5l-2.8-2-1.3 1.3c-.2.2-.3.3-.6.3l.2-2.9 5.2-4.7c.2-.2 0-.3-.3-.1l-6.4 4-2.8-.9c-.6-.2-.6-.6.1-.9Z" fill="#fff"/></svg>',
  out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 4-6 8-6s7.2 2 8 6"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/></svg>',
  gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 16a8 8 0 1 1 16 0"/><path d="m12 16 4-5"/></svg>',
  wallet: '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="wlg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--accent-hi)"/><stop offset="1" style="stop-color:var(--accent)"/></linearGradient></defs><rect x="6" y="18" width="48" height="36" rx="9" fill="url(#wlg)"/><path d="M12 18 40 8l6 10" fill="none" style="stroke:var(--accent)" stroke-width="3" stroke-linejoin="round"/><rect x="38" y="30" width="20" height="12" rx="6" fill="#fff" opacity=".9"/><circle cx="45" cy="36" r="2.6" style="fill:var(--accent)"/><circle cx="20" cy="12" r="5" fill="#f2b62f"/><circle cx="29" cy="8" r="4" fill="#ffd25a"/></svg>',
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
  return `<div class="row-card clean">
    <a class="row-main" href="#/platform/${p.id}">${coin(p)}<span><b>${p.name}</b><small>${a ? `${scv(a.credits)} credits` : `${p.games} games`}</small></span></a>
    ${a ? `<button class="btn btn-outline btn-row" data-act="gcreds" data-plat="${p.id}">${I.eyeO}View</button>`
        : `<button class="btn btn-outline btn-row" data-act="unlock" data-plat="${p.id}">${I.lockO}Unlock</button>`}
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
  return `${ticker()}<div class="page home">
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
             <p class="hero-sub">Fish games and slots from every platform, all in one place.</p>
             <div class="hero-acts"><a class="btn btn-accent btn-lg" href="#/games">Play now</a></div>`}
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

    ${platBand()}
    ${promoBanner()}

    ${guest ? `<section class="steps3 four">
      <div><span>1</span><b>Create your account</b><p>Email and a 6-digit code. That's your ${BRAND()} login.</p></div>
      <div><span>2</span><b>Deposit to your wallet</b><p>Send crypto. Your wallet shows it once confirmed.</p></div>
      <div><span>3</span><b>Unlock a game, load credits</b><p>Each game gets its own login. Move money from your wallet into it.</p></div>
      <div><span>4</span><b>Play, then redeem</b><p>Redeem credits back to your wallet, then withdraw.</p></div>
    </section>` : ''}

    <section class="winners">
      <div class="win-h"><h2>${I.trophy}Winners</h2><div class="seg"><button class="on" data-wtab="latest">Latest</button><button data-wtab="month">This month</button></div></div>
      <div class="win-pane" data-pane="latest">${BIG.slice(0, 5).map(([pid, u, d, a]) => `<div class="wrow">${coin(plat(pid), 'sm')}<span class="wrow-txt"><b>${esc(u)}</b><small>${plat(pid).name} &middot; ${d}</small></span><em>$${a.toLocaleString('en-US')}</em></div>`).join('')}</div>
      <div class="win-pane" data-pane="month" hidden>${MONTHLY.map(([pid, u, a], i) => `<div class="wrow ${i === 0 ? 'top1' : ''}"><span class="wrank">#${i + 1}</span>${coin(plat(pid), 'sm')}<span class="wrow-txt"><b>${esc(u)}</b><small>${plat(pid).name}</small></span><em>$${a.toLocaleString('en-US')}</em></div>`).join('')}</div>
    </section>
    ${S.user ? '' : reviewsSection()}
  </div>
  `;
}

function platBand() {
  return `<section class="pband">
    <div class="pband-h"><h2>Our platforms</h2><a href="#/games">All games ${I.chev}</a></div>
    <div class="pband-row">${PLATFORMS.map(p => `<a class="pband-item" href="#/platform/${p.id}" style="--c1:${p.c1};--c2:${p.c2}">
      ${coin(p, 'sm')}<b>${p.name}</b><small>${p.games} games</small>${p.daily ? `<em>Daily 1st +${p.daily}%</em>` : ''}
    </a>`).join('')}</div>
  </section>`;
}

function viewGames() {
  const mine = PLATFORMS.filter(p => acct(p.id)), rest = PLATFORMS.filter(p => !acct(p.id));
  return `<div class="page narrow-page">
    ${crumb(['Games'])}
    <p class="lede">Here you'll find your <b>Gaming Accounts</b>. ${mine.length ? 'Tap View to play, load or redeem.' : "Don't have one yet? Unlock it now!"}</p>
    ${mine.length ? `<div class="list-h"><h2>Your Games</h2><span>${mine.length} account${mine.length === 1 ? '' : 's'}</span></div><div class="rows">${mine.map(platRow).join('')}</div>` : ''}
    ${rest.length ? `<div class="list-h"><h2>More Games</h2><span>${rest.length} available</span></div><div class="rows">${rest.map(platRow).join('')}</div>` : ''}
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
  return `<div class="page">
    ${crumb(['Games', '#/games'], [p.name])}
    <div class="plat-top">
      ${coin(p, 'lg')}
      <div class="plat-top-txt"><h1>${p.name}</h1>${tags(p)}<p>${p.blurb}</p>
        <p class="signed">${a ? `Your ${p.name} login: <code>${esc(a.username)}</code> &middot; ${scv(a.credits)} credits` : `You need a ${p.name} account to play.`}</p></div>
      <div class="plat-top-acts">${a
        ? `<button class="btn btn-outline" data-act="load" data-plat="${p.id}">Load credits</button><button class="btn btn-accent" data-act="play" data-plat="${p.id}">Play</button>`
        : `<button class="btn btn-accent" data-act="unlock" data-plat="${p.id}">Unlock Account</button><button class="btn btn-outline" data-act="download" data-plat="${p.id}">${I.dl}Get the app</button>`}</div>
    </div>
    <section class="plat-steps">
      <div class="${a ? 'done' : ''}"><span>${a ? I.check : '1'}</span><b>${a ? 'Account ready' : 'Unlock your account'}</b><p>${a ? `Logged in as ${esc(a.username)}.` : `We create your ${p.name} login, or link the one you have.`}</p></div>
      <div><span>2</span><b>Load credits</b><p>Move money from your wallet into ${p.name}.${p.daily ? ` First load each day gets +${p.daily}%.` : ''}</p></div>
      <div><span>3</span><b>Play</b><p>Open the ${p.name} web version or app and log in.</p></div>
    </section>
  </div>`;
}

const BAL_ITEMS = [
  { id: 'shop', label: 'Shop', sub: 'Packages with free bonus', color: '#f59e0b', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16l-1.2 10a1 1 0 0 1-1 .9H6.2a1 1 0 0 1-1-.9ZM8.5 9V7a3.5 3.5 0 0 1 7 0v2"/></svg>' },
  { id: 'deposit', label: 'Deposit', sub: 'Fund your wallet in seconds', color: '#1fbf8f', icon: I.plus },
  { id: 'withdraw', label: 'Withdraw', sub: 'Withdraw your winnings', color: '#e0334f', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14m-6-6 6 6 6-6"/></svg>' },
  { id: 'transfer', label: 'Transfer', sub: 'Send funds to a game', color: '#3b82f6', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>' },
  { id: 'redeem', label: 'Redeem', sub: 'Redeem credits to your balance', color: '#a855f7', icon: I.arrowL },
  { id: 'p2p', label: 'P2P', sub: 'Send funds to other players', color: '#c9961a', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M14.5 15.2c.8-.5 1.6-.7 2.5-.7 2.1 0 3.6 1.2 4 3.5"/></svg>' },
  { id: 'voucher', label: 'Voucher', sub: 'Redeem a voucher code', color: '#0ea5b7', icon: I.ticket }
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
  { id: 'shib', name: 'Shiba Inu', code: 'SHIB', bg: '#e8590c', sym: '&#x1F415;', pre: '0x' },
  { id: 'usdt', name: 'Tether', code: 'USDT', bg: '#26a17b', sym: '&#8366;', pre: 'T' },
  { id: 'doge', name: 'Dogecoin', code: 'DOGE', bg: '#c2a633', sym: '&#208;', pre: 'D' },
  { id: 'usdc', name: 'USD Coin', code: 'USDC', bg: '#2775ca', sym: '$', pre: '0x' },
  { id: 'dai', name: 'Dai', code: 'DAI', bg: '#f5ac37', sym: '&#9672;', pre: '0x' },
  { id: 'xrp', name: 'Ripple', code: 'XRP', bg: '#23292f', sym: '&#10005;', pre: 'r' },
  { id: 'xmr', name: 'Monero', code: 'XMR', bg: '#f26822', sym: 'M', pre: '4' }
];
const cryptoIco = c => `<span class="cry" style="background:${c.bg}">${c.sym}${c.bolt ? `<i>${I.bolt}</i>` : ''}</span>`;

function balPanel(id) {
  const it = BAL_ITEMS.find(b => b.id === id);
  const head = (t, s) => `<div class="panel-h"><span class="mini-ico" style="background:${it.color}">${it.icon}</span><div><h2>${t}</h2><p>${s}</p></div></div>`;
  const walletLine = `<div class="wallet-line">Wallet balance <b>${scv(S.user.wallet)}</b></div>`;
  const cryptoList = () => `<div class="opt-list">${CRYPTO.map(c => `<button class="opt cry-opt ${S.method === c.id ? 'on' : ''}" data-method="${c.id}">${cryptoIco(c)}<b>${c.name}</b><small>(${c.code})</small>${S.method === c.id ? `<span class="tick-ok">${I.check}</span>` : ''}</button>`).join('')}</div>`;
  const unlocked = PLATFORMS.filter(p => acct(p.id));
  const noGames = `<div class="card soft"><b>No game accounts yet</b><p class="card-sub">Unlock a game first. Each game gets its own login.</p><a class="btn btn-accent" href="#/games">Unlock a game</a></div>`;
  const stop = blocked();
  if (id === 'deposit') return head(S.pkg ? `Buy ${gcv(S.pkg.amt * GC_PER_USD)}` : 'Deposit', S.pkg ? `Choose the crypto you want to pay with. You get ${gcv(S.pkg.amt * GC_PER_USD)} + ${scv(S.pkg.bonus)} free.` : `Choose the crypto you want to pay with. Every $1 gets you 100 GC plus 1 free SC. Minimum $${MIN_DEPOSIT}.`) + walletLine + (stop ? `<div class="warn">${stop}</div>` : cryptoList() +
    `<div class="sticky-cta"><button class="btn btn-accent btn-lg" data-act="deposit-now" ${S.method ? '' : 'disabled'}>${S.method ? `Deposit with ${CRYPTO.find(c => c.id === S.method).name}` : 'Deposit Now'}</button></div>`);
  if (id === 'withdraw') return head('Withdraw', `Redeem Sweeps Coins to your crypto address. 1 SC = $1. Minimum ${MIN_WITHDRAW} SC.`) + walletLine +
    `<p class="hint">Credits inside a game must be redeemed to your wallet first.</p>` + cryptoList() +
    `<div class="sticky-cta"><button class="btn btn-accent btn-lg" data-act="withdraw-now" ${S.method ? '' : 'disabled'}>Withdraw Now</button></div>`;
  if (id === 'transfer') return head('Load a game', 'Move money from your wallet into a game account as credits.') + walletLine + (stop ? `<div class="warn">${stop}</div>` : unlocked.length ?
    `<form class="form-row narrow" data-form="load">
      <label class="lbl">Game</label><select class="field" name="plat">${unlocked.map(p => `<option value="${p.id}" ${S.loadPlat === p.id ? 'selected' : ''}>${p.name} (${scv(acct(p.id).credits)} credits)</option>`).join('')}</select>
      <label class="lbl">Amount ($)</label><input class="field" name="amt" type="number" min="1" step="0.01" placeholder="0.00" required>
      <button class="btn btn-accent" type="submit">Load credits</button>
    </form>` : noGames);
  if (id === 'redeem') return head('Redeem', 'Bring credits from a game back to your wallet.') + walletLine + (unlocked.length ?
    `<div class="opt-list">${unlocked.map(p => `<button class="opt" data-act="redeem" data-plat="${p.id}" ${acct(p.id).credits < 1 ? 'disabled' : ''}>${coin(p, 'sm')}<b>${p.name}</b><small>${scv(acct(p.id).credits)} credits</small>${I.chev}</button>`).join('')}</div>` : noGames);
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
  return `<div class="page narrow-page">
    ${crumb(['Balance'])}
    <p class="lede">Manage your funds, transfers and rewards</p>
    <section class="total-card"><div><small>Sweeps Coins</small><b>${scv(S.user.wallet)}</b><span>${gcv(S.user.gc)} &middot; ${scv(creditsTotal())} in games</span></div><span class="total-art">${I.wallet}</span></section>
    <div class="act-grid">${BAL_ITEMS.map(b => `<button class="act-card" data-balsheet="${b.id}" style="--ic:${b.color}">
      <span class="mini-ico" style="background:${b.color}">${b.icon}</span><span class="act-txt"><b>${b.label}</b><small>${b.sub}</small></span>${I.chev}</button>`).join('')}</div>
  </div>`;
}
function openBalSheet(id) {
  S.bal = id;
  openModal(`<div id="balPanel" class="bal-sheet">${balPanel(id)}</div>`);
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
        <div class="row-acts"><b class="${t.amt >= 0 ? 'pos' : 'neg'}">${t.amt >= 0 ? '+' : '-'}${(t.cur === 'gc' ? gcv : t.kind === 'Deposits' ? usd : scv)(Math.abs(t.amt))}</b>${t.status === 'pending' ? '<span class="pend">Processing</span>' : ''}</div>
      </div>`; }).join('')}</div>`
      : '<p class="empty big">No transactions found for the selected filter</p>'}
  </div>`;
}

function viewAccount() {
  if (!S.user) return needLogin('Profile');
  const u = S.user, n = unlockedCount();
  const row = (ico, title, sub, attrs, right) => `<${attrs.startsWith('href') ? 'a' : 'button'} class="set-row" ${attrs}><span class="set-ico">${ico}</span><span class="set-txt"><b>${title}</b><small>${sub}</small></span>${right || I.chev}</${attrs.startsWith('href') ? 'a' : 'button'}>`;
  return `<div class="page narrow-page">
    ${crumb(['Profile'])}
    <section class="prof-card">
      <button class="av-btn" data-act="avatar-pick" aria-label="Change avatar">${avatarHtml(u, 'big')}</button>
      <div class="prof-txt"><b>${esc(u.first)}</b><button class="pid" data-copyval="${esc(u.username)}" data-what="Player ID"><span>Player ID: ${esc(u.username)}</span>${I.copy}</button>
        <small>${esc(u.email || u.phone)} &middot; since ${new Date(u.since).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</small></div>
    </section>
    <section class="money-card">
      <div class="mc-cols"><div><small>Sweeps Coins</small><b>${fmt(u.wallet)}</b></div><div><small>Gold Coins</small><b>${Math.round(u.gc).toLocaleString('en-US')}</b></div><div><small>Points</small><b>${u.points.toLocaleString('en-US')}</b></div></div>
      <div class="mc-acts"><a class="round-act" href="#/balance" data-bal-go="deposit"><span class="ra-ico dep">${I.plus}</span>Deposit</a><a class="round-act" href="#/balance" data-bal-go="withdraw"><span class="ra-ico wd">${I.dl}</span>Withdraw</a></div>
    </section>
    <div class="set-list">
      ${row(I.user, 'Change username', esc(u.username), 'data-sheet="user"')}
      ${row(I.lock, 'Change password', 'Security settings', 'data-sheet="pw"')}
      ${row(I.shield, 'Two-step login', u.twofa ? 'On: a code is asked at every login' : 'Off', 'data-act="twofa"', `<span class="switch ${u.twofa ? 'on' : ''}"><i></i></span>`)}
      ${row(I.key, 'Game accounts', `${n} of ${PLATFORMS.length} unlocked`, 'data-sheet="games"')}
    </div>
    <div class="set-list">
      ${row(I.gift.replace('<svg', '<svg class="gift-ico"'), 'Invite & Earn', 'Share your link, earn rewards when friends deposit', 'data-rw="you"')}
      ${row(I.list, 'Transactions', 'Order history', 'href="#/activity"')}
      ${row(I.help, 'Help Center', 'Chat with support', 'data-act="chat"')}
    </div>
    <div class="set-list">
      ${row(I.gauge, 'Daily deposit limit', u.limit ? `$${u.limit} per day` : 'No limit', 'data-sheet="limit"')}
      ${row(I.pause, 'Take a break', blocked() || 'Pause deposits for a while, or self-exclude', 'data-sheet="break"')}
      <div class="set-row static"><span class="set-ico">${navIco.swap}</span><span class="set-txt"><b>Theme</b><small>${(THEMES_NOW().find(t => t[0] === curTheme()) || THEMES_NOW()[0])[1]}</small></span><span class="theme-pick" data-theme-pick>${themePick()}</span></div>
      <div class="set-row static"><span class="set-ico">${D_ICO.globe}</span><span class="set-txt"><b>Language</b><small data-noi18n>${LANG_NAMES[LANG]}</small></span><span data-lang-pick="bare">${langPick(false)}</span></div>
    </div>
    <div class="set-list"><button class="set-row" data-act="logout"><span class="set-txt"><b>Logout</b></span>${I.out}</button></div>
  </div>`;
}
/* ---------- Gamewallet777 dashboard ---------- */

const D_ICO = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2" stroke-linecap="round"/></svg>',
  id: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14 10h4.5M14 13.5h3" stroke-linecap="round"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4M9 12h6M9 16h6" stroke-linecap="round"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>',
  sound: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9h4l5-4v14l-5-4H4Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3Z"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4m-5 5 5-5 5 5M5 15v4h14v-4"/></svg>'
};

function dashboardHtml(inPanel) {
  const u = S.user;
  const head = inPanel
    ? `<div class="dash-top"><button class="icon-btn" data-close-menu aria-label="Close">${I.x}</button><span class="logo">${logoInner()}</span><button class="dash-lang" data-act="lang">${D_ICO.globe}<span data-noi18n>${LANG_NAMES[LANG]}</span></button></div>`
    : '';
  if (!u) return head + `<div class="dash-guest"><h2>Welcome to ${BRAND()}</h2><p>Sign up to get your wallet, game accounts and rewards.</p>
      <button class="btn btn-accent btn-block" data-act="signup">Create account</button><button class="btn btn-ghost btn-block" data-act="login">Log in</button></div>
      <nav class="dash-links"><a href="#" data-act="telegram">Join our Telegram</a><a href="#" data-act="get-app">Download App</a><a href="#" data-act="foot-doc" data-doc="How it works">How it works</a><a href="#" data-act="choose-site">Switch site</a></nav>`;
  const n = unlockedCount();
  const row = (ico, title, sub, attrs, right) => `<button class="d-row" ${attrs}><span class="d-ico">${ico}</span><span class="d-txt"><b>${title}</b><small>${sub}</small></span>${right === undefined ? I.chev : right}</button>`;
  const recent = u.tx.slice(0, 4);
  return head + `
    <div class="dash-id"><button class="av-btn" data-act="avatar-pick" aria-label="Change avatar">${avatarHtml(u)}</button>
      <div><b>${esc(u.first)}</b><button class="pid" data-copyval="${esc(u.username)}" data-what="Player ID"><span>ID: ${esc(u.username)}</span>${I.copy}</button></div>
      ${inPanel ? `<nav class="dash-quick"><a href="#/rewards" aria-label="Rewards">${navIco.rewards}</a></nav>` : ''}</div>
    <section class="dash-bal">
      <div class="db-half"><div class="db-h"><span class="db-coin sc">SC</span><b>Sweeps Coins</b></div><strong>${fmt(u.wallet)}</strong><span class="db-pill">Redeemable</span></div>
      <div class="db-half"><div class="db-h"><span class="db-coin w">GC</span><b>Gold Coins</b></div><strong class="db-gold">${Math.round(u.gc).toLocaleString('en-US')}</strong>
        <div class="db-sub"><span><small>In games</small><em><i class="dot-b"></i>${n}</em></span><span><small>Points</small><em><i class="dot-g"></i>${u.points.toLocaleString('en-US')}</em></span></div></div>
    </section>
    <div class="dash-acts"><a class="d-round" href="#/balance" data-bal-go="deposit"><span class="dr-ico dep">${I.plus}</span>Deposit</a><a class="d-round" href="#/balance" data-bal-go="withdraw"><span class="dr-ico wd">${D_ICO.up}</span>Withdraw</a></div>
    <div class="d-list">
      ${row(D_ICO.phone, 'Bind/Change Phone', u.phone ? esc(u.phone) : 'Not Bound', 'data-dsheet="phone"')}
      ${row(I.lock, 'Change Password', 'Security settings', 'data-sheet="pw"')}
      ${row(D_ICO.id, 'Identity Verification', u.kyc === 'verified' ? 'Verified' : u.kyc === 'pending' ? 'Under review' : 'Not Verified', 'data-dsheet="kyc"')}
      ${row(I.user, 'Change Username', esc(u.username), 'data-sheet="user"')}
      ${row(I.shield, 'Two-step Login', u.twofa ? 'On' : 'Off', 'data-act="twofa"', `<span class="switch ${u.twofa ? 'on' : ''}"><i></i></span>`)}
      ${row(I.key, 'Game Accounts', `${n} of ${PLATFORMS.length} unlocked`, 'data-sheet="games"')}
    </div>
    <div class="d-list">
      ${row(I.gift.replace('<svg', '<svg class="gift-ico"'), 'Invite & Earn', 'Share your link, earn rewards when friends deposit', 'data-rw="you"')}
      <details class="d-exp"><summary class="d-row"><span class="d-ico">${I.help}</span><span class="d-txt"><b>Help Center</b><small>How it works and FAQ</small></span>${I.down}</summary>
        <div class="d-exp-body"><button class="d-link" data-act="foot-doc" data-doc="How it works">How it works</button><button class="d-link" data-act="foot-doc" data-doc="FAQ">FAQ</button></div></details>
    </div>
    <div class="d-list">
      <div class="d-row static"><span class="d-ico">${D_ICO.moon}</span><span class="d-txt"><b>Theme</b><small>${(THEMES_NOW().find(t => t[0] === curTheme()) || THEMES_NOW()[0])[1]}</small></span><span class="theme-pick" data-theme-pick>${themePick()}</span></div>
      <div class="d-row static"><span class="d-ico">${D_ICO.globe}</span><span class="d-txt"><b>Language</b><small data-noi18n>${LANG_NAMES[LANG]}</small></span><span data-lang-pick="bare">${langPick(false)}</span></div>
      ${row(D_ICO.sound, 'Background music', u.music ? 'On' : 'Off', 'data-act="music"', `<span class="switch ${u.music ? 'on' : ''}"><i></i></span>`)}
      <div class="d-row static"><span class="d-ico">${D_ICO.sliders}</span><span class="d-txt"><b>Music volume</b><small>${u.volume}%</small></span><input class="d-range" type="range" min="0" max="100" step="5" value="${u.volume}" data-volume aria-label="Music volume"></div>
    </div>
    <div class="d-list">
      ${row(I.gauge, 'Daily deposit limit', u.limit ? `$${u.limit} per day` : 'No limit', 'data-sheet="limit"')}
      ${row(I.pause, 'Take a break', blocked() || 'Pause deposits, or self-exclude', 'data-sheet="break"')}
      ${inPanel ? row(navIco.swap, 'Switch site', 'Recharge777, Gamewallet777 or Skillslots777', 'data-act="choose-site"') : ''}
      ${row(I.out, 'Logout', '', 'data-act="logout"', '')}
    </div>`;
}

function viewAccountB() {
  if (!S.user) return needLogin('Dashboard');
  return `<div class="page narrow-page dash-page">${crumb(['Dashboard'])}${dashboardHtml(false)}</div>`;
}

function openDashSheet(k) {
  const u = S.user;
  if (k === 'phone') return openModal(`<h2>${u.phone ? 'Change phone' : 'Bind phone'}</h2><p>We text a code to confirm it. Used for login alerts and recovery.</p>
    <form class="form-row" data-form="phone"><input class="field" name="phone" type="tel" inputmode="tel" placeholder="+1 555 000 1234" value="${esc(u.phone || '')}" required>
    <button class="btn btn-accent btn-block" type="submit">Send code</button></form><p class="note">Demo: the number is saved straight away.</p>`);
  if (k === 'kyc') return openModal(`<h2>Identity Verification</h2><p>${u.kyc === 'verified' ? 'You are verified. Thanks!' : u.kyc === 'pending' ? 'Your documents are under review. We will email you when it is done.' : 'Verify once to unlock withdrawals and higher limits. Have a photo ID ready.'}</p>
    ${u.kyc !== 'none' ? '' : '<div class="kyc-steps"><span>1. Photo of your ID (front and back)</span><span>2. A quick selfie</span><span>3. Proof of address</span></div><button class="btn btn-accent btn-block" data-act="kyc-start">Start verification</button>'}`);
}

function openSheet(k) {
  const u = S.user;
  if (k === 'user') return openModal(`<h2>Change username</h2><p>4 to 20 letters, numbers or underscores.</p>
    <form class="form-row" data-form="user"><input class="field" name="next" value="${esc(u.username)}" pattern="[A-Za-z0-9_]{4,20}" title="4 to 20 letters, numbers or _" autocomplete="username" required>
    <input class="field" type="password" name="cur" placeholder="Current password" autocomplete="current-password" required><button class="btn btn-accent btn-block" type="submit">Save username</button></form>`);
  if (k === 'pw') return openModal(`<h2>Change password</h2><p>Your game logins are separate and don't change.</p>
    ${credRow('Current password', u.password, u.password, true)}
    <form class="form-row" data-form="pw" style="margin-top:14px"><input class="field" type="password" name="cur" placeholder="Current password" autocomplete="current-password" required>
    <input class="field" type="password" name="next" placeholder="New password (8+ characters)" minlength="8" autocomplete="new-password" required><button class="btn btn-accent btn-block" type="submit">Update password</button></form>`);
  if (k === 'games') { const games = PLATFORMS.filter(p => acct(p.id)); return openModal(`<h2>Game accounts</h2><p>Each game has its own login.</p>
    ${games.length ? `<div class="ga-list">${games.map(p => `<button class="opt" data-act="gcreds" data-plat="${p.id}">${coin(p, 'sm')}<b>${p.name}</b><small>${esc(acct(p.id).username)}</small>${I.chev}</button>`).join('')}</div>` : '<a class="btn btn-accent btn-block" href="#/games">Unlock a game</a>'}`); }
  if (k === 'limit') return openModal(`<h2>Daily deposit limit</h2><p>Lower it any time. Raising it takes 24 hours.</p>
    <form class="form-row" data-form="limit"><select class="field" name="limit">${[0, 50, 100, 250, 500, 1000].map(v => `<option value="${v}" ${u.limit === v ? 'selected' : ''}>${v ? `$${v} per day` : 'No limit'}</option>`).join('')}</select><button class="btn btn-accent btn-block" type="submit">Save limit</button></form>`);
  if (k === 'break') return openModal(`<h2>Take a break</h2><p>${blocked() || 'Pause deposits and loading credits for a while.'}</p>
    <div class="sheet-grid three"><button class="btn btn-outline" data-act="cool" data-h="24">24 hours</button><button class="btn btn-outline" data-act="cool" data-h="168">7 days</button><button class="btn btn-outline" data-act="cool" data-h="720">30 days</button></div>
    <button class="btn btn-outline btn-block danger" data-act="exclude" style="margin-top:14px">Self-exclude</button>`);
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
const PROMO_CODES = { BONUS50: 50, RECHARGE100: 100 };

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
      <p class="note">Demo codes: BONUS50, RECHARGE100</p>
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
  const link = `https://recharge777.com/r/${S.user.refCode}`;
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
      <p class="card-sub">Choose an avatar to complete your profile (+50 pts).</p>
      <div class="rw-av">${avatarHtml(S.user, 'big')}<button class="btn btn-accent" data-act="avatar-pick">Choose avatar</button></div>
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
      <div class="pts-bot"><span>Cashable <b>${scv(S.user.cashable)}</b></span>${S.user.cashable > 0 ? `<button class="btn btn-accent btn-sm" data-act="cash-move">Move to wallet</button>` : ''}</div>
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
  const row = (ico, label, attrs) => `<a class="m-row" ${attrs}>${ico}<span>${label}</span>${I.chev}</a>`;
  return `<div class="drawer-h"><h2>Menu</h2><button class="icon-btn" data-close-menu aria-label="Close menu">${I.x}</button></div>
    ${S.user ? `<div class="m-prof"><a class="m-prof-link" href="#/account">${avatarHtml(S.user)}<span class="m-prof-txt"><b>Profile</b><small>${esc(S.user.first)}</small></span></a><button class="m-prof-id" data-copyval="${esc(S.user.username)}" data-what="Player ID" aria-label="Copy Player ID"><small>Player ID</small><code>${esc(S.user.username)}</code>${I.copy}</button></div>` : ''}
    <nav class="m-list">
      ${S.user ? row(navIco.rewards, 'Rewards', 'href="#/rewards"') : ''}
      ${row(I.tg, 'Join our Telegram', 'href="#" data-act="telegram"')}
      ${row(I.dl, 'Download App', 'href="#" data-act="get-app"')}
      ${row(I.help, 'How it works', 'href="#" data-act="foot-doc" data-doc="How it works"')}
      ${row(navIco.swap, 'Switch site', 'href="#" data-act="choose-site"')}
    </nav>
    <div class="theme-pick m-theme" data-theme-pick>${themePick()}</div>
    <div class="m-theme m-lang" data-lang-pick>${langPick()}</div>
    <div class="drawer-foot">${S.user
      ? `<button class="m-row logout" data-act="logout"><span>Logout</span>${I.out}</button>`
      : ''}</div>`;
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

const SITE_THEMES = {
  a: [['plum', 'Plum', '#1e0f2b', '#170a22'], ['navy', 'Navy', '#0f1630', '#0b1126'], ['white', 'White', '#f6f3fa', '#ffffff']],
  b: [['wine', 'Wine', '#2a0e17', '#220a12'], ['navy', 'Navy', '#0d1a33', '#0a152b'], ['white', 'White', '#faf6ee', '#ffffff']]
};
const THEMES_NOW = () => SITE_THEMES[S.site || 'a'];
const curTheme = () => document.documentElement.dataset.theme || THEMES_NOW()[0][0];
const themePick = () => `<span>Colour</span>${THEMES_NOW().map(([k, n, bg]) => `<button class="${curTheme() === k ? 'on' : ''}" style="background:${bg}" data-theme-set="${k}" title="${n}" aria-label="${n} theme"></button>`).join('')}`;
function setTheme(k, quiet) {
  const list = THEMES_NOW();
  if (!list.some(t => t[0] === k)) k = list[0][0];
  document.documentElement.dataset.theme = k;
  if (!quiet) { try { localStorage.setItem('pp_theme_' + (S.site || 'a'), k); } catch (e) {} }
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.content = list.find(t => t[0] === k)[3];
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

function promoBanner() {
  if (S.user) return '';
  return `<a class="promo-banner" href="#" data-act="signup" aria-label="All fish games and slots platform under one roof. Sign up">
    <img src="assets/banner-fish-slots-purple.webp" alt="All Fish Games &amp; Slots: platform under one roof" width="2000" height="580" loading="lazy"></a>`;
}

/* Player reviews carousel. Keep the "Sample review" label until these are real
   (best: pulled from the connected Trustpilot profile). */
const REVIEWS = [
  ['All my games in one place', 'I like having my game platforms together in one place. One wallet, separate logins, no juggling apps.', 'R', '#a3445f', 'milkyway'],
  ['Easy to find a game', 'The game categories make it easy to find what I want to explore, and the platform pages show exactly what to do next.', 'M', '#2f7a5a', 'firekirin'],
  ['Works great on my phone', 'The layout feels clear on my phone and my tablet. Everything fits and nothing is hidden behind tiny buttons.', 'J', '#b0652a', 'orion'],
  ['Loading is quick', 'Loading credits into a game takes just a couple of taps, and I can see the new balance before I confirm.', 'K', '#8a4fc0', 'firekirin'],
  ['Logins in one spot', 'Seeing every game login in one place saves me time. Copy the username, copy the password, done.', 'D', '#1f7f95', 'panda'],
  ['Nice daily bonus', 'The Daily 1st bonus is a fun reason to check in each day. The extra credits show up right away.', 'S', '#b8862a', 'orion'],
  ['Simple redeems', 'Redeeming back to my wallet is simple to follow, and I can track every step under Activity.', 'L', '#3f8f4a', 'milkyway'],
  ['Helpful support', 'Live chat answered my question quickly and walked me through linking the account I already had.', 'T', '#c0485a', 'vegas'],
  ['Budget tools', 'The deposit limit setting helps me stay on budget. Good to see a site that offers it.', 'N', '#7a5a3a', 'panda'],
  ['Spanish option', 'Being able to switch to Spanish is really helpful for my family.', 'E', '#2f8f7f', 'vegas']
];
/* Video reviews: drop each clip in assets/reviews/ and fill src (mp4), poster (jpg), name and quote.
   Empty src shows a "coming soon" tile. */
const VIDEO_REVIEWS = [
  { src: '', poster: '', name: '', quote: 'One wallet for all my games. Loading takes seconds.', sample: true, game: 'firekirin' },
  { src: '', poster: '', name: '', quote: 'I like that every game has its own login, all in one place.', sample: true, game: 'milkyway' },
  { src: '', poster: '', name: '', quote: 'The Daily 1st bonus keeps me coming back.', sample: true, game: 'orion' },
  { src: '', poster: '', name: '', quote: 'Redeeming back to my wallet was simple.', sample: true, game: 'juwa' },
  { src: '', poster: '', name: '', quote: 'Support helped me link my old account in minutes.', sample: true, game: 'panda' }
];
/* Trustpilot: paste the business unit ID from Trustpilot Business (Integrations > TrustBox)
   and the public profile URL. Until then the header shows a plain placeholder: never fake a score. */
const TRUSTPILOT = { businessUnitId: '', url: '' };

const TP_STARS = n => `<span class="tp-stars" aria-label="${n} stars">${Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? 'on' : ''}">&#9733;</i>`).join('')}</span>`;
function trustpilotHtml() {
  const tp = TRUSTPILOT;
  if (tp.businessUnitId) return `<div class="rv-tp live"><div class="trustpilot-widget" data-locale="${LANG === 'es' ? 'es-ES' : 'en-US'}" data-template-id="53aa8807dec7e10d38f59f36" data-businessunit-id="${tp.businessUnitId}" data-style-height="150px" data-style-width="100%" data-theme="dark">${tp.url ? `<a href="${tp.url}" target="_blank" rel="noopener">Trustpilot</a>` : ''}</div></div>`;
  return `<div class="tp-head"><span class="tp-logo"><i>&#9733;</i>Trustpilot</span><small>Our rating shows here once the Trustpilot profile is connected.</small></div>`;
}
const rvCard = i => { const [t, q, init, c, pid] = REVIEWS[i]; const p = plat(pid); return `<article class="pr-card">
    <div class="pr-top">${TP_STARS(5)}<small>Sample review</small></div>
    <h3>${t}</h3>
    <p class="pr-txt">${q}</p><button class="pr-more" data-prmore>See more</button>
    <div class="pr-foot"><span class="rv-av" style="background:${c}">${init}</span><span class="pr-who"><b>Sample player</b><small>Plays ${p.name}</small></span>${coin(p, 'xs')}</div>
  </article>`; };
function videoSpot() {
  const k = S.vsel || 0, v = VIDEO_REVIEWS[k], p = plat(v.game), g = GAMES.find(x => x.p === v.game);
  return `<div class="vs-main">
      <button class="vs-video ${v.src ? '' : 'soon'}" data-vreview="${k}" aria-label="Play video review">
        <span class="vr-bg" style="background-image:url(${v.poster || g.img})"></span><span class="vr-shade"></span>
        ${v.src ? '' : '<span class="vr-tag">Coming soon</span>'}<span class="vr-play">${I.play}</span></button>
      <span class="vs-name">${v.name ? esc(v.name) : `Player ${k + 1}`}</span>
      <blockquote class="vs-quote">${v.sample ? '<small class="vs-sample">Sample quote</small>' : ''}${v.quote ? `&ldquo;${esc(v.quote)}&rdquo;` : 'Their quote will show here once the video is added.'}</blockquote>
    </div>
    <div class="vs-thumbs">${VIDEO_REVIEWS.map((x, i) => { const gx = GAMES.find(y => y.p === x.game); return `<button class="vs-thumb ${i === k ? 'on' : ''}" data-vsel="${i}" aria-label="Video review ${i + 1}" style="background-image:url(${x.poster || gx.img})"></button>`; }).join('')}</div>`;
}
function videoReviewModal(i) {
  const v = VIDEO_REVIEWS[i], p = plat(v.game);
  openModal(v.src
    ? `<div class="vr-player"><video src="${v.src}" ${v.poster ? `poster="${v.poster}"` : ''} controls autoplay playsinline></video></div><p class="vr-cap">${coin(p, 'xs')} ${v.name ? esc(v.name) : 'Player video review'} &middot; ${p.name}</p>`
    : `<div class="modal-coin">${coin(p, 'md')}</div><h2>Video review</h2><p>This player video goes here once the clip is uploaded.</p>`);
  $('#modalBox').classList.add('vr-box');
}
function allReviewsModal() {
  if (TRUSTPILOT.url) { window.open(TRUSTPILOT.url, '_blank', 'noopener'); return; }
  openModal(`<h2>Player Reviews</h2><p>Sample reviews. Once Trustpilot is connected, View All opens your Trustpilot page.</p><div class="pr-all">${REVIEWS.map((_, i) => rvCard(i)).join('')}</div>`);
  $('#modalBox').classList.add('pr-box');
}
function reviewsSection() {
  return `<section class="pr">
      <h2>Player Reviews</h2>
      ${trustpilotHtml()}
      <div class="pr-wrap"><button class="pr-nav prev" data-prnav="-1" aria-label="Previous review">${I.chev}</button>
        <div class="pr-track" id="prTrack">${REVIEWS.map((_, i) => rvCard(i)).join('')}</div>
        <button class="pr-nav next" data-prnav="1" aria-label="Next review">${I.chev}</button></div>
      <p class="rv-disc"><span class="rv-badge">Design preview &middot; sample reviews</span> These examples show the layout. They are not customer testimonials.</p>
      <button class="btn btn-accent pr-all-btn" data-act="all-reviews">View All</button>
    </section>
    <section class="vs">
      <p class="vs-lede">We bring the most popular fish games and slots together in one place. <b>See what players have to say.</b></p>
      <div id="vsBox">${videoSpot()}</div>
    </section>
    <section class="pay">
      <h2>Pay your way</h2>
      <p>Deposit and withdraw with the coins you already use.</p>
      <div class="pay-grid">${CRYPTO.map(c => `<span class="pay-coin">${cryptoIco(c)}<small>${c.name}</small></span>`).join('')}</div>
    </section>`;
}
let rvTimer;
function prStep(dir) {
  const tr = document.getElementById('prTrack');
  if (!tr) return;
  const card = tr.querySelector('.pr-card');
  const w = card ? card.getBoundingClientRect().width + 14 : 300;
  const end = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4;
  if (dir > 0 && end) tr.scrollTo({ left: 0, behavior: 'smooth' });
  else tr.scrollBy({ left: dir * w, behavior: 'smooth' });
}
function startReviews() {
  clearInterval(rvTimer);
  const tr = document.getElementById('prTrack');
  if (!tr) return;
  if (TRUSTPILOT.businessUnitId && !window.Trustpilot && !document.getElementById('tpjs')) {
    const sc = document.createElement('script'); sc.id = 'tpjs'; sc.async = true;
    sc.src = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
    sc.onload = () => document.querySelectorAll('.trustpilot-widget').forEach(el => window.Trustpilot && window.Trustpilot.loadFromElement(el));
    document.head.appendChild(sc);
  } else if (window.Trustpilot) document.querySelectorAll('.trustpilot-widget').forEach(el => window.Trustpilot.loadFromElement(el));
  let paused = false;
  ['pointerenter', 'touchstart', 'focusin'].forEach(ev => tr.addEventListener(ev, () => { paused = true; }, { passive: true }));
  ['pointerleave', 'focusout'].forEach(ev => tr.addEventListener(ev, () => { paused = false; }));
  rvTimer = setInterval(() => {
    if (!document.getElementById('prTrack')) return clearInterval(rvTimer);
    if (paused || document.hidden) return;
    prStep(1);
  }, 4000);
}

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

/* ---------- Gamewallet777 (site b) ---------- */

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
  const u = S.user;
  const main = [['home', '#/', 'Lobby'], ['games', '#/games', 'Games']].concat(u ? [['balance', '#/balance', 'Balance'], ['activity', '#/activity', 'Activity'], ['rewards', '#/rewards', 'Rewards']] : []);
  return `<a class="logo" href="#/">${logoInner()}</a>
    ${u ? `<div class="side-prof m-prof"><a class="m-prof-link" href="#/account">${avatarHtml(u)}<span class="m-prof-txt"><b>Profile</b><small>${esc(u.first)}</small></span></a><button class="m-prof-id" data-copyval="${esc(u.username)}" data-what="Player ID" aria-label="Copy Player ID"><small>Player ID</small><code>${esc(u.username)}</code>${I.copy}</button></div>` : ''}
    <nav class="side-nav">${main.map(([k, h, t]) => `<a href="${h}" class="${name === k ? 'on' : ''}">${navIco[k]}<span>${t}</span>${k === 'rewards' && canCheckin() ? '<i class="side-dot"></i>' : ''}</a>`).join('')}
      <a href="#" data-act="chat">${navIco.chat}<span>Help &amp; chat</span></a></nav>
    <nav class="side-nav side-more">
      <a href="#" data-act="telegram">${I.tg}<span>Join our Telegram</span></a>
      <a href="#" data-act="get-app">${I.dl}<span>Download App</span></a>
      <a href="#" data-act="foot-doc" data-doc="How it works">${I.help}<span>How it works</span></a>
      <a href="#" data-act="choose-site">${navIco.swap}<span>Switch site</span></a></nav>
    <div class="side-foot">${u ? `<button class="side-logout" data-act="logout">${I.out}<span>Logout</span></button>` : ''}</div>`;
}

function platCardB(p) {
  const a = acct(p.id);
  return `<div class="b-plat">
    <a class="b-plat-top" href="#/platform/${p.id}">${coin(p, 'lg')}<b>${p.name}</b><small>${a ? `${scv(a.credits)} credits` : `${p.games} games`}</small></a>
    ${a ? `<button class="btn btn-outline btn-sm btn-block" data-act="gcreds" data-plat="${p.id}">${I.eyeO}View</button>`
        : `<button class="btn btn-accent btn-sm btn-block" data-act="unlock" data-plat="${p.id}">${I.lockO}Unlock</button>`}
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
      <small>MY WALLET</small><b class="b-bal">${scv(S.user.wallet)}</b>
      <span class="b-sub">${scv(creditsTotal())} in ${unlockedCount()} game${unlockedCount() === 1 ? '' : 's'}</span>
      <div class="b-wal-acts"><a class="btn btn-accent" href="#/balance" data-bal-go="deposit">Deposit</a><a class="btn btn-ghost" href="#/balance" data-bal-go="withdraw">Withdraw</a></div>
      <div class="b-ck"><div><b>Daily check-in</b><small>${st.streakNow ? `${st.streakNow}-day streak` : 'Start a streak'}</small></div>
        ${st.done ? '<span class="b-ck-done">' + I.check + 'Done</span>' : `<button class="btn btn-accent btn-sm" data-act="checkin">+${st.reward} pts</button>`}</div>
      <a class="b-pts" href="#/rewards"><span>Points</span><b>${S.user.points.toLocaleString('en-US')}</b>${I.chev}</a>
    </aside>`;
}

function viewHomeB() {
  const mine = PLATFORMS.filter(p => acct(p.id));
  return `<div class="page b-home">
    <div class="b-top ${S.user ? 'solo' : ''}">
      <section class="b-hero">
        ${B_SLIDES.map((x, i) => { const g = game(x.g), p = plat(g.p); return `<div class="b-slide ${i === S.bslide ? 'on' : ''}">
          <div class="b-slide-bg" style="background-image:url(${g.img})"></div>
          <div class="b-slide-txt"><span class="b-kicker">${coin(p, 'xs')}${p.name}</span><h1>${x.t}</h1><p>${x.s}</p>
            <button class="btn btn-accent btn-lg" data-game="${g.id}">Play now</button></div>
          <img class="b-slide-art" src="${g.img}" alt="">
        </div>`; }).join('')}
        <div class="b-dots">${B_SLIDES.map((_, i) => `<button class="${i === S.bslide ? 'on' : ''}" data-bslide="${i}" aria-label="Slide ${i + 1}"></button>`).join('')}</div>
      </section>
      ${S.user ? '' : walletBoxB()}
    </div>
    <section class="b-sec"><div class="b-sec-h"><h2>Platforms</h2><a href="#/games">See all ${I.chev}</a></div><div class="b-plats">${PLATFORMS.map(platCardB).join('')}</div></section>
    ${promoBanner()}
    <section class="b-sec"><div class="b-sec-h"><h2>Recent big wins</h2></div>
      <div class="b-wins">${BIG.slice(0, 5).map(([pid, u, d, a]) => `<div class="b-win">${coin(plat(pid), 'xs')}<b>${esc(u)}</b><span>${plat(pid).name}</span><small>${d}</small><em>$${a.toLocaleString('en-US')}</em></div>`).join('')}</div></section>
    ${S.user ? '' : reviewsSection()}
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
      <div class="ch-lang" data-lang-pick>${langPick()}</div>
      <h2>Choose your site</h2><p>Same games, same wallet. Pick the look you like.</p>
      <div class="ch-opts">
        <button class="ch-opt a" data-site-pick="a">
          <div class="ch-prev"><i class="p-top"></i><i class="p-hero"></i><i class="p-rows"></i><i class="p-rows"></i><i class="p-bar"></i></div>
          <b>Recharge777</b><span>Neon pink &middot; Plum, Navy or White &middot; bottom menu</span></button>
        <button class="ch-opt b" data-site-pick="b">
          <div class="ch-prev"><i class="p-side"></i><i class="p-hero"></i><i class="p-wallet"></i><i class="p-cards"></i></div>
          <b>Gamewallet777</b><span>Gold &amp; ruby &middot; Wine, Navy or White &middot; side menu</span></button>
        <a class="ch-opt c" href="v3/">
          <div class="ch-prev"><img src="v3/assets/landing/join-777.jpg" alt="" loading="lazy"></div>
          <b>Skillslots777</b><span>Full redesign &middot; Splash intro &middot; New wallet and shop</span></a>
      </div>
    </div>`;
  ch.hidden = false;
  document.body.style.overflow = 'hidden';
}
function siteSwitch() {
  const el = document.getElementById('siteSwitch');
  if (!el) return;
  el.innerHTML = `<small>Site:</small>${[['a', 'Recharge777'], ['b', 'Gamewallet777']].map(([k, n]) => `<button type="button" class="${S.site === k ? 'on' : ''}" data-site-pick="${k}" ${S.site === k ? 'aria-current="page"' : ''}>${n}</button>`).join('')}<a href="v3/">Skillslots777</a>`;
}
function pickSite(k) {
  if (location.hash && location.hash !== '#/') history.replaceState(null, '', location.pathname + location.search + '#/');
  applySite(k);
  showLoader(600, true);
  document.getElementById('chooser').hidden = true;
  document.body.style.overflow = '';
  render();
  siteSwitch();
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
  const views = { home: isB ? viewHomeB : viewHome, games: r === 'platform' ? () => viewPlatform(arg) : (isB ? viewGamesB : viewGames), balance: viewBalance, activity: viewActivity, account: isB ? viewAccountB : viewAccount, rewards: viewRewards };
  $('#app').innerHTML = views[name]();
  $('#topRight').innerHTML = topRight();
  claimStrip();
  if (name === 'home' && S.user && S.user.kyc === 'none' && !S.vpShown) { S.vpShown = true; let tries = 0; const tryPop = () => { if (!S.user || S.user.kyc !== 'none') return; if ($('#modal').hidden && $('#chooser').hidden) verifyPop(); else if (++tries < 20) setTimeout(tryPop, 1500); }; setTimeout(tryPop, 1500); }
  document.body.classList.toggle('has-ticker', name === 'home' && !isB);
  const side = $('#side'); if (side) side.innerHTML = isB ? sideHtml(name) : '';
  startBSlides();
  startReviews();
  if (name === 'balance' && S.pendingSheet && S.user) { const k = S.pendingSheet; S.pendingSheet = null; setTimeout(() => openBalSheet(k), 30); }
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
  document.querySelectorAll('#modalBox video').forEach(v => v.pause());
  $('#modal').hidden = true;
  document.body.style.overflow = '';
  clearInterval(S.launchTimer);
}

const pending = {};
const CC = [['+1', 'US'], ['+52', 'MX'], ['+34', 'ES'], ['+44', 'UK'], ['+91', 'IN'], ['+977', 'NP']];
const authTabs = (first) => `<div class="auth-tabs" role="tablist">${[['email', first], ['phone', 'Phone']].map(([k, t]) => `<button type="button" role="tab" class="${(S.authVia || 'email') === k ? 'on' : ''}" data-auth-via="${k}">${t}</button>`).join('')}</div>`;
const phoneField = (cc, num) => `<div class="phone-in"><select class="field" name="cc" aria-label="Country code">${CC.map(([c, n]) => `<option value="${c}" ${c === (cc || '+1') ? 'selected' : ''}>${n} ${c}</option>`).join('')}</select>
  <input class="field" type="tel" name="phone" inputmode="tel" placeholder="Phone number" autocomplete="tel-national" required minlength="6" value="${esc(num || '')}"></div>`;
function signupStep(step) {
  const bar = n => `<div class="dots-steps">${[1, 2, 3].map(k => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</div>`;
  const via = S.authVia || 'email';
  if (step === 1) {
    S.authModal = 'signup';
    openModal(`${bar(1)}<h2>Create your account</h2><p>This is your ${BRAND()} login for your wallet. Game accounts come later, one per game.</p>
      ${authTabs('Email')}
      <form class="form-row" data-form="email">
        <input class="field" name="first" placeholder="First name" autocomplete="given-name" required value="${esc(pending.first || '')}">
        ${via === 'phone' ? phoneField(pending.cc, pending.phone) : `<input class="field" type="email" name="email" placeholder="Email address" autocomplete="email" required value="${esc(pending.email || '')}">`}
        <label class="check"><input type="checkbox" required> I'm 21 or older and agree to the terms and sweepstakes rules.</label>
        <button class="btn btn-accent btn-block" type="submit">Send code</button>
      </form>
      <p class="note">Already have an account? <a href="#" data-act="login">Log in</a></p>`);
  } else if (step === 2) {
    const phone = pending.via === 'phone';
    const target = phone ? `${pending.cc} ${pending.phone}` : pending.email;
    openModal(`${bar(2)}<h2>${phone ? 'Check your phone' : 'Check your email'}</h2><p>We sent a 6-digit code to <b>${esc(target)}</b>. Any 6 digits work in this demo.</p>
      <form data-form="code">
        <div class="code-in">${Array.from({ length: 6 }, () => '<input inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]" aria-label="Digit" required>').join('')}</div>
        <button class="btn btn-accent btn-block" type="submit" style="margin-top:16px">Verify and create account</button>
      </form>
      <p class="note">${phone ? 'No text?' : 'No email?'} <a href="#" data-act="resend">Send a new code</a> or <a href="#" data-act="signup">${phone ? 'change the number' : 'change the email'}</a></p>`);
  } else {
    const u = S.user;
    openModal(`${bar(3)}<div class="done-mark">${I.check}</div><h2>You're in, ${esc(u.first)}</h2>
      <p>Here is your ${BRAND()} login. Next, deposit to your wallet and unlock your first game.</p>
      ${credRow('Username', u.username, u.username)}
      ${credRow('Password', u.password, u.password, true)}
      <div class="warn">${u.email ? `We also emailed these to ${esc(u.email)}.` : `We also texted these to ${esc(u.phone)}.`} You can change both under My account.</div>
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
  return { username: `rc_${base}${Math.floor(1000 + Math.random() * 9000)}`, password: makePw() };
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


function downloadModal(pid) {
  const p = plat(pid);
  openModal(`<div class="modal-coin">${coin(p, 'md')}</div><h2>Get ${p.name}</h2><p>Play in your browser or install the app. Log in with your ${p.name} username and password.</p>
    <div class="dl-list">
      <button class="opt" data-act="web" data-plat="${pid}"><b>Web version</b><small>Opens in a new tab</small>${I.chev}</button>
      <button class="opt" data-act="store" data-store="Android"><b>Android</b><small>Download the APK</small>${I.dl}</button>
      <button class="opt" data-act="store" data-store="iPhone"><b>iPhone</b><small>Install from the link</small>${I.dl}</button>
    </div>`);
}




/* ---------- Sweeps Coins (SC, redeemable, the old wallet) + Gold Coins (GC, for fun) ---------- */

const GC_PER_USD = 100;
const VERIFY_GC = 30000, VERIFY_SC = 3;
const scv = n => `${fmt(n)} SC`;
const gcv = n => `${Math.round(n).toLocaleString('en-US')} GC`;
const curTag = (k, cls = '') => `<span class="cur-coin ${k} ${cls}">${k.toUpperCase()}</span>`;
let CUR = store.get('pp_cur', 'sc');
const curBal = k => k === 'gc' ? S.user.gc : S.user.wallet;
const curNum = (k, n) => k === 'gc' ? Math.round(n).toLocaleString('en-US') : fmt(n);

function topRight() {
  if (!S.user) return `<button class="btn btn-ghost btn-sm" data-act="login">Log in</button><button class="btn btn-accent btn-sm" data-act="signup">Sign up</button>`;
  const u = S.user;
  return `<div class="cur-wrap">
      <button class="cur-pill" data-act="cur-menu" aria-label="Switch coins">${curTag(CUR)}<span class="cur-num">${curNum(CUR, curBal(CUR))}</span>${I.down}</button>
      <button class="cur-add" data-act="shop" aria-label="Buy coins">${I.plus}</button>
      <div class="cur-menu" id="curMenu" hidden>${['gc', 'sc'].map(k => `<button class="${CUR === k ? 'on' : ''}" data-cur="${k}">${curTag(k)}<span><b>${k === 'gc' ? 'Gold Coins' : 'Sweeps Coins'}</b><small>${k === 'gc' ? 'For fun, no cash value' : 'Redeemable'}</small></span><em>${curNum(k, curBal(k))}</em></button>`).join('')}</div>
    </div>
    <button class="round-btn top-bell" data-act="bell" aria-label="Notifications">${I.bell}<i class="dot"></i></button>
    <button class="top-av" data-act="avatar-pick" aria-label="Change avatar">${avatarHtml(u)}</button>`;
}

function claimStrip() {
  let el = document.getElementById('claim');
  if (!el) { el = document.createElement('div'); el.id = 'claim'; const top = document.querySelector('.top'); top.parentNode.insertBefore(el, top); }
  const show = S.user && S.user.kyc !== 'verified' && !S.claimHidden;
  el.className = show ? 'claim' : '';
  el.innerHTML = show ? `<button class="claim-main" data-act="verify-pop">
      <span class="claim-gift">${I2.gift}</span><span class="cur-chip gc">${curTag('gc', 'sm')}+30K</span><span class="cur-chip sc">${curTag('sc', 'sm')}+${VERIFY_SC}</span>
      <span class="claim-txt">${S.user.kyc === 'pending' ? 'Under review. Almost there.' : 'locked! One step to claim.'}</span></button>
    <button class="claim-x" data-act="claim-x" aria-label="Close">${I.x}</button>` : '';
}

const GIFT_ART = `<svg viewBox="0 0 220 170" aria-hidden="true">
  <defs><linearGradient id="gbx" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd76a"/><stop offset="1" stop-color="#d48a12"/></linearGradient>
  <linearGradient id="grb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9b3df0"/><stop offset="1" stop-color="#6a1fc4"/></linearGradient>
  <radialGradient id="gglow" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#ffd76a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd76a" stop-opacity="0"/></radialGradient></defs>
  <ellipse cx="110" cy="92" rx="105" ry="78" fill="url(#gglow)"/>
  <g fill="#ffd34d" stroke="#b5760a" stroke-width="2"><circle cx="40" cy="58" r="13"/><circle cx="182" cy="50" r="11"/><circle cx="196" cy="104" r="9"/><circle cx="26" cy="112" r="9"/></g>
  <g fill="#fff3c4" opacity=".9"><circle cx="40" cy="58" r="5"/><circle cx="182" cy="50" r="4"/></g>
  <path d="M58 76h104v78a8 8 0 0 1-8 8H66a8 8 0 0 1-8-8Z" fill="url(#gbx)" stroke="#9c5f05" stroke-width="2.5"/>
  <rect x="50" y="60" width="120" height="24" rx="6" fill="url(#gbx)" stroke="#9c5f05" stroke-width="2.5"/>
  <rect x="99" y="60" width="22" height="102" fill="url(#grb)"/>
  <path d="M110 60c-14-22-38-26-40-12-2 12 22 14 40 12Zm0 0c14-22 38-26 40-12 2 12-22 14-40 12Z" fill="url(#grb)" stroke="#4d128f" stroke-width="2"/>
  <g font-family="Arial Black,Arial" font-weight="900" text-anchor="middle"><circle cx="78" cy="118" r="16" fill="#ffd34d" stroke="#b5760a" stroke-width="2.5"/><text x="78" y="123" font-size="12" fill="#7a4a00">GC</text>
  <circle cx="142" cy="118" r="16" fill="#26c27a" stroke="#0f7a48" stroke-width="2.5"/><text x="142" y="123" font-size="12" fill="#fff">SC</text></g>
</svg>`;
function verifyPop() {
  if (!S.user) return;
  const pending = S.user.kyc === 'pending';
  openModal(`<div class="vp-art">${GIFT_ART}</div>
    <h2 class="vp-title">Get ${gcv(VERIFY_GC)} + ${scv(VERIFY_SC)} for verifying!</h2>
    <p class="vp-sub">${pending ? 'Your documents are under review. The coins land in your account as soon as it is approved.' : 'Verify your identity and we will add the bonus to your account. It only takes 2 minutes.'}</p>
    ${pending ? '<button class="btn btn-ghost btn-block" data-close>OK</button>' : '<button class="btn btn-accent btn-lg vp-go" data-dsheet="kyc">Verify now</button>'}`);
  $('#modalBox').classList.add('vp-box');
}

/* avatars: 25 drawn portraits, picked in the avatar sheet */
const AV_SKIN = ['#f5d0b5', '#e8b48f', '#c98d63', '#a8693f', '#7a4a2a', '#f2c7a5'];
const AV_HAIR = ['#2b1a12', '#5a3418', '#a8642a', '#e3c16a', '#d9d9d9', '#1c1c2a', '#8a2b2b'];
const AV_BG = [['#6a2bd9', '#2a0f5c'], ['#e0428f', '#5c0f38'], ['#1f9fbf', '#0c3b52'], ['#f2a41f', '#6b3a05'], ['#2fbf71', '#0d4a2b'], ['#d9433f', '#5a1210'], ['#4d6bff', '#151f66']];
const AV_FIT = ['#1d1d2b', '#7a1fd1', '#c2185b', '#0f6b8a', '#b8860b', '#e9e9f2', '#2e7d32', '#3a3a4a'];
const AV_SPEC = [
  [0, 0, 0, 0, 0, 'tie'], [1, 1, 1, 1, 1, 'ear'], [0, 2, 2, 0, 2, 'glass'], [3, 4, 4, 0, 3, 'beard'], [1, 5, 2, 1, 4, 'ear'],
  [2, 3, 3, 1, 5, ''], [0, 1, 1, 0, 6, 'tie'], [5, 4, 4, 1, 7, 'ear'], [0, 0, 5, 0, 0, ''], [5, 2, 5, 2, 1, 'scarf'],
  [5, 3, 5, 2, 5, 'scarf'], [1, 1, 0, 1, 2, 'ear'], [0, 2, 0, 0, 3, 'tie'], [1, 0, 0, 1, 4, 'ear'], [4, 5, 5, 4, 6, 'glass'],
  [0, 1, 0, 3, 0, 'beard'], [2, 0, 3, 1, 1, 'ear'], [1, 2, 6, 1, 2, ''], [3, 3, 1, 3, 3, 'beard'], [0, 4, 2, 0, 4, 'glass'],
  [2, 5, 6, 2, 5, 'crown'], [1, 6, 0, 1, 6, 'ear'], [4, 0, 1, 0, 0, 'tie'], [3, 1, 6, 4, 1, 'ear'], [0, 3, 3, 0, 2, 'crown']
];
/* spec: [hairStyle 0 short,1 long,2 bun,3 bald,4 curly,5 cloth], skin, hair, ?, bg, accessory */
function avatarSvg(i) {
  const [hs, sk, hc, , bg, acc] = AV_SPEC[i % AV_SPEC.length];
  const skin = AV_SKIN[sk], hair = AV_HAIR[hc], [b1, b2] = AV_BG[bg % AV_BG.length], fit = AV_FIT[i % AV_FIT.length];
  const id = `av${i}`;
  const back = hs === 1 ? `<path d="M17 31c0-12 6-19 15-19s15 7 15 19v20H17Z" fill="${hair}"/>` : hs === 5 ? `<path d="M15 33c0-13 7-20 17-20s17 7 17 20l3 31H12Z" fill="#f4f4f6"/>` : '';
  const top = hs === 0 ? `<path d="M20.5 29c0-10 5-15 11.5-15S43.5 19 43.5 29c-2-5-6-7.5-11.5-7.5S22.5 24 20.5 29Z" fill="${hair}"/>`
    : hs === 1 ? `<path d="M20.5 30c0-10 5-15.5 11.5-15.5S43.5 20 43.5 30c-3-6-7-8-11.5-8-3 0-6 1-8 3Z" fill="${hair}"/>`
    : hs === 2 ? `<circle cx="32" cy="12.5" r="5.5" fill="${hair}"/><path d="M20.5 29c0-10 5-15 11.5-15S43.5 19 43.5 29c-2-5-6-7.5-11.5-7.5S22.5 24 20.5 29Z" fill="${hair}"/>`
    : hs === 4 ? `<g fill="${hair}"><circle cx="22" cy="24" r="5"/><circle cx="27" cy="18" r="5.5"/><circle cx="33" cy="16.5" r="5.5"/><circle cx="39" cy="18.5" r="5.5"/><circle cx="43" cy="24" r="5"/></g>`
    : hs === 5 ? `<path d="M19 27c1-9 6-13.5 13-13.5S44 18 45 27c-4-3-8-4-13-4s-9 1-13 4Z" fill="#fff"/><path d="M19 25.5h26" stroke="#1d1d2b" stroke-width="2.4"/>` : '';
  const beard = acc === 'beard' ? `<path d="M21.5 32c1 8.5 5 12.5 10.5 12.5S41.5 40.5 42.5 32c-2.5 3-6 4-10.5 4s-8-1-10.5-4Z" fill="${hair}"/>` : '';
  const extra = acc === 'glass' ? `<g fill="none" stroke="#1d1d2b" stroke-width="1.6"><circle cx="27.5" cy="30" r="3.6"/><circle cx="36.5" cy="30" r="3.6"/><path d="M31 30h2"/></g>`
    : acc === 'ear' ? `<g fill="#ffd34d"><circle cx="20.8" cy="35" r="1.6"/><circle cx="43.2" cy="35" r="1.6"/></g>`
    : acc === 'tie' ? `<path d="M28 49l4 3 4-3-1.5 5h-5Z" fill="#d4af37"/>`
    : acc === 'crown' ? `<path d="M23 16l3-6 3 4 3-6 3 6 3-4 3 6Z" fill="#ffd34d" stroke="#b5760a" stroke-width=".8"/>` : '';
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b1}"/><stop offset="1" stop-color="${b2}"/></linearGradient></defs>
    <rect width="64" height="64" fill="url(#${id})"/>${back}
    <path d="M9 64c2-11 11-16.5 23-16.5S53 53 55 64Z" fill="${fit}"/>${fit === '#e9e9f2' ? '' : '<path d="M27 47.5l5 6 5-6" fill="none" stroke="#fff" stroke-width="2" opacity=".85"/>'}
    <rect x="27.5" y="38" width="9" height="10" rx="3" fill="${skin}"/>
    <ellipse cx="32" cy="30.5" rx="11" ry="12.5" fill="${skin}"/>
    ${beard}${top}
    <g fill="#241812"><ellipse cx="27.5" cy="30" rx="1.5" ry="1.8"/><ellipse cx="36.5" cy="30" rx="1.5" ry="1.8"/></g>
    <path d="M28.5 36.5c2 1.8 5 1.8 7 0" fill="none" stroke="#7a3b2a" stroke-width="1.5" stroke-linecap="round"/>${extra}</svg>`;
}
function avatarHtml(u, cls = '') {
  const m = /^av:(\d+)$/.exec(u.avatar || '');
  if (m) return `<span class="avatar av-img ${cls}">${avatarSvg(+m[1])}</span>`;
  return `<span class="avatar ${cls}" ${u.avatar ? `style="background:${u.avatar}"` : ''}>${esc((u.first[0] || 'P').toUpperCase())}</span>`;
}
function avatarModal() {
  if (!requireLogin()) return;
  setMenu(false);
  const m = /^av:(\d+)$/.exec(S.user.avatar || '');
  S.avSel = m ? +m[1] : 0;
  openModal(`<h2 class="av-title">Choose Avatar</h2>
    <div class="av-prev" id="avPrev">${avatarSvg(S.avSel)}</div><small class="av-cap">PREVIEW</small>
    <label class="lbl" for="avName">Name</label><input class="field" id="avName" maxlength="20" placeholder="Enter name" value="${esc(S.user.first)}">
    <div class="av-h"><b>Select an avatar</b><small>${AV_SPEC.length} available</small></div>
    <div class="av-grid">${AV_SPEC.map((_, i) => `<button class="av-pick ${i === S.avSel ? 'on' : ''}" data-avsel="${i}" aria-label="Avatar ${i + 1}">${avatarSvg(i)}</button>`).join('')}</div>
    <div class="av-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-accent" data-act="av-confirm">Confirm</button></div>`);
  $('#modalBox').classList.add('av-box');
}

/* ---------- load to game (deposit to game balance) ---------- */

const tierFn = tiers => amt => { const t = tiers.find(x => amt >= x[0]); return t ? t[1] : 0; };
const LD = {
  sc: { chips: [10, 25, 50, 100, 500], step: 5, tier: tierFn([[500, 25], [250, 10], [100, 4], [50, 1.5], [25, 0.5]]) },
  gc: { chips: [1000, 2000, 5000, 10000, 50000], step: 500, tier: tierFn([[10000, 150], [5000, 100], [2000, 50]]) }
};
const I2 = {
  chev2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m6 6 6 6 6-6M6 12l6 6 6-6"/></svg>',
  reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1M3.5 4v4.5H8"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  arrowR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>',
  coins: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><ellipse cx="10" cy="7" rx="6" ry="2.6"/><path d="M4 7v4c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6V7M4 11v4c0 1.4 2.7 2.6 6 2.6 1 0 2-.1 2.8-.3"/><circle cx="17.5" cy="16.5" r="3.5"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20M12 8.5S10.5 4 8 4.5 6.5 8.5 12 8.5Zm0 0S13.5 4 16 4.5s1.5 4-4 4Z"/></svg>',
  crown: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 11H5Z"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s5 4.6 5 10a5 5 0 0 1-10 0c0-2.3 1.2-4.2 2.3-5.3.2 1.9 1.2 3.3 2.7 3.3 0-3.2 0-5.4 0-8Z"/></svg>'
};
const dollarCoin = (cls = '') => `<span class="usd-coin ${cls}">$</span>`;

function loadModal(pid) {
  if (!requireLogin()) return;
  const stop = blocked();
  if (stop) return openModal(`<h2>Loading is paused</h2><p>${stop}</p>`);
  if (!acct(pid)) return unlockModal(pid);
  const cur = CUR;
  S.ld = { pid, cur, amt: 0 };
  S.ld.amt = Math.min(LD[cur].chips[0], Math.floor(curBal(cur)));
  openModal(`<div id="ldBox" class="ld">${ldHtml()}</div>`);
  $('#modalBox').classList.add('ld-box');
}
function ldHtml() {
  const { pid, amt, cur } = S.ld, p = plat(pid), a = acct(pid), cfg = LD[cur], bal = curBal(cur);
  const have = cur === 'gc' ? (a.gc || 0) : a.credits;
  const daily = cur === 'sc' && p.daily && !dailyUsed(pid) ? Math.round(amt * p.daily) / 100 : 0;
  const bonus = cfg.tier(amt) + daily;
  const after = have + amt + bonus;
  return `<h2 class="ld-title">Load ${p.name}</h2>
    <div class="ld-tabs">${['sc', 'gc'].map(k => `<button class="${cur === k ? 'on' : ''}" data-act="ld-cur" data-v="${k}">${curTag(k, 'sm')}${k === 'gc' ? 'Gold Coins' : 'Sweeps Coins'}</button>`).join('')}</div>
    <div class="ld-bal">
      <span class="ld-lab">${curTag(cur)}<b>${cur === 'gc' ? 'GC' : 'SC'} in ${p.name}</b></span>
      <span class="ld-flow"><em>${curNum(cur, have)}</em>${I2.arrowR}<strong>${curNum(cur, after)}</strong></span>
    </div>
    <div class="ld-wallet"><span>${curTag(cur, 'sm')}Your balance</span><b>${curNum(cur, bal)}</b><a href="#" class="ld-top" data-act="shop" aria-label="Buy coins">${I.plus}</a></div>
    <p class="ld-info">${I.help}Pick an amount to load into your ${p.name} game balance.</p>
    <div class="ld-down">${I2.chev2}</div>
    <div class="ld-game">${coin(p, 'md')}<b>${p.name}</b><button class="btn btn-outline btn-sm" data-act="play" data-plat="${pid}">${I.play}Start Game</button></div>
    <div class="ld-amt">
      <div class="ld-amt-h"><span>${I2.coins}<b>Select amount</b></span><button class="ld-reset" data-act="ld-reset" ${amt ? '' : 'disabled'}>${I2.reset}Reset</button></div>
      <div class="ld-step">
        <button class="ld-pm" data-act="ld-minus" aria-label="Less" ${amt < cfg.step ? 'disabled' : ''}>${I2.minus}</button>
        <div class="ld-val">${curTag(cur)}<span>${curNum(cur, amt)}</span></div>
        <button class="ld-pm" data-act="ld-plus" aria-label="More" ${amt + cfg.step > bal ? 'disabled' : ''}>${I.plus}</button>
      </div>
      <div class="ld-chips">${cfg.chips.map(v => { const b = cfg.tier(v); return `<button class="ld-chip" data-act="ld-add" data-v="${v}" ${amt + v > bal ? 'disabled' : ''}>+${curNum(cur, v)}${b ? `<i>+${curNum(cur, b)}</i>` : ''}</button>`; }).join('')}
        <button class="ld-chip" data-act="ld-all" ${bal < 1 ? 'disabled' : ''}>All</button></div>
      ${bonus ? `<p class="ld-bonus">${I.bolt}You get <b>${curNum(cur, bonus)} ${cur.toUpperCase()}</b> bonus${daily ? ` (includes +${p.daily}% Daily 1st)` : ''}.</p>` : `<p class="ld-bonus mute">Load ${curNum(cur, cfg.chips[1])} ${cur.toUpperCase()} or more for a bonus.</p>`}
    </div>
    <div class="ld-foot"><button class="btn btn-ghost ld-cancel" data-close>Cancel</button>
      <button class="btn btn-accent ld-go" data-act="ld-go" ${amt < 1 ? 'disabled' : ''}>Load to game ${I2.arrowR}</button></div>
    ${bal < 1 ? `<p class="note">You have no ${cur === 'gc' ? 'Gold Coins' : 'Sweeps Coins'} yet. <a href="#" data-act="shop">Buy coins</a></p>` : ''}`;
}
function ldSet(v) {
  const bal = curBal(S.ld.cur);
  S.ld.amt = Math.max(0, Math.min(S.ld.cur === 'gc' ? Math.floor(bal) : Math.floor(bal * 100) / 100, S.ld.cur === 'gc' ? Math.round(v) : Math.round(v * 100) / 100));
  $('#ldBox').innerHTML = ldHtml();
}
function ldGo() {
  const { pid, amt, cur } = S.ld, p = plat(pid), a = S.user.accounts[pid], cfg = LD[cur];
  const stop = blocked();
  if (stop) { toast(stop); return; }
  if (amt < 1 || amt > curBal(cur)) { toast('Not enough coins for that'); return; }
  const tier = cfg.tier(amt);
  if (cur === 'gc') {
    S.user.gc -= amt; a.gc = (a.gc || 0) + amt + tier; S.loadPlat = pid;
    addTx({ kind: 'Loads', label: 'Loaded Gold Coins', p: pid, amt: -amt, cur: 'gc', status: 'done' });
    if (tier) addTx({ kind: 'Bonus', label: 'GC load bonus', p: pid, amt: tier, cur: 'gc', status: 'done' });
    closeModal(); refresh();
    toast(`${gcv(amt)} loaded into ${p.name}${tier ? ` + ${gcv(tier)} bonus` : ''}`);
    return;
  }
  S.user.wallet -= amt; a.credits += amt; S.loadPlat = pid;
  addTx({ kind: 'Loads', label: 'Loaded credits', p: pid, amt: -amt, status: 'done' });
  if (Math.floor(amt) > 0) addPts(`Loaded ${p.name}`, Math.floor(amt));
  let extra = 0;
  if (tier) { a.credits += tier; extra += tier; addTx({ kind: 'Bonus', label: `Load bonus (${amt.toFixed(0)}+ SC)`, p: pid, amt: tier, status: 'done' }); }
  if (p.daily && !dailyUsed(pid)) {
    const d = Math.round(amt * p.daily) / 100;
    a.credits += d; extra += d;
    addTx({ kind: 'Bonus', label: `Daily 1st bonus (+${p.daily}%)`, p: pid, amt: d, status: 'done' });
  }
  closeModal(); refresh();
  toast(`${scv(amt)} loaded into ${p.name}${extra ? ` + ${scv(extra)} bonus` : ''}`);
}

/* ---------- game login card ---------- */

function credLine(label, value, secret) {
  const shown = !secret || S.showPw;
  return `<div class="gc-line"><div><small>${label}:</small><b class="${secret && !shown ? 'dots' : ''}">${shown ? esc(value) : '&bull;'.repeat(Math.min(10, value.length))}</b></div>
    ${secret ? `<button class="gc-btn" data-act="pw" aria-label="${shown ? 'Hide' : 'Show'} password">${shown ? I.eyeOff : I.eye}</button>` : ''}
    <button class="gc-btn" data-copyval="${esc(value)}" data-what="${label}" aria-label="Copy ${label.toLowerCase()}">${I.copy}</button></div>`;
}
function credsCard(pid, opts = {}) {
  const p = plat(pid), a = acct(pid), g = opts.gameId ? game(opts.gameId) : null;
  return `<div class="gc-badge">${coin(p, 'lg')}</div>
    <div class="gc-card">
      <h2>${g ? esc(g.name) : p.name}</h2>
      <p class="gc-sub">${opts.fresh ? `Your ${p.name} account is ready. ` : ''}${g ? `In the ${p.name} app. ` : ''}${a.linked ? 'Linked to your existing login.' : 'Log in to the game with these.'}</p>
      ${credLine('Username', a.username)}
      ${credLine('Password', a.password, true)}
      <div class="gc-row2">${a.linked ? '' : `<button class="gc-reset" data-act="reset-pw" data-plat="${pid}">${I2.reset}Reset password</button>`}<button class="gc-reset" data-act="gedit" data-plat="${pid}">${I.key}Edit login</button></div>
      <button class="btn btn-accent gc-play" data-act="web" data-plat="${pid}" ${g ? `data-game-id="${g.id}"` : ''}>Play ${g ? esc(g.name) : p.name} ${I2.ext}</button>
      <div class="gc-meta"><span><b>${scv(a.credits)}</b> &middot; <b>${gcv(a.gc || 0)}</b></span>
        <a href="#" data-act="load" data-plat="${pid}">Load</a>
        <a href="#" data-act="redeem" data-plat="${pid}" ${a.credits < 1 ? 'aria-disabled="true" class="off"' : ''}>Redeem</a>
        <a href="#" data-act="download" data-plat="${pid}">Get app</a></div>
    </div>`;
}
function openCreds(pid, opts) {
  openModal(credsCard(pid, opts));
  $('#modalBox').classList.add('gc-box');
  S.credsOpen = { pid, opts };
}
function gameCredsModal(pid, fresh) { openCreds(pid, { fresh }); }
function playModal(pid, gameId) {
  if (!requireLogin()) return;
  if (!acct(pid)) return unlockModal(pid);
  openCreds(pid, { gameId });
}

/* ---------- shop (wallet packages) ---------- */

const SHOP_PKGS = [5, 10, 20, 30, 50, 80, 100, 200, 500];
const FIRST_EXTRA = 0.20;
const firstDone = () => S.user && S.user.tx.some(t => t.kind === 'Deposits');

function shopModal(tab) {
  if (!requireLogin()) return;
  S.shopTab = tab || S.shopTab || (firstDone() ? 'packs' : 'first');
  openModal(`<div id="shopBox">${shopHtml()}</div>`);
  $('#modalBox').classList.add('shop-box');
}
function shopHtml() {
  const first = S.shopTab === 'first', used = firstDone();
  const card = v => {
    const base = v, ex = Math.round(v * FIRST_EXTRA * 100) / 100;
    return `<div class="pk ${first ? 'pk-first' : ''} ${v === 500 ? 'pk-best' : ''}">
      ${v === 500 ? '<span class="pk-deal">BEST DEAL</span>' : ''}${first ? `<span class="pk-tag">+${FIRST_EXTRA * 100}% SC</span>` : ''}
      <div class="pk-amt">${curTag('gc', 'lg')}<b>${(v * GC_PER_USD).toLocaleString('en-US')}</b></div>
      <small class="pk-lab">Gold Coins</small>
      <div class="pk-free"><span class="pk-f">FREE</span>${curTag('sc')}<span class="pk-v"><b>+${fmt(first ? base + ex : base)}</b>${first ? `<em>(${fmt(base)}+${fmt(ex)})</em>` : ''}</span></div>
      <button class="pk-buy" data-act="pkg" data-v="${v}" ${first && used ? 'disabled' : ''}>$${v}.00</button>
    </div>`;
  };
  return `<h2 class="shop-title">Shop</h2>
    <div class="shop-tabs"><button class="${first ? '' : 'on'}" data-act="shop-tab" data-tab2="packs">${I2.coins}Packages</button><button class="${first ? 'on' : ''}" data-act="shop-tab" data-tab2="first">${I2.crown}First Deposit</button></div>
    ${first
      ? `<p class="shop-note first">${I2.flame}${used ? 'You have already made your first deposit. This offer is one-time only.' : `First deposit exclusive: up to <b>+${FIRST_EXTRA * 100}%</b> extra SC. One time only.`}</p>`
      : `<p class="shop-note">${I2.gift}Purchase GC and get FREE SC as a bonus!</p>`}
    <div class="pk-grid">${SHOP_PKGS.map(card).join('')}</div>
    <p class="note">Paid in crypto. Gold Coins are for fun and have no cash value. Sweeps Coins can be redeemed, 1 SC = $1.</p>`;
}
function buyPackage(v) {
  const first = S.shopTab === 'first' && !firstDone();
  const bonus = Math.round(v * (1 + (first ? FIRST_EXTRA : 0)) * 100) / 100;
  S.pkg = { amt: v, bonus, first };
  S.method = null;
  openBalSheet('deposit');
}

/* ---------- deposit address (shared by deposit + shop) ---------- */

function depositAddress(amt) {
  const c = CRYPTO.find(x => x.id === S.method);
  const addr = c.pre + Array.from({ length: 30 }, () => 'abcdefghjkmnpqrstuvwxyz023456789'[Math.floor(Math.random() * 32)]).join('');
  const pk = S.pkg && S.pkg.amt === amt ? S.pkg : null;
  openModal(`<div class="modal-coin">${cryptoIco(c)}</div><h2>Send ${usd(amt)} in ${c.code}</h2><p>Send to this address. Only send ${c.code} on the ${c.name} network.</p>
    <div class="bonus-note">${I.bolt}You get ${gcv(amt * GC_PER_USD)} + ${scv(pk ? pk.bonus : amt)} free.</div>
    <div class="addr"><div class="qr" aria-hidden="true">${Array.from({ length: 49 }, (_, i) => `<i class="${(i * 7 + addr.charCodeAt(i % addr.length)) % 3 ? '' : 'on'}"></i>`).join('')}</div>
      <div class="cred"><label>Deposit address (demo)</label><div class="cred-row"><code>${addr}</code><button class="icon-btn" data-copyval="${addr}" data-what="Address">${I.copy}</button></div></div></div>
    <div class="warn">This address is for this deposit only. Your wallet updates after the network confirms it.</div>
    <button class="btn btn-accent btn-block" data-act="sent" data-amount="${amt}" style="margin-top:16px">I've sent it</button>`);
}

/* ---------- coin loader ---------- */

function coinHtml(size) {
  const face = site().img
    ? `<img src="${site().img}" alt="">`
    : site().svg ? site().svg
    : `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#f2c14b"/><circle cx="16" cy="16" r="12.5" fill="#0f211b"/><path d="M16 7.5l2.4 5 5.4.6-4 3.7 1.1 5.4L16 19.5l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6Z" fill="#f2c14b"/></svg>`;
  const edges = Array.from({ length: 11 }, (_, i) => `<i class="c-edge" style="transform:translateZ(${(i - 5) * 1.1}px)"></i>`).join('');
  return `<div class="coin3d-wrap" style="--cs:${size}px" role="img" aria-label="Loading"><span class="coin3d-glow"></span>
    <div class="coin3d"><span class="c-face back">${face}</span>${edges}<span class="c-face front">${face}</span></div></div>`;
}

let loaderTimer;
function showLoader(ms = 450, full = false) {
  const el = document.getElementById('loader');
  if (!el) return;
  el.innerHTML = coinHtml(full ? 140 : 92);
  el.classList.toggle('soft', !full);
  el.classList.remove('off');
  clearTimeout(loaderTimer);
  loaderTimer = setTimeout(hideLoader, ms);
}
function hideLoader() { const el = document.getElementById('loader'); if (el) el.classList.add('off'); }

function launch(pid, gameId) {
  const p = plat(pid), a = acct(pid), g = gameId ? game(gameId) : GAMES.find(x => x.p === pid);
  openModal(`<div class="launch-stage"><div class="launch-blur" style="background-image:url(${g.img})"></div>
      <div class="launch-mid"><div id="lcoin">${coinHtml(110)}</div><h3>${p.name}</h3><p id="lmsg">Opening ${p.name}&hellip;</p><div class="bar"><i id="lbar"></i></div></div></div>
    <div class="launch-foot">${coin(p, 'xs')}<span>${p.name}</span><span>as <code>${esc(a.username)}</code></span><span>${scv(a.credits)} credits</span>
      <button class="btn btn-ghost btn-sm" data-close>Back</button></div>`, true);
  let pct = 0;
  S.launchTimer = setInterval(() => {
    pct = Math.min(100, pct + 10);
    const bar = $('#lbar'), msg = $('#lmsg');
    if (!bar) return clearInterval(S.launchTimer);
    bar.style.width = pct + '%';
    if (pct >= 100) { clearInterval(S.launchTimer); msg.textContent = `In the live site this opens the ${p.name} web version in a new tab.`; const lc = $('#lcoin'); if (lc) lc.innerHTML = `<img class="launch-art" src="${g.img}" alt="">`; }
  }, 200);
}


function redeemModal(pid) {
  const p = plat(pid), a = acct(pid);
  openModal(`<div class="modal-coin">${coin(p, 'md')}</div><h2>Redeem from ${p.name}</h2><p>Credits go back to your ${BRAND()} wallet. You can then withdraw or load another game.</p>
    <div class="wallet-line">${p.name} credits <b>${scv(a.credits)}</b></div>
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
  if (open) { const d = $('#drawer'); d.classList.remove('dash-drawer'); d.innerHTML = menuHtml(); }
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
  const cm = document.getElementById('curMenu'); if (cm && !cm.hidden && !e.target.closest('.cur-wrap')) cm.hidden = true;
  const t = e.target.closest('[data-game],[data-act],[data-copyval],[data-cat],[data-close],[data-close-menu],[data-bal],[data-tab],[data-chip],[data-menu],[data-method],[data-amt],[data-rw],[data-theme-set],[data-site-pick],[data-auth-via],[data-bslide],[data-post],[data-video],[data-vreview],[data-cur],[data-avsel],[data-vsel],[data-prnav],[data-prmore],[data-bal-go],[data-close-after],.dash-quick a,.dash-links a,[data-balsheet],[data-sheet],[data-dsheet],[data-wtab],[data-lang-set],.m-list a,.m-prof-link');
  if (!t) return;
  if (t.dataset.balGo) { S.bal = t.dataset.balGo; S.pendingSheet = t.dataset.balGo; S.pkg = null; S.method = null; }
  if (t.dataset.closeAfter !== undefined) closeModal();
  if (t.dataset.balGo && !t.dataset.act) { if (location.hash === '#/balance') { closeModal(); render(true); } return; }
  if (t.dataset.closeAfter !== undefined && !t.dataset.act) return;
  if (t.matches('.m-list a, .m-prof-link, .dash-quick a, .dash-links a') && !t.dataset.act) { setMenu(false); return; }
  if (t.dataset.menu !== undefined) { e.preventDefault(); setChat(false); return setMenu(!document.body.classList.contains('menu-open')); }
  if (t.dataset.closeMenu !== undefined) return setMenu(false);
  if (t.dataset.close !== undefined) return closeModal();
  if (t.dataset.post) { postModal(t.dataset.post); return; }
  if (t.dataset.video) { videoModal(t.dataset.video); return; }
  if (t.dataset.vreview) { videoReviewModal(+t.dataset.vreview); return; }
  if (t.dataset.cur) { CUR = t.dataset.cur; store.set('pp_cur', CUR); $('#topRight').innerHTML = topRight(); I18N.walk($('#topRight')); return; }
  if (t.dataset.avsel) { S.avSel = +t.dataset.avsel; $('#avPrev').innerHTML = avatarSvg(S.avSel); document.querySelectorAll('.av-pick').forEach(b => b.classList.toggle('on', +b.dataset.avsel === S.avSel)); return; }
  if (t.dataset.vsel) { S.vsel = +t.dataset.vsel; $('#vsBox').innerHTML = videoSpot(); return; }
  if (t.dataset.prnav) { prStep(+t.dataset.prnav); return; }
  if (t.dataset.prmore !== undefined) { const c = t.closest('.pr-card'); c.classList.toggle('open'); t.textContent = c.classList.contains('open') ? 'See less' : 'See more'; return; }
  if (t.dataset.sitePick) { pickSite(t.dataset.sitePick); return; }
  if (t.dataset.authVia) { const f = t.closest('#modalBox').querySelector('[name=first]'); if (f) pending.first = f.value; S.authVia = t.dataset.authVia; if (S.authModal === 'login') { const el = document.createElement('button'); el.dataset.act = 'login'; document.body.append(el); el.click(); el.remove(); } else signupStep(1); return; }
  if (t.dataset.langSet) { setLang(t.dataset.langSet); if ($('#chooser').hidden) render(true); if (document.body.classList.contains('menu-open')) setMenu(true); return; }
  if (t.dataset.bslide) { setBSlide(+t.dataset.bslide); startBSlides(); return; }
  if (t.dataset.themeSet) { setTheme(t.dataset.themeSet); toast(`${THEMES_NOW().find(x => x[0] === t.dataset.themeSet)[1]} theme`); return; }
  if (t.dataset.amt) { t.closest('form').amt.value = t.dataset.amt; return; }
  if (t.dataset.game) { const g = game(t.dataset.game); return playModal(g.p, g.id); }
  if (t.dataset.cat) {
    S.cat = t.dataset.cat;
    const grid = $('#gameGrid');
    if (!grid) return;
    grid.innerHTML = gameGrid(GAMES.filter(g => g.p === grid.dataset.plat));
    document.querySelectorAll('[data-cat]').forEach(b => b.classList.toggle('on', b.dataset.cat === S.cat));
    return;
  }
  if (t.dataset.bal) { S.bal = t.dataset.bal; return render(true); }
  if (t.dataset.balsheet) { S.pkg = null; S.method = null; if (t.dataset.balsheet === 'shop') shopModal(); else openBalSheet(t.dataset.balsheet); return; }
  if (t.dataset.sheet) { setMenu(false); openSheet(t.dataset.sheet); return; }
  if (t.dataset.dsheet) { setMenu(false); openDashSheet(t.dataset.dsheet); return; }
  if (t.dataset.wtab) { const w = t.closest('.winners'); w.querySelectorAll('[data-wtab]').forEach(b => b.classList.toggle('on', b === t)); w.querySelectorAll('.win-pane').forEach(p => { p.hidden = p.dataset.pane !== t.dataset.wtab; }); return; }
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
    else if ($('#modalBox .gc-card') && S.credsOpen) openCreds(S.credsOpen.pid, S.credsOpen.opts);
    else document.querySelectorAll('#modalBox .cred').forEach(c => { const b = c.querySelector('[data-act="pw"]'); if (b) { const v = c.querySelector('[data-copyval]').dataset.copyval; c.outerHTML = credRow('Password', v, v, true); } });
  }
  if (a === 'signup') { setMenu(false); signupStep(1); }
  if (a === 'resend') toast(`New code sent to ${pending.via === 'phone' ? `${pending.cc} ${pending.phone}` : pending.email}`);
  if (a === 'login') {
    setMenu(false);
    S.authModal = 'login';
    const via = S.authVia || 'email';
    openModal(`<h2>Log in</h2><p>Use your ${BRAND()} email, username or phone.</p>
      ${authTabs('Account')}
      <form class="form-row" data-form="login">
        ${via === 'phone' ? phoneField() : '<input class="field" name="u" placeholder="Email or username" autocomplete="username" required>'}
        <input class="field" type="password" name="p" placeholder="Password" autocomplete="current-password" required>
        <a href="#" class="forgot" data-act="forgot">Forgot password?</a>
        <button class="btn btn-accent btn-block" type="submit">Log in</button>
      </form>
      <p class="note">New here? <a href="#" data-act="signup">Create an account</a></p>`);
  }
  if (a === 'forgot') toast('A reset link goes to your email or phone in the live site');
  if (a === 'logout') { setMenu(false); S.user = null; store.set('pp_user', null); S.showPw = false; goHome(); toast('Signed out'); }
  if (a === 'unlock') unlockModal(pid);
  if (a === 'unlock-go') {
    S.user.accounts[pid] = { username: `${S.user.username.replace(/^(pp|ld|rc)_/, '').slice(0, 10)}_${pid.slice(0, 2)}${Math.floor(100 + Math.random() * 900)}`, password: makePw(), credits: 0 };
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
  if (a === 'gedit') {
    const p = plat(pid), ga = acct(pid);
    openModal(`<div class="modal-coin">${coin(p, 'md')}</div><h2>Edit ${p.name} login</h2><p>Change it here if you changed it in the ${p.name} app, or to pick your own.</p>
      <form class="form-row" data-form="gedit"><input type="hidden" name="plat" value="${pid}">
        <label class="lbl" for="ge-u">Username</label><input id="ge-u" class="field" name="u" value="${esc(ga.username)}" autocomplete="off" required minlength="3" maxlength="24">
        <label class="lbl" for="ge-p">Password</label><input id="ge-p" class="field" name="p" value="${esc(ga.password)}" autocomplete="off" required minlength="4" maxlength="32">
        <button class="btn btn-accent btn-block" type="submit">Save login</button>
      </form>
      <p class="note"><a href="#" data-act="gcreds" data-plat="${pid}">Back</a></p>`);
  }
  if (a === 'download') downloadModal(pid);
  if (a === 'play') playModal(pid);
  if (a === 'web') launch(pid, t.dataset.gameId);
  if (a === 'store') toast(`${t.dataset.store} download link goes here in the live site`);
  if (a === 'load') loadModal(pid);
  if (a === 'ld-add') ldSet(S.ld.amt + Number(t.dataset.v));
  if (a === 'ld-plus') ldSet(S.ld.amt + 5);
  if (a === 'ld-minus') ldSet(S.ld.amt - 5);
  if (a === 'ld-reset') ldSet(0);
  if (a === 'ld-all') ldSet(S.user.wallet);
  if (a === 'ld-go') ldGo();
  if (a === 'shop') { setMenu(false); shopModal(); }
  if (a === 'cur-menu') { const m = $('#curMenu'); if (m) m.hidden = !m.hidden; return; }
  if (a === 'ld-cur') { S.ld.cur = t.dataset.v; S.ld.amt = Math.min(LD[S.ld.cur].chips[0], Math.floor(curBal(S.ld.cur))); $('#ldBox').innerHTML = ldHtml(); return; }
  if (a === 'avatar-pick') avatarModal();
  if (a === 'av-confirm') { const n = ($('#avName').value || '').trim(); S.user.avatar = 'av:' + S.avSel; if (n) S.user.first = n.slice(0, 20); closeModal(); refresh(); syncQuests(); if (document.body.classList.contains('menu-open')) setMenu(true); toast('Avatar updated'); }
  if (a === 'verify-pop') verifyPop();
  if (a === 'claim-x') { S.claimHidden = true; claimStrip(); }
  if (a === 'all-reviews') allReviewsModal();
  if (a === 'shop-tab') { S.shopTab = t.dataset.tab2; $('#shopBox').innerHTML = shopHtml(); }
  if (a === 'pkg') buyPackage(Number(t.dataset.v));
  if (a === 'reset-pw') { S.user.accounts[pid].password = makePw(); S.showPw = true; refresh(); openCreds(pid, S.credsOpen && S.credsOpen.pid === pid ? S.credsOpen.opts : {}); toast('New password made. Use it next time you log in.'); }
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
    refresh(); toast(`${scv(it.cash)} added to cashable`);
  }
  if (a === 'cash-move') {
    const c = S.user.cashable;
    S.user.wallet += c; S.user.cashable = 0;
    addTx({ kind: 'Bonus', label: 'Rewards cash to wallet', amt: c, status: 'done' });
    refresh(); toast(`${scv(c)} moved to your wallet`);
  }
  if (a === 'avatar') { S.user.avatar = t.dataset.c; refresh(); syncQuests(); render(true); }
  if (a === 'share') {
    const link = t.dataset.link;
    if (navigator.share) navigator.share({ title: BRAND(), text: `Join me on ${BRAND()}`, url: link }).catch(() => {});
    else { if (navigator.clipboard) navigator.clipboard.writeText(link).catch(() => {}); toast('Invite link copied'); }
  }
  if (a === 'bell') toast('No new notifications');
  if (a === 'telegram') toast('Your Telegram channel link goes here');
  if (a === 'get-app') { setMenu(false); openModal(`<h2>Download the app</h2><p>Install ${BRAND()} on your phone for faster access.</p><div class="dl-list"><button class="opt" data-act="store" data-store="Android"><b>Android</b><small>Download the APK</small>${I.dl}</button><button class="opt" data-act="store" data-store="iPhone"><b>iPhone</b><small>Add to Home Screen</small>${I.dl}</button></div>`); }
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
    if (!c) return;
    if (S.pkg) { const stop = blocked(); if (stop) { toast(stop); return; } if (S.user.limit && todayDeposits() + S.pkg.amt > S.user.limit) { toast(`That would pass your $${S.user.limit} daily limit`); return; } depositAddress(S.pkg.amt); return; }
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
    const pk = S.pkg && S.pkg.amt === amt ? S.pkg : null; S.pkg = null;
    settleLater(id, () => { const gc = amt * GC_PER_USD; S.user.gc += gc; S.user.wallet += amt; addTx({ kind: 'Bonus', label: 'Gold Coins purchased', amt: gc, cur: 'gc', status: 'done' }); addTx({ kind: 'Bonus', label: 'Free Sweeps Coins', amt, status: 'done' }); let extra = 0; if (pk && pk.first) { extra = Math.round(amt * FIRST_EXTRA * 100) / 100; S.user.wallet += extra; addTx({ kind: 'Bonus', label: 'First deposit bonus', amt: extra, status: 'done' }); } toast(`Purchase confirmed: ${gcv(gc)} + ${scv(amt + extra)} free`); });
    closeModal(); refresh(); toast('Waiting for network confirmation (demo: about 4 seconds)');
  }
  if (a === 'withdraw-now') {
    const c = CRYPTO.find(x => x.id === S.method);
    openModal(`<div class="modal-coin">${cryptoIco(c)}</div><h2>Withdraw to ${c.name}</h2><p>From your wallet (${scv(S.user.wallet)}). Minimum $${MIN_WITHDRAW}.</p>
      <form class="form-row" data-form="withdraw">
        <input class="field" name="amt" type="number" min="${MIN_WITHDRAW}" step="0.01" max="${S.user.wallet}" placeholder="Amount ($)" required>
        <input class="field" name="addr" placeholder="Your ${c.code} address" required>
        <button class="btn btn-accent btn-block" type="submit">Request withdrawal</button>
      </form>
      ${S.user.wallet < MIN_WITHDRAW ? `<p class="note">Your wallet has less than $${MIN_WITHDRAW}. Redeem credits from a game first.</p>` : ''}`);
  }
  if (a === 'twofa') { S.user.twofa = !S.user.twofa; refresh(); if (document.body.classList.contains('menu-open')) setMenu(true); toast(`Two-step login ${S.user.twofa ? 'on' : 'off'}`); }
  if (a === 'music') { S.user.music = !S.user.music; refresh(); if (document.body.classList.contains('menu-open')) setMenu(true); toast(`Background music ${S.user.music ? 'on' : 'off'}`); }
  if (a === 'lang') { setLang(LANG === 'en' ? 'es' : 'en'); render(true); if (document.body.classList.contains('menu-open')) setMenu(true); }
  if (a === 'kyc-start') {
    S.user.kyc = 'pending'; closeModal(); refresh(); if (document.body.classList.contains('menu-open')) setMenu(true); toast('Documents submitted for review (demo: approved in about 4 seconds)');
    setTimeout(() => { if (!S.user || S.user.kyc !== 'pending') return; S.user.kyc = 'verified'; S.user.gc += VERIFY_GC; S.user.wallet += VERIFY_SC; addTx({ kind: 'Bonus', label: 'Verification bonus', amt: VERIFY_GC, cur: 'gc', status: 'done' }); addTx({ kind: 'Bonus', label: 'Verification bonus', amt: VERIFY_SC, status: 'done' }); refresh(); toast(`Verified! ${gcv(VERIFY_GC)} + ${scv(VERIFY_SC)} added`); }, 4000);
  }
  if (a === 'cool') { S.user.coolUntil = Date.now() + Number(t.dataset.h) * 3600e3; closeModal(); refresh(); toast('Break started. Deposits and loading are paused.'); }
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
  if (k === 'quick') { pending.email = d.email; S.authVia = 'email'; signupStep(1); }
  if ((k === 'email' || k === 'login') && d.phone && d.phone.replace(/[^0-9]/g, '').length < 6) { toast('Enter a phone number with at least 6 digits'); return; }
  if (k === 'email') { pending.first = d.first.trim(); pending.via = d.phone ? 'phone' : 'email'; if (d.phone) { pending.cc = d.cc; pending.phone = d.phone.replace(/[^0-9]/g, ''); pending.email = ''; } else { pending.email = d.email.trim(); pending.phone = ''; } signupStep(2); }
  if (k === 'code') {
    S.user = normUser({ first: pending.first, email: pending.email || '', phone: pending.via === 'phone' ? `${pending.cc} ${pending.phone}` : '', since: new Date().toISOString().slice(0, 10), ...makeCreds(pending.first) });
    S.showPw = true;
    save();
    history.replaceState(null, '', location.pathname + location.search + '#/');
    render();
    signupStep(3);
  }
  if (k === 'login') {
    const saved = normUser(store.get('pp_account', null));
    const name = (d.u || '').trim();
    const digits = d.phone ? d.phone.replace(/[^0-9]/g, '') : '';
    const match = saved && (d.phone ? (saved.phone || '').replace(/[^0-9]/g, '').endsWith(digits) : (name.toLowerCase() === saved.username.toLowerCase() || name.toLowerCase() === (saved.email || '').toLowerCase()));
    S.user = match ? saved : d.phone ? normUser({ ...demoUser('player' + digits.slice(-4), d.p), first: 'Player', email: '', phone: `${d.cc} ${digits}` }) : demoUser(name, d.p);
    save();
    closeModal(); goHome(); toast(`Welcome back, ${S.user.first}`);
  }
  if (k === 'pw') {
    if (d.cur !== S.user.password) { toast('Current password is wrong'); return; }
    S.user.password = d.next; f.reset(); closeModal(); refresh(); toast('Password updated');
  }
  if (k === 'user') {
    if (d.cur !== S.user.password) { toast('Current password is wrong'); return; }
    const next = d.next.trim();
    if (next === S.user.username) { toast('That is already your username'); return; }
    S.user.username = next; closeModal(); refresh(); toast(`Username changed to ${next}`);
  }
  if (k === 'deposit') {
    const stop = blocked();
    if (stop) { toast(stop); return; }
    if (S.user.limit && todayDeposits() + amt > S.user.limit) { toast(`That would pass your $${S.user.limit} daily limit`); return; }
    depositAddress(amt);
  }
  if (k === 'withdraw') {
    if (amt > S.user.wallet) { toast('More than your wallet balance'); return; }
    const c = CRYPTO.find(x => x.id === S.method);
    S.user.wallet -= amt;
    addTx({ kind: 'Withdrawals', label: `Withdrawal (${c.name})`, amt: -amt, status: 'pending' });
    closeModal(); refresh(); toast(`Withdrawal of ${scv(amt)} requested. Track it under Activity.`);
  }
  if (k === 'load') {
    const stop = blocked();
    if (stop) { toast(stop); return; }
    if (amt > S.user.wallet) { toast(`Not enough in your wallet (${scv(S.user.wallet)})`); return; }
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
      closeModal(); refresh(); toast(`${scv(amt)} loaded into ${lp.name} + ${scv(bonus)} daily first-load bonus`);
    } else { closeModal(); refresh(); toast(`${scv(amt)} loaded into ${lp.name}`); }
  }
  if (k === 'gedit') {
    const ga = S.user.accounts[d.plat];
    ga.username = d.u.trim(); ga.password = d.p; ga.linked = true;
    S.showPw = false; refresh(); gameCredsModal(d.plat); toast(`${plat(d.plat).name} login updated`);
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
    settleLater(id, () => { S.user.wallet += amt; toast(`${scv(amt)} from ${plat(d.plat).name} is in your wallet`); });
    closeModal(); refresh(); toast('Redeem requested. It lands in your wallet shortly (demo: 4 seconds).');
  }
  if (k === 'p2p') {
    if (amt > S.user.wallet) { toast('More than your wallet balance'); return; }
    S.user.wallet -= amt;
    addTx({ kind: 'P2P', label: `Sent to ${d.to}`, amt: -amt, status: 'done' });
    f.reset(); closeModal(); refresh(); toast(`Sent ${scv(amt)} to ${d.to}`);
  }
  if (k === 'phone') { S.user.phone = d.phone.trim(); closeModal(); refresh(); toast('Phone number saved'); }
  if (k === 'voucher') {
    if (d.code.trim().toUpperCase() === 'WELCOME5' && !S.user.tx.some(t => t.label === 'Voucher WELCOME5')) {
      S.user.wallet += 5;
      addTx({ kind: 'Vouchers', label: 'Voucher WELCOME5', amt: 5, status: 'done' });
      closeModal(); refresh(); toast('$5.00 added to your wallet');
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
  if (k === 'limit') { S.user.limit = Number(d.limit); closeModal(); refresh(); toast(S.user.limit ? `Daily deposit limit set to $${S.user.limit}` : 'Daily deposit limit removed'); }
  if (k === 'reason' || k === 'chat') {
    S.chat.push({ me: true, t: k === 'reason' ? d.r : d.m });
    S.chat.push({ t: 'Thanks. An agent will reply here shortly.' });
    setChat(true);
  }
});

document.addEventListener('input', e => {
  if (e.target.matches('[data-volume]')) { S.user.volume = Number(e.target.value); save(); const sm = e.target.closest('.d-row').querySelector('small'); if (sm) sm.textContent = S.user.volume + '%'; }
  if (e.target.matches('[data-search]')) {
    S.q = e.target.value;
    const grid = $('#gameGrid');
    if (!grid) return;
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

window.addEventListener('hashchange', () => { S.cat = 'All'; S.q = ''; closeModal(); setMenu(false); showLoader(420); render(); });
if (location.hash && location.hash !== '#/') history.replaceState(null, '', location.pathname + location.search + '#/');
const wantSite = new URLSearchParams(location.search).get('site');
if (wantSite) history.replaceState(null, '', location.pathname + '#/');
applySite(wantSite === 'b' ? 'b' : 'a');
render();
siteSwitch();
fillLangPicks();
I18N.start();
if (wantSite === 'a' || wantSite === 'b') showLoader(500, true);
else { showLoader(1300, true); setTimeout(showChooser, 1300); }
