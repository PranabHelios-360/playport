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
  cur: store.get('pp_cur', 'sc'),
  cat: 'All',
  q: '',
  showPw: false,
  slide: 0,
  timer: null
};

/* ---------- art ---------- */

const logoMark = (p, cls = 'plat-logo') => p.logo
  ? `<span class="${cls}"><img src="${p.logo}" alt="" loading="lazy"></span>`
  : `<span class="${cls} mono" style="--c1:${p.c1};--c2:${p.c2}">${p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>`;

/* ---------- icons ---------- */

const I = {
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="8" width="13" height="13" rx="2.5"/><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-8A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
  back: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
};

/* ---------- pieces ---------- */

const fmt = (n, cur) => cur === 'sc' ? n.toFixed(2) : n.toLocaleString('en-US');
const total = cur => Object.values(BALANCES).reduce((s, b) => s + b[cur === 'sc' ? 0 : 1], 0);

function topRight() {
  if (!S.user) return `<button class="btn btn-line btn-sm" data-act="login">Log in</button><button class="btn btn-mint btn-sm" data-act="signup">Sign up</button>`;
  return `
    <div class="bal" role="group" aria-label="Balance">
      <button class="bal-seg ${S.cur === 'sc' ? 'on' : 'gc-only'}" data-cur="sc"><span class="coin sc">S</span>${fmt(total('sc'), 'sc')}</button>
      <button class="bal-seg ${S.cur === 'gc' ? 'on' : 'gc-only'}" data-cur="gc"><span class="coin gc">G</span>${fmt(total('gc'), 'gc')}</button>
      <button class="bal-add" data-act="buy" aria-label="Get coins">+</button>
    </div>
    <a class="avatar" href="#/account" aria-label="My account">${esc(S.user.first[0])}</a>`;
}

function tile(g, extra = {}) {
  const p = plat(g.p);
  return `<button class="tile" data-game="${g.id}">
    <div class="tile-art"><img src="${g.img}" alt="" loading="lazy">
      ${extra.pct != null ? `<div class="tile-prog"><i style="width:${extra.pct}%"></i></div>` : ''}
      <div class="tile-play"><span>${I.play}</span></div>
    </div>
    <div class="tile-name">${esc(g.name)}</div>
    <div class="tile-plat"><i style="background:${p.c2}"></i>${p.name}${extra.when ? `<em>${extra.when}</em>` : ''}</div>
  </button>`;
}

function platTile(p) {
  const linked = !!S.user;
  return `<a class="plat" href="#/platform/${p.id}" style="--c1:${p.c1};--c2:${p.c2}">
    ${logoMark(p)}
    <div class="plat-name">${p.name}</div>
    <div class="plat-meta"><span>${p.games} games</span>${linked ? `<span class="ok">${I.check}Linked</span>` : ''}</div>
  </a>`;
}

function credRow(label, value, key, secret) {
  const shown = !secret || S.showPw;
  return `<div class="cred"><label>${label}</label>
    <div class="cred-row"><code>${shown ? esc(value) : '&bull;'.repeat(12)}</code>
      ${secret ? `<button class="icon-btn" data-act="pw" aria-label="${S.showPw ? 'Hide' : 'Show'} password">${S.showPw ? I.eyeOff : I.eye}</button>` : ''}
      <button class="icon-btn" data-copy="${key}" aria-label="Copy ${label.toLowerCase()}">${I.copy}</button>
    </div></div>`;
}

function passCard() {
  if (!S.user) {
    return `<aside class="pass pass-guest">
      <div class="pass-top">
        <div class="pass-label">PLAYPORT PASS</div>
        <h3>One login for all ${PLATFORMS.length} platforms</h3>
        <p>Sign up with your email. We create your accounts and give you a single username and password that opens every game here.</p>
        <form class="form-row" data-form="quick">
          <input class="field" type="email" name="email" placeholder="Email address" required autocomplete="email">
          <button class="btn btn-mint btn-block" type="submit">Create my pass</button>
        </form>
      </div>
      <div class="perf"></div>
      <div class="pass-bot">
        <ul class="steps">
          <li>${I.check}<span><b>Enter your email</b> and confirm the 6-digit code</span></li>
          <li>${I.check}<span><b>Get your username and password</b> on screen</span></li>
          <li>${I.check}<span><b>Play any platform</b> without signing up again</span></li>
        </ul>
      </div>
    </aside>`;
  }
  return `<aside class="pass">
    <div class="pass-top">
      <div class="pass-label">PLAYPORT PASS <span class="live">Active</span></div>
      ${credRow('Username', S.user.username, 'username')}
      ${credRow('Password', S.user.password, 'password', true)}
      ${route().name === 'account' ? '' : '<a class="pass-edit" href="#/account">Change username or password</a>'}
    </div>
    <div class="perf"></div>
    <div class="pass-bot">
      <h3>Works on <b>${PLATFORMS.length} of ${PLATFORMS.length} platforms</b></h3>
      <div class="chips">${PLATFORMS.map(p => `<span class="chip"><i style="background:${p.c2}"></i>${p.name}</span>`).join('')}</div>
    </div>
  </aside>`;
}

