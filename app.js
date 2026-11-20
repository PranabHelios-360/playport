const PLATFORMS = [
  { id: 'milkyway', name: 'Milky Way', c1: '#1d2370', c2: '#7a4dff', logo: 'assets/logos/mw-icon.jpg', blurb: 'Space-themed slots, keno and fish games, with the Milky Way jackpot wheel.' },
  { id: 'firekirin', name: 'Fire Kirin', c1: '#0b4d26', c2: '#c99a14', logo: 'assets/logos/fk-icon.jpg', blurb: 'Fish tables and lucky slots. Home of Jade Fortune and Space Jet.' },
  { id: 'orion', name: 'Orion Stars', c1: '#7a2510', c2: '#f29a2e', blurb: 'The biggest catalogue: fish, slots and keno.' },
  { id: 'panda', name: 'Panda Master', c1: '#6e0f28', c2: '#e2486a', blurb: 'Lucky-themed slots with daily bonus drops.' },
  { id: 'juwa', name: 'Juwa', c1: '#05514a', c2: '#18b89a', blurb: 'Fast fish games and multiplier slots.' },
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

const HERO = [
  { game: 'milkyway--shooting-star', title: 'Shooting Star', text: 'Stack rubies and cherries for the Grand jackpot. Play it on your Milky Way account.' },
  { game: 'firekirin--jade-fortune', title: 'Jade Fortune', text: 'The jade dragon pays up to 2,000x. New this week on Fire Kirin.' },
  { game: 'milkyway--ocean-king', title: 'Ocean King', text: 'Hunt the great white for the boss bonus. Fish tables on Milky Way.' }
];

const RECENT = [
  { id: 'milkyway--ocean-king', pct: 72, when: '2h ago' },
  { id: 'firekirin--jade-fortune', pct: 40, when: 'Yesterday' },
  { id: 'milkyway--king-of-leopard', pct: 88, when: 'Yesterday' },
  { id: 'firekirin--space-jet', pct: 25, when: '3 days ago' },
  { id: 'milkyway--hexno-keno', pct: 55, when: '5 days ago' },
  { id: 'firekirin--lucky-weekends', pct: 10, when: '1 week ago' }
];

const BALANCES = { firekirin: [42.5, 18200], milkyway: [12, 5400], orion: [88.25, 31000], panda: [0, 2500], juwa: [7.8, 9100], vegas: [3.1, 1200] };

const plat = id => PLATFORMS.find(p => p.id === id);
const game = id => GAMES.find(g => g.id === id);
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};

const S = {
  user: store.get('pp_user', null),
  cat: 'All',
  q: '',
  showPw: false,
  bal: 'deposit',
  actTab: 'done',
  actChip: 'All',
  chat: [{ t: 'Hi there. How can we help you today?' }]
};

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
const TX = [
  { kind: 'Deposits', label: 'Deposit', p: 'firekirin', amt: '+20.00 SC', when: '11/20/2026 01:12 PM', done: true },
  { kind: 'Bonus', label: 'Daily bonus', p: 'milkyway', amt: '+1.00 SC', when: '11/20/2026 09:00 AM', done: true },
  { kind: 'Redeems', label: 'Redeem', p: 'orion', amt: '-50.00 SC', when: '11/19/2026 08:41 PM', done: true },
  { kind: 'Vouchers', label: 'Voucher WELCOME5', p: 'juwa', amt: '+5.00 SC', when: '11/18/2026 06:30 PM', done: true },
  { kind: 'Redeems', label: 'Redeem', p: 'firekirin', amt: '-25.00 SC', when: '11/20/2026 03:05 PM', done: false }
];

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
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0Zm0 1H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 2v4m-4 3h8"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  arrowL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5m6-6-6 6 6 6"/></svg>',
  ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4Z"/><path d="M14 7v10" stroke-dasharray="2 2"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  gift: '<svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="12" rx="2" fill="#e2483a"/><rect x="2" y="7" width="20" height="5" rx="1.5" fill="#ff6a52"/><rect x="10.5" y="7" width="3" height="14" fill="#ffd25a"/><path d="M12 7c-2-4-6-4-6-1.5S10 7 12 7c2 0 6-1 6-1.5S14 3 12 7Z" fill="#ffd25a"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6Z" fill="#ffc83d"/><path d="M9.5 18a2.5 2.5 0 0 0 5 0Z" fill="#e6a313"/></svg>'
};

