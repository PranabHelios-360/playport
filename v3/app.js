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
const featuredPlatforms = [
  PLATFORMS[0], {id:'rsweeps', name:'RSweeps', preview:true},
  {id:'golden-treasure', name:'Golden Treasure', preview:true},
  ...['vegas','firekirin','orion','panda','juwa'].map(id => PLATFORMS.find(p => p.id === id))
];
let spotlightIndex = 2;

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
  user: normUser(store.get('p3_user', null)),
  cat: 'All',
  q: '',
  showPw: false,
  hideBalance: store.get('r777_hide_balance',false) === true,
  bal: 'deposit',
  method: 'btc',
  actTab: 'done',
  actChip: 'All',
  chat: [],
  rw: 'today'
};

function persistDemoChange(previous, next) {
  if (next.kioskDemo) return;
  const session = localStorage.getItem('p3_user');
  let stored;
  try { stored = JSON.parse(session); } catch { stored = null; }
  if (!stored || Object.keys(stored).some(key => JSON.stringify(stored[key]) !== JSON.stringify(previous[key]))) {
    throw Error('Your account changed in another tab. Refresh before trying again.');
  }
  const data = JSON.stringify(next);
  try {
    localStorage.setItem('p3_user', data);
    if (!next.demoSession) {
      try { localStorage.setItem('p3_account', data); }
      catch (error) { localStorage.setItem('p3_user', session); throw error; }
    }
  } catch {
    throw Error('Could not save on this device. Check browser storage and retry.');
  }
}

function save() {
  if (S.user?.kioskDemo) return;
  store.set('p3_user', S.user);
  if (S.user && !S.user.demoSession) store.set('p3_account', S.user);
}

/* ---------- sites ---------- */

const SITES = {
  a: { name: 'Skillandslots', word: 'Skilland<b>slots</b>', mark: '<path d="M10 9h12v3.2L15.8 23h-4.3l6.1-10.6H10Z" fill="var(--on-accent)"/>', theme: '#0b0f20', img: 'assets/logos/r777-logo.png' },
  b: { name: 'Loaded777', word: 'Loaded<b>777</b>', svg: '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="l7g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe7a1"/><stop offset=".45" stop-color="#e3a21a"/><stop offset=".75" stop-color="#ffd25a"/><stop offset="1" stop-color="#b9780c"/></linearGradient><radialGradient id="l7c" cx=".5" cy=".38" r=".65"><stop offset="0" stop-color="#3d1418"/><stop offset="1" stop-color="#120607"/></radialGradient></defs><circle cx="32" cy="32" r="31" fill="url(#l7g)"/><circle cx="32" cy="32" r="25.5" fill="url(#l7c)" stroke="#7a4a08" stroke-width="1.2"/><path d="M20.5 17.5h24v6.2L33.6 46.5h-8.4l10.6-21.2H20.5Z" fill="#e2343f" stroke="#ffd36b" stroke-width="2.2" stroke-linejoin="round"/><path d="M23 20.4h18.5" stroke="#ff9aa0" stroke-width="1.6" stroke-linecap="round" opacity=".75"/></svg>', mark: '<path d="M16 7.5l2.4 5 5.4.6-4 3.7 1.1 5.4L16 19.5l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6Z" fill="var(--on-accent)"/>', theme: '#0c0809' }
};
// Flat, scalable brand marks shared by header, drawer, footer and loader.
SITES.a.img = null;
SITES.a.svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" fill=\"none\" aria-hidden=\"true\"><defs><linearGradient id=\"rgold\" x1=\"8\" y1=\"4\" x2=\"54\" y2=\"61\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#ffe4f5\"/><stop offset=\".28\" stop-color=\"#bb1677\"/><stop offset=\".5\" stop-color=\"#ff9bd6\"/><stop offset=\".75\" stop-color=\"#9f185f\"/><stop offset=\"1\" stop-color=\"#ffc4e8\"/></linearGradient><radialGradient id=\"rcore\"><stop stop-color=\"#34204c\"/><stop offset=\"1\" stop-color=\"#101b38\"/></radialGradient></defs><circle cx=\"32\" cy=\"32\" r=\"30\" fill=\"url(#rgold)\"/><circle cx=\"32\" cy=\"32\" r=\"27\" fill=\"url(#rcore)\" stroke=\"#ffb4df\" stroke-width=\".7\"/><circle cx=\"32\" cy=\"32\" r=\"24.5\" stroke=\"#d72d90\" stroke-width=\".6\"/><path d=\"M36 9L15 35h15l-4 20 23-30H34l2-16Z\" fill=\"url(#rgold)\" stroke=\"#ffe6f6\" stroke-width=\".8\" stroke-linejoin=\"round\"/><path d=\"M12 17A26 26 0 0 1 42 8\" stroke=\"#fff0fa\" stroke-width=\"1.2\" stroke-linecap=\"round\" opacity=\".7\"/></svg>";
SITES.b.svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" fill=\"none\" aria-hidden=\"true\"><rect width=\"64\" height=\"64\" rx=\"20\" fill=\"#f5b82e\"/><path d=\"M18 15h30L32 34h11L22 52l7-22H18l12-9H18z\" fill=\"#151a31\"/></svg>";
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
  setTheme(curTheme());
  document.title = SITES[k].name + ' | Your games. One wallet.';
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) favicon.href = k === 'b' ? 'assets/logos/loaded-mark.svg' : 'assets/logos/recharge-mark.svg';
  document.querySelectorAll('header .logo').forEach(el => { el.innerHTML = logoInner(); el.setAttribute('aria-label', SITES[k].name + ' home'); });
}

/* ---------- demo feed data ---------- */

const BIG = [
  ['firekirin', 'luckyrae', '11/20/2026 02:00 PM', 2020], ['milkyway', 'reelking', '11/20/2026 12:06 PM', 2000],
  ['orion', 'goldie9', '11/19/2026 11:24 PM', 1000], ['juwa', 'nate_x', '11/19/2026 10:15 PM', 1166],
  ['panda', 'kayla22', '11/19/2026 07:40 PM', 1082], ['vegas', 'dex808', '11/19/2026 05:02 PM', 950]
];

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
  coins: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="14" cy="6" rx="7" ry="3"/><path d="M7 6v4c0 1.7 3.1 3 7 3s7-1.3 7-3V6m0 4v4c0 1.7-2.6 2.9-6 3"/><ellipse cx="8" cy="14" rx="6" ry="2.7"/><path d="M2 14v4c0 1.5 2.7 2.7 6 2.7s6-1.2 6-2.7v-4"/></svg>',
  controller: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M7 6h10c2 0 3 1.3 3.6 4l1 5.5c.6 3.4-2.3 4.7-4.4 2.5L15 15H9l-2.2 3c-2.1 2.2-5 .9-4.4-2.5l1-5.5C4 7.3 5 6 7 6Z"/><path d="M8 9v5m-2.5-2.5h5M15 11h.1m2.4-1.8h.1"/></svg>',
  receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h10l4 4v14H5Z"/><path d="M14 3v5h5M8 12h8m-8 4h6"/></svg>',
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