function hero() {
  const cta = S.user ? 'Play now' : 'Sign up to play';
  return `<section class="hero" aria-roledescription="carousel">
    ${HERO.map((h, i) => {
      const g = game(h.game), p = plat(g.p);
      return `<div class="slide ${i === S.slide ? 'on' : ''}" aria-hidden="${i !== S.slide}">
        <div class="slide-blur" style="background-image:url(${g.img})"></div>
        <button class="slide-card" data-game="${g.id}" tabindex="-1"><img src="${g.img}" alt="${esc(g.name)}"></button>
        <div class="slide-body">
          <span class="slide-plat">${logoMark(p, 'mini-logo')}${p.name}</span>
          <h2>${h.title}</h2>
          <p>${h.text}</p>
          <button class="btn btn-mint" data-game="${g.id}">${cta} ${I.arrow}</button>
        </div>
      </div>`;
    }).join('')}
    <div class="hero-dots">${HERO.map((_, i) => `<button class="${i === S.slide ? 'on' : ''}" data-slide="${i}" aria-label="Slide ${i + 1}"></button>`).join('')}</div>
  </section>`;
}

function gameBrowser(list, title, limit) {
  const cats = ['All', 'Fish', 'Slots', 'Keno'];
  const q = S.q.trim().toLowerCase();
  const shown = list.filter(g => (S.cat === 'All' || g.cat === S.cat) && (!q || g.name.toLowerCase().includes(q) || plat(g.p).name.toLowerCase().includes(q)));
  return `<section class="sec" id="browser">
    <div class="sec-h"><h2>${title}</h2></div>
    <div class="cats" style="margin-bottom:18px">
      ${cats.map(c => `<button class="cat ${S.cat === c ? 'on' : ''}" data-cat="${c}">${c}</button>`).join('')}
      <label class="search">${I.search}<input type="search" placeholder="Search games or platforms" value="${esc(S.q)}" data-search aria-label="Search games"></label>
    </div>
    <div class="grid" id="gameGrid">${shown.length ? shown.slice(0, limit || shown.length).map(g => tile(g)).join('') : `<p class="empty">No games match that search.</p>`}</div>${limit && shown.length > limit ? `<div class="show-all"><a class="btn btn-line" href="#/games">Show all ${shown.length} games</a></div>` : ''}
  </section>`;
}

/* ---------- views ---------- */

