const shopTiers = [5, 10, 20, 30, 50, 80, 100, 200, 500];
const shopMethods = [
  { id:'cash', name:'Cash App', mark:'$' },
  { id:'chime', name:'Chime', mark:'chime' },
  { id:'cards', name:'Visa / Mastercard', mark:'VISA' },
  { id:'apple', name:'Apple Pay', mark:'Pay' },
  { id:'google', name:'Google Pay', mark:'G Pay' }
];

function paymentPicker() {
  return `<fieldset class="payment-picker"><legend>Payment method preview</legend>
    <div class="payment-grid">${shopMethods.map(({id, name, mark}, index) => `
      <label class="payment-option">
        <input type="radio" name="shop-method" value="${id}" ${index === 0 ? 'checked' : ''}>
        <span class="payment-tile">
          <span aria-hidden="true" class="payment-mark mark-${id}">${mark}</span>
          <span>${name}</span>
        </span>
      </label>`).join('')}</div>
  </fieldset>`;
}
const shopSections = {packages:'Packages', records:'Records', faq:'FAQ'};

function shopCoinStack(tier) {
  const count = 1 + Math.floor(shopTiers.indexOf(tier) / 2);
  return `<span class="shop-stack" aria-hidden="true">${Array.from({length:count}, (_, i) =>
    `<i style="--layer:${i}">${i === count - 1 ? 'GC' : ''}</i>`).join('')}</span>`;
}

function packageDetails(price, first) {
  const extra = first ? price / 5 : 0;
  return {gc:(price * 100).toLocaleString('en-US'),base:price,extra,total:price + extra};
}

function packageCard(price, first) {
  const pack = packageDetails(price, first);
  const largest = price === shopTiers.at(-1);
  const art = largest ? 'chest' : price >= 50 ? 'stack-large' : price >= 20 ? 'stack-medium' : 'stack-small';
  return `<button type="button" class="shop-pack${largest ? ' shop-featured' : ''}" data-package="${price}">
    <img class="shop-pack-art" src="assets/shop/${art}.webp" alt="">
    ${largest ? '<span class="shop-ribbon">Largest package</span>' : ''}
    ${first ? '<span class="shop-promo">+20% SC</span>' : ''}
    <strong class="shop-quantity"><i>GC</i> ${pack.gc}</strong>
    <span class="shop-bonus"><i>SC</i><b>+${pack.total}</b> ${first ? `<small>(${pack.base} + ${pack.extra})</small>` : '<small>bonus</small>'}</span>
    <span class="shop-price">${usd(price)}</span>
  </button>`;
}

function shopPackages(first) {
  return `<nav class="shop-offers" aria-label="Package type">
    <a href="#/store" aria-current="${first ? 'false' : 'page'}">${I.coins}<span>Coin packages</span></a>
    <a href="#/store/first" aria-current="${first ? 'page' : 'false'}">${I.gift}<span>First deposit</span></a></nav>
    <p class="shop-note">${first ? 'First-deposit preview includes 20% extra SC on top of the base bonus.' : 'Each Gold Coin package includes bonus Sweeps Coins.'}</p>
    <div class="shop-grid${first ? ' shop-first' : ''}">${shopTiers.map(price => packageCard(price,first)).join('')}</div>`;
}

function shopRecords(transactions) {
  const deposits = transactions.filter(tx => tx.kind === 'Deposits');
  return `<h2>Deposit records</h2>${deposits.length ? deposits.map(tx =>
    `<article class="shop-record"><div><b>Deposit</b><small>${esc(tx.when)}</small></div>
      <div><b>${usd(tx.amt)}</b><small>${esc(tx.status)}</small></div></article>`).join('') :
    '<p class="shop-note">No deposit records to show.</p>'}`;
}

function shopFaq() {
  const entries = [
    ['What comes in a package?', 'GC stands for Gold Coins. SC stands for Sweeps Coins. Each card lists the GC amount and bonus SC separately.'],
    ['How is the extra bonus calculated?', 'The first-deposit preview adds 20% of the base SC bonus. A package with 5 bonus SC shows 1 extra SC.'],
    ['Can I buy a package here?', 'You can review prices and compare payment options. Live checkout is unavailable in this preview.'],
    ['Where can I see deposits?', 'Open Records to see deposits for your signed-in account. Previewing a package creates no transaction.']
  ];
  return `<h2>Shop FAQ</h2>${entries.map(([q,a]) => `<details class="shop-question"><summary>${q}</summary><p>${a}</p></details>`).join('')}`;
}

function renderCoinShop(routeSection, transactions) {
  const section = ['records','faq'].includes(routeSection) ? routeSection : 'packages';
  const icons = {packages:I.coins,records:I.receipt,faq:I.help};
  return `<div class="page coin-shop">
    <header class="shop-title"><div><h1>Coin shop</h1><p>Preview packages and bonuses. Live checkout is unavailable.</p></div></header>
    <nav class="shop-tabs" aria-label="Shop navigation">${Object.entries(shopSections).map(([key,label]) =>
      `<a href="#/store${key === 'packages' ? '' : '/' + key}" aria-current="${section === key ? 'page' : 'false'}">${icons[key]}<span>${label}</span></a>`).join('')}</nav>
    ${section === 'records' ? shopRecords(transactions) : section === 'faq' ? shopFaq() : shopPackages(routeSection === 'first')}
    <nav class="shop-footer"><a href="#/balance">Open wallet</a><a href="#/rewards">Explore rewards</a></nav></div>`;
}

document.addEventListener('click', event => {
  const button = event.target.closest('.shop-pack');
  if (!button) return;
  const amount = Number(button.dataset.package);
  if (!shopTiers.includes(amount)) return;
  const pack = packageDetails(amount, route().arg === 'first');
  openModal(`<section class="shop-review"><h2>Package preview</h2>
    <div class="shop-receipt">${shopCoinStack(amount)}<strong>${pack.gc} GC</strong><b>${usd(amount)}</b></div>
    <p><span>Bonus SC</span><b>+${pack.base}</b></p>
    ${pack.extra ? `<p><span>First-deposit extra</span><b>+${pack.extra} SC</b></p><p><span>Total bonus SC</span><b>+${pack.total}</b></p>` : ''}
    ${paymentPicker()}
    <label><span>Coupon code</span><input disabled placeholder="Available at launch"></label>
    <small>Payment methods and coupon redemption are for preview only.</small>
    <button class="btn btn-accent" data-close>Back to shop</button></section>`);
  document.querySelector('.payment-option input:checked').focus({preventScroll:true});
});