function topRight() {
  if (S.site === 'a' && ['kiosk','kiosk-pair'].includes(route().r)) return '<a class="btn btn-ghost btn-sm" href="#/">Home</a>';
  if (S.user && S.site === 'a' && route().r === 'balance' && !route().arg) {
    return `<a class="wallet-profile" href="#/account" aria-label="My account">${I.user}</a>`;
  }
  if (!S.user && S.site !== 'b' && route().name === 'home') return `<button class="btn btn-ghost guest-login" data-act="login" ${route().r==='login'?'aria-current="page"':''}>Login</button><button class="btn btn-accent guest-register" data-act="landing-register" ${route().r==='login'?'':'aria-current="page"'}>Register</button>`;
  if (!S.user) return `<button class="wallet-toggle" data-act="wallet-panel" aria-label="Open wallet overview">${I.wallet}</button><button class="btn btn-ghost btn-sm" data-act="login">Sign in</button><button class="btn btn-accent btn-sm" data-act="signup">Sign up</button>`;
  return `<a class="round-btn" href="#/rewards" aria-label="Rewards">${I.gift}${canCheckin() ? '<i class="dot"></i>' : ''}</a>
    <button class="round-btn" data-act="bell" aria-label="Notifications">${I.bell}</button>
    <button class="bal" data-act="wallet-panel" aria-label="Open wallet overview"><span class="bal-plus">${I.plus}</span><span class="bal-num">${S.site !== 'b' && S.hideBalance ? '••••' : usd(S.user.wallet)}</span><span>⌄</span></button>`;
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
    <a class="row-main" href="#/platform/${p.id}">${coin(p)}<span><b>${p.name}</b><small>${a ? `${usd(a.credits)} credits` : `${p.games} games`}</small></span></a>
    ${a ? `<button class="btn btn-outline btn-row" data-act="gcreds" data-plat="${p.id}">${I.eyeO}View</button>`
        : `<button class="btn btn-outline btn-row" data-act="unlock" data-plat="${p.id}">${I.lockO}Unlock</button>`}
  </div>`;
}

/* ---------- views ---------- */

function landingReviews() {
  const configured = Array.isArray(window.RECHARGE_CONTENT?.reviews) ? window.RECHARGE_CONTENT.reviews.filter(r => r && typeof r.quote === 'string' && typeof r.name === 'string').slice(0,4) : [];
  const sample = configured.length === 0;
  const reviews = sample ? [
    {name:'Sample player',quote:'I like having my game platforms together in one place.'},
    {name:'Sample player',quote:'The game categories make it easy to find what I want to explore.'},
    {name:'Sample player',quote:'The layout feels clear on my phone and my tablet.'},
    {name:'Sample player',quote:'Switching between the light and dark themes is a nice touch.'}
  ] : configured;
  return `<section class="player-stories" aria-labelledby="stories-title">
    <div class="stories-intro"><p class="section-kicker">THE SKILLANDSLOTS COMMUNITY</p><h2 id="stories-title">Every player.<br>A different story.</h2><p>A place for the experiences, favorites, and feedback that make our community.</p>
    ${sample ? '<span class="preview-label">Design preview · sample reviews</span><p class="review-note">These examples show the layout. They are not customer testimonials.</p>' : '<span class="community-note">Player reviews</span>'}</div>
    <div class="review-grid">${reviews.map((r,i)=>`<article class="review-card"><div class="review-top"><span class="quote-mark" aria-hidden="true">“</span><span>${sample?'SAMPLE REVIEW':'PLAYER REVIEW'}</span></div><blockquote>${esc(r.quote)}</blockquote><div class="review-person"><span class="review-avatar avatar-${i}" aria-hidden="true">${sample?'R':esc(r.name.slice(0,1))}</span><div><b>${esc(r.name)}</b><small>${sample?'Preview content':esc(r.location||'Skillandslots community')}</small></div></div></article>`).join('')}</div>
  </section>`;
}

function appDownloadSection() {
  const config = window.RECHARGE_CONTENT || {};
  const storeLink = (raw,host) => { try { const url=new URL(raw); return url.protocol==='https:' && url.hostname===host ? url.href : null; } catch { return null; } };
  const ios = storeLink(config.iosUrl,'apps.apple.com'), android=storeLink(config.androidUrl,'play.google.com');
  const badge = (url,icon,top,label) => url ? `<a class="store-badge" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${icon}<span><small>${top}</small><b>${label}</b></span></a>` : `<button class="store-badge" disabled aria-label="${label} download unavailable in this preview">${icon}<span><small>${top}</small><b>${label}</b></span></button>`;
  const apple = '<svg viewBox="0 0 24 28" aria-hidden="true"><path fill="currentColor" d="M17.5 0c.3 2-1.1 4-2.2 5.1-1.2 1.2-2.8 1.8-4.2 1.6-.3-1.9 1-3.9 2.1-5C14.5.6 16.1 0 17.5 0ZM21.1 21.3c-.8 1.8-1.2 2.6-2.3 4.2-1.4 2-3.3 2.2-5.2 1.3-1.7-.8-3.3-.8-5.1.1-1.8.8-3.2.6-4.6-1.3C.1 20.3-.8 13.8 1.9 10.3c1.8-2.5 5-2.8 7.1-1.8 1.5.7 2.6.8 4.3 0 2.4-1.1 5.3-.8 7.2 1.6-4.4 2.7-3.6 8.5.6 10.2v1Z"/></svg>';
  const play = '<svg viewBox="0 0 26 28" aria-hidden="true"><path fill="#65d6b4" d="M2 1v26l13-13Z"/><path fill="#6db6ff" d="m2 1 16 9-3 4Z"/><path fill="#ffcf5c" d="m15 14 3-4 7 4-7 4Z"/><path fill="#f7839f" d="m2 27 13-13 3 4Z"/></svg>';
  return `<section class="app-promo" aria-labelledby="app-title"><div class="app-promo-copy"><p class="section-kicker">YOUR NEXT SESSION, ANYWHERE</p><h2 id="app-title">Take <span>Skillandslots</span><br>with you.</h2><p>Explore your platforms from your phone, tablet, or computer.</p><div class="store-badges">${badge(ios,apple,'Download on the','App Store')}${badge(android,play,'Get it on','Google Play')}</div>${!ios||!android?'<p class="download-note">Preview: official app download links have not been provided.</p>':''}<a class="mobile-browser-link" href="#/games">Explore games in your browser</a></div>
    <div class="phone-scene" aria-hidden="true"><span class="floating-coin coin-one">7</span><span class="floating-coin coin-two">7</span><span class="floating-coin coin-three">7</span><div class="demo-phone"><div class="phone-island"></div><div class="phone-brand">Skilland<b>slots</b></div><img src="assets/landing/recharge-hero.png" alt="" loading="lazy"><div class="phone-caption">YOUR GAME LIBRARY</div><div class="phone-games"><span class="category-art art-slots"></span><span class="category-art art-fish"></span><span class="category-art art-store"></span></div><div class="phone-action">Explore games</div><div class="phone-nav">Home &nbsp; Games &nbsp; Wallet</div></div></div>
  </section>`;
}

function authPasswordField(id,name,label,placeholder,isNew=true) {
  return `<div class="join-field"><label for="${id}">${label}</label><div class="join-input">${I.lock}<input id="${id}" name="${name}" type="password" ${isNew ? 'minlength="8" autocomplete="new-password"' : 'autocomplete="current-password"'} required placeholder="${placeholder}"><button type="button" data-act="join-visibility" aria-controls="${id}" aria-label="Show password" aria-pressed="false">${I.eyeOff}</button></div></div>`;
}

function landingLogin() {
  const remembered = store.get('p3_login_name','');
  return `<div class="page guest-auth-page"><section class="landing-register return-screen" aria-labelledby="return-title">
    <header class="return-hero"><img src="assets/platform-scenes/vegas.jpg" alt="" fetchpriority="high"><div><h1 id="return-title"><span>Welcome</span> <em>back!</em></h1><p>Sign in to your Skillandslots account.</p></div></header>
    <form class="register-panel return-panel demo-entry" data-form="demo-login">
      <div class="join-field"><label for="demo-player">Demo player ID</label><div class="join-input">${I.user}<input id="demo-player" name="player" type="text" required autocomplete="off" placeholder="Enter any player ID"></div></div>
      <button class="register-submit" type="submit"><span>Open demo wallet</span>${I.chev}</button>
      <p class="register-note">Sample balance and activity. No password needed.</p>
    </form>
    <details class="saved-login" ${remembered?'open':''}><summary>Sign in to a saved account</summary>
    <form class="register-panel return-panel" data-form="login">
      <div class="login-via" role="tablist" aria-label="Sign in with"><button type="button" role="tab" class="on" aria-selected="true" data-login-via="account">Account</button><button type="button" role="tab" aria-selected="false" data-login-via="phone">Phone</button></div>
      <div class="join-field" data-via="account"><label for="return-name">Username or email</label><div class="join-input">${I.user}<input id="return-name" name="u" autocomplete="username" required placeholder="Enter your username or email" value="${esc(remembered)}"></div></div>
      <div class="join-field" data-via="phone" hidden><label for="return-phone">Phone number</label><div class="login-phone-row"><select name="cc" aria-label="Country calling code" disabled><option value="+1">US +1</option><option value="+1">CA +1</option><option value="+52">MX +52</option><option value="+34">ES +34</option></select><div class="join-input"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10.5 18.5h3"/></svg><input id="return-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" required disabled placeholder="Your phone number"></div></div></div>
      ${authPasswordField('return-password','p','Password','Enter your password',false)}
      <div class="return-options"><label class="register-consent"><input name="rememberName" type="checkbox" ${remembered?'checked':''}><span>Remember my login name</span></label><button class="auth-link" type="button" data-act="login-help">Forgot password?</button></div>
      <button class="register-submit" type="submit">${I.bolt}<span>Sign in</span><span aria-hidden="true">→</span></button>
      <p class="auth-divider">Social sign-in unavailable in this demo</p>
      <div class="provider-buttons"><button disabled type="button">Google</button><button disabled type="button">Apple</button></div>
      <div class="auth-switch"><span>New here?</span> <a href="#/register">Create an account</a></div></form>
    </details></section></div>`;
}

function welcomeEntry() {
  return `<div class="page guest-auth-page"><section class="welcome-entry">
    <div class="welcome-art"><img src="assets/landing/join-777.jpg" alt="" fetchpriority="high"><span aria-hidden="true">777</span></div><div class="welcome-copy">
    <h1>Play. <em>Recharge.</em></h1><p>Your home for game platforms, fish games, and slots.</p>
    <nav class="entry-shortcuts"><a href="#/games/platforms">${I.controller}<span>Games</span></a><a href="#/store">${I.coins}<span>Coin shop</span></a><a href="#/rewards">${I.gift}<span>Rewards</span></a></nav>
    <a class="register-submit" href="#/register">${I.user}<span>Create free account</span></a>
    <a class="continue-guest" href="#/login">${I.out}<span>Sign in</span></a>
    <a class="auth-link" href="#/games/platforms">Continue as guest</a></div></section></div>`;
}

function signupProgress(step) {
  return `<ol class="signup-progress" aria-label="Registration progress"><li ${step===1?'aria-current="step"':''}><b>${step===2?'✓':'1'}</b><span>Account</span></li><li ${step===2?'aria-current="step"':''}><b>2</b><span>Verify</span></li></ol>`;
}

function landingRegistration() {
  if (S.user) return '';
  return `<section class="landing-register guardian-registration" aria-labelledby="register-title">
    <header class="guardian-intro">
      <img src="assets/landing/guardian-register.webp" alt="" width="510" height="254" fetchpriority="high">
      <div><h1 id="register-title"><span>Create your</span> <em>account</em></h1>
      <p>Manage your game accounts and credits in one place.</p></div>
    </header>
    <form class="register-panel" data-form="join">
      <div class="join-field"><label for="join-email">Email</label><div class="join-input"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/></svg><input id="join-email" name="email" type="email" autocomplete="email" required placeholder="Your email address"></div></div>
      ${authPasswordField('join-password','password','Password','At least 8 characters')}
      ${authPasswordField('join-confirm','confirm','Confirm password','Confirm your password')}
      <div class="join-consents"><div class="register-consent"><input id="join-terms" type="checkbox" required aria-labelledby="join-policy-label"><div id="join-policy-label"><label for="join-terms">I accept the</label> <button type="button" data-act="foot-doc" data-doc="Terms of service">Terms of service</button> <span>and</span> <button type="button" data-act="foot-doc" data-doc="Privacy policy">Privacy policy</button></div></div>
      <label class="register-consent"><input type="checkbox" required><span>I am 21 or older.</span></label>
      <label class="register-consent"><input type="checkbox" name="offers"><span>Send me offers and updates (optional).</span></label></div>
      <button class="register-submit" type="submit">${I.user}<span>Register now</span></button>
      <p class="register-note">Demo registration · Account saved on this device.</p>
      <div class="guardian-divider"><span>or</span></div>
      <a class="continue-guest" href="#/games/platforms">${I.user}<span>Continue as guest</span></a>
      <div class="auth-switch"><span>Already have an account?</span> <a href="#/login">Sign in</a></div>
    </form></section>`;
}

function viewHome() {
  if (S.user) return highlightsHome();
return `<div class="page recharge-home premium-home">
${landingRegistration()}
${platformSpotlight()}
${typeof extrasSection === 'function' ? extrasSection() : ''}
${featureRewards()}${communityUpdates()}</div>`;
}

function viewCatalog(category) {
  if (S.cat === 'All' && ['Slots','Fish'].includes(category)) S.cat=category;
  return `<div class="page">${crumb(['Games','#/games'],[category==='all'?'All games':category==='Fish'?'Fish games':'Slots'])}<div class="catalog-intro"><p class="section-kicker">FIND YOUR NEXT FAVORITE</p><h1>${category==='all'?'All games':category==='Fish'?'Dive into fish games.':'Explore the reels.'}</h1><p>Browse titles across all platforms. Each platform uses its own game account.</p></div><div class="filters">${['All','Fish','Slots','Keno'].map(c=>`<button class="chip ${S.cat===c?'on':''}" data-cat="${c}">${c}</button>`).join('')}<label class="search">${I.search}<input type="search" placeholder="Search games" value="${esc(S.q)}" data-search aria-label="Search games"></label></div><div class="grid" id="gameGrid" data-plat="all">${gameGrid(GAMES)}</div></div>`;
}

function viewStore() {
  return renderCoinShop(route().arg, S.user?.tx || []);
}


function viewGames() {
  return `<div class="page charged-lobby">${platformDirectory(true)}</div>`;
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
  const cover = id === 'milkyway' ? 'milkyway-cover.webp' : p.id + '.jpg';
  return `<div class="page platform-detail">
    ${crumb(['Games', '#/games'], [p.name])}
    <section class="platform-pass">
      <div class="platform-cover"><img src="assets/platform-scenes/${cover}" alt="">${id === 'milkyway' ? '' : coin(p,'md')}</div>
      <div class="platform-intro"><h1>${p.name}</h1>${tags(p)}<p>${p.blurb}</p>
        ${a ? `<button class="platform-login" data-copyval="${esc(a.username)}" data-what="Username">Your game login <strong>${esc(a.username)}</strong>${I.copy}</button>` : '<p>Unlock a game account to play.</p>'}
        <div class="platform-buttons">${a
          ? `<button data-act="load" data-plat="${p.id}">${I.coins}Load credits</button><button class="play-primary" data-act="play" data-plat="${p.id}">${I.play}Play now</button>`
          : `<button class="play-primary" data-act="unlock" data-plat="${p.id}">${I.key}Unlock account</button><button data-act="download" data-plat="${p.id}">${I.dl}Get the app</button>`}</div>
      </div>
    </section>
    ${a ? `<section class="platform-balance"><h2>Game balance <strong>${usd(a.credits)}</strong></h2><div class="platform-tools">
      <button data-act="gcreds" data-plat="${p.id}">${I.key}Account details</button>
      <button data-act="redeem" data-plat="${p.id}" ${a.credits<1?'disabled':''}>${I.arrowL}Redeem</button>
      <a href="#/activity">${I.receipt}History</a></div></section>` : ''}
    ${p.daily ? `<div class="platform-bonus"><img src="assets/platform-scenes/first-load-chest.webp" alt=""><div><b>Daily first-load bonus</b><strong>+${p.daily}% game credits</strong>${dailyUsed(p.id)?'<small>Already received today</small>':''}</div></div>` : ''}
    ${S.user ? `<button class="platform-accounts" data-sheet="games">${I.controller}Your game accounts ${I.chev}</button>` : ''}
  </div>`;
}

const BAL_ITEMS = [
  { id: 'deposit', label: 'Deposit', sub: 'Add funds to your wallet', color: 'var(--action)', icon: I.plus },
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
  { id: 'usdt', name: 'Tether', code: 'USDT', bg: '#26a17b', sym: '&#8366;', pre: 'T' }
];
const cryptoIco = c => `<span class="cry" style="background:${c.bg}">${c.sym}${c.bolt ? `<i>${I.bolt}</i>` : ''}</span>`;

function balPanel(id) {
  const it = BAL_ITEMS.find(b => b.id === id);
  const head = (t, s) => `<div class="panel-h"><span class="mini-ico" style="background:${it.color}">${it.icon}</span><div><h2>${t}</h2><p>${s}</p></div></div>`;
  const walletLine = `<div class="wallet-line">Wallet balance <b>${usd(S.user.wallet)}</b></div>`;
  const cryptoList = () => `<div class="opt-list">${CRYPTO.map(c => `<button class="opt cry-opt ${S.method === c.id ? 'on' : ''}" data-method="${c.id}" aria-pressed="${S.method === c.id}">${cryptoIco(c)}<b>${c.name}</b><small>(${c.code})</small>${S.method === c.id ? `<span class="tick-ok">${I.check}</span>` : ''}</button>`).join('')}</div>`;
  const unlocked = PLATFORMS.filter(p => acct(p.id));
  const noGames = `<div class="card soft"><b>No game accounts yet</b><p class="card-sub">Unlock a game first. Each game gets its own login.</p><a class="btn btn-accent" href="#/games">Unlock a game</a></div>`;
  const stop = blocked();
  if (id === 'deposit') return head('Deposit', `Choose the crypto you want to deposit. Minimum $${MIN_DEPOSIT}.`) + walletLine + (stop ? `<div class="warn">${stop}</div>` : cryptoList() +
    `<div class="sticky-cta"><button class="btn btn-accent btn-lg" data-act="deposit-now">Deposit Now</button></div>`);
  if (id === 'withdraw') return `<section class="withdraw-sheet"><header class="cash-cover"><h2>Withdraw</h2><p>From your demo wallet to a crypto address.</p><small>Minimum withdrawal · ${usd(MIN_WITHDRAW)}</small></header>
    <div class="cash-body">${walletLine}<p class="cash-hint">Redeem game credits first to include them in your wallet balance.</p><h3>Withdrawal method</h3>${cryptoList()}
    <button class="btn cash-primary" data-act="withdraw-now" ${S.user.wallet<MIN_WITHDRAW?'disabled':''}>Continue with ${CRYPTO.find(c=>c.id===S.method).name} →</button>
    ${S.user.wallet<MIN_WITHDRAW?'<p class="note">Your wallet is below the withdrawal minimum.</p>':''}</div></section>`;
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
  if (S.site === 'a' && route().arg === 'deposit') return depositPage();
  if (S.site !== 'b') {
    const amount = value => S.hideBalance ? '••••' : usd(value);
    const descriptions = {withdraw:'Withdraw from your wallet',redeem:'Move game credits to your balance'};
    return `<div class="page member-wallet">
      <header class="wallet-heading"><h1>Balance</h1>
        <p>Manage your funds, transfers, and rewards.</p></header>
      <section class="wallet-banner" aria-label="Wallet balance"><div class="wallet-figures">
        <div class="wallet-caption"><span>${S.user.demoSession ? 'Demo balance' : 'Wallet balance'}</span><button type="button" data-act="toggle-balance" aria-label="${S.hideBalance ? 'Show balance' : 'Hide balance'}">${S.hideBalance ? I.eyeOff : I.eye}</button></div>
        <strong>${amount(S.user.wallet)}</strong><span class="wallet-currency">USD</span><small><b>${amount(creditsTotal())}</b> <span>in game credits</span></small>
      </div><i class="wallet-illustration" aria-hidden="true"></i></section>
      <h2 class="wallet-actions-title">Wallet actions</h2>
      <div class="wallet-actions-grid">${BAL_ITEMS.map(item=>`<button type="button" class="wallet-action-tile" data-balsheet="${item.id}"><span class="wallet-action-icon" aria-hidden="true"></span><span class="wallet-action-copy"><b>${item.label}</b><small>${descriptions[item.id] || item.sub}</small></span><span class="wallet-action-chevron" aria-hidden="true">${I.chev}</span></button>`).join('')}</div>
      <a href="#/rewards" class="wallet-offers"><i class="wallet-gift-art" aria-hidden="true"></i><div><h2>Rewards &amp; bonuses</h2><p>Explore your rewards and offers.</p></div><span>View offers ${I.chev}</span></a>
      <p class="wallet-age">21+ <span aria-hidden="true">•</span> <button type="button" data-act="foot-doc" data-doc="Responsible play">Play responsibly</button></p>
    </div>`;
  }
  return `<div class="page narrow-page">
    ${crumb(['Balance'])}
    <h1 class="product-heading">${S.user.demoSession ? 'Demo wallet' : 'Your wallet'}</h1>
    <section class="total-card"><div><small>Available balance</small><b>${usd(S.user.wallet)}</b><span>${usd(creditsTotal())} in game credits</span></div>
      <div class="wallet-primary"><button class="btn btn-accent" data-balsheet="deposit">${I.plus}Deposit</button>
      <button class="btn btn-outline" data-balsheet="withdraw">Withdraw</button></div></section>
    <div class="act-grid">${BAL_ITEMS.slice(2).map(b => `<button class="act-card" data-balsheet="${b.id}" style="--ic:${b.color}">
      <span class="mini-ico" style="background:${b.color}">${b.icon}</span><span class="act-txt"><b>${b.label}</b><small>${b.sub}</small></span>${I.chev}</button>`).join('')}</div>
  </div>`;
}
function openBalSheet(id) {
  if (id === 'deposit' && S.site === 'a') {
    closeModal();
    location.hash = '#/balance/deposit';
    return;
  }
  S.bal = id;
  openModal(`<div id="balPanel" class="bal-sheet">${balPanel(id)}</div>`);
}

function viewActivity() {
  if (!S.user) return needLogin('Activity');
  const chips = ['All', 'Deposits', 'Withdrawals', 'Loads', 'Redeems', 'P2P', 'Vouchers', 'Bonus'];
  const rows = S.user.tx.filter(t => (S.actTab === 'done' ? t.status === 'done' : t.status === 'pending') && (S.actChip === 'All' || t.kind === S.actChip));
  return `<div class="page activity-plain">
    ${crumb(['Activity'])}
    <div class="tabs">
      <button class="${S.actTab === 'done' ? 'on' : ''}" data-tab="done">Finished</button>
      <button class="${S.actTab === 'pending' ? 'on' : ''}" data-tab="pending">In progress</button>
    </div>
    <div class="filters">${chips.map(c => `<button class="chip ${S.actChip === c ? 'on' : ''}" data-chip="${c}">${c}</button>`).join('')}</div>
    ${rows.length ? `<div class="rows tx">${rows.map(t => { const p = t.p && plat(t.p); return `<div class="row-card slim">
        <div class="row-main">${p ? coin(p, 'sm') : `<span class="tx-ico">${t.amt >= 0 ? I.plus : I.arrowL}</span>`}<span><b>${esc(t.label)}</b><small>${p ? esc(p.name) + ' &middot; ' : ''}${esc(t.when)}</small></span></div>
        <div class="row-acts"><b class="${t.amt >= 0 ? 'pos' : 'neg'}">${t.amt >= 0 ? '+' : '-'}${usd(Math.abs(t.amt))}</b>${t.status === 'pending' ? '<span class="pend">Processing</span>' : ''}</div>
      </div>`; }).join('')}</div>`
      : '<p class="empty big">No transactions found for the selected filter</p>'}
  </div>`;
}

function featuredDestination(p) {
  return p.preview ? `data-act="featured-preview" data-featured-id="${p.id}"` : `href="#/platform/${p.id}"`;
}

function spotlightStage() {
  return [-2,-1,0,1,2].map(offset => {
    const count = featuredPlatforms.length;
    const p = featuredPlatforms[(spotlightIndex + offset + count) % count];
    const center = offset === 0;
    const tag = center && !p.preview ? 'a' : 'button';
    const action = center ? featuredDestination(p) : `data-act="spotlight-${offset < 0 ? 'prev' : 'next'}" data-distance="${Math.abs(offset)}"`;
    const art = p.id === 'golden-treasure' ? '' : p.id === 'rsweeps'
      ? '<span class="rs-face"><b>R</b><small>RSWEEPS</small></span>'
      : `<img src="assets/platform-scenes/${p.id}.jpg" draggable="false" alt="">`;
    return `<${tag} class="showcase-coin" data-motion-key="${p.id}" data-slot="${offset}" aria-label="${p.name}" ${action}>${art}${center?flowEdge(true):''}</${tag}>`;
  }).join('');
}

function spotlightCaption() {
  const p = featuredPlatforms[spotlightIndex];
  const tag = p.preview ? 'button' : 'a';
  return `<${tag} class="showcase-caption" ${featuredDestination(p)}><strong>${p.name}</strong><span>Explore this platform</span></${tag}>`;
}

function platformSpotlight(lobby = false) {
  const heading = lobby ? 'h1' : 'h2';
  return `<section class="world-collection" aria-labelledby="collection-title"><div class="showcase-inner">
    <header><span class="showcase-brand" role="img" aria-label="Skillandslots"></span><p>Featured platforms</p>
    <${heading} id="collection-title"><span>Your next favorite.</span><em>One swipe away.</em></${heading}></header>
    <div class="collection-stage" id="spotlightStage" data-original="${featuredPlatforms[spotlightIndex].id === 'golden-treasure'}">${spotlightStage()}</div>
    <div id="spotName" aria-live="polite">${spotlightCaption()}</div>
    <div class="collection-controls"><button type="button" data-act="spotlight-prev" aria-label="Previous platform">${I.chev}</button>
    <span class="collection-position" aria-hidden="true">${featuredPlatforms.map((p,i)=>`<i class="${i === spotlightIndex ? 'current' : ''}"></i>`).join('')}</span>
    <button type="button" data-act="spotlight-next" aria-label="Next platform">${I.chev}</button>${carouselPause()}</div>
    <a class="collection-all" href="#/browse/all"><span>View all games</span><span aria-hidden="true">→</span></a>
    <p class="showcase-foot">Browse platforms. Find your favorite.</p></div></section>`;
}

function advanceSpotlight(step) {
  if (document.querySelector('.home-world-stage')) return advanceHomeWorld(step);
  const stage = document.getElementById('spotlightStage');
  if (!stage) return;
  const count = featuredPlatforms.length;
  spotlightIndex = (spotlightIndex + step + count) % count;
  const restoreFocus = stage.contains(document.activeElement);
  stage.dataset.original = featuredPlatforms[spotlightIndex].id === 'golden-treasure';
  RechargeMotion.updatePositions(stage,()=>{stage.innerHTML = spotlightStage();});
  if (restoreFocus) stage.querySelector('[data-slot="0"]').focus({preventScroll:true});
  document.querySelectorAll('.collection-position i').forEach((dot,i) => dot.classList.toggle('current', i === spotlightIndex));
  document.getElementById('spotName').innerHTML = spotlightCaption();
}
let spotlightTouch;
document.addEventListener('touchstart', event => {
  spotlightTouch = event.target.closest('.collection-stage,.home-world-stage') && event.touches.length === 1 ? event.touches[0] : null;
}, {passive:true});
document.addEventListener('touchend', event => {
  if (!spotlightTouch) return;
  const delta = event.changedTouches[0].clientX - spotlightTouch.clientX;
  const vertical = event.changedTouches[0].clientY - spotlightTouch.clientY;
  spotlightTouch = null;
  if (Math.abs(delta) < 40 || Math.abs(delta) <= Math.abs(vertical)) return;
  if (event.cancelable) event.preventDefault();
  advanceSpotlight(delta < 0 ? 1 : -1);
}, {passive:false});
document.addEventListener('touchcancel', () => { spotlightTouch = null; });
document.addEventListener('keydown', event => {
  if (!event.target.closest('.world-collection,.member-world-hero') || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  advanceSpotlight(event.key === 'ArrowLeft' ? -1 : 1);
});

function viewActivityPreview(){
  const cards=PLATFORMS.slice(0,3).map(p=>{const g=GAMES.find(x=>x.p===p.id);return `<a class="pulse-card" href="#/platform/${p.id}"><img src="${g.img}" alt=""><span>${coin(p,'sm')}<b>${p.name}</b><small>${p.games} titles to explore</small></span></a>`}).join('');
  return `<div class="page activity-preview">${crumb(['Activity & Highlights'])}<header class="pulse-hero"><p class="section-kicker">PLATFORM PULSE</p><h1>Activity & highlights.</h1><p>Explore curated platform highlights from Skillandslots. Live rankings and winner data are not connected yet.</p><div class="preview-trust"><span>CURATED PREVIEW</span><span>No live payout claims</span></div></header><section class="pulse-feature"><div><p class="section-kicker">FEATURED NOW</p><h2>Three places to start.</h2></div><div class="pulse-grid">${cards}</div></section><section class="pulse-explainer"><span class="pulse-info">i</span><div><h3>How highlights are selected</h3><p>This preview uses the platform catalog available in the demo. When verified activity data is connected, this area can show real trends with a clear update time and methodology.</p></div></section><section class="pulse-list"><div class="list-h"><div><p class="section-kicker">CATALOG HIGHLIGHTS</p><h2>Explore the full lineup.</h2></div><a class="btn btn-outline" href="#/games">View platforms</a></div>${PLATFORMS.map(p=>`<a href="#/platform/${p.id}">${coin(p,'sm')}<span><b>${p.name}</b><small>${p.games} available titles</small></span><em>Explore</em></a>`).join('')}</section></div>`;
}

function avatarFace(user) {
  if (user.avatar === 'tuxedo') return '<img src="assets/profile/tuxedo.jpg" alt="">';
  return esc((user.first || user.username || 'R').slice(0,1).toUpperCase());
}

function avatarBackground(user) {
  return AVATARS.includes(user.avatar) ? `style="background:${user.avatar}"` : '';
}

function memberCard(user) {
  const verified = user.verified === true;
  return `<div class="member-card">
    <button class="edit-avatar" data-act="edit-avatar" aria-label="Edit avatar"><span class="member-face" ${avatarBackground(user)}>${avatarFace(user)}</span><span class="edit-nib" aria-hidden="true">✎</span></button>
    <div class="member-identity"><b>${esc(user.first || user.username)}</b><button class="member-id" data-copyval="${esc(user.username)}" data-what="Player ID" aria-label="Copy player ID"><span>Player ID</span><strong>${esc(user.username)}</strong>${I.copy}</button></div>
    <span class="member-status${verified ? ' verified' : ''}">${verified ? I.shield : I.lock}<span>${verified ? 'Verified player' : 'Unverified'}</span></span>
    <span class="member-flash" aria-hidden="true">${I.bolt}</span></div>`;
}

function viewAccount() {
  if (!S.user) return needLogin('Profile');
  const u = S.user, n = unlockedCount();
  const row = (ico, title, sub, attrs, right) => `<${attrs.startsWith('href') ? 'a' : 'button'} class="set-row" ${attrs}><span class="set-ico">${ico}</span><span class="set-txt"><b>${title}</b><small>${sub}</small></span>${right || I.chev}</${attrs.startsWith('href') ? 'a' : 'button'}>`;
  return `<div class="page narrow-page profile-page">
    <header class="profile-heading">${crumb(['Profile'])}
    <h1 class="product-heading">My account</h1></header>
    ${memberCard(u)}
    <p class="member-since"><span class="profile-mail" aria-hidden="true">✉</span> ${esc(u.email)} &middot; <span>Member since</span> ${new Date(u.since).toLocaleDateString(document.documentElement.lang || 'en', { month: 'short', year: 'numeric' })}</p>
    <section class="money-card">
      <div class="mc-cols"><div><small>${I.wallet}<span>Wallet</span></small><b>${usd(u.wallet)}</b></div><div><small>${I.controller}<span>In games</span></small><b>${usd(creditsTotal())}</b></div><div><small>${I.trophy}<span>Points</span></small><b>${u.points.toLocaleString('en-US')}</b></div></div>
      <div class="mc-acts"><a class="round-act" href="#/balance" data-bal-go="deposit"><span class="ra-ico dep">${I.plus}</span>Deposit</a><a class="round-act" href="#/balance" data-bal-go="withdraw"><span class="ra-ico wd">${I.dl}</span>Withdraw</a></div>
    </section>
    <div class="set-list">
      ${row(I.user, 'Change username', esc(u.username), 'data-sheet="user"')}
      ${row(I.lock, 'Change password', 'Security settings', 'data-sheet="pw"')}
      ${row(I.shield, 'Two-step login', u.twofa ? 'On: a code is asked at every login' : 'Off', `data-act="twofa" role="switch" aria-checked="${Boolean(u.twofa)}"`, `<span class="switch ${u.twofa ? 'on' : ''}"><i></i></span>`)}
      ${row(I.key, 'Game accounts', `${n} of ${PLATFORMS.length} unlocked`, 'data-sheet="games"')}
    </div>
    <div class="set-list">
      ${row(I.gift.replace('<svg', '<svg class="gift-ico"'), 'Invite & Earn', 'Share your link, earn rewards when friends deposit', 'data-rw="you"')}
      ${row(I.receipt, 'Transactions', 'Order history', 'href="#/activity"')}
      ${row(I.help, 'Help Center', 'Chat with support', 'data-act="chat"')}
    </div>
    <div class="set-list">
      ${row(I.gauge, 'Daily deposit limit', u.limit ? `$${u.limit} per day` : 'No limit', 'data-sheet="limit"')}
      ${row(I.pause, 'Take a break', blocked() || 'Pause deposits for a while, or self-exclude', 'data-sheet="break"')}
      <div class="set-row static"><span class="set-ico">${navIco.swap}</span><span class="set-txt"><b>Theme</b><small data-theme-name>${(THEMES_NOW().find(t => t[0] === curTheme()) || THEMES_NOW()[0])[1]}</small></span><span class="theme-pick" data-theme-pick>${themePick()}</span></div>
    </div>
    <div class="set-list"><button class="set-row" data-act="logout"><span class="set-ico">${I.out}</span><span class="set-txt"><b>Logout</b></span>${I.out}</button></div>
  </div>`;
}
function openSheet(k) {
  const u = S.user;
  if (k === 'user') return openModal(`<h2>Change username</h2><p>4 to 20 letters, numbers or underscores.</p>
    <form class="form-row" data-form="user"><input class="field" name="next" value="${esc(u.username)}" pattern="[A-Za-z0-9_]{4,20}" title="4 to 20 letters, numbers or _" autocomplete="username" required>
    <input class="field" type="password" name="cur" placeholder="Current password" autocomplete="current-password" required><button class="btn btn-accent btn-block" type="submit">Save username</button></form>`);
  if (k === 'pw') return openModal(`<h2>Change password</h2><p>Your game logins are separate and don't change.</p>
    ${u.passwordKey ? '' : credRow('Current password', u.password, u.password, true)}
    <form class="form-row" data-form="pw" style="margin-top:14px"><input class="field" type="password" name="cur" placeholder="Current password" autocomplete="current-password" required>
    <input class="field" type="password" name="next" placeholder="New password (8+ characters)" minlength="8" autocomplete="new-password" required><button class="btn btn-accent btn-block" type="submit">Update password</button></form>`);
  if (k === 'games') { const games = PLATFORMS.filter(p => acct(p.id)); return openModal(`<div class="game-account-list"><h2>Your game accounts</h2><p>${games.length} active</p></div>
    ${games.length ? `<div class="ga-list">${games.map(p => `<div class="owned-platform"><button class="opt" data-act="gcreds" data-plat="${p.id}">${coin(p, 'sm')}<span><b>${p.name}</b><small>${esc(acct(p.id).username)}</small></span></button><button class="owned-play" data-act="play" data-plat="${p.id}">${I.play}Play</button></div>`).join('')}</div>` : '<a class="btn btn-accent btn-block" href="#/games">Unlock a game</a>'}`); }
  if (k === 'limit') return openModal(`<h2>Daily deposit limit</h2><p>Lower it any time. Raising it takes 24 hours.</p>
    <form class="form-row" data-form="limit"><select class="field" name="limit">${[0, 50, 100, 250, 500, 1000].map(v => `<option value="${v}" ${u.limit === v ? 'selected' : ''}>${v ? `$${v} per day` : 'No limit'}</option>`).join('')}</select><button class="btn btn-accent btn-block" type="submit">Save limit</button></form>`);
  if (k === 'break') return openModal(`<h2>Take a break</h2><p>${blocked() || 'Pause deposits and loading credits for a while.'}</p>
    <div class="sheet-grid three"><button class="btn btn-outline" data-act="cool" data-h="24">24 hours</button><button class="btn btn-outline" data-act="cool" data-h="168">7 days</button><button class="btn btn-outline" data-act="cool" data-h="720">30 days</button></div>
    <button class="btn btn-outline btn-block danger" data-act="exclude" style="margin-top:14px">Self-exclude</button>`);
}

/* ---------- rewards ---------- */

const CHECKIN = [10, 15, 20, 30, 40, 60, 100];
const LEVELS = [['Bronze', 500], ['Silver', 1500], ['Gold', 4000], ['Platinum', 10000]];
const AVATARS = ['#f044a7', '#7a4dff', '#1fbf8f', '#f29a2e', '#3b82f6', '#e0334f'];
function avatarChoices() {
  const labels = ['Pink','Violet','Green','Amber','Blue','Red'];
  return `<div class="avatars profile-choices">${['tuxedo', ...AVATARS].map((value,index) => {
    const active = S.user.avatar === value, label = index ? labels[index-1] : 'Tuxedo portrait';
    const option = {...S.user, avatar:value};
    return `<button class="av${active ? ' on' : ''}" ${avatarBackground(option)} data-act="avatar" data-c="${value}" aria-label="${label}" title="${label}" aria-pressed="${active}">${avatarFace(option)}</button>`;
  }).join('')}</div>`;
}
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
  if (got.length) { save(); setTimeout(() => toast(got.join(' · ')), 300); }
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
        return `<div class="quest" data-quest="${q.id}">
          <div class="q-top"><span class="quest-icon" aria-hidden="true">${({deposit1:I.coins,game1:I.controller,streak3:I.bolt,deposit5:I.wallet,games3:I.key,secure:I.shield,profile:I.user,refer:I.gift})[q.id] || I.trophy}</span><div><b>${q.name}</b><p>${q.desc}</p></div><span class="q-pts">+${q.pts} pts</span></div>
          <div class="q-bar"><div class="bar-track" role="progressbar" aria-label="${q.name}" aria-valuenow="${done?q.goal:n}" aria-valuemin="0" aria-valuemax="${q.goal}"><i style="width:${done ? 100 : (n / q.goal) * 100}%" class="${done ? 'done' : ''}"></i></div>
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
      <p class="card-sub">Pick one to complete your profile (+50 pts).</p>
      ${avatarChoices()}
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
    <header class="reward-banner"><div><h1>Rewards</h1><p>Play more. Earn more.</p></div><img src="assets/wallet-rewards.jpg" alt=""></header>
    <section class="pts-card">
      <div class="pts-top"><div><small>YOUR POINTS</small><b class="pts-num">${S.user.points.toLocaleString('en-US')}</b></div><span class="pts-lv">${lv.cur ? `${lv.cur[0]} level` : 'No level yet'}</span></div>
      <div class="pts-bot"><span>Cashable <b>${usd(S.user.cashable)}</b></span>${S.user.cashable > 0 ? `<button class="btn btn-accent btn-sm" data-act="cash-move">Move to wallet</button>` : ''}</div>
    </section>
    <nav class="rw-tabs">${tabs.map(([k, t]) => `<button class="${S.rw === k ? 'on' : ''}" data-rw="${k}">${t}${k === 'today' && canCheckin() && S.rw !== 'today' ? '<i class="rw-dot"></i>' : ''}</button>`).join('')}</nav>
    ${body}
  </div>`;
}

function needLogin(title) {
  if (title === 'Balance' && S.site !== 'b') {
    return `<div class="page wallet-entry-page">${crumb([title])}
      <section class="wallet-entry-card" aria-labelledby="wallet-entry-title">
        <span class="wallet-entry-mark" aria-hidden="true"><i></i></span>
        <h1 id="wallet-entry-title">Sign in to your wallet</h1>
        <p>View your balance, game credits, and transfers in one place.</p>
        <div class="wallet-entry-actions"><a class="btn btn-accent" href="#/register"><span>Sign up</span>${I.chev}</a><a class="btn btn-outline" href="#/login"><span>Sign in</span>${I.chev}</a></div>
      </section></div>`;
  }
  return `<div class="page">${crumb([title])}
    <div class="card gate"><h2>Log in to see this page</h2><p class="card-sub">Don't have an account yet? Sign up with your email. It takes about a minute.</p>
      <div class="gate-acts"><button class="btn btn-accent" data-act="signup">Sign up</button><button class="btn btn-outline" data-act="login">Sign in</button></div></div>
  </div>`;
}

/* ---------- menu + chat ---------- */

const LOGO = () => logoInner();

function menuHtml() {
  const row=(url,title,sub,icon)=>`<a href="${url}"><span class="account-menu-icon">${icon}</span><span><b>${title}</b><small>${sub}</small></span>${I.chev}</a>`;
  if (!S.user) return `<section class="guest-menu-intro" aria-labelledby="guest-welcome"><span class="avatar" aria-hidden="true">${BRAND()[0]}</span><div><h2 id="guest-welcome">Welcome to ${BRAND()}</h2><p>Create an account to unlock your wallet, rewards, and game accounts.</p></div><span class="guest-intro-bolt" aria-hidden="true">${I.bolt}</span></section>
    <div class="guest-menu-actions"><button class="btn btn-accent btn-block" data-act="${route().name === 'home' && S.site !== 'b' ? 'landing-register' : 'signup'}">Create account</button><button class="btn btn-outline btn-block" data-act="login">Sign in</button></div>
    <nav class="drawer-nav guest-links">
      ${row('#/store','Coin shop','Browse coin packages',I.gift)}
      ${row(S.site === 'b' ? '#/games' : '#/games/platforms','Explore platforms','Browse every supported platform',I.play)}
      <a href="#" data-act="foot-doc" data-doc="How it works"><span class="account-menu-icon">${I.help}</span><span><b>How it works</b><small>Learn how accounts and credits work</small></span>${I.chev}</a>
      <a href="#" data-act="chat"><span class="account-menu-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 13v-2a9 9 0 0 1 18 0v5q0 5-6 5h-2"/><rect x="3" y="11" width="4" height="7" rx="2"/><rect x="17" y="11" width="4" height="7" rx="2"/></svg></span><span><b>Help center</b><small>Get answers before you sign up</small></span>${I.chev}</a>
    </nav>
    <div class="menu-theme-row"><span><b>Appearance</b><small>Choose your theme</small></span><div class="theme-pick" data-theme-pick>${themePick()}</div></div>
    <a href="#/welcome" class="guest-signature" aria-label="Welcome page"><span aria-hidden="true">${I.bolt}</span><small>Welcome page</small></a>
    <div class="guest-utilities"><select class="menu-language" aria-label="Language" onchange="window.setLanguage(this.value)"><option value="en">English</option><option value="es">Español</option></select><button type="button" data-close-menu>${I.x}<span>Close menu</span></button></div>`;
  const player = S.user;
  return `<header class="member-tools"><a href="#/" class="logo">${LOGO()}</a>
    <select class="menu-language" aria-label="Language" onchange="window.setLanguage(this.value)"><option value="en">English</option><option value="es">Español</option></select>
    <button class="icon-btn" data-close-menu aria-label="Close menu">${I.x}</button></header>
  ${memberCard(player)}
  <div class="menu-wallet"><div><small>${I.wallet}<span>WALLET BALANCE</span></small><strong>${usd(player.wallet)}</strong><span>Available balance</span></div><div><small>${I.coins}<span>GAME CREDITS</span></small><strong>${usd(creditsTotal())}</strong><span>Across your platforms</span></div></div>
  <div class="member-actions"><a href="#/balance" data-bal-go="deposit">${I.dl}<span>Deposit</span></a><a href="#/balance" data-bal-go="withdraw">${I.dl}<span>Withdraw</span></a></div>
  <nav class="drawer-nav">
  ${row('#/account','Account & security','Profile and login settings',I.shield)}
  ${row('#/store','Coin shop','Browse coin packages',I.coins)}
  ${row('#/rewards','Rewards & referrals','Explore your account rewards',I.gift)}
  <details><summary><span class="account-menu-icon">${I.receipt}</span><b>Transactions</b>${I.chev}</summary>${row('#/activity','Transaction history','Track your account activity',I.receipt)}${row('#/balance','Wallet','Manage your balance',I.wallet)}</details>
  <details><summary><span class="account-menu-icon">${I.help}</span><b>Help center</b>${I.chev}</summary><a href="#" data-act="chat">Contact support${I.chev}</a><a href="#" data-act="foot-doc" data-doc="FAQ">Frequently asked questions${I.chev}</a></details>
  <details><summary><span class="account-menu-icon">${I.shield}</span><b>Legal</b>${I.chev}</summary>${['Terms of service','Privacy policy','Sweepstakes rules','Responsible play'].map(doc=>`<a href="#" data-act="foot-doc" data-doc="${doc}"><span>${doc}</span>${I.chev}</a>`).join('')}</details>
  ${row('#/games','Game platforms','Browse your gaming accounts',I.controller)}</nav>
  <div class="menu-theme-row"><span><b>Appearance</b><small>Choose your theme</small></span><div class="theme-pick" data-theme-pick>${themePick()}</div></div>
  <div class="drawer-foot"><button class="btn btn-ghost btn-block" data-act="logout">${I.out}<span>Sign out</span></button></div>`;
}

const supportIcons = {
  headset:'<path d="M4 13v-1a8 8 0 0 1 16 0v4a5 5 0 0 1-5 5h-2"/><rect x="3" y="11" width="4" height="7" rx="2"/><rect x="17" y="11" width="4" height="7" rx="2"/>',
  send:'<path d="m21 3-6 18-4-8-8-4 18-6Z"/><path d="m11 13 10-10"/>',
  clip:'<path d="m9 16 7-7a2 2 0 0 0-3-3l-8 8a4 4 0 0 0 6 6l9-9a6 6 0 0 0-8-9l-9 9"/>',
  message:'<path d="M4 4h16v13h-9l-5 4v-4H4z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/>'
};
function supportIcon(key) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${supportIcons[key]}</svg>`;
}
function chatMessage(message) {
  return `<div class="msg${message.me ? ' me' : ''}">${esc(message.t)}${message.file ? `<span class="chat-file-name">${supportIcon('clip')}${esc(message.file)}</span>` : ''}</div>`;
}
function chatHtml() {
  return `<div class="chat-h"><button class="icon-btn" type="button" data-act="chat-close" aria-label="Close chat">${I.x}</button><span class="chat-av">${supportIcon('headset')}</span><div><b>${BRAND()} Support</b><small><i aria-hidden="true"></i><span>Demo chat · Automated replies</span></small></div></div>
    <div class="chat-body" id="chatBody">
      <div class="msg chat-greeting"><span>Hi there! 👋</span><br><span>How can we help you today?</span></div>
      <div class="chat-log" role="log" aria-label="Conversation">${S.chat.map(chatMessage).join('')}</div>
      ${!S.chat.length ? `<form class="chat-reason" data-form="reason"><label for="chat-reason">${supportIcon('message')}<span>Contact reason</span></label>
        <select class="field" id="chat-reason" name="r"><option value="Account / login issues">Account / login issues</option><option value="Deposit not showing">Deposit not showing</option><option value="Redeem or withdrawal">Redeem or withdrawal</option><option value="Game account / credits">Game account / credits</option><option value="Something else">Something else</option></select>
        <button class="chat-send" type="submit">${supportIcon('send')}<span>Send</span></button></form>` : ''}
    </div>
    <form class="chat-in" data-form="chat"><div class="chat-file-preview" hidden><div><small>Local attachment preview</small><output></output></div><button type="button" data-act="clear-chat-file" aria-label="Remove attachment">${I.x}</button></div>
      <div class="chat-entry"><label class="chat-clip">${supportIcon('clip')}<input type="file" name="attachment" aria-label="Attach a file"></label><input class="field" name="m" aria-label="Message" placeholder="Type a message…" autocomplete="off"></div>
      <button class="chat-send" type="submit" aria-label="Send message">${supportIcon('send')}</button></form>`;
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
    </div>`,
  'Responsible play': `<div class="responsible-doc"><p>Skillandslots is intended for adults aged 21 and over. Set limits that fit your budget, take regular breaks, and never use money needed for everyday expenses.</p><ul><li>Use the daily deposit limit in your account settings.</li><li>Choose a cool-off period when you want time away.</li><li>Use self-exclusion if you need a longer break.</li><li>Contact support if you need help finding these controls.</li></ul><p>No purchase is necessary. Availability and platform rules may vary by location.</p></div>`
});

/* ---------- theme ---------- */

const THEMES = [
  ['navy', 'Charcoal & Plum', '#a431a9', '#19191f'],
  ['white', 'Porcelain', '#a34464', '#faf9f6'],
  ['pine', 'Pine & Brass', '#dec58d', '#142521']
];
const THEMES_NOW = () => THEMES;
const curTheme = () => document.documentElement.dataset.theme;
const themePick = () => THEMES.map(([key, label, accent, base]) =>
  `<button type="button" class="${curTheme() === key ? 'on' : ''}" data-theme-set="${key}" aria-pressed="${curTheme() === key}"><i aria-hidden="true" style="--sample:${accent};--base:${base}"></i>${label}</button>`
).join('');
function setTheme(k) {
  const palette = THEMES.find(([key]) => key === k) || THEMES[0];
  k = palette[0];
  document.documentElement.dataset.theme = k;
  try { localStorage.setItem('p3_theme', k); } catch (e) {}
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.content = palette[3];
  document.querySelectorAll('[data-theme-name]').forEach(label => { label.textContent = palette[1]; });
  const url = new URL(location.href);
  if (url.searchParams.has('palette') && url.searchParams.get('palette') !== k) {
    url.searchParams.set('palette', k);
    history.replaceState(history.state, '', url);
  }
  document.querySelectorAll('[data-theme-set]').forEach(button => {
    const selected = button.dataset.themeSet === k;
    button.classList.toggle('on', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
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
      <div class="bv-h"><h2>A little guidance</h2><a href="#" data-act="foot-doc" data-doc="How it works">How it works ${I.chev}</a></div>
      <div class="bv-posts">${POSTS.map(p => `<article class="post" data-post="${p.id}" tabindex="0">
        <div class="post-img"><img src="${p.img}" alt="" loading="lazy"><span class="post-cat">${p.cat}</span></div>
        <div class="post-body"><small>${p.date} &middot; ${p.read} read</small><h3>${p.title}</h3><p>${p.excerpt}</p><span class="post-more">Read more ${I.chev}</span></div>
      </article>`).join('')}</div>
    </section>
    <section class="bv">
      <div class="bv-h"><h2>Watch &amp; learn</h2></div>
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

/* ---------- Loaded777 (site b) ---------- */

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
      ? `<a class="side-user" href="#/account"><span class="avatar" ${avatarBackground(S.user)}>${avatarFace(S.user)}</span><span><b>${esc(S.user.first)}</b><small>${usd(S.user.wallet)} wallet</small></span></a>`
      : `<button class="btn btn-accent btn-block" data-act="signup">Join now</button><button class="btn btn-ghost btn-block" data-act="login">Sign in</button>`}</div>`;
}