const initials = p => p.name.split(' ').map(w => w[0]).join('').slice(0, 2);
const coin = (p, size = '') => `<span class="coin ${size}" style="--c1:${p.c1};--c2:${p.c2}">${p.logo ? `<img src="${p.logo}" alt="">` : `<i class="ini">${initials(p)}</i>`}</span>`;
const crumb = (...parts) => `<nav class="crumb"><a href="#/" aria-label="Home">${I.home}</a>${parts.map(([t, h]) => `<span class="sep">${I.chev}</span>${h ? `<a href="${h}">${t}</a>` : `<b>${t}</b>`}`).join('')}</nav>`;
const fmt = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const totalSC = () => Object.values(BALANCES).reduce((s, b) => s + b[0], 0);

function topRight() {
  if (!S.user) return `<button class="btn btn-ghost btn-sm" data-act="login">Log in</button><button class="btn btn-accent btn-sm" data-act="signup">Sign up</button>`;
  return `<button class="round-btn" data-act="gift" aria-label="Daily bonus">${I.gift}</button>
    <button class="round-btn" data-act="bell" aria-label="Notifications">${I.bell}<i class="dot"></i></button>
    <a class="bal" href="#/balance" aria-label="Balance"><span class="bal-plus">${I.plus}</span><span class="bal-num">${fmt(totalSC())} SC</span></a>`;
}

