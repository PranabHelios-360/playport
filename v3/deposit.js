let depositDraft = null;

function depositPage() {
  depositDraft ??= { amount: '25.00', method: 'btcln', step: 0, expanded: false, paid: false };
  const d = depositDraft;
  const preferred = ['btcln', 'btc', 'ltc', 'eth'];
  const method = CRYPTO.find(c => c.id === d.method);
  const money = d.amount === '' ? '—' : usd(Number(d.amount));
  const card = c => `<label class="dep-method">
    <input type="radio" name="dep-method" value="${c.id}" ${c.id === d.method ? 'checked' : ''}>
    ${cryptoIco(c)}<span><b>${esc(c.name)}</b><small>${c.bolt ? 'Lightning network' : esc(c.code)}</small></span></label>`;
  const summary = `<section class="dep-summary"><h2>Deposit details</h2><dl>
    <div><dt>Amount</dt><dd><span data-dep-total>${money}</span> USD</dd></div>
    <div><dt>Method</dt><dd data-dep-name>${esc(method.name)}</dd></div>
    <div><dt>Fees</dt><dd>${d.step === 0 ? 'Shown at review' : '$0.00'}</dd></div></dl></section>`;
  const details = `<form data-deposit-form>
    <section class="dep-amount"><h2><label for="dep-amount">Deposit amount</label></h2>
      <div class="dep-entry"><span>$</span><input id="dep-amount" name="amount" type="number" inputmode="decimal" min="${MIN_DEPOSIT}" step="0.01" required value="${esc(d.amount)}" aria-describedby="dep-min"><small>USD</small></div>
      <div class="dep-picks">${[MIN_DEPOSIT,50,100].map(n => `<button type="button" data-dep-pick="${n}" aria-pressed="${Number(d.amount) === n}">$${n}</button>`).join('')}</div>
      <small id="dep-min"><span>Minimum deposit</span> · ${usd(MIN_DEPOSIT)}</small>
    </section>
    <fieldset class="dep-methods"><legend>Payment method</legend>
      <div class="dep-grid">${preferred.map(id => card(CRYPTO.find(c => c.id === id))).join('')}</div>
      <details ${d.expanded ? 'open' : ''}><summary><span>More payment methods</span>${I.down}</summary>
        <div class="dep-grid">${CRYPTO.filter(c => !preferred.includes(c.id)).map(card).join('')}</div>
      </details></fieldset>
    ${summary}<button class="btn btn-accent dep-submit" type="submit">Review deposit ${I.chev}</button></form>`;
  const review = `${summary}<p class="dep-note">This is a demo deposit. Only sample credits will be added.</p>
    <button class="btn btn-accent dep-submit" data-dep-step="next">Continue to payment ${I.chev}</button>
    <button class="dep-link" data-dep-step="edit">Edit details</button>`;
  const payment = d.paid ? `<section class="dep-confirm" role="status">${I.check}<h2>Demo deposit complete</h2><strong>${money}</strong><p>Sample credits added to your wallet.</p></section>
    <a class="btn btn-accent dep-submit" href="#/balance">Back to wallet ${I.chev}</a>` :
    `${summary}<p class="dep-note">This is a demo deposit. Only sample credits will be added.</p>
    <button class="btn btn-accent dep-submit" data-dep-step="pay">Add demo credits ${I.chev}</button><button class="dep-link" data-dep-step="review">Back to review</button>`;
  const stopped = blocked();
  return `<div class="page deposit-page">
    <a class="dep-back" href="#/balance">${I.arrowL}<span>Back to wallet</span></a>
    <header class="dep-hero"><div><h1>Recharge your <em>wallet.</em></h1><p>Choose an amount and a payment method.</p></div>
      <img src="assets/wallet-coins.jpg" class="wallet-banner-art" alt=""></header>
    <ol class="dep-steps" aria-label="Deposit progress">${['Details','Review','Payment'].map((name,i) => `<li ${i === d.step ? 'aria-current="step"' : ''}><i>${i < d.step || d.paid ? I.check : i+1}</i><span>${name}</span></li>`).join('')}</ol>
    ${stopped && !d.paid ? `<p class="warn">${esc(stopped)}</p>` : [details,review,payment][d.step]}
    <button class="dep-link" data-act="chat">Need help?</button>
  </div>`;
}

function depositMove(step) {
  depositDraft.step = step;
  render();
  const heading = document.querySelector('.dep-hero h1');
  if (heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
}

function depositAllowed() {
  if (!S.user || !depositDraft) return false;
  const amount = Number(depositDraft.amount);
  if (!Number.isSafeInteger(Math.round(amount * 100)) || amount < MIN_DEPOSIT) return false;
  const stop = blocked();
  if (stop) { toast(stop); return false; }
  if (S.user.limit && todayDeposits() + amount > S.user.limit) {
    toast(`That would pass your $${S.user.limit} daily limit`);
    return false;
  }
  return true;
}

document.addEventListener('input', e => {
  if (!depositDraft || !e.target.closest('[data-deposit-form]')) return;
  if (e.target.id === 'dep-amount') {
    depositDraft.amount = e.target.value;
    document.querySelector('[data-dep-total]').textContent = e.target.value ? usd(Number(e.target.value)) : '—';
    document.querySelectorAll('[data-dep-pick]').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.depPick) === Number(e.target.value)));
  } else if (e.target.name === 'dep-method') {
    depositDraft.method = e.target.value;
    document.querySelector('[data-dep-name]').textContent = CRYPTO.find(c => c.id === e.target.value).name;
  }
});
document.addEventListener('submit', e => {
  if (!e.target.matches('[data-deposit-form]')) return;
  e.preventDefault();
  if (!depositAllowed()) return;
  depositDraft.expanded = e.target.querySelector('details').open;
  depositMove(1);
});
document.addEventListener('click', e => {
  const b = e.target.closest('[data-dep-pick],[data-dep-step]');
  if (!b || !depositDraft || !S.user) return;
  if (b.dataset.depPick) {
    const input = document.querySelector('#dep-amount');
    input.value = Number(b.dataset.depPick).toFixed(2);
    input.dispatchEvent(new Event('input', {bubbles:true}));
    return;
  }
  const d = depositDraft;
  switch (b.dataset.depStep) {
    case 'edit': depositMove(0); break;
    case 'review': depositMove(1); break;
    case 'next': if (depositAllowed()) depositMove(2); break;
    case 'pay':
      if (d.step !== 2 || d.paid || !depositAllowed()) return;
      const amount = Number(d.amount);
      const method = CRYPTO.find(c => c.id === d.method);
      d.paid = true;
      S.user.wallet = Math.round((S.user.wallet + amount) * 100) / 100;
      addTx({kind:'Deposits', label:`Demo deposit (${method.name})`, amt:amount, status:'done'});
      save();
      depositMove(2);
  }
});