function viewLanding() {
  const total = GAMES.length;
  const wall = ['milkyway--shooting-star', 'firekirin--jade-fortune', 'milkyway--ocean-king'];
  const preview = ['milkyway--king-of-leopard', 'firekirin--lucky-weekends', 'milkyway--life-of-luxury', 'firekirin--space-jet', 'milkyway--hexno-keno', 'firekirin--neon-777', 'milkyway--clover-fortune', 'firekirin--yun-cai-fa'];
  return `<div class="landing">
    <section class="land-hero wrap">
      <div class="land-copy">
        <span class="land-tag">Free to join &middot; 21+</span>
        <h1>Play Milky Way, Fire Kirin and more with <em>one login</em></h1>
        <p>Sign up with your email, confirm the code we send you, and get a username and password that works on all ${PLATFORMS.length} platforms here.</p>
        <form class="land-form" data-form="quick">
          <input class="field" type="email" name="email" placeholder="Your email address" required autocomplete="email">
          <button class="btn btn-mint" type="submit">Get my login ${I.arrow}</button>
        </form>
        <p class="land-small">Already signed up? <a href="#" data-act="login">Log in</a></p>
      </div>
      <div class="land-stack">
        ${wall.map((id, i) => `<button class="land-card c${i}" data-game="${id}" tabindex="-1"><img src="${game(id).img}" alt="${esc(game(id).name)}"></button>`).join('')}
      </div>
    </section>

    <section class="land-stats wrap">
      <div><b>${PLATFORMS.length}</b><span>platforms</span></div>
      <div><b>${total}</b><span>games</span></div>
      <div><b>1</b><span>username + password</span></div>
    </section>

    <section class="sec wrap">
      <div class="sec-h"><div><h2>How it works</h2><p class="sub">Your login is only created after your email is verified.</p></div></div>
      <div class="how">
        <div class="how-steps">
          <div class="how-step"><span class="how-ico">@</span><div><b>Enter your email</b><p>Plus your first name. That's all we ask for.</p></div></div>
          <div class="how-step"><span class="how-ico">#</span><div><b>Verify with the code</b><p>We email you a 6-digit code. Type it in to confirm the address is yours.</p></div></div>
          <div class="how-step"><span class="how-ico">${I.check}</span><div><b>Get your username and password</b><p>They show on screen right away and work on every platform below.</p></div></div>
        </div>
        <div class="pass pass-locked">
          <div class="pass-top">
            <div class="pass-label">PLAYPORT PASS <span class="lock">Locked</span></div>
            <div class="cred"><label>Username</label><div class="cred-row"><code class="blur">pp_yourname0000</code></div></div>
            <div class="cred"><label>Password</label><div class="cred-row"><code class="blur">&bull;&bull;&bull;&bull;-&bull;&bull;&bull;&bull;-&bull;&bull;</code></div></div>
          </div>
          <div class="perf"></div>
          <div class="pass-bot"><p class="lock-note">Unlocks after you verify your email</p>
            <button class="btn btn-mint btn-block" data-act="signup">Start sign up</button></div>
        </div>
      </div>
    </section>

    <section class="sec wrap">
      <div class="sec-h"><h2>Platforms you get</h2><a class="more" href="#/platforms">See all ${I.arrow}</a></div>
      <div class="plats">${PLATFORMS.map(platTile).join('')}</div>
    </section>

    <section class="sec wrap">
      <div class="sec-h"><h2>Some of the games</h2><a class="more" href="#/games">All ${total} games ${I.arrow}</a></div>
      <div class="grid">${preview.map(id => tile(game(id))).join('')}</div>
    </section>

    <section class="sec wrap">
      <div class="sec-h"><h2>Questions</h2></div>
      <div class="faq">
        <details><summary>Do I need a separate account for each platform?</summary><p>No. We create them for you when you sign up. You only ever use your PlayPort username and password.</p></details>
        <details><summary>When do I get my password?</summary><p>Straight after you enter the 6-digit code from your email. We also send a copy to that email.</p></details>
        <details><summary>Can I change my password later?</summary><p>Yes, from My account. The change applies to every platform at once.</p></details>
        <details><summary>Is it free?</summary><p>Signing up is free. No purchase is necessary to play.</p></details>
      </div>
    </section>

    <section class="land-cta wrap">
      <div><h2>Ready to play?</h2><p>Takes about a minute.</p></div>
      <button class="btn btn-mint" data-act="signup">Create my login</button>
    </section>
  </div>`;
}

function viewLobby() {
  const name = S.user ? `Welcome back, ${esc(S.user.first)}` : 'Every platform, one login';
  const sub = S.user
    ? `Your pass is linked to <b>${PLATFORMS.length} platforms</b> and <b>${PLATFORMS.reduce((s, p) => s + p.games, 0)} games</b>.`
    : `Fire Kirin, Milky Way, Orion Stars and more, all in one lobby.`;
  return `<div class="wrap">
    <div class="hello"><h1>${name}</h1><p>${sub}</p></div>
    <div class="lead">${hero()}${passCard()}</div>

    <section class="sec">
      <div class="sec-h"><h2>Platforms</h2><a class="more" href="#/platforms">See all ${I.arrow}</a></div>
      <div class="plats">${PLATFORMS.map(platTile).join('')}</div>
    </section>

    ${S.user ? `<section class="sec">
      <div class="sec-h"><h2>Continue playing</h2></div>
      <div class="row-scroll">${RECENT.map(r => tile(game(r.id), { pct: r.pct, when: r.when })).join('')}</div>
    </section>` : ''}

    ${gameBrowser(GAMES, 'All games', 16)}
  </div>`;
}

