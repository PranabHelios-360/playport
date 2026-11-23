const directoryPreviews = [
  {id:'river-sweeps',name:'River Sweeps',preview:true},
  {id:'thunder-7',name:'Thunder 7',preview:true}
];
const directoryFilters = [
  ['all','All platforms','▦'], ['popular','Popular','☆'], ['new','New','✧'], ['favorites','My favorites','♡']
];

function directoryFavoritesKey() {
  return S.user ? 'r777_fav_player_' + String(S.user.email || S.user.username).toLowerCase() : 'r777_fav_guest';
}

function directoryCards(filter, query) {
  const favorites = store.get(directoryFavoritesKey(), []);
  const catalog = [...PLATFORMS,...directoryPreviews];
  let entries = catalog;
  if (filter === 'favorites') entries = entries.filter(p => favorites.includes(p.id));
  if (filter === 'new') entries = directoryPreviews;
  if (filter === 'popular') {
    const totals=new Map(sampleRedemptions.map(row=>[row.id,row.totals[highlightPeriods[0]]]));
    entries=PLATFORMS.slice().sort((a,b)=>(totals.get(b.id)||0)-(totals.get(a.id)||0)).slice(0,3);
  }
  const term = query.trim().toLowerCase();
  entries = entries.filter(p => p.name.toLowerCase().includes(term));
  if (!entries.length) {
    const message = filter === 'favorites' && !favorites.length ? 'Tap a heart to save your favorite platforms.' : 'No matching platforms.';
    return `<p class="charged-empty" role="status">${message}</p>`;
  }
  const note = filter === 'popular' ? '<p class="charged-note">Ranked by sample redemption totals.</p>' : '';
  return note + entries.map(p => {
    const saved = favorites.includes(p.id);
    const tags = p.preview ? ['Platform preview'] : [...new Set(GAMES.filter(g=>g.p===p.id).map(g=>g.cat))];
    const tag = p.preview ? 'button' : 'div';
    const action = p.preview ? `type="button" data-directory-preview="${p.id}"` : '';
    const mine = !p.preview && typeof acct === 'function' && acct(p.id);
    return `<article class="charged-card" data-platform="${p.id}">
      <img class="charged-scene" src="assets/platform-scenes/${p.id}.${p.preview ? 'webp' : 'jpg'}" alt="" loading="lazy">
      <i class="flow-spark" aria-hidden="true"></i><${tag} class="charged-open" ${action}>
        <i class="charged-badge" aria-hidden="true" style="--badge:${catalog.indexOf(p)}"></i>
        <strong>${p.name}</strong><small>${tags.map(t=>`<span>${t}</span>`).join('')}</small>
        ${p.preview ? '<span class="charged-view">Preview <i aria-hidden="true">→</i></span>' : ''}
      </${tag}>
      ${p.preview ? '' : mine
        ? `<div class="charged-acts"><button type="button" data-act="gcreds" data-plat="${p.id}">My login</button><button type="button" class="gold" data-act="play" data-plat="${p.id}">Play</button></div>`
        : `<div class="charged-acts"><button type="button" data-act="unlock-link" data-plat="${p.id}">I have an account</button><button type="button" class="gold" data-act="unlock-go" data-plat="${p.id}">Auto-create</button></div>`}
      <button type="button" class="charged-heart" data-platform-favorite="${p.id}" aria-label="${p.name} — ${document.documentElement.lang==='es'?'favorito':'favorite'}" aria-pressed="${saved}"><span aria-hidden="true">${saved?'♥':'♡'}</span></button>
    </article>`;
  }).join('');
}

function platformDirectory(mainHeading = false) {
  const heading = mainHeading ? 'h1' : 'h2';
  return `<section class="charged-directory" aria-labelledby="charged-heading">
    <header class="charged-intro"><div><p>Featured platforms</p><${heading} id="charged-heading"><span>Your games.</span><em>Fully charged.</em></${heading}><small>Explore your favorite platforms.</small></div></header>
    <div class="charged-tools"><label class="charged-search">${I.search}<input type="search" placeholder="Search platforms" aria-label="Search platforms" autocomplete="off"></label>
    <div class="charged-filters" role="group" aria-label="Filter platforms">${directoryFilters.map(([id,label,icon])=>`<button type="button" data-platform-filter="${id}" aria-pressed="${id==='all'}"><i aria-hidden="true">${icon}</i><span>${label}</span></button>`).join('')}</div></div>
    <div class="charged-grid">${directoryCards('all','')}</div></section>`;
}

function updateDirectory(section) {
  const filter = section.querySelector('[data-platform-filter][aria-pressed=true]').dataset.platformFilter;
  const grid = section.querySelector('.charged-grid');
  RechargeMotion.updatePositions(grid,()=>{grid.innerHTML=directoryCards(filter,section.querySelector('input').value);});
  RechargeMotion.mount();
}
document.addEventListener('input',event => {
  if (event.target.matches('.charged-search input')) updateDirectory(event.target.closest('.charged-directory'));
});
document.addEventListener('click',event => {
  const button = event.target.closest('[data-platform-filter],[data-platform-favorite],[data-directory-preview]');
  if (!button) return;
  const section = button.closest('.charged-directory');
  if (button.hasAttribute('data-directory-preview')) {
    const platform = directoryPreviews.find(p => p.id === button.dataset.directoryPreview);
    openModal(`<header class="game-access"><img class="preview-cover" src="assets/platform-scenes/${platform.id}.webp" alt=""><h2>${platform.name}</h2></header><p>Artwork preview. This platform is not connected to Skillandslots.</p><a class="btn btn-accent" href="#/browse/all" data-close-after>View all games</a>`);
    return;
  }
  if (button.hasAttribute('data-platform-filter')) {
    if (button.getAttribute('aria-pressed')==='true') return;
    section.querySelectorAll('[data-platform-filter]').forEach(el => el.setAttribute('aria-pressed',el === button));
    updateDirectory(section);
    return;
  }
  const key = directoryFavoritesKey();
  const favorites = new Set(store.get(key,[]));
  const id = button.dataset.platformFavorite;
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  store.set(key,[...favorites]);
  const favoritesFilter = section.querySelector('[data-platform-filter=favorites]');
  if (favoritesFilter.getAttribute('aria-pressed')==='true') {
    updateDirectory(section);
    (section.querySelector('[data-platform-favorite]') || favoritesFilter).focus({preventScroll:true});
  } else {
    button.setAttribute('aria-pressed',String(favorites.has(id)));
    button.firstElementChild.textContent=favorites.has(id)?'♥':'♡';
  }
});