function platCardB(p) {
  const a = acct(p.id);
  return `<div class="b-plat">
    <a class="b-plat-top" href="#/platform/${p.id}">${coin(p, 'lg')}<b>${p.name}</b><small>${a ? `${usd(a.credits)} credits` : `${p.games} games`}</small></a>
    ${a ? `<button class="btn btn-outline btn-sm btn-block" data-act="gcreds" data-plat="${p.id}">${I.eyeO}View</button>`
        : `<button class="btn btn-accent btn-sm btn-block" data-act="unlock" data-plat="${p.id}">${I.lockO}Unlock</button>`}
  </div>`;
}

function walletBoxB() {
  if (!S.user) return `<aside class="b-wallet join">
      <small>NEW HERE?</small><h2>Join ${BRAND()}</h2>
      <p>One wallet for Milky Way, Fire Kirin, Orion Stars and more.</p>
      <form class="form-row" data-form="quick"><input class="field" type="email" name="email" placeholder="Email address" required autocomplete="email"><button class="btn btn-accent btn-block" type="submit">Create account</button></form>
      <p class="hl-note">Have an account? <a href="#" data-act="login">Sign in</a></p>
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
    <section class="b-sec"><div class="b-sec-h"><h2>Recent big wins</h2></div>
      <div class="b-wins">${BIG.slice(0, 5).map(([pid, u, d, a]) => `<div class="b-win">${coin(plat(pid), 'xs')}<b>${esc(u)}</b><span>${plat(pid).name}</span><small>${d}</small><em>$${a.toLocaleString('en-US')}</em></div>`).join('')}</div></section>
    ${blogVideoSection()}
  </div>`;
}