function viewGames() {
  return `<div class="wrap">
    <div class="hello"><h1>Games</h1><p><b>${GAMES.length}</b> games across ${PLATFORMS.length} platforms</p></div>
    ${gameBrowser(GAMES, 'Browse')}
  </div>`;
}

function viewPlatforms() {
  return `<div class="wrap">
    <div class="hello"><h1>Platforms</h1><p>${S.user ? 'Your PlayPort username and password work on every one.' : 'Sign up once to unlock all of them.'}</p></div>
    <div class="plat-list" style="margin-top:22px">
      ${PLATFORMS.map(p => {
        const b = BALANCES[p.id];
        return `<article class="plat-card">
          ${platTile(p)}
          <div class="plat-card-body">
            <p>${p.blurb}</p>
            <div class="kv"><div>Games<b>${p.games}</b></div>${S.user ? `<div>SC<b>${fmt(b[0], 'sc')}</b></div><div>GC<b>${fmt(b[1], 'gc')}</b></div>` : ''}</div>
            <div class="acts">
              <a class="btn btn-mint btn-sm" href="#/platform/${p.id}">Open lobby</a>
              ${S.user ? `<button class="btn btn-line btn-sm" data-act="buy" data-plat="${p.id}">Add coins</button>` : ''}
            </div>
          </div>
        </article>`;
      }).join('')}
    </div>
  </div>`;
}

function viewPlatform(id) {
  const p = plat(id);
  if (!p) return viewPlatforms();
  const b = BALANCES[p.id];
  return `<div class="wrap">
    <a class="crumb" href="#/platforms">${I.back} All platforms</a>
    <header class="plat-head" style="--c1:${p.c1};--c2:${p.c2}">
      ${logoMark(p, 'plat-logo big')}
      <div><h1>${p.name}</h1>
      <p>${p.blurb}${S.user ? ` Signed in as <b style="font-family:var(--mono)">${esc(S.user.username)}</b> &middot; ${fmt(b[0], 'sc')} SC` : ''}</p></div>
    </header>
    ${gameBrowser(GAMES.filter(g => g.p === p.id), `${p.name} games`)}
  </div>`;
}

function viewAccount() {
  if (!S.user) {
    return `<div class="wrap"><div class="hello"><h1>My account</h1></div>
      <div class="lead" style="grid-template-columns:minmax(0,420px)">${passCard()}</div></div>`;
  }
  const u = S.user;
  return `<div class="wrap">
    <div class="hello"><h1>My account</h1><p>${esc(u.email)} &middot; member since ${new Date(u.since).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p></div>
    <div class="acct">
      <div class="stack">
        ${passCard()}
        <div class="panel">
          <h2>Change username</h2>
          <p>Pick your own. It changes on all ${PLATFORMS.length} platforms.</p>
          <form class="form-row" data-form="user">
            <input class="field" name="next" placeholder="New username" value="${esc(S.user.username)}" pattern="[A-Za-z0-9_]{4,20}" title="4 to 20 letters, numbers or _" autocomplete="username" required>
            <input class="field" type="password" name="cur" placeholder="Current password" autocomplete="current-password" required>
            <button class="btn btn-mint btn-block" type="submit">Save username</button>
          </form>
          <p class="note">4 to 20 letters, numbers or underscores.</p>
        </div>
        <div class="panel">
          <h2>Change password</h2>
          <p>The new password is pushed to all ${PLATFORMS.length} platforms at once.</p>
          <form class="form-row" data-form="pw">
            <input class="field" type="password" name="cur" placeholder="Current password" autocomplete="current-password" required>
            <input class="field" type="password" name="next" placeholder="New password (8+ characters)" minlength="8" autocomplete="new-password" required>
            <button class="btn btn-mint btn-block" type="submit">Update everywhere</button>
          </form>
        </div>
      </div>
      <div class="stack">
        <div class="panel">
          <h2>Linked platforms</h2>
          <p>Each platform keeps its own balance. Coins don't move between platforms.</p>
          <table class="tbl">
            <thead><tr><th>Platform</th><th>Status</th><th class="num">SC</th><th class="num">GC</th></tr></thead>
            <tbody>${PLATFORMS.map(p => `<tr><td><span class="pname"><i style="background:${p.c2}"></i>${p.name}</span></td><td><span class="status">Linked</span></td><td class="num">${fmt(BALANCES[p.id][0], 'sc')}</td><td class="num">${fmt(BALANCES[p.id][1], 'gc')}</td></tr>`).join('')}</tbody>
          </table>
        </div>
        <div class="panel">
          <h2>Recent activity</h2>
          <table class="tbl">
            <thead><tr><th>Game</th><th>Platform</th><th class="num">When</th></tr></thead>
            <tbody>${RECENT.map(r => { const g = game(r.id); return `<tr><td>${g.name}</td><td><span class="pname"><i style="background:${plat(g.p).c2}"></i>${plat(g.p).name}</span></td><td class="num">${r.when}</td></tr>`; }).join('')}</tbody>
          </table>
        </div>
        <button class="btn btn-line" data-act="logout" style="justify-self:start">Sign out</button>
      </div>
    </div>
  </div>`;
}

