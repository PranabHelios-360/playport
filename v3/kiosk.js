// Kiosk pairing opens an isolated sample wallet. Personal accounts are local to their browser.
const kioskScanIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 8V4h5m8 0h5v4M3 16v4h5m8 0h5v-4M5 12h14"/></svg>';
const homeShareIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="5" cy="12" r="2.6"/><circle cx="18" cy="5" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m7.5 11 8-4.5m-8 7 8 4.5"/></svg>';
const kioskLifetime = 180000;
const qrLibraries = new Map();
let kioskChallenge, kioskExpiryTimer, kioskDemoTimer, scanner;

function loadQrLibrary(src) {
  if (!qrLibraries.has(src)) {
    qrLibraries.set(src,new Promise((resolve,reject) => {
      const script = document.createElement('script');
      script.src = 'vendor/' + src;
      script.onload = resolve;
      script.onerror = () => { qrLibraries.delete(src); script.remove(); reject(new Error('QR library unavailable')); };
      document.head.appendChild(script);
    }));
  }
  return qrLibraries.get(src);
}
function homeUtilities() {
  return `<nav class="home-tools" aria-label="Home shortcuts"><button type="button" data-kiosk="share">${homeShareIcon} Share</button><button type="button" data-kiosk="scan">${kioskScanIcon} <span>Scan kiosk QR</span></button>${S.user?.kioskDemo ? '<button type="button" data-kiosk="end">End demo</button>' : ''}</nav>`;
}
function publicHomeUrl() { return location.origin + location.pathname + '#/'; }
async function shareHome() {
  const url = publicHomeUrl();
  if (navigator.share) {
    try { await navigator.share({title:'Skillslots777',url}); return; }
    catch (error) { if (error.name === 'AbortError') return; }
  }
  openModal(`<section class="pair-panel"><h2>Share Skillslots777</h2><p>Share the public Home page.</p><label>Home link<input class="field" data-share-url readonly value="${esc(url)}"></label><button class="pair-primary" data-kiosk="copy">Copy link</button><p class="pair-status" role="status"></p></section>`);
}
function clearKioskChallenge() {
  clearTimeout(kioskExpiryTimer);
  kioskChallenge = null;
}
function readPair(value) {
  let url;
  try { url = new URL(value); } catch { return null; }
  if (url.origin !== location.origin || url.pathname !== location.pathname || url.search || url.username || url.password) return null;
  const parts = /^#\/kiosk-pair\/(\d{13})\.([A-F0-9]{4})\.(\d{6})$/.exec(url.hash);
  if (!parts) return null;
  const until = Number(parts[1]);
  if (until <= Date.now() || until > Date.now()+kioskLifetime+10000) return null;
  return {until,station:parts[2],code:parts[3]};
}
function kioskPage(routeName) {
  if (routeName === 'kiosk-pair') return `<div class="page kiosk-screen">${phoneApproval(readPair(location.href))}</div>`;
  if (S.user) return '<div class="page kiosk-screen"><section class="pair-panel"><h1>Kiosk sign-in</h1><p>Open the kiosk link in a signed-out browser on the kiosk device.</p><a class="pair-primary" href="#/">Back to Home</a></section></div>';
  return `<div class="page kiosk-screen"><section class="pair-panel"><h1>Kiosk sign-in</h1><p>Scan this QR with your phone to start a separate demo wallet on this kiosk.</p>
    <div class="kiosk-code" role="img" aria-label="Kiosk pairing QR code"></div><p class="kiosk-station"></p>
    <form data-kiosk-pin><label>Code from your phone<input name="pin" class="field" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="off" required></label><button class="pair-primary">Open demo wallet</button></form>
    <p class="pair-status" role="status"></p><button class="pair-secondary" data-kiosk="renew">Get a new QR code</button></section></div>`;
}
function phoneApproval(pair) {
  if (!pair) return '<section class="pair-panel"><h2>QR unavailable</h2><p>Get a new code on the kiosk and scan again.</p><a class="pair-secondary" href="#/">Back to Home</a></section>';
  return `<section class="pair-panel" data-phone-pair><h2>Confirm kiosk</h2><p><span>Kiosk</span> <b>${pair.station}</b></p><p>Match this ID to the kiosk in front of you. This opens a fresh demo wallet there.</p>
    <button class="pair-primary" data-kiosk="confirm">Show sign-in code</button><div class="pair-status" role="status"></div></section>`;
}
function mountKioskPage(routeName) {
  if (routeName === 'kiosk' && !S.user) issueKioskCode();
}
async function issueKioskCode() {
  clearKioskChallenge();
  const page = document.querySelector('.kiosk-screen');
  const qr = page?.querySelector('.kiosk-code');
  if (!qr) return;
  const status = page.querySelector('.pair-status');
  const form = page.querySelector('form');
  form.reset(); form.querySelector('button').disabled = true; qr.replaceChildren();
  const random = crypto.getRandomValues(new Uint32Array(2));
  const current = {until:Date.now()+kioskLifetime,station:random[0].toString(16).padStart(8,'0').slice(-4).toUpperCase(),code:String(random[1]%1000000).padStart(6,'0'),tries:0};
  kioskChallenge = current;
  page.querySelector('.kiosk-station').innerHTML = `<span>Kiosk</span> <b>${current.station}</b>`;
  const expire = () => {
    clearKioskChallenge(); qr.replaceChildren(); form.querySelector('button').disabled = true;
    status.textContent = 'Get a new code on the kiosk and scan again.';
  };
  try {
    await loadQrLibrary('qrcode-1.4.4.js');
    if (!page.isConnected || current !== kioskChallenge) return;
    const code = qrcode(0,'M');
    code.addData(location.origin+location.pathname+'#/kiosk-pair/'+[current.until,current.station,current.code].join('.'));
    code.make(); qr.innerHTML = code.createSvgTag({cellSize:4,margin:16,scalable:true});
    status.textContent = 'QR valid for 3 minutes.'; form.querySelector('button').disabled = false;
    kioskExpiryTimer = setTimeout(expire,Math.max(0,current.until-Date.now()));
  } catch { if (current === kioskChallenge) expire(); }
}
function endKioskDemo() {
  clearTimeout(kioskDemoTimer);
  if (!S.user?.kioskDemo) return;
  S.user = null; closeModal(); setMenu(false); setChat(false); location.hash = '#/kiosk';
}
function stopKioskScanner() {
  if (!scanner) return;
  clearTimeout(scanner.timer);
  scanner.stream?.getTracks().forEach(track=>track.stop());
  scanner = null;
}
function showKioskScanner() {
  openModal(`<section class="pair-panel scanner-panel"><h2>Scan QR code</h2><p>Point your camera at the QR code on your Skillslots777 kiosk.</p>
    <div class="kiosk-finder"><video muted playsinline autoplay></video><i aria-hidden="true"></i></div>
    <p class="pair-status" role="status">Start the camera or choose a QR image.</p><button class="pair-primary" data-kiosk="camera">Start camera</button>
    <label class="pair-file">Choose QR image<input type="file" accept="image/*" data-kiosk-image></label>
    <a class="pair-secondary" href="#/kiosk" data-close-after>Open kiosk screen</a></section>`);
  document.querySelector('.scanner-panel [data-kiosk=camera]').focus({preventScroll:true});
}
function acceptQr(value) {
  const pair = readPair(value);
  if (!pair) return false;
  stopKioskScanner(); closeModal();
  if (location.search) history.replaceState(null,'',location.pathname+location.hash);
  location.hash = new URL(value).hash;
  return true;
}
function decodeQr(source,width,height,canvas,scaleLimit) {
  const ratio = Math.min(1,scaleLimit/Math.max(width,height));
  canvas.width = Math.max(1,Math.round(width*ratio)); canvas.height = Math.max(1,Math.round(height*ratio));
  const ctx = canvas.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(source,0,0,canvas.width,canvas.height);
  const pixels = ctx.getImageData(0,0,canvas.width,canvas.height);
  return jsQR(pixels.data,pixels.width,pixels.height,{inversionAttempts:'attemptBoth'})?.data;
}
async function startKioskCamera(panel) {
  stopKioskScanner();
  const run = {canvas:document.createElement('canvas')};
  scanner = run;
  const status = panel.querySelector('.pair-status'), button = panel.querySelector('[data-kiosk=camera]');
  button.disabled = true; status.textContent = 'Opening camera…';
  try {
    await loadQrLibrary('jsQR-1.4.0.js');
    if (run !== scanner) return;
    const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
    if (run !== scanner) { stream.getTracks().forEach(track=>track.stop()); return; }
    run.stream = stream;
    const video = panel.querySelector('video'); video.srcObject = stream; await video.play();
    if (run !== scanner) return;
    status.textContent = 'Keep the kiosk QR inside the frame.'; panel.classList.add('scanning');
    const tick = () => {
      if (run !== scanner) return;
      if (video.readyState >= 2 && video.videoWidth) {
        const value = decodeQr(video,video.videoWidth,video.videoHeight,run.canvas,640);
        if (value && acceptQr(value)) return;
        if (value) status.textContent = 'Use a current Skillslots777 kiosk QR.';
      }
      run.timer = setTimeout(tick,180);
    };
    tick();
  } catch {
    if (run !== scanner) return;
    stopKioskScanner(); button.disabled=false; panel.classList.remove('scanning');
    status.textContent='Camera unavailable. Allow camera access or choose a QR image.';
  }
}
document.addEventListener('change',async event => {
  const input = event.target;
  if (!input.matches('[data-kiosk-image]') || !input.files[0]) return;
  const panel = input.closest('.scanner-panel'), status=panel.querySelector('.pair-status');
  stopKioskScanner(); panel.classList.remove('scanning'); panel.querySelector('[data-kiosk=camera]').disabled=false;
  const run={}; scanner=run;
  const url = URL.createObjectURL(input.files[0]); input.value='';
  try {
    await loadQrLibrary('jsQR-1.4.0.js');
    const image = new Image(); image.src=url; await image.decode();
    if (scanner!==run) return;
    const value=decodeQr(image,image.width,image.height,document.createElement('canvas'),1400);
    if (!value || !acceptQr(value)) status.textContent='Use a current Skillslots777 kiosk QR.';
  } catch { if (scanner===run) status.textContent='Could not read the image. Try another QR image.'; }
  finally { URL.revokeObjectURL(url); }
});
document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-kiosk]');
  if (!button) return;
  switch (button.dataset.kiosk) {
    case 'share': await shareHome(); break;
    case 'scan': showKioskScanner(); break;
    case 'end': endKioskDemo(); break;
    case 'camera': await startKioskCamera(button.closest('.scanner-panel')); break;
    case 'renew': await issueKioskCode(); break;
    case 'copy': {
      const input=document.querySelector('[data-share-url]'), status=button.parentNode.querySelector('.pair-status');
      try {await navigator.clipboard.writeText(input.value);status.textContent='Link copied.';}
      catch {input.select();status.textContent='Select and copy the Home link.';}
      break;
    }
    case 'confirm': {
      const pair=readPair(location.href), status=button.parentNode.querySelector('.pair-status');
      button.disabled=true;
      if (pair) status.innerHTML=`<p>Enter this code on the kiosk.</p><strong class="phone-pin">${pair.code}</strong>`;
      else status.textContent='Get a new code on the kiosk and scan again.';
      break;
    }
  }
});
document.addEventListener('submit',event=>{
  const form=event.target;
  if (!form.matches('[data-kiosk-pin]')) return;
  event.preventDefault();
  const status=form.parentNode.querySelector('.pair-status');
  const current=kioskChallenge;
  if (!current || current.until <= Date.now()) {status.textContent='Get a new code on the kiosk and scan again.';return;}
  if (form.elements.pin.value !== current.code) {
    if (++current.tries >= 5) {issueKioskCode(); return;}
    status.textContent='That code does not match. Check the code on your phone.';return;
  }
  if (S.user) return;
  clearKioskChallenge();
  S.user=demoUser('Kiosk-'+current.station,makePw());
  S.user.kioskDemo=true; S.user.demoSession=true;
  kioskDemoTimer=setTimeout(endKioskDemo,600000);
  location.hash='#/';
});
window.addEventListener('pagehide',stopKioskScanner);
document.addEventListener('visibilitychange',() => {
  if (!document.hidden || !scanner) return;
  stopKioskScanner();
  const panel = document.querySelector('.scanner-panel');
  if (!panel) return;
  panel.classList.remove('scanning');
  panel.querySelector('[data-kiosk=camera]').disabled=false;
  panel.querySelector('.pair-status').textContent='Start the camera or choose a QR image.';
});