function viewGamesB() {
  const mine = PLATFORMS.filter(p => acct(p.id)), rest = PLATFORMS.filter(p => !acct(p.id));
  return `<div class="page">
    ${crumb(['My Games'])}
    <p class="lede">${mine.length ? `${mine.length} game account${mine.length === 1 ? '' : 's'} ready. Load credits and play.` : 'Choose a platform and create your game login.'}</p>
    ${mine.length ? `<div class="b-sec-h"><h2>Unlocked</h2></div><div class="b-plats">${mine.map(platCardB).join('')}</div>` : ''}
    ${rest.length ? `<div class="b-sec-h"><h2>Available</h2></div><div class="b-plats">${rest.map(platCardB).join('')}</div>` : ''}
  </div>`;
}

function startBSlides() {
  clearInterval(S.bTimer);
  if (S.site !== 'b' || !document.querySelector('.b-hero') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
          <b>Skillandslots</b><span>Navy or white theme · bottom navigation</span></button>
        <button class="ch-opt b" data-site-pick="b">
          <div class="ch-prev"><i class="p-side"></i><i class="p-hero"></i><i class="p-wallet"></i><i class="p-cards"></i></div>
          <b>Loaded777</b><span>Navy or white theme · side navigation</span></button>
      </div>
    </div>`;
  ch.hidden = false;
  document.body.style.overflow = 'hidden';
}
function pickSite(k) {
  applySite(k);
  const host=document.getElementById('loader');
  host.hidden=false;
  host.classList.remove('off');
  const splash=null;
  document.getElementById('chooser').hidden = true;
  document.body.style.overflow = '';
  render();
  const finish=()=>{host.hidden=true;host.classList.add('off');host.replaceChildren();};
  finish();
}

/* ---------- router ---------- */

function route() {
  const [r, arg] = location.hash.replace(/^#\/?/, '').split('/');
  const name = { '': 'home', games: 'games', browse: 'games', store: 'store', platform: 'games', balance: 'balance', activity: 'activity', account: 'account', rewards: 'rewards' }[r] || 'home';
  return { name, r, arg };
}

function renderMarketingFooter(publicHome) {
  const mounted = document.querySelector('body > footer.foot');
  if (!publicHome) {
    mounted?.remove();
    return;
  }
  if (mounted?.dataset.brand === S.site) return;
  const footer = $('#marketing-footer-template').content.firstElementChild.cloneNode(true);
  footer.dataset.brand = S.site;
  const logo = footer.querySelector('.logo');
  logo.innerHTML = logoInner();
  logo.setAttribute('aria-label', BRAND() + ' home');
  footer.querySelector('.copy').textContent = `© ${new Date().getFullYear()} ${BRAND()}. All rights reserved.`;
  if (mounted) mounted.replaceWith(footer);
  else $('#app').after(footer);
}

function updateBottomNav(name) {
  const memberTabs = {account:'home', store:'balance', rewards:'balance'};
  const current = document.body.classList.contains('chat-open') ? 'chat' : (S.user && memberTabs[name]) || name;
  document.querySelectorAll('.tabbar [data-nav]').forEach(link => {
    const active = link.dataset.nav === current;
    link.classList.toggle('on', active);
    if (active) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
}

function render(keepScroll) {
  scheduleDemoRedemption();
  const { name, r, arg } = route();
  const chatOwner = S.site + '/' + (S.user?.email || S.user?.username || '');
  if (S.chatOwner !== chatOwner) { S.chatOwner = chatOwner; S.chat = []; $('#chat').replaceChildren(); }
  renderMarketingFooter(!S.user && r === '');
  if (name !== 'balance' || arg !== 'deposit' || !S.user) depositDraft = null;
  const isB = S.site === 'b';
  const views = { home: isB ? viewHomeB : viewHome, store: viewStore, games: r === 'browse' ? () => viewCatalog(arg) : r === 'platform' ? () => viewPlatform(arg) : (isB ? viewGamesB : viewGames), balance: viewBalance, activity: viewActivity, account: viewAccount, rewards: viewRewards };
  const entryViews = {login:landingLogin,welcome:welcomeEntry,register:()=>`<div class="page guest-auth-page">${landingRegistration()}</div>`};
  const kioskRoute = !isB && (r === 'kiosk' || r === 'kiosk-pair');
  if (r !== 'kiosk') clearKioskChallenge();
  const content = kioskRoute ? kioskPage(r) : !isB && !S.user && Object.hasOwn(entryViews,r) ? entryViews[r]() : views[name]();
  $('#app').innerHTML = (!isB && (!r || (!S.user && r === 'register')) ? homeUtilities() : '') + content;
  RechargeMotion.mount();
  if (kioskRoute) mountKioskPage(r);
  $('#topRight').innerHTML = topRight();
  document.body.classList.toggle('member-navigation',Boolean(S.user) && !isB);
  document.body.classList.toggle('has-ticker', name === 'home' && !S.user && !isB && !Object.hasOwn(entryViews,r));
  const side = $('#side'); if (side) side.innerHTML = isB ? sideHtml(name) : '';
  startBSlides();
  if (name === 'balance' && S.pendingSheet && S.user) { const k = S.pendingSheet; S.pendingSheet = null; setTimeout(() => openBalSheet(k), 30); }
  updateBottomNav(name);
  if (!keepScroll) window.scrollTo(0, 0);
  document.querySelectorAll('[data-theme-pick]').forEach(el => { el.innerHTML = themePick(); });
  if (S.user && name !== 'rewards') syncQuests();
}

function goHome() { if (location.hash.length > 2) location.hash = '#/'; else render(); }
function refresh() { save(); render(true); }


/* ---------- modal ---------- */

let modalTrigger;
let releaseGamePreview;
function stopGamePreview() {
  releaseGamePreview?.();
  releaseGamePreview = undefined;
}
function openModal(html, wide) {
  stopGamePreview();
  stopKioskScanner();
  if ($('#modal').hidden) modalTrigger = document.activeElement;
  const box = $('#modalBox');
  box.className = 'modal-box' + (wide ? ' wide' : '');
  box.innerHTML = `<button class="icon-btn modal-x" data-close aria-label="Close">${I.x}</button>` + html;
  box.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach((field,index) => {
    if (field.labels.length || field.hasAttribute('aria-label')) return;
    const label = field.previousElementSibling;
    if (label?.matches('label.lbl')) {
      field.id ||= 'dialog-field-' + index;
      label.htmlFor = field.id;
    } else if (field.placeholder) {
      field.setAttribute('aria-label', field.placeholder);
    }
  });
  $('#modal').hidden = false;
  document.body.style.overflow = 'hidden';
  const title = box.querySelector('h1,h2,h3');
  if (title) { title.id = 'dialogHeading'; box.setAttribute('aria-labelledby', title.id); }
  else { box.removeAttribute('aria-labelledby'); box.setAttribute('aria-label', BRAND()); }
  const reviewTitle = box.querySelector('.load-cover h2,.cash-cover h2');
  if (reviewTitle) reviewTitle.tabIndex = -1;
  const focusTarget = reviewTitle || box.querySelector('input:not([readonly],[disabled],[type=hidden])') || box.querySelector('.modal-x');
  focusTarget.focus({preventScroll:true});
}
function closeModal() {
  if ($('#modal').hidden) return;
  stopKioskScanner();
  const installCard = $('#modalBox .install-invite');
  if ($('#modalBox').querySelector('.phone-preview')) {
    clearInterval(phoneTimer);
    delete pending.join;
  }
  $('#modal').hidden = true;
  document.body.style.overflow = '';
  stopGamePreview();
  if (modalTrigger?.isConnected) modalTrigger.focus({preventScroll:true});
  if (installCard && installCard.dataset.route === location.hash) showVerificationOffer();
}

const pending = {};
let phoneTimer;
function renewPhoneCode() {
  clearInterval(phoneTimer);
  const demoCode = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6,'0');
  pending.code = demoCode;
  const form = $('#modalBox').querySelector('.phone-preview');
  const resend = form.querySelector('[data-act="demo-resend"]');
  form.querySelector('output').textContent = demoCode;
  form.querySelectorAll('.code-in input').forEach(input=>input.value='');
  form.querySelector('.phone-error').hidden = true;
  const until = Date.now()+30000;
  function tick() {
    const seconds = Math.max(0,Math.ceil((until-Date.now())/1000));
    resend.disabled = seconds>0;
    resend.querySelector('time').textContent = seconds ? ` · 0:${String(seconds).padStart(2,'0')}` : '';
    if (!seconds || !form.isConnected) clearInterval(phoneTimer);
  }
  tick();
  phoneTimer=setInterval(tick,500);
}
function phonePreview() {
  openModal(`<div class="phone-step-heading"><div class="phone-brand">Skilland<b>slots</b></div><span aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="7" y="3" width="24" height="41" rx="5"/><path d="M14 7h10M16 39h6"/><path fill="var(--panel)" d="M25 14h15a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-7l-6 5v-5h-2a4 4 0 0 1-4-4v-8a4 4 0 0 1 4-4Z"/><path d="M26 22h2m3 0h2m3 0h2"/></svg></span><h2>Verify your phone</h2>
    <p>Use a sample number and the demo code below. No SMS is sent.</p>${signupProgress(2)}</div>
    <form class="phone-preview" data-form="code"><label for="preview-phone">Phone number</label>
    <div class="preview-phone-row"><select aria-label="Country calling code"><option>US +1</option><option>CA +1</option><option>MX +52</option><option>ES +34</option></select><input id="preview-phone" class="field" type="tel" inputmode="tel" autocomplete="off" pattern="[0-9]{7,12}" placeholder="5550101234" required></div>
    <label for="verify-digit-0">Verification code</label><div class="code-in">${Array.from({length:6},(_,i)=>`<input id="verify-digit-${i}" aria-label="${i+1}/6" inputmode="numeric" pattern="[0-9]" required>`).join('')}</div>
    <div class="code-tools"><span><span>Demo code</span> <output></output></span><button type="button" class="auth-link" data-act="demo-resend"><span>New demo code</span><time></time></button></div>
    <p class="phone-error" role="alert" hidden>Enter the six digits shown above.</p>
    <button class="register-submit" type="submit">Verify and create account</button><button class="auth-link back-account" type="button" data-act="landing-register">Back to account details</button></form>`);
  renewPhoneCode();
}
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
    if (pending.join) {phonePreview();return;}
    openModal(`${bar(2)}<h2>Enter the demo code</h2><p>Use any six digits to continue this demo.</p>
      <form data-form="code">
        <div class="code-in">${Array.from({ length: 6 }, () => '<input inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]" aria-label="Digit" required>').join('')}</div>
        <button class="btn btn-accent btn-block" type="submit" style="margin-top:16px">Verify and create account</button>
      </form>
      <p class="note"><a href="#" data-act="${pending.join ? 'landing-register' : 'signup'}">Change email address</a></p>`);
  } else {
    const u = S.user;
    openModal(`${bar(3)}<div class="done-mark">${I.check}</div><h2>You're in, ${esc(u.first)}</h2>
      <p>Here is your ${BRAND()} login. Next, deposit to your wallet and unlock your first game.</p>
      ${credRow('Username', u.username, u.username)}
      ${u.passwordKey ? '' : credRow('Password', u.password, u.password, true)}
      <div class="warn">You can change your login details under My account.</div>
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

async function passwordKey(password, salt = crypto.getRandomValues(new Uint8Array(16))) {
  const encoded = new TextEncoder().encode(password);
  const key = await crypto.subtle.importKey('raw', encoded, 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',iterations:600000,salt},key,256);
  return {salt:Array.from(salt),digest:btoa(String.fromCharCode(...new Uint8Array(bits)))};
}

async function matchesPassword(account, value) {
  if (!account.passwordKey) return value === account.password;
  const compared = await passwordKey(value, Uint8Array.from(account.passwordKey.salt));
  return compared.digest === account.passwordKey.digest;
}

function requireLogin() {
  if (S.user) return true;
  if (S.site === 'b') signupStep(1);
  else location.hash = '#/register';
  return false;
}

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
  S.showPw = false;
  openModal(`<div class="game-access sheet-head">${coin(p, 'md')}<div><h2>${fresh ? `${p.name} account ready` : p.name}</h2><p>${a.linked ? 'Linked to your existing account' : 'Use this login in the game'}</p></div></div>
    ${credRow('Username', a.username, a.username)}
    ${credRow('Password', a.password, a.password, true)}
    <button class="btn btn-outline btn-block gedit-btn" data-act="gedit" data-plat="${pid}">${I.key}Edit username or password</button>
    <div class="wallet-line">Credits <b>${usd(a.credits)}</b></div>
    <div class="sheet-grid">
      <button class="btn btn-accent" data-act="play" data-plat="${pid}">${I.play}Play</button>
      <button class="btn btn-outline" data-act="load" data-plat="${pid}">Load</button>
      <button class="btn btn-outline" data-act="redeem" data-plat="${pid}" ${a.credits < 1 ? 'disabled' : ''}>Redeem</button>
      <button class="btn btn-outline" data-act="download" data-plat="${pid}">${I.dl}Get app</button>
    </div>`);
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
  S.showPw = false;
  openModal(`<header class="game-access"><div class="modal-coin">${coin(p,'md')}</div><h2>${g ? esc(g.name) : p.name}</h2><p>Use your ${p.name} login to play.</p></header>
    ${credRow('Username', a.username, a.username)}
    ${credRow('Password', a.password, a.password, true)}
    <div class="wallet-line">Game balance <b>${usd(a.credits)}</b></div>
    <div class="modal-acts"><button class="btn btn-accent" data-act="web" data-plat="${pid}" ${g ? `data-game-id="${g.id}"` : ''}>${I.play}Play ${p.name}</button><button class="btn btn-outline" data-act="download" data-plat="${pid}">${I.dl}Get the app</button></div>`);
}

/* ---------- coin loader ---------- */

function coinHtml(size) { return `<div class="brand-loading" role="status"><div class="splash-mark" style="--splash-size:${size}px">${site().svg || "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" fill=\"none\" aria-hidden=\"true\"><rect width=\"64\" height=\"64\" rx=\"20\" fill=\"#f044a7\"/><path d=\"M18 15h30L32 34h11L22 52l7-22H18l12-9H18z\" fill=\"#151a31\"/></svg>"}</div><strong>${BRAND()}</strong><span class="splash-progress" aria-hidden="true"></span><span class="splash-caption">Your platforms. Connected.</span></div>`; }

function launch(pid, gameId) {
  const p = plat(pid), account = acct(pid);
  const selected = gameId ? game(gameId) : GAMES.find(item => item.p === pid);
  openModal(`<div class="launch-stage game-opening-stage"></div>
    <div class="launch-foot">${coin(p, 'xs')}<span>${p.name}</span><span>as <code>${esc(account.username)}</code></span><span>${usd(account.credits)} credits</span>
      <button class="btn btn-ghost btn-sm" data-close>Back</button></div>`, true);
  const stage = $('#modalBox .launch-stage');
  let splash, closed = false;
  releaseGamePreview = () => { closed = true; splash?.finish(); };
  async function loadPreview() {
    splash?.finish();
    if (S.site === 'b') stage.innerHTML = coinHtml(92);
    else splash = RechargeSplash.play(stage);
    const picture = new Image();
    picture.className = 'launch-art';
    picture.alt = '';
    try {
      if (!selected?.img) throw new Error('Missing preview');
      picture.src = selected.img;
      await picture.decode();
    } catch {
      if (closed) return;
      if (splash) splash.fail('Game preview couldn’t load.', loadPreview);
      else {
        stage.innerHTML = '<div><p>Game preview couldn’t load.</p><button type="button" class="btn btn-accent">Retry</button></div>';
        stage.querySelector('button').onclick = loadPreview;
      }
      return;
    }
    if (closed) return;
    function showPicture() {
      stage.classList.remove('game-opening-stage');
      stage.innerHTML = `<div class="launch-blur"></div><div class="launch-mid"><div class="preview-picture"></div><h3>${p.name}</h3><p>Game preview · Live play is unavailable in this demo.</p></div>`;
      stage.querySelector('.launch-blur').style.backgroundImage = `url("${picture.src}")`;
      stage.querySelector('.preview-picture').append(picture);
    }
    if (splash) splash.ready(showPicture);
    else showPicture();
  }
  loadPreview();
}

function loadModal(pid) {
  if (!requireLogin()) return;
  const stop = blocked();
  if (stop) return openModal(`<h2>Loading is paused</h2><p>${stop}</p>`);
  const p = plat(pid), a = acct(pid);
  if (!a) return unlockModal(pid);
  const wallet = S.user.wallet;
  const amount = Math.min(10,wallet);
  const presets = [10,20,50,100,500].map(value => {
    const bonus = value <= wallet ? gameLoadBonus(pid,value) : 0;
    return `<button type="button" data-amt="${value}" ${value>wallet?'disabled':''}><b>${usd(value)}</b>${bonus ? `<small>+${usd(bonus)} bonus</small>` : ''}</button>`;
  }).join('');
  openModal(`<header class="game-load-head load-cover" style="--load-art:url('assets/platform-scenes/${p.id}.jpg')"><div><p>${coin(p,'sm')} ${p.name}</p><h2>Load game balance</h2></div></header>
    <form class="form-row game-load-form" data-form="load"><input type="hidden" name="plat" value="${pid}">
      <div class="game-wallet-preview"><span>${I.wallet} Demo wallet</span><b>${usd(wallet)}</b><i aria-hidden="true">→</i><output aria-label="Wallet after transfer" data-wallet-after></output></div>
      <div class="load-label"><label for="game-load-amount">Transfer amount</label><button type="button" data-act="load-reset">Reset</button></div>
      <div class="load-stepper"><button type="button" data-act="load-less" aria-label="Subtract one dollar">−</button><div><span aria-hidden="true">$</span><input id="game-load-amount" name="amt" aria-label="Transfer amount in dollars" inputmode="decimal" type="number" min="1" step="0.01" max="${wallet.toFixed(2)}" value="${amount.toFixed(2)}" required></div><button type="button" data-act="load-more" aria-label="Add one dollar">+</button></div>
      <div class="game-presets">${presets}<button type="button" data-amt="${wallet.toFixed(2)}" data-all ${wallet<1?'disabled':''}><b>All</b></button></div>
      <dl class="game-totals"><div><dt>First-load bonus</dt><dd data-load-bonus></dd></div><div><dt>Total game credits added</dt><dd data-load-total></dd></div></dl>
      <p class="transfer-feedback" role="status"></p><div class="load-actions"><button type="button" class="btn btn-outline" data-close>Cancel</button>
      ${wallet<1 ? '<a class="btn btn-accent" href="#/balance" data-bal-go="deposit" data-close-after>Go to deposit</a>' : '<button class="btn btn-accent" type="submit">Confirm demo transfer</button>'}</div>
    </form>`);
  updateGameLoad($('#modalBox .game-load-form'));
}

function gameLoadBonus(pid, amount) {
  const percent = plat(pid)?.daily || 0;
  return dailyUsed(pid) ? 0 : Math.round(amount * percent) / 100;
}

function updateGameLoad(form) {
  const input = form.elements.amt;
  const amount = input.valueAsNumber;
  const valid = input.validity.valid;
  const submit = form.querySelector('[type=submit]');
  if (submit) submit.disabled = !valid || form.dataset.sending === 'true';
  const error=form.querySelector('.transfer-feedback');
  if (error) error.textContent = input.validity.rangeOverflow ? 'This amount exceeds your wallet balance.' : '';
  const bonus = valid ? gameLoadBonus(form.elements.plat.value, amount) : 0;
  form.querySelector('[data-wallet-after]').textContent = valid ? usd(S.user.wallet - amount) : '—';
  form.querySelector('[data-load-bonus]').textContent = valid ? usd(bonus) : '—';
  form.querySelector('[data-load-total]').textContent = valid ? usd(amount + bonus) : '—';
  const presets = [...form.querySelectorAll('[data-amt]')];
  const selected = presets.find(button => valid && Number(button.dataset.amt) === amount);
  presets.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
  form.querySelector('[data-act=load-less]').disabled = !valid || amount<=1;
  form.querySelector('[data-act=load-more]').disabled = !valid || amount>=S.user.wallet;
}

document.addEventListener('input', event => {
  const redeem = event.target.closest('.redeem-form');
  if (redeem) {
    if (event.target.matches('.redeem-slider')) redeem.elements.amt.value = event.target.valueAsNumber.toFixed(2);
    updateRedeem(redeem);
  }
  if (event.target.matches('.game-load-form [name=amt]')) updateGameLoad(event.target.form);
});

function gameLoadReceipt(p, amount, bonus, transactionId) {
  openModal(`<header class="game-success"><span aria-hidden="true">✓</span><h2>Credits added!</h2><p>${p.name} · Demo transfer</p></header>
    <dl class="game-totals"><div><dt>From your wallet</dt><dd>${usd(amount)}</dd></div><div><dt>First-load bonus</dt><dd>${usd(bonus)}</dd></div><div><dt>Total added</dt><dd>${usd(amount + bonus)}</dd></div></dl>
    <dl class="receipt-balances"><div><dt>Wallet after transfer</dt><dd>${usd(S.user.wallet)}</dd></div><div><dt>Game balance after transfer</dt><dd>${usd(acct(p.id).credits)}</dd></div></dl>
    <div class="form-row"><button class="btn btn-accent" data-act="play" data-plat="${p.id}">${I.play}Play ${p.name}</button><button class="btn btn-outline" data-act="load-history" data-transaction="${esc(transactionId)}">${I.receipt}View transaction</button></div>`);
}

function redeemModal(pid) {
  const p = plat(pid), a = acct(pid);
  if (!a) return unlockModal(pid);
  const maximum = a.credits.toFixed(2);
  openModal(`<header class="game-load-head load-cover" style="--load-art:url('assets/platform-scenes/${p.id}.jpg')"><div><p>${coin(p,'sm')} ${p.name}</p><h2>Redeem game credits</h2></div></header>
    <form class="form-row redeem-form cash-body" data-form="redeem"><input type="hidden" name="plat" value="${pid}">
    <div class="cash-line"><span>Game balance</span><b>${usd(a.credits)} <i>→</i> <output data-game-after></output></b></div>
    <div class="load-label"><label for="redeem-amount">Amount to redeem</label><button type="button" data-act="redeem-reset">Reset</button></div>
    <input id="redeem-amount" class="field redeem-value" name="amt" inputmode="decimal" type="number" min="1" step="0.01" max="${maximum}" value="${maximum}" required>
    <input class="redeem-slider" aria-label="Adjust redemption amount" type="range" min="${Math.min(1,a.credits)}" max="${maximum}" step="0.01" value="${maximum}" ${a.credits<=1?'disabled':''}>
    <div class="range-labels"><span>Min · ${usd(1)}</span><span>Max · ${usd(a.credits)}</span></div>
    <div class="cash-line"><span>Demo wallet</span><b>${usd(S.user.wallet)} <i>→</i> <output data-redeem-after></output></b></div>
    <p class="redeem-info">Demo credits return to your wallet after processing. Track your request in Activity.</p><p class="transfer-feedback" role="status"></p>
    <div class="load-actions"><button type="button" class="btn btn-outline" data-close>Cancel</button><button type="submit" class="btn cash-primary">Redeem to wallet</button></div></form>`);
  updateRedeem($('#modalBox .redeem-form'));
}

function updateRedeem(form) {
  const input = form.elements.amt;
  const available = acct(form.elements.plat.value).credits;
  const valid = input.validity.valid && available >= 1;
  const value = input.valueAsNumber;
  const slider = form.querySelector('.redeem-slider');
  if (Number.isFinite(value)) slider.value = value;
  form.querySelector('[data-game-after]').textContent = valid ? usd(available-value) : '—';
  form.querySelector('[data-redeem-after]').textContent = valid ? usd(S.user.wallet+value) : '—';
  form.querySelector('[type=submit]').disabled = !valid;
  form.querySelector('.transfer-feedback').textContent = available < 1 ? 'At least $1.00 in game credits is required.' : input.validity.rangeOverflow ? 'This amount exceeds your game balance.' : '';
}

let redemptionTimer;
function scheduleDemoRedemption() {
  clearTimeout(redemptionTimer);
  const record = S.user?.tx.filter(t => t.kind === 'Redeems' && t.status === 'pending' && Number.isFinite(t.settleAt)).sort((a,b) => a.settleAt-b.settleAt)[0];
  if (!record) return;
  const owner = S.user;
  redemptionTimer = setTimeout(() => {
    if (S.user !== owner) return scheduleDemoRedemption();
    const next = structuredClone(owner);
    next.tx.find(t => t.id === record.id).status = 'done';
    next.wallet = Math.round((next.wallet+record.amt)*100)/100;
    try { persistDemoChange(owner,next); }
    catch { toast('Demo redemption is pending. Refresh to check your wallet.'); return; }
    S.user = next;
    render(true);
    toast('Redeemed game credits added to your demo wallet.');
  }, Math.max(0,record.settleAt-Date.now()));
}

function addTx(t) { const record = { id: rid(), when: now(), ...t }; S.user.tx.unshift(record); return record; }
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

function toast(t, tone = 'info') {
  const el = $('#toast');
  el.dataset.tone = tone;
  el.textContent = t;
  el.classList.add('on');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove('on'), 2400);
}

function setMenu(open) {
  if (open) {
    const drawer = $('#drawer');
    drawer.classList.toggle('member-drawer', Boolean(S.user));
    drawer.classList.toggle('guest-drawer', !S.user);
    drawer.innerHTML = menuHtml();
    drawer.scrollTop = 0;
  }
  document.body.classList.toggle('menu-open', open);
  document.querySelectorAll('[data-menu]').forEach(trigger=>trigger.setAttribute('aria-expanded',String(open)));
}
function setChat(open) {
  const panel = $('#chat');
  if (open && !panel.firstElementChild) panel.innerHTML = chatHtml();
  panel.inert = !open;
  document.body.classList.toggle('chat-open', open);
  $('.tabbar [data-nav="chat"]').setAttribute('aria-expanded',String(open));
  updateBottomNav(route().name);
  if (open) {
    const thread = $('#chatBody');
    thread.scrollTop = S.chat.length ? thread.scrollHeight : 0;
    panel.focus({preventScroll:true});
  }
}

function todayDeposits() {
  const d = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  return S.user.tx.filter(t => t.kind === 'Deposits' && t.when.startsWith(d)).reduce((s, t) => s + t.amt, 0);
}

/* ---------- events ---------- */

document.addEventListener('click', e => {
  const via = e.target.closest('[data-login-via]');
  if (via) {
    const form = via.closest('form'), mode = via.dataset.loginVia;
    form.querySelectorAll('[data-login-via]').forEach(b => { const on = b === via; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    form.querySelectorAll('[data-via]').forEach(g => { const on = g.dataset.via === mode; g.hidden = !on; g.querySelectorAll('input,select').forEach(x => { x.disabled = !on; }); if (g.matches('input,select')) g.disabled = !on; });
    const first = form.querySelector(`[data-via="${mode}"] input, input[data-via="${mode}"]`); if (first) first.focus();
    return;
  }
  if (document.body.classList.contains('chat-open') && e.target.closest('.tabbar a[href^="#/"]')) setChat(false);
  if (document.body.classList.contains('menu-open') && e.target.closest('.drawer a[href^="#/"], .tabbar a[data-nav], .top button:not([data-menu]), .top a')) setMenu(false);
  const t = e.target.closest('[data-game],[data-act],[data-copyval],[data-cat],[data-close],[data-close-menu],[data-bal],[data-tab],[data-chip],[data-menu],[data-method],[data-amt],[data-rw],[data-theme-set],[data-site-pick],[data-bslide],[data-post],[data-video],[data-bal-go],[data-close-after],[data-balsheet],[data-sheet],[data-wtab],.m-list a');
  if (!t) return;
  if (t.dataset.balGo) { S.bal = t.dataset.balGo; S.pendingSheet = t.dataset.balGo; }
  if (t.dataset.closeAfter !== undefined) closeModal();
  if (t.dataset.balGo && !t.dataset.act) { if (location.hash === '#/balance') { closeModal(); render(true); } return; }
  if (t.dataset.closeAfter !== undefined && !t.dataset.act) return;
  if (t.matches('.m-list a') && !t.dataset.act) { setMenu(false); return; }
  if (t.dataset.menu !== undefined) { e.preventDefault(); setChat(false); return setMenu(!document.body.classList.contains('menu-open')); }
  if (t.dataset.closeMenu !== undefined) return setMenu(false);
  if (t.dataset.close !== undefined) return leaveVerification(closeModal);
  if (t.dataset.post) { postModal(t.dataset.post); return; }
  if (t.dataset.video) { videoModal(t.dataset.video); return; }
  if (t.dataset.sitePick) { pickSite(t.dataset.sitePick); return; }
  if (t.dataset.bslide) { setBSlide(+t.dataset.bslide); startBSlides(); return; }
  if (t.dataset.themeSet) { setTheme(t.dataset.themeSet); return; }
  if (t.dataset.act === 'redeem-reset') { t.form.elements.amt.value = acct(t.form.elements.plat.value).credits.toFixed(2); updateRedeem(t.form); return; }
  if (['load-less','load-more','load-reset'].includes(t.dataset.act)) {
    const form = t.form;
    const current = form.elements.amt.valueAsNumber;
    const next = t.dataset.act === 'load-reset' ? 10 : current + (t.dataset.act === 'load-more' ? 1 : -1);
    form.elements.amt.value = Math.min(S.user.wallet,Math.max(1,next)).toFixed(2);
    updateGameLoad(form);
    return;
  }
  if (t.dataset.amt) { const input = t.closest('form').elements.amt; input.value = t.dataset.amt; input.dispatchEvent(new Event('input', {bubbles:true})); return; }
  if (t.dataset.game) { const g = game(t.dataset.game); return playModal(g.p, g.id); }
  if (t.dataset.cat) {
    S.cat = t.dataset.cat;
    const grid = $('#gameGrid');
    grid.innerHTML = gameGrid(GAMES.filter(g => grid.dataset.plat === 'all' || g.p === grid.dataset.plat));
    document.querySelectorAll('[data-cat]').forEach(b => b.classList.toggle('on', b.dataset.cat === S.cat));
    return;
  }
  if (t.dataset.bal) { S.bal = t.dataset.bal; return render(true); }
  if (t.dataset.balsheet) { openBalSheet(t.dataset.balsheet); return; }
  if (t.dataset.sheet) { openSheet(t.dataset.sheet); return; }
  if (t.dataset.wtab) { const w = t.closest('.winners'); w.querySelectorAll('[data-wtab]').forEach(b => b.classList.toggle('on', b === t)); w.querySelectorAll('.win-pane').forEach(p => { p.hidden = p.dataset.pane !== t.dataset.wtab; }); return; }
  if (t.dataset.method) { S.method = t.dataset.method; $('#balPanel').innerHTML = balPanel(S.bal); $('#balPanel [aria-pressed=true]')?.focus({preventScroll:true}); return; }
  if (t.dataset.tab) {
    S.actTab = t.dataset.tab;
    render(true);
    document.querySelector(`.activity-plain [data-tab="${S.actTab}"]`)?.focus({ preventScroll: true });
    return;
  }
  if (t.dataset.rw) { S.rw = t.dataset.rw; if (location.hash !== '#/rewards') location.hash = '#/rewards'; else render(true); return; }
  if (t.dataset.chip) {
    S.actChip = t.dataset.chip;
    render(true);
    document.querySelector(`.activity-plain [data-chip="${S.actChip}"]`)?.focus({ preventScroll: true });
    return;
  }
  if (t.dataset.copyval) {
    if (!navigator.clipboard) return toast('Clipboard unavailable');
    navigator.clipboard.writeText(t.dataset.copyval)
      .then(() => toast(`${t.dataset.what || 'Text'} copied`))
      .catch(() => toast('Clipboard unavailable'));
    return;
  }
  const a = t.dataset.act;
  if (a === 'toggle-balance') {
    S.hideBalance = !S.hideBalance;
    store.set('r777_hide_balance',S.hideBalance);
    render(true);
    document.querySelector('[data-act="toggle-balance"]')?.focus({preventScroll:true});
    return;
  }
  if (a === 'landing-register') {
    e.preventDefault();
    setMenu(false);
    closeModal();
    if (route().r === 'login') { location.hash = '#/register'; return; }
    if (route().r === 'welcome') {location.hash='#/register';return;}
    const panel = document.querySelector('.landing-register');
    panel?.querySelector('form')?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    panel?.querySelector('input')?.focus({preventScroll:true});
    return;
  }
  if (a === 'join-visibility') {
    const input = document.getElementById(t.getAttribute('aria-controls'));
    const showing = input.type === 'password';
    input.type = showing ? 'text' : 'password';
    t.setAttribute('aria-pressed',String(showing));
    t.innerHTML = showing ? I.eye : I.eyeOff;
    return;
  }
  if (a === 'featured-preview') {
    const p = featuredPlatforms.find(platform => platform.preview && platform.id === t.dataset.featuredId);
    if (!p) return;
    openModal(`<h2>${p.name}</h2><p>This platform is featured in the collection artwork. Browse the catalog for available games.</p><a class="btn btn-accent btn-block" href="#/browse/all" data-close-after>View all games</a>`);
    return;
  }
  if (a === 'spotlight-prev' || a === 'spotlight-next') {
    advanceSpotlight((a === 'spotlight-next' ? 1 : -1) * Number(t.dataset.distance || 1));
    return;
  }
  if(a === 'review-prev' || a === 'review-next'){ const tr=document.getElementById('reviewTrack');tr?.scrollBy({left:(a==='review-next'?1:-1)*tr.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return;}
  if(a === 'reward-wheel') return openModal('<h2>Thunder Wheel</h2><p>Coming soon. Wheel rewards, eligibility, and official rules have not been configured.</p>');
  if(a === 'reward-early') return openModal('<h2>Early access</h2><p>New platform announcements will appear here when available.</p><a class="btn btn-accent" href="#/games" data-close-after>Explore platforms</a>');
  if (a === 'wallet-panel') return walletOverview();
  if (a === 'coin-help') return openModal('<h2>What is GC/SC?</h2><p>Gold Coins are play-only coins. Sweepstakes Coins are a separate balance whose use and redemption depend on the platform rules.</p><p>This preview is not connected to a GC/SC provider. Unavailable balances are shown as a dash, not as money you can withdraw.</p>');
  if (a === 'wallet-deposit' || a === 'wallet-withdraw') { if (!requireLogin()) return; S.bal = a === 'wallet-deposit' ? 'deposit' : 'withdraw'; S.pendingSheet = S.bal; closeModal(); if(location.hash === '#/balance') render(true); else location.hash = '#/balance'; return; }
  if (t.tagName === 'A' && t.getAttribute('href') === '#') e.preventDefault();
  const pid = t.dataset.plat;
  if (a === 'pw') {
    S.showPw = !S.showPw;
    if ($('#modal').hidden) render(true);
    else document.querySelectorAll('#modalBox .cred').forEach(c => { const b = c.querySelector('[data-act="pw"]'); if (b) { const v = c.querySelector('[data-copyval]').dataset.copyval; c.outerHTML = credRow('Password', v, v, true); } });
  }
  if (a === 'signup') { setMenu(false); if(S.site==='b') signupStep(1); else {closeModal();location.hash='#/register';} }
  if (a === 'demo-resend' && !t.disabled && pending.join) renewPhoneCode();
  if (a === 'resend') toast(`New code sent to ${pending.email}`);
  if (a === 'login') {
    setMenu(false);
    if (S.site !== 'b') {
      closeModal();
      if (route().r === 'login') document.getElementById('return-name')?.focus();
      else location.hash = '#/login';
      return;
    }
    openModal(`<h2>Sign in</h2><p>Use your ${BRAND()} username, email or phone, and your password.</p>
      <form class="form-row" data-form="login">
        <div class="login-via" role="tablist" aria-label="Sign in with"><button type="button" role="tab" class="on" aria-selected="true" data-login-via="account">Account</button><button type="button" role="tab" aria-selected="false" data-login-via="phone">Phone</button></div>
        <input class="field" data-via="account" name="u" placeholder="Username or email" autocomplete="username" required>
        <div class="login-phone-row" data-via="phone" hidden><select class="field" name="cc" aria-label="Country calling code" disabled><option value="+1">US +1</option><option value="+52">MX +52</option><option value="+34">ES +34</option></select><input class="field" name="phone" type="tel" inputmode="tel" placeholder="Phone number" autocomplete="tel-national" required disabled></div>
        <input class="field" type="password" name="p" placeholder="Password" autocomplete="current-password" required>
        <button class="btn btn-accent btn-block" type="submit">Sign in</button>
      </form>
      <p class="note">New here? <a href="#" data-act="signup">Create an account</a></p>`);
  }
  if (a === 'login-help') openModal(`<h2>Forgot password?</h2><p>Password recovery is unavailable for local demo accounts. If you saved your password in your browser, check its password manager.</p><button type="button" class="btn btn-outline btn-block" data-close>Close</button>`);
  if (a === 'logout') {
    if (S.user?.kioskDemo) { endKioskDemo(); return; }
    setMenu(false); S.user = null; store.set('p3_user', null); S.showPw = false; goHome(); toast('Signed out');
  }
  if (a === 'unlock') unlockModal(pid);
  if ((a === 'unlock-go' || a === 'unlock-link' || a === 'gcreds' || a === 'gedit') && !requireLogin()) return;
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
  if (a === 'load-history') { S.actTab = 'done'; S.actChip = 'Loads'; closeModal(); if (location.hash === '#/activity') render(true); else location.hash = '#/activity'; return; }
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
  if (a === 'edit-avatar' && S.user) openModal(`<h2>Edit avatar</h2>${avatarChoices()}`);
  if (a === 'avatar' && S.user && (AVATARS.includes(t.dataset.c) || t.dataset.c === 'tuxedo')) {
    const fromMenu = document.body.classList.contains('menu-open');
    closeModal();
    S.user.avatar = t.dataset.c;
    refresh(); syncQuests(); render(true);
    if (fromMenu) setMenu(true);
    document.querySelector(fromMenu ? '#drawer .edit-avatar' : 'main .edit-avatar')?.focus({preventScroll:true});
  }
  if (a === 'share') {
    const link = t.dataset.link;
    if (navigator.share) navigator.share({ title: BRAND(), text: `Join me on ${BRAND()}`, url: link }).catch(() => {});
    else { if (navigator.clipboard) navigator.clipboard.writeText(link).catch(() => {}); toast('Invite link copied'); }
  }
  if (a === 'bell') openModal(`<div class="inbox-empty"><span class="inbox-icon">${I.bell}</span>
    <h2>Notifications</h2><p>No new notifications</p></div>`);
  if (a === 'telegram') toast('Your Telegram channel link goes here');
  if (a === 'get-app') { setMenu(false); openModal(`<h2>Download the app</h2><p>Install ${BRAND()} on your phone for faster access.</p><div class="dl-list"><button class="opt" data-act="store" data-store="Android"><b>Android</b><small>Download the APK</small>${I.dl}</button><button class="opt" data-act="store" data-store="iPhone"><b>iPhone</b><small>Add to Home Screen</small>${I.dl}</button></div>`); }
  if (a === 'choose-site') { setMenu(false); showChooser(); return; }
  if (a === 'chat') { closeModal(); setMenu(false); setChat(true); }
  if (a === 'chat-close') { setChat(false); $('.tabbar [data-nav="chat"]').focus({preventScroll:true}); }
  if (a === 'clear-chat-file') {
    const input=t.form.elements.attachment;
    input.value=''; input.dispatchEvent(new Event('change',{bubbles:true})); input.focus();
  }
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
    openModal(`<section class="withdraw-sheet"><header class="cash-cover"><h2>Withdraw to ${c.name}</h2><p>Demo withdrawal · ${c.code}</p></header>
      <form class="form-row cash-body" data-form="withdraw"><div class="cash-line"><span>Demo wallet</span><b>${usd(S.user.wallet)}</b></div>
        <label for="withdraw-value">Withdrawal amount</label><input id="withdraw-value" class="field" name="amt" type="number" inputmode="decimal" min="${MIN_WITHDRAW}" step="0.01" max="${S.user.wallet}" placeholder="${usd(MIN_WITHDRAW)} minimum" required>
        <label for="withdraw-address">${c.name} address</label><input id="withdraw-address" class="field" name="addr" autocomplete="off" spellcheck="false" placeholder="Demo destination address" required>
        <p class="redeem-info">This records a demo request in Activity. No crypto is sent.</p>
        <div class="load-actions"><button class="btn btn-outline" type="button" data-balsheet="withdraw">Back</button><button class="btn cash-primary" type="submit">Request withdrawal</button></div>
      </form></section>`);
  }
  if (a === 'twofa') { S.user.twofa = !S.user.twofa; refresh(); toast(`Two-step login ${S.user.twofa ? 'on' : 'off'}`); }
  if (a === 'cool') { S.user.coolUntil = Date.now() + Number(t.dataset.h) * 3600e3; closeModal(); refresh(); toast('Break started. Deposits and loading are paused.'); }
  if (a === 'exclude') openModal(`<h2>Self-exclude?</h2><p>This closes deposits and loading on your account. You can still redeem and withdraw what you have. To reopen, you will need to contact support.</p><button class="btn btn-outline btn-block danger" data-act="exclude-go">Yes, self-exclude me</button>`);
  if (a === 'exclude-go') { S.user.excluded = true; closeModal(); refresh(); toast('Self-exclusion is on'); }
});

document.addEventListener('input', e => {
  const join = e.target.closest('[data-form="join"]');
  if (join) join.elements.confirm.setCustomValidity('');
});

document.addEventListener('submit', async e => {
  const f = e.target.closest('[data-form]');
  if (!f) return;
  e.preventDefault();
  const d = Object.fromEntries(new FormData(f));
  const k = f.dataset.form;
  const amt = Number(d.amt);
  if (k === 'quick') { pending.email = d.email; signupStep(1); }
  if (k === 'join') {
    if (d.password !== d.confirm) {
      f.elements.confirm.setCustomValidity(document.documentElement.lang === 'es' ? 'Las contraseñas deben coincidir.' : 'The passwords must match.');
      f.elements.confirm.reportValidity(); return;
    }
    const submit = f.querySelector('[type="submit"]');
    if (submit.disabled) return;
    submit.disabled = true;
    try {
      const credential = await passwordKey(d.password);
      if (!f.isConnected || S.user) return;
      pending.email = d.email.trim();
      pending.first = pending.email.split('@')[0];
      pending.join = {passwordKey:credential,marketingOptIn:d.offers === 'on'};
      signupStep(2);
    } catch { toast('Registration is unavailable in this browser.'); }
    finally { submit.disabled = false; }
    return;
  }
  if (k === 'email') { delete pending.join; pending.first = d.first.trim(); pending.email = d.email.trim(); signupStep(2); }
  if (k === 'code') {
    if (f.classList.contains('phone-preview')) {
      if (!pending.join) return;
      const digits = [...f.querySelectorAll('.code-in input')].map(input=>input.value).join('');
      if (digits !== pending.code) {f.querySelector('.phone-error').hidden=false;return;}
      clearInterval(phoneTimer);delete pending.code;
      const ph = f.querySelector('#preview-phone'), cc = f.querySelector('.preview-phone-row select');
      if (ph && ph.value.trim()) pending.phone = `${(cc && cc.value.split(' ').pop()) || '+1'} ${ph.value.replace(/[^0-9]/g, '')}`;
    }
    const credentials = makeCreds(pending.first);
    if (pending.join) { delete credentials.password; Object.assign(credentials,pending.join); delete pending.join; }
    S.user = normUser({ goldCoins: 50000, first: pending.first, email: pending.email, phone: pending.phone || '', since: new Date().toISOString().slice(0, 10), ...credentials });
    S.showPw = true;
    save();
    if (route().r) {
      window.addEventListener('hashchange',()=>signupStep(3),{once:true});
      location.hash='#/';
    } else {render();signupStep(3);}
  }
  if (k === 'demo-login') {
    const player = d.player.trim();
    if (!player) { f.elements.player.value=''; f.elements.player.reportValidity(); return; }
    S.user = demoUser(player,makePw());
    S.user.demoSession = true;
    save(); finishRechargeLogin();
    return;
  }
  if (k === 'login') {
    const saved = normUser(store.get('p3_account', null));
    const digits = (d.phone || '').replace(/[^0-9]/g, '');
    const name = d.phone ? `${d.cc || '+1'} ${digits}` : (d.u || '').trim();
    if (d.phone && digits.length < 7) { toast('Enter your phone number'); return; }
    const match = saved && (d.phone ? !!saved.phone && saved.phone.replace(/[^0-9]/g, '').endsWith(digits) : (name.toLowerCase() === saved.username.toLowerCase() || name.toLowerCase() === (saved.email || '').toLowerCase()));
    if (S.site !== 'b' || saved?.passwordKey) {
      if (!match || !(await matchesPassword(saved,d.p))) {toast('Incorrect login details');return;}
    }
    if (f.elements.rememberName && !d.phone) {
      if (d.rememberName) store.set('p3_login_name',name);
      else store.del('p3_login_name');
    }
    S.user = match ? saved : demoUser(name, d.p);
    save();
    closeModal();
    if (S.site === 'b') {goHome();toast(`Welcome back, ${S.user.first}`);}
    else finishRechargeLogin();
  }
  if (k === 'pw') {
    if (!(await matchesPassword(S.user,d.cur))) { toast('Current password is wrong'); return; }
    if (S.user.passwordKey) S.user.passwordKey = await passwordKey(d.next);
    else S.user.password = d.next;
    f.reset(); closeModal(); refresh(); toast('Password updated');
  }
  if (k === 'user') {
    if (!(await matchesPassword(S.user,d.cur))) { toast('Current password is wrong'); return; }
    const next = d.next.trim();
    if (next === S.user.username) { toast('That is already your username'); return; }
    S.user.username = next; closeModal(); refresh(); toast(`Username changed to ${next}`);
  }
  if (k === 'deposit') {
    const stop = blocked();
    if (stop) { toast(stop); return; }
    if (S.user.limit && todayDeposits() + amt > S.user.limit) { toast(`That would pass your $${S.user.limit} daily limit`); return; }
    const c = CRYPTO.find(x => x.id === S.method);
    const addr = c.pre + Array.from({ length: 30 }, () => 'abcdefghjkmnpqrstuvwxyz023456789'[Math.floor(Math.random() * 32)]).join('');
    openModal(`<div class="modal-coin">${cryptoIco(c)}</div><h2>Review deposit</h2>
      <div class="wallet-line"><span>${esc(c.name)}</span><b>${usd(amt)}</b></div>
      <div class="addr"><div class="qr" aria-hidden="true">${Array.from({ length: 49 }, (_, i) => `<i class="${(i * 7 + addr.charCodeAt(i % addr.length)) % 3 ? '' : 'on'}"></i>`).join('')}</div>
        <div class="cred"><label>Deposit address (demo)</label><div class="cred-row"><code>${addr}</code><button class="icon-btn" data-copyval="${addr}" data-what="Address">${I.copy}</button></div></div></div>
      <div class="warn">Demo address. Use the button below to simulate a deposit. Do not send funds.</div>
      <button class="btn btn-accent btn-block" data-act="sent" data-amount="${amt}" style="margin-top:16px">Simulate deposit</button>`);
  }
  if (k === 'withdraw') {
    if (!f.isConnected || $('#modal').hidden || !f.reportValidity() || !Number.isFinite(amt) || amt<MIN_WITHDRAW || amt>S.user.wallet) return;
    const c = CRYPTO.find(x => x.id === S.method);
    const next = structuredClone(S.user);
    next.wallet = Math.round((next.wallet-amt)*100)/100;
    next.tx.unshift({id:rid(), when:now(), kind:'Withdrawals', label:`Withdrawal (${c.name})`, amt:-amt, status:'pending'});
    try { persistDemoChange(S.user,next); } catch (error) { toast(error.message); return; }
    S.user = next;
    closeModal(); render(true); toast('Demo withdrawal requested. Track it in Activity.');
  }
  if (k === 'load') {
    if (!f.isConnected || f.dataset.sending === 'true') return;
    if (!f.classList.contains('game-load-form')) {
      loadModal(d.plat);
      const review = document.querySelector('.game-load-form');
      if (review) { review.elements.amt.value = d.amt; updateGameLoad(review); }
      return;
    }
    const feedback = f.querySelector('.transfer-feedback');
    const button = f.querySelector('[type=submit]');
    if (!button || !f.reportValidity()) return;
    f.dataset.sending = 'true';
    button.disabled = true;
    feedback.textContent = 'Saving demo transfer…';
    const owner = S.user;
    const commit = () => {
      if (owner !== S.user || !f.isConnected || $('#modal').hidden) return;
      if (blocked()) throw Error(blocked());
      if (!acct(d.plat) || !Number.isFinite(amt) || amt < 1 || amt > owner.wallet) throw Error('Check the amount and available wallet balance.');
      const p=plat(d.plat), bonus=gameLoadBonus(d.plat,amt);
      const next=structuredClone(owner);
      S.user=next;
      let record;
      try {
        next.wallet=Math.round((next.wallet-amt)*100)/100;
        next.accounts[d.plat].credits=Math.round((next.accounts[d.plat].credits+amt+bonus)*100)/100;
        record=addTx({kind:'Loads',label:'Loaded credits',p:d.plat,amt:-amt,status:'done'});
        if (Math.floor(amt)>0) addPts(`Loaded ${p.name}`,Math.floor(amt));
        if (bonus>0) addTx({kind:'Bonus',label:`Daily 1st bonus (+${p.daily}%)`,p:d.plat,amt:bonus,status:'done'});
        persistDemoChange(owner,next);
      } catch (error) {
        S.user=owner;
        throw error;
      }
      S.loadPlat=d.plat;
      closeModal(); render(true); gameLoadReceipt(p,amt,bonus,record.id);
    };
    try {
      await new Promise(resolve=>requestAnimationFrame(resolve));
      if (navigator.locks) await navigator.locks.request('r777-demo-wallet',commit);
      else commit();
    } catch (error) {
      feedback.textContent=error.message;
      button.disabled=false;
      button.textContent='Retry demo transfer';
    } finally { delete f.dataset.sending; }
    return;
  }
  if (k === 'gedit') {
    const ga = S.user.accounts[d.plat];
    ga.username = d.u.trim(); ga.password = d.p;
    refresh(); gameCredsModal(d.plat); toast(`${plat(d.plat).name} login updated`);
  }
  if (k === 'link') {
    S.user.accounts[d.plat] = { username: d.u.trim(), password: d.p, credits: 0, linked: true };
    S.showPw = false;
    refresh();
    gameCredsModal(d.plat, true);
    toast(`${plat(d.plat).name} account linked`);
  }
  if (k === 'redeem') {
    if (!f.isConnected || $('#modal').hidden || !f.reportValidity() || !acct(d.plat) || !Number.isFinite(amt) || amt<1 || amt>acct(d.plat).credits) return;
    const next = structuredClone(S.user);
    next.accounts[d.plat].credits = Math.round((next.accounts[d.plat].credits-amt)*100)/100;
    next.tx.unshift({id:rid(),kind:'Redeems',label:'Redeemed credits',p:d.plat,amt,when:now(),status:'pending',settleAt:Date.now()+4000});
    try { persistDemoChange(S.user,next); } catch (error) { toast(error.message); return; }
    S.user = next;
    closeModal(); render(true); toast('Demo redemption requested. Track it in Activity.');
  }
  if (k === 'p2p') {
    if (amt > S.user.wallet) { toast('More than your wallet balance'); return; }
    S.user.wallet -= amt;
    addTx({ kind: 'P2P', label: `Sent to ${d.to}`, amt: -amt, status: 'done' });
    f.reset(); closeModal(); refresh(); toast(`Sent ${usd(amt)} to ${d.to}`);
  }
  if (k === 'voucher') {
    if (d.code.trim().toUpperCase() === 'WELCOME5' && !S.user.tx.some(t => t.label === 'Voucher WELCOME5')) {
      S.user.wallet += 5;
      addTx({ kind: 'Vouchers', label: 'Voucher WELCOME5', amt: 5, status: 'done' });
      closeModal(); refresh(); toast('$5.00 added to your wallet');
    } else { f.reset(); toast('That voucher code is not valid','error'); }
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
    const text = (k === 'reason' ? d.r : d.m).trim();
    const file = k === 'chat' ? f.elements.attachment.files[0]?.name : '';
    if (!text && !file) { f.elements.m.focus(); return; }
    const guidance = {
      'Account / login issues':'Open Menu, then Account & security to check your login settings.',
      'Deposit not showing':'Open Activity and select In progress to check pending deposits.',
      'Redeem or withdrawal':'Open Balance to redeem game credits or start a withdrawal.',
      'Game account / credits':'Open Games and choose a platform to see its account details.'
    };
    const reply = (k === 'reason' && guidance[d.r]) || 'This is a local chat preview. For help topics, open Help center in the menu.';
    const messages = [{me:true,t:text,file},{t:reply}];
    S.chat.push(...messages);
    $('#chat .chat-reason')?.remove();
    $('#chat .chat-log').insertAdjacentHTML('beforeend',messages.map(chatMessage).join(''));
    const composer = $('#chat .chat-in');
    if (k === 'chat') { composer.reset(); composer.querySelector('.chat-file-preview').hidden=true; }
    composer.elements.m.focus({preventScroll:true});
    $('#chatBody').scrollTop = $('#chatBody').scrollHeight;
  }
});

document.addEventListener('change', event => {
  if (!event.target.matches('.chat-clip input')) return;
  const preview = event.target.form.querySelector('.chat-file-preview');
  const file = event.target.files[0];
  preview.hidden = !file;
  preview.querySelector('output').textContent = file?.name || '';
});

document.addEventListener('input', e => {
  if (e.target.matches('[data-search]')) {
    S.q = e.target.value;
    const grid = $('#gameGrid');
    grid.innerHTML = gameGrid(GAMES.filter(g => grid.dataset.plat === 'all' || g.p === grid.dataset.plat));
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
  if (e.key === 'Tab' && !$('#modal').hidden) {
    const controls = [...$('#modalBox').querySelectorAll('a[href],button,input,select,textarea,summary,[tabindex="0"]')]
      .filter(el => !el.disabled && el.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }
  if (e.key === 'Escape') { if (!$('#modal').hidden) leaveVerification(closeModal); setMenu(false); setChat(false); }
  if (e.key === 'Backspace' && e.target.closest('.code-in') && !e.target.value && e.target.previousElementSibling) e.target.previousElementSibling.focus();
});

window.addEventListener('hashchange', () => { S.cat = 'All'; S.q = ''; closeModal(); setMenu(false); setChat(false); render(); });
applySite('a');
render();
if (!S.user && route().name === 'home' && performance.getEntriesByType('navigation')[0]?.type === 'reload') {
  history.scrollRestoration = 'manual';
  window.addEventListener('pageshow', () => requestAnimationFrame(() => {
    window.scrollTo({top:0,behavior:'instant'});
    history.scrollRestoration = 'auto';
  }), {once:true});
}
document.getElementById('loader').setAttribute('data-ready','');
// Open directly on Skillandslots; alternate site remains available in the footer.

function walletOverview(){
 const u=S.user, value=x=>Number.isFinite(x)?x.toFixed(2):'—';
 openModal(`<div class="coin-wallet"><div class="coin-wallet-title"><div><p class="section-kicker">YOUR WALLET</p><h2>Balance overview</h2></div></div><div class="coin-balance"><span class="currency-token gc">GC</span><div><b>Gold Coins</b><small>Play only</small></div><strong>${value(u?.goldCoins)}</strong></div><div class="sweeps-balance"><div class="coin-balance"><span class="currency-token sc">SC</span><div><b>Sweepstakes Coins</b></div><strong>${value(u?.sweepsCoins)}</strong></div><div class="balance-divider"></div><div class="coin-breakdown"><span>Unplayed <b>${value(u?.unplayedSC)}</b></span><span>Redeemable <b>${value(u?.redeemableSC)}</b></span></div></div><p class="coin-disclaimer">GC/SC balances are not connected yet.</p><div class="coin-wallet-actions"><button class="btn btn-accent" data-act="wallet-deposit">+ Deposit</button><button class="btn btn-ghost" data-act="wallet-withdraw">↥ Withdraw</button></div><button class="coin-help" data-act="coin-help">ⓘ <span>What is GC/SC?</span> →</button>${!u?'<p class="hint">Sign in to manage your wallet.</p>':''}</div>`);
}
function communityUpdates() {
  const previewMethods = [
    {name:'Cash App',bg:'#0c9339',sym:'$'}, ...CRYPTO,
    {name:'Shiba Inu',bg:'#b23b20',sym:'<svg viewBox="0 0 32 32"><path fill="#eb8a3c" d="m4 3 9 4 6 0 9-4-1 13Q27 27 16 29 5 27 5 16Z"/><path fill="#fff1db" d="M5 17q7 0 11 5 4-5 11-5-2 10-11 12-9-2-11-12Z"/><path fill="#34293b" d="m8 13 6 2-2 2Zm16 0-4 4-2-2Zm-11 8h6l-3 3Z"/></svg>'},
    {name:'Dogecoin',bg:'#ad842c',sym:'Ð'},
    {name:'USD Coin',bg:'#2775ca',sym:'<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.6" stroke-linecap="round"><path d="M7 4a9 9 0 0 0 0 16m10-16a9 9 0 0 1 0 16M15 8.5c-1-2.7-6.8-2-6 1 .7 2.3 5.3 1.4 6 4 .8 3.2-5.5 4.1-6.4 1.1M12 5v2m0 10v2"/></svg>'},
    {name:'Dai',bg:'#ee9d23',sym:'<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.7"><path d="M6 5h5a7 7 0 0 1 0 14H6Zm-3 5h18M3 14h18"/></svg>'},
    {name:'Ripple',bg:'#202738',sym:'<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="m3 5 6 5a5 5 0 0 0 6 0l6-5M3 19l6-5a5 5 0 0 1 6 0l6 5"/></svg>'},
    {name:'Monero',bg:'#f16722',sym:'<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M1 17h4V8l7 7 7-7v9h4"/></svg>'}
  ];
  return communityShowcase() + `<section class="method-gallery" aria-labelledby="method-title">
    <header><span class="method-wallet-icon" aria-hidden="true">${I.wallet}</span><div><h2 id="method-title">Wallet payment methods</h2><p>Preview only · Live payments are not connected.</p></div></header>
    <ul>${previewMethods.map(method=>`<li><span aria-hidden="true">${cryptoIco(method)}</span><b>${method.name}</b></li>`).join('')}</ul>
    <footer><a href="#/balance">${I.wallet}<span>Open wallet</span>${I.chev}</a><button data-act="foot-doc" data-doc="FAQ">${I.help}<span>Help center</span></button></footer></section>`;
}


function featureRewards(){return `<section class="feature-rewards"><p class="section-kicker">MORE TO EXPLORE</p><h2>Power up your experience.</h2><div class="feature-grid"><button data-act="reward-wheel"><span class="reward-art art-0"></span><b>THUNDER WHEEL</b><small>New rewards · Coming soon</small></button><a href="#/rewards"><span class="reward-art art-1"></span><b>REWARDS CLUB</b><small>Explore your points and benefits</small></a><button data-act="bell"><span class="reward-art art-2"></span><b>INBOX</b><small>Your account announcements</small></button><button data-act="reward-early"><span class="reward-art art-3"></span><b>EARLY ACCESS</b><small>Discover what is coming next</small></button></div></section>`;}