/* ---------- router ---------- */

function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const [r, arg] = h.split('/');
  const name = { '': 'lobby', platforms: 'platforms', platform: 'platforms', games: 'games', account: 'account' }[r] || 'lobby';
  return { name, r, arg };
}

function render(keepScroll) {
  const { name, r, arg } = route();
  const views = { lobby: () => S.user ? viewLobby() : viewLanding(), platforms: r === 'platform' ? () => viewPlatform(arg) : viewPlatforms, games: viewGames, account: viewAccount };
  $('#app').innerHTML = views[name]();
  $('#topRight').innerHTML = topRight();
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === name));
  if (!keepScroll) window.scrollTo(0, 0);
  startHero();
}

function refreshGrid() {
  const host = $('#browser');
  if (!host) return;
  const { name, r, arg } = route();
  const list = r === 'platform' ? GAMES.filter(g => g.p === arg) : GAMES;
  const title = host.querySelector('h2').textContent;
  const tmp = document.createElement('div');
  tmp.innerHTML = gameBrowser(list, title, name === 'lobby' ? 16 : 0);
  host.querySelector('#gameGrid').replaceWith(tmp.querySelector('#gameGrid'));
  host.querySelector('.show-all')?.remove();
  const more = tmp.querySelector('.show-all');
  if (more) host.appendChild(more);
  host.querySelectorAll('[data-cat]').forEach(b => b.classList.toggle('on', b.dataset.cat === S.cat));
}

function startHero() {
  clearInterval(S.timer);
  if (!$('.hero')) return;
  S.timer = setInterval(() => setSlide((S.slide + 1) % HERO.length), 6500);
}
function setSlide(i) {
  S.slide = i;
  document.querySelectorAll('.slide').forEach((s, k) => { s.classList.toggle('on', k === i); s.setAttribute('aria-hidden', k !== i); });
  document.querySelectorAll('.hero-dots button').forEach((d, k) => d.classList.toggle('on', k === i));
}

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
    openModal(`${bar(1)}<h2>Create your pass</h2><p>One email. We set up your account on all ${PLATFORMS.length} platforms.</p>
      <form class="form-row" data-form="email">
        <input class="field" name="first" placeholder="First name" autocomplete="given-name" required value="${esc(pending.first || '')}">
        <input class="field" type="email" name="email" placeholder="Email address" autocomplete="email" required value="${esc(pending.email || '')}">
        <button class="btn btn-mint btn-block" type="submit">Send code</button>
      </form>
      <p class="note">21+ only. By continuing you agree to the sweepstakes rules of each platform.</p>`);
  } else if (step === 2) {
    openModal(`${bar(2)}<h2>Check your email</h2><p>We sent a 6-digit code to <b>${esc(pending.email)}</b>. Any 6 digits work in this demo.</p>
      <form data-form="code">
        <div class="code-in">${Array.from({ length: 6 }, () => '<input inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]" aria-label="Digit" required>').join('')}</div>
        <button class="btn btn-mint btn-block" type="submit" style="margin-top:16px">Verify and create accounts</button>
      </form>
      <p class="note">No email? <a href="#" data-act="resend" style="color:var(--mint);font-weight:700">Send a new code</a> or <a href="#" data-act="signup" style="color:var(--mint);font-weight:700">change the email</a></p>`);
  } else {
    const u = S.user;
    openModal(`${bar(3)}<div class="done-mark">${I.check}</div><h2>You're in, ${esc(u.first)}</h2>
      <p>Your accounts on all ${PLATFORMS.length} platforms are ready. Use this login for every game.</p>
      ${credRow('Username', u.username, 'username')}
      ${credRow('Password', u.password, 'password', true)}
      <div class="warn">We also emailed these to ${esc(u.email)}. You can change the password any time from My account.</div>
      <button class="btn btn-mint btn-block" data-close style="margin-top:18px">Go to lobby</button>`);
  }
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
  openModal(`<div class="launch-stage"><div class="slide-blur" style="background-image:url(${g.img})"></div><div class="veil"></div>
      <div class="launch-mid"><img class="launch-art" src="${g.img}" alt=""><h3>${esc(g.name)}</h3><p id="lmsg">Signing in to ${p.name}&hellip;</p><div class="bar"><i id="lbar"></i></div></div></div>
    <div class="launch-foot"><span class="pname"><i style="background:${p.c2}"></i>${p.name}</span><span>as <code>${esc(S.user.username)}</code></span><span>${fmt(BALANCES[p.id][0], 'sc')} SC</span>
      <button class="btn btn-line btn-sm" data-close>Back to lobby</button></div>`, true);
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
  toast.t = setTimeout(() => el.classList.remove('on'), 1800);
}