function credRow(label, value, key, secret) {
  const shown = !secret || S.showPw;
  return `<div class="cred"><label>${label}</label>
    <div class="cred-row"><code>${shown ? esc(value) : '&bull;'.repeat(12)}</code>
      ${secret ? `<button class="icon-btn" data-act="pw" aria-label="${S.showPw ? 'Hide' : 'Show'} password">${S.showPw ? I.eyeOff : I.eye}</button>` : ''}
      <button class="icon-btn" data-copy="${key}" aria-label="Copy ${label.toLowerCase()}">${I.copy}</button>
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
  const actions = S.user
    ? `<span class="linked">${I.check}Linked</span>
       <a class="btn btn-accent" href="#/platform/${p.id}">Play</a>
       <button class="sq-btn" data-act="creds" aria-label="Show my login">${I.key}</button>`
    : `<button class="btn btn-outline" data-act="signup">Unlock Account</button>
       <a class="sq-btn" href="#/platform/${p.id}" aria-label="See games">${I.chev}</a>`;
  return `<div class="row-card">
    <a class="row-main" href="#/platform/${p.id}">${coin(p)}<span><b>${p.name}</b><small>${p.games} games &middot; ${p.blurb}</small></span></a>
    <div class="row-acts">${actions}</div>
  </div>`;
}

function ticker() {
  const card = f => { const p = plat(f.p); return `<div class="tick">${coin(p, 'xs')}
    <span class="tick-txt"><b>${esc(f.user)}</b> won on ${p.name}</span><em>${f.amt} SC</em><small>${f.ago}</small></div>`; };
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
          ? `<h1>One login for <span>every platform</span></h1>
             <p class="hero-sub">Sign up with your email, confirm the 6-digit code, and get a username and password that works on all ${PLATFORMS.length} platforms.</p>
             <form class="hl-form" data-form="quick">
               <input class="field" type="email" name="email" placeholder="Your email address" required autocomplete="email">
               <button class="btn btn-accent btn-lg" type="submit">Get my login</button>
             </form>
             <p class="hl-note">Already have one? <a href="#" data-act="login">Log in</a></p>`
          : `<h1>Welcome back, <span>${esc(S.user.first)}</span></h1>
             <p class="hero-sub">Your login works on all ${PLATFORMS.length} platforms. Pick one and play.</p>
             <div class="hero-acts"><a class="btn btn-accent btn-lg" href="#/games">Play now</a><button class="btn btn-outline btn-lg" data-act="creds">${I.key}My login</button></div>`}
        <div class="hero-stats">
          <div><b>${PLATFORMS.length}</b><span>platforms</span></div>
          <div><b>${GAMES.length}</b><span>games</span></div>
          <div><b>${guest ? '1' : fmt(totalSC())}</b><span>${guest ? 'login for all' : 'SC balance'}</span></div>
        </div>
      </div>
      <div class="hero-mascot" aria-hidden="true"><img src="assets/mascot.jpg" alt=""></div>
      <div class="hot-card">
        <div class="hot-label">${I.bolt}Hot right now</div>
        ${hot.map((p, i) => `<a class="hot-row" href="#/platform/${p.id}">
          ${coin(p, 'md')}
          <span class="hot-name"><b>${p.name}</b><small><i></i>${[1240, 986, 712][i].toLocaleString('en-US')} playing</small></span>
          <span class="btn btn-accent btn-sm">Play</span>
        </a>`).join('')}
      </div>
    </section>

    ${guest ? `<section class="steps3">
      <div><span>1</span><b>Enter your email</b><p>Plus your first name.</p></div>
      <div><span>2</span><b>Verify the code</b><p>We email you 6 digits.</p></div>
      <div><span>3</span><b>Get your login</b><p>Username and password, shown on screen.</p></div>
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
  </div>
  ${ticker()}`;
}

function viewGames() {
  return `<div class="page">
    ${crumb(['Games'])}
    <p class="lede">${S.user ? `Your <b>PlayPort login</b> works on every platform below. Tap Play to open one.` : `Here you'll find all our <b>platforms</b>. Don't have a login yet? Unlock it now!`}</p>
    <div class="list-h"><h2>Platforms</h2><span>${PLATFORMS.length} available</span></div>
    <div class="rows">${PLATFORMS.map(platRow).join('')}</div>
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
  const list = GAMES.filter(g => g.p === p.id);
  return `<div class="page">
    ${crumb(['Games', '#/games'], [p.name])}
    <div class="plat-top">
      ${coin(p, 'lg')}
      <div class="plat-top-txt"><h1>${p.name}</h1><p>${p.blurb}</p>
        ${S.user ? `<p class="signed">Signed in as <code>${esc(S.user.username)}</code> &middot; ${fmt(BALANCES[p.id][0])} SC</p>` : ''}</div>
      <div class="plat-top-acts">${S.user
        ? `<button class="btn btn-outline" data-act="creds">${I.key}My login</button><a class="btn btn-accent" href="#/balance">Add coins</a>`
        : `<button class="btn btn-accent" data-act="signup">Unlock Account</button>`}</div>
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
  { id: 'redeem', label: 'Redeem', color: '#e0709e', icon: I.arrowL },
  { id: 'balances', label: 'My balances', color: '#3b82f6', icon: I.list },
  { id: 'voucher', label: 'Voucher', color: '#0ea5b7', icon: I.ticket }
];

function balPanel(id) {
  const head = (t, s) => `<div class="panel-h"><span class="mini-ico" style="background:${BAL_ITEMS.find(b => b.id === id).color}">${BAL_ITEMS.find(b => b.id === id).icon}</span><div><h2>${t}</h2><p>${s}</p></div></div>`;
  if (id === 'deposit') return head('Deposit', 'Choose the platform you want to add coins to.') +
    `<div class="opt-list">${PLATFORMS.map(p => `<button class="opt" data-act="cashier" data-plat="${p.id}">${coin(p, 'sm')}<b>${p.name}</b><small>${fmt(BALANCES[p.id][0])} SC</small>${I.chev}</button>`).join('')}</div>`;
  if (id === 'redeem') return head('Redeem', 'Redeem Sweeps Coins you won on a platform.') +
    `<div class="opt-list">${PLATFORMS.map(p => `<button class="opt" data-act="redeem" data-plat="${p.id}" ${BALANCES[p.id][0] < 1 ? 'disabled' : ''}>${coin(p, 'sm')}<b>${p.name}</b><small>${fmt(BALANCES[p.id][0])} SC available</small>${I.chev}</button>`).join('')}</div>`;
  if (id === 'balances') return head('My balances', 'Each platform keeps its own coins.') +
    `<table class="tbl"><thead><tr><th>Platform</th><th class="num">Sweeps Coins</th><th class="num">Gold Coins</th></tr></thead>
     <tbody>${PLATFORMS.map(p => `<tr><td><span class="pname">${coin(p, 'xs')}${p.name}</span></td><td class="num">${fmt(BALANCES[p.id][0])}</td><td class="num">${BALANCES[p.id][1].toLocaleString('en-US')}</td></tr>`).join('')}
     <tr class="tot"><td>Total</td><td class="num">${fmt(totalSC())}</td><td class="num">${Object.values(BALANCES).reduce((s, b) => s + b[1], 0).toLocaleString('en-US')}</td></tr></tbody></table>`;
  return head('Voucher', 'Got a voucher code? Enter it here.') +
    `<form class="form-row narrow" data-form="voucher"><input class="field" name="code" placeholder="Voucher code" required><button class="btn btn-accent" type="submit">Apply voucher</button></form>`;
}

function viewBalance() {
  if (!S.user) return needLogin('Balance');
  return `<div class="page split">
    <aside class="split-left">
      ${crumb(['Balance'])}
      <p class="lede">Here you can manage your deposits, redeems and vouchers.</p>
      <div class="acc">${BAL_ITEMS.map(b => `<button class="acc-item ${S.bal === b.id ? 'on' : ''}" data-bal="${b.id}" style="--ic:${b.color}">
        <span class="mini-ico" style="background:${b.color}">${b.icon}</span><b>${b.label}</b>${S.bal === b.id ? I.chev : I.down}</button>`).join('')}</div>
    </aside>
    <section class="split-right" id="balPanel">${balPanel(S.bal)}</section>
  </div>`;
}

function viewActivity() {
  if (!S.user) return needLogin('Activity');
  const chips = ['All', 'Deposits', 'Redeems', 'Bonus', 'Vouchers'];
  const rows = TX.filter(t => t.done === (S.actTab === 'done') && (S.actChip === 'All' || t.kind === S.actChip));
  return `<div class="page">
    ${crumb(['Activity'])}
    <div class="tabs">
      <button class="${S.actTab === 'done' ? 'on' : ''}" data-tab="done">Finished</button>
      <button class="${S.actTab === 'pending' ? 'on' : ''}" data-tab="pending">In progress</button>
    </div>
    <div class="filters">${chips.map(c => `<button class="chip ${S.actChip === c ? 'on' : ''}" data-chip="${c}">${c}</button>`).join('')}</div>
    ${rows.length ? `<div class="rows tx">${rows.map(t => { const p = plat(t.p); return `<div class="row-card slim">
        <div class="row-main">${coin(p, 'sm')}<span><b>${t.label}</b><small>${p.name} &middot; ${t.when}</small></span></div>
        <div class="row-acts"><b class="${t.amt.startsWith('+') ? 'pos' : 'neg'}">${t.amt}</b>${t.done ? '' : '<span class="pend">Pending</span>'}</div>
      </div>`; }).join('')}</div>`
      : '<p class="empty big">No transactions found for the selected filter</p>'}
  </div>`;
}

function viewAccount() {
  if (!S.user) return needLogin('My account');
  const u = S.user;
  return `<div class="page">
    ${crumb(['My account'])}
    <p class="lede">${esc(u.email)} &middot; member since ${new Date(u.since).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
    <div class="acct">
      <div class="card">
        <h2>My login</h2>
        <p class="card-sub">Works on all ${PLATFORMS.length} platforms.</p>
        ${credRow('Username', u.username, 'username')}
        ${credRow('Password', u.password, 'password', true)}
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
        <p class="card-sub">Updated on every platform at once.</p>
        <form class="form-row" data-form="pw">
          <input class="field" type="password" name="cur" placeholder="Current password" autocomplete="current-password" required>
          <input class="field" type="password" name="next" placeholder="New password (8+ characters)" minlength="8" autocomplete="new-password" required>
          <button class="btn btn-accent btn-block" type="submit">Update password</button>
        </form>
      </div>
    </div>
    <button class="btn btn-ghost" data-act="logout" style="margin-top:22px">Sign out</button>
  </div>`;
}

function needLogin(title) {
  return `<div class="page">${crumb([title])}
    <div class="card gate"><h2>Log in to see this page</h2><p class="card-sub">Don't have a login yet? Sign up with your email. It takes about a minute.</p>
      <div class="gate-acts"><button class="btn btn-accent" data-act="signup">Sign up</button><button class="btn btn-outline" data-act="login">Log in</button></div></div>
  </div>`;
}

/* ---------- menu + chat ---------- */

function menuHtml() {
  const links = [['#/', 'Home'], ['#/games', 'Games'], ['#/balance', 'Balance'], ['#/activity', 'Activity'], ['#/account', 'My account']];
  return `<div class="drawer-h"><a class="logo" href="#/">${LOGO}</a><button class="icon-btn" data-close-menu aria-label="Close menu">${I.x}</button></div>
    ${S.user ? `<div class="drawer-user"><span class="avatar">${esc(S.user.first[0] || 'P').toUpperCase()}</span><div><b>${esc(S.user.first)}</b><small>${esc(S.user.username)}</small></div></div>` : ''}
    <nav class="drawer-nav">${links.map(([h, t]) => `<a href="${h}">${t}${I.chev}</a>`).join('')}
      <a href="#" data-act="chat">Help &amp; chat${I.chev}</a></nav>
    <div class="drawer-foot">${S.user
      ? `<button class="btn btn-ghost btn-block" data-act="logout">Sign out</button>`
      : `<button class="btn btn-accent btn-block" data-act="signup">Sign up</button><button class="btn btn-ghost btn-block" data-act="login">Log in</button>`}</div>`;
}

const LOGO = `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="2" width="28" height="28" rx="9" fill="var(--accent)"/><path d="M11 23V9h6.2c3.1 0 5 1.8 5 4.5s-1.9 4.6-5 4.6H14.6V23Z" fill="#3a1022"/></svg><span>Play<b>Port</b></span>`;

function chatHtml() {
  return `<div class="chat-h"><button class="icon-btn" data-act="chat-close" aria-label="Close chat">${I.x}</button><span class="chat-av">P</span><b>PlayPort support</b></div>
    <div class="chat-body" id="chatBody">
      ${S.chat.map(m => `<div class="msg ${m.me ? 'me' : ''}">${esc(m.t)}</div>`).join('')}
      ${S.chat.length === 1 ? `<form class="chat-reason" data-form="reason"><label>Contact reason</label>
        <select class="field" name="r"><option>Account / login issues</option><option>Deposit or coins</option><option>Redeem</option><option>A game isn't loading</option><option>Something else</option></select>
        <button class="btn btn-accent btn-sm" type="submit">Send</button></form>` : ''}
    </div>
    <form class="chat-in" data-form="chat"><input class="field" name="m" placeholder="Type a message" autocomplete="off" required><button class="btn btn-accent btn-sm" type="submit">Send</button></form>`;
}

/* ---------- router ---------- */

function route() {
  const [r, arg] = location.hash.replace(/^#\/?/, '').split('/');
  const name = { '': 'home', games: 'games', platform: 'games', balance: 'balance', activity: 'activity', account: 'account' }[r] || 'home';
  return { name, r, arg };
}

function render(keepScroll) {
  const { name, r, arg } = route();
  const views = { home: viewHome, games: r === 'platform' ? () => viewPlatform(arg) : viewGames, balance: viewBalance, activity: viewActivity, account: viewAccount };
  $('#app').innerHTML = views[name]();
  $('#topRight').innerHTML = topRight();
  document.body.classList.toggle('has-ticker', name === 'home');
  document.querySelectorAll('.tabbar [data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === name));
  if (!keepScroll) window.scrollTo(0, 0);
}

function goHome() { if (location.hash.length > 2) location.hash = '#/'; else render(); }

/* ---------- modal ---------- */

function openModal(html, wide) {
  const box = $('#modalBox');
  box.className = 'modal-box' + (wide ? ' wide' : '');
  box.innerHTML = `<button class="icon-btn modal-x" data-close aria-label="Close">${I.x}</button>` + html;
  $('#modal').hidden = false;
  document.body.style.overflow = 'hidden';
  const f = box.querySelector('input');
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
    openModal(`${bar(1)}<h2>Create your login</h2><p>One email. We set up your account on all ${PLATFORMS.length} platforms.</p>
      <form class="form-row" data-form="email">
        <input class="field" name="first" placeholder="First name" autocomplete="given-name" required value="${esc(pending.first || '')}">
        <input class="field" type="email" name="email" placeholder="Email address" autocomplete="email" required value="${esc(pending.email || '')}">
        <button class="btn btn-accent btn-block" type="submit">Send code</button>
      </form>
      <p class="note">21+ only. By continuing you agree to the sweepstakes rules of each platform.</p>`);
  } else if (step === 2) {
    openModal(`${bar(2)}<h2>Check your email</h2><p>We sent a 6-digit code to <b>${esc(pending.email)}</b>. Any 6 digits work in this demo.</p>
      <form data-form="code">
        <div class="code-in">${Array.from({ length: 6 }, () => '<input inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]" aria-label="Digit" required>').join('')}</div>
        <button class="btn btn-accent btn-block" type="submit" style="margin-top:16px">Verify and create my login</button>
      </form>
      <p class="note">No email? <a href="#" data-act="resend">Send a new code</a> or <a href="#" data-act="signup">change the email</a></p>`);
  } else {
    const u = S.user;
    openModal(`${bar(3)}<div class="done-mark">${I.check}</div><h2>You're in, ${esc(u.first)}</h2>
      <p>Your accounts on all ${PLATFORMS.length} platforms are ready. Use this login for every game.</p>
      ${credRow('Username', u.username, 'username')}
      ${credRow('Password', u.password, 'password', true)}
      <div class="warn">We also emailed these to ${esc(u.email)}. You can change both any time from My account.</div>
      <button class="btn btn-accent btn-block" data-close style="margin-top:18px">Go to games</button>`);
  }
}

function credsModal() {
  openModal(`<h2>My login</h2><p>Use this on every platform.</p>
    ${credRow('Username', S.user.username, 'username')}
    ${credRow('Password', S.user.password, 'password', true)}
    <a class="btn btn-outline btn-block" href="#/account" style="margin-top:18px">Change username or password</a>`);
}

function makeCreds(first) {
  const base = first.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8) || 'player';
  const n = Math.floor(1000 + Math.random() * 9000);
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const chunk = () => Array.from({ length: 4 }, () => abc[Math.floor(Math.random() * abc.length)]).join('');
  return { username: `pp_${base}${n}`, password: `${chunk()}-${chunk()}-${n % 100}` };
}

function launch(id) {
  if (!S.user) { signupStep(1); return; }
  const g = game(id), p = plat(g.p);
  openModal(`<div class="launch-stage"><div class="launch-blur" style="background-image:url(${g.img})"></div>
      <div class="launch-mid"><img class="launch-art" src="${g.img}" alt=""><h3>${esc(g.name)}</h3><p id="lmsg">Signing in to ${p.name}&hellip;</p><div class="bar"><i id="lbar"></i></div></div></div>
    <div class="launch-foot">${coin(p, 'xs')}<span>${p.name}</span><span>as <code>${esc(S.user.username)}</code></span><span>${fmt(BALANCES[p.id][0])} SC</span>
      <button class="btn btn-ghost btn-sm" data-close>Back</button></div>`, true);
  let pct = 0;
  const msgs = [[30, `Signing in to ${p.name}…`], [65, 'Loading game…'], [100, 'Ready']];
  S.launchTimer = setInterval(() => {
    pct = Math.min(100, pct + 9);
    const bar = $('#lbar'), msg = $('#lmsg');
    if (!bar) return clearInterval(S.launchTimer);
    bar.style.width = pct + '%';
    msg.textContent = msgs.find(m => pct <= m[0])[1];
    if (pct >= 100) { clearInterval(S.launchTimer); msg.textContent = 'The game opens here once the platform connection is live.'; }
  }, 160);
}

function toast(t) {
  const el = $('#toast');
  el.textContent = t;
  el.classList.add('on');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove('on'), 2000);
}

function setMenu(open) {
  $('#drawer').innerHTML = open ? menuHtml() : $('#drawer').innerHTML;
  document.body.classList.toggle('menu-open', open);
}
function setChat(open) {
  if (open) $('#chat').innerHTML = chatHtml();
  document.body.classList.toggle('chat-open', open);
  if (open) { const b = $('#chatBody'); b.scrollTop = b.scrollHeight; }
}

/* ---------- events ---------- */

document.addEventListener('click', e => {
  const t = e.target.closest('[data-game],[data-act],[data-copy],[data-cat],[data-close],[data-close-menu],[data-bal],[data-tab],[data-chip],[data-menu],.drawer-nav a');
  if (!t) return;
  if (t.matches('.drawer-nav a') && !t.dataset.act) { setMenu(false); return; }
  if (t.dataset.menu !== undefined) { e.preventDefault(); setChat(false); return setMenu(!document.body.classList.contains('menu-open')); }
  if (t.dataset.closeMenu !== undefined) return setMenu(false);
  if (t.dataset.close !== undefined) return closeModal();
  if (t.dataset.game) { closeModal(); return launch(t.dataset.game); }
  if (t.dataset.cat) {
    S.cat = t.dataset.cat;
    const grid = $('#gameGrid');
    grid.innerHTML = gameGrid(GAMES.filter(g => g.p === grid.dataset.plat));
    document.querySelectorAll('[data-cat]').forEach(b => b.classList.toggle('on', b.dataset.cat === S.cat));
    return;
  }
  if (t.dataset.bal) { S.bal = t.dataset.bal; return render(true); }
  if (t.dataset.tab) { S.actTab = t.dataset.tab; return render(true); }
  if (t.dataset.chip) { S.actChip = t.dataset.chip; return render(true); }
  if (t.dataset.copy) {
    const v = S.user && S.user[t.dataset.copy];
    if (v && navigator.clipboard) navigator.clipboard.writeText(v).catch(() => {});
    return toast(t.dataset.copy === 'username' ? 'Username copied' : 'Password copied');
  }
  const a = t.dataset.act;
  if (t.tagName === 'A' && t.getAttribute('href') === '#') e.preventDefault();
  if (a === 'pw') {
    S.showPw = !S.showPw;
    document.querySelectorAll('.cred').forEach(c => { if (c.querySelector('[data-act="pw"]')) c.outerHTML = credRow('Password', S.user.password, 'password', true); });
  }
  if (a === 'signup') { setMenu(false); signupStep(1); }
  if (a === 'resend') toast(`New code sent to ${pending.email}`);
  if (a === 'login') {
    setMenu(false);
    openModal(`<h2>Log in</h2><p>Use your PlayPort username and password.</p>
      <form class="form-row" data-form="login">
        <input class="field" name="u" placeholder="Username" autocomplete="username" required>
        <input class="field" type="password" name="p" placeholder="Password" autocomplete="current-password" required>
        <button class="btn btn-accent btn-block" type="submit">Log in</button>
      </form>
      <p class="note">New here? <a href="#" data-act="signup">Create your login</a></p>`);
  }
  if (a === 'logout') { setMenu(false); S.user = null; store.set('pp_user', null); S.showPw = false; goHome(); toast('Signed out'); }
  if (a === 'creds') credsModal();
  if (a === 'gift') toast('Daily bonus: +1.00 SC added');
  if (a === 'bell') toast('No new notifications');
  if (a === 'cashier') toast(`${plat(t.dataset.plat).name} cashier opens here in the live version`);
  if (a === 'redeem') toast(`Redeem request for ${plat(t.dataset.plat).name} opens here in the live version`);
  if (a === 'chat') { setMenu(false); setChat(true); }
  if (a === 'chat-close') setChat(false);
});

document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]');
  if (!f) return;
  e.preventDefault();
  const d = Object.fromEntries(new FormData(f));
  const k = f.dataset.form;
  if (k === 'quick') { pending.email = d.email; signupStep(1); }
  if (k === 'email') { pending.first = d.first.trim(); pending.email = d.email.trim(); signupStep(2); }
  if (k === 'code') {
    S.user = { first: pending.first, email: pending.email, since: new Date().toISOString().slice(0, 10), ...makeCreds(pending.first) };
    store.set('pp_user', S.user);
    store.set('pp_account', S.user);
    S.showPw = true;
    location.hash = '#/games';
    render();
    signupStep(3);
  }
  if (k === 'login') {
    const acct = store.get('pp_account', null);
    const name = d.u.trim();
    const match = acct && (name.toLowerCase() === acct.username.toLowerCase() || name.toLowerCase() === acct.email.toLowerCase());
    const user = match ? acct : { first: name.split('@')[0], email: name.includes('@') ? name : `${name}@example.com`, username: name, password: d.p, since: new Date().toISOString().slice(0, 10) };
    S.user = user;
    store.set('pp_user', user);
    store.set('pp_account', user);
    closeModal(); goHome(); toast(`Welcome back, ${user.first}`);
  }
  if (k === 'pw') {
    const acct = store.get('pp_account', S.user);
    if (d.cur !== acct.password) { toast('Current password is wrong'); return; }
    S.user.password = d.next;
    store.set('pp_user', S.user);
    store.set('pp_account', S.user);
    f.reset(); render(true); toast(`Password updated on ${PLATFORMS.length} platforms`);
  }
  if (k === 'user') {
    const acct = store.get('pp_account', S.user);
    if (d.cur !== acct.password) { toast('Current password is wrong'); return; }
    const next = d.next.trim();
    if (next === S.user.username) { toast('That is already your username'); return; }
    S.user.username = next;
    store.set('pp_user', S.user);
    store.set('pp_account', S.user);
    render(true); toast(`Username changed to ${next}`);
  }
  if (k === 'voucher') { f.reset(); toast('That voucher code is not valid'); }
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
render();
