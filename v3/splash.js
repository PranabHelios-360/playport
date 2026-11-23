/* The same scene runs during application bootstrap and game preview decoding. */
window.RechargeSplash = (() => {
  const host = document.getElementById('loader');
  const blueprint = host.firstElementChild.cloneNode(true);
  const minimumDisplayMs = 5000;
  const sequence = [
    ['slots', 'Warming up the slots...'],
    ['fortune', 'Loading your fortune...'],
    ['slots', 'Waking the reels...'],
    ['fortune', 'Your rewards are loading...'],
    ['dragon', 'Awakening the dragon...'],
    ['fortune', 'Win amazing rewards...'],
    ['fortune', 'Fortune is on the way...'],
    ['slots', 'Spin and win...']
  ];
  let previous = -1;
  try { previous = Number(sessionStorage.getItem('r777:last-splash') ?? -1); } catch {}

  function play(container) {
    const scene = blueprint.cloneNode(true);
    const message = scene.querySelector('.power-message');
    const retry = scene.querySelector('.power-retry');
    const choices = sequence.map((_, i) => i).filter(i => i !== previous);
    let index = choices[Math.floor(Math.random() * choices.length)];
    let fade;
    function paint() {
      const [theme, text] = sequence[index];
      scene.dataset.theme = theme;
      message.textContent = text;
      message.classList.remove('fading');
      previous = index;
      try { sessionStorage.setItem('r777:last-splash', String(index)); } catch {}
    }
    paint();
    container.replaceChildren(scene);
    const visibleSince = performance.now();
    let dismissal;
    const rotation = setInterval(() => {
      message.classList.add('fading');
      index = (index + 1) % sequence.length;
      fade = setTimeout(paint, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 160);
    }, 2000);
    function stop() {
      clearTimeout(dismissal);
      clearInterval(rotation);
      clearTimeout(fade);
      message.classList.remove('fading');
    }
    return {
      ready(onDismiss) {
        const remaining = minimumDisplayMs - (performance.now() - visibleSince);
        const dismiss = () => { stop(); scene.remove(); onDismiss(); };
        if (remaining > 0) {
          const enter = document.createElement('button');
          enter.type = 'button';
          enter.className = 'power-continue';
          enter.textContent = container===host ? 'Enter Skillandslots →' : 'Open preview →';
          enter.onclick = dismiss;
          scene.querySelector('.power-core').append(enter);
          dismissal = setTimeout(dismiss, Math.ceil(remaining));
        }
        else dismiss();
      },
      finish() { stop(); scene.remove(); },
      fail(text, onRetry) {
        stop();
        scene.classList.add('power-failed');
        message.textContent = text;
        retry.onclick = onRetry;
        retry.hidden = false;
      }
    };
  }

  const opening = play(host);
  let failed = false;
  function handleError(event) {
    const source = event.target instanceof HTMLScriptElement ? event.target.src : event.filename;
    if (source && Array.from(document.scripts).some(script => script.hasAttribute('data-boot') && script.src === source)) {
      failed = true;
      opening.fail('Skillandslots couldn’t start.', () => location.reload());
    }
  }
  window.addEventListener('error', handleError, true);
  document.addEventListener('DOMContentLoaded', () => {
    window.removeEventListener('error', handleError, true);
    if (failed) return;
    if (!host.hasAttribute('data-ready')) {
      opening.fail('Skillandslots couldn’t start.', () => location.reload());
      return;
    }
    opening.ready(() => {
      host.hidden = true;
      host.classList.add('off');
    });
  }, {once:true});
  return {play};
})();