/* ---------- events ---------- */

document.addEventListener('click', e => {
  const t = e.target.closest('[data-game],[data-act],[data-copy],[data-cur],[data-cat],[data-slide],[data-close]');
  if (!t) return;
  if (t.dataset.close !== undefined) return closeModal();
  if (t.dataset.game) { closeModal(); return launch(t.dataset.game); }
  if (t.dataset.slide) { setSlide(+t.dataset.slide); return startHero(); }
  if (t.dataset.cat) { S.cat = t.dataset.cat; return refreshGrid(); }
  if (t.dataset.cur) {
    if (window.matchMedia('(max-width: 900px)').matches || S.cur !== t.dataset.cur) {
      S.cur = S.cur === 'sc' ? 'gc' : 'sc';
      store.set('pp_cur', S.cur);
      $('#topRight').innerHTML = topRight();
    }
    return;
  }
  if (t.dataset.copy) {
    const v = S.user && S.user[t.dataset.copy];
    if (v && navigator.clipboard) navigator.clipboard.writeText(v).catch(() => {});
    return toast(t.dataset.copy === 'username' ? 'Username copied' : 'Password copied');
  }
  const a = t.dataset.act;
  if (a === 'pw') {
    S.showPw = !S.showPw;
    document.querySelectorAll('.cred').forEach(c => {
      const isPw = c.querySelector('[data-act="pw"]');
      if (isPw) c.outerHTML = credRow('Password', S.user.password, 'password', true);
    });
  }
  if (a === 'signup') { e.preventDefault(); signupStep(1); }
  if (a === 'resend') { e.preventDefault(); toast(`New code sent to ${pending.email}`); }
  if (a === 'login') e.preventDefault();
  if (a === 'login') openModal(`<h2>Log in</h2><p>Use your PlayPort username and password.</p>
    <form class="form-row" data-form="login">
      <input class="field" name="u" placeholder="Username" autocomplete="username" required>
      <input class="field" type="password" name="p" placeholder="Password" autocomplete="current-password" required>
      <button class="btn btn-mint btn-block" type="submit">Log in</button>
    </form>
    <p class="note err" id="loginErr" hidden></p>
    <p class="note">New here? <a href="#" data-act="signup" style="color:var(--mint);font-weight:700">Create your pass</a></p>`);
  if (a === 'logout') { S.user = null; store.set('pp_user', null); S.showPw = false; goHome(); toast('Signed out'); }
  if (a === 'buy') toast('Coin store opens the platform cashier');
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
});

function goHome() {
  if (location.hash.length > 2) location.hash = '#/';
  else render();
}

document.addEventListener('input', e => {
  if (e.target.matches('[data-search]')) { S.q = e.target.value; refreshGrid(); }
  if (e.target.closest('.code-in')) {
    const boxes = [...e.target.parentNode.children];
    let i = boxes.indexOf(e.target);
    const digits = e.target.value.replace(/\D/g, '').split('');
    e.target.value = '';
    digits.forEach(d => { if (boxes[i]) boxes[i++].value = d; });
    const next = boxes[Math.min(i, boxes.length - 1)];
    if (digits.length) next.focus();
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('#modal').hidden) closeModal();
  if (e.key === 'Backspace' && e.target.closest('.code-in') && !e.target.value && e.target.previousElementSibling) e.target.previousElementSibling.focus();
});

window.addEventListener('hashchange', () => { S.cat = 'All'; S.q = ''; closeModal(); render(); });
render();
