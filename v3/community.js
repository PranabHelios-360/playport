const storyExamples = [
  ['Alex', 'One wallet, all my games', 'I like having my game platforms together in one place.'],
  ['Sam', 'Finding a favorite', 'The game categories make it easy to find what I want to explore.'],
  ['Jordan', 'On the go', 'The layout feels clear on my phone and my tablet.'],
  ['Riley', 'Light or dark', 'Switching between the light and dark themes is a nice touch.'],
  ['Morgan', 'In my language', 'Being able to switch to Spanish is really helpful.']
].map(([name,title,quote], i) => ({name,title,quote,portraitUrl:`assets/stories/portrait-${i}.jpg`}));

function communityItems(key) {
  const records = window.RECHARGE_CONTENT?.[key];
  if (!Array.isArray(records)) return [];
  return records.filter(item => item && typeof item.name === 'string' && typeof item.quote === 'string');
}

function storyMedia(path) {
  if (typeof path !== 'string' || !path.trim()) return '';
  try {
    const url = new URL(path, document.baseURI);
    if (url.protocol === 'https:' || (url.origin === location.origin && url.protocol === 'http:')) return esc(url.href);
  } catch {}
  return '';
}

function storyPoster(story) {
  const portrait = storyMedia(story.portraitUrl);
  return portrait ? `<img loading="lazy" src="${portrait}" alt="">` : '<span class="story-silhouette" aria-hidden="true">777</span>';
}

function storyTime(story) {
  const seconds = story.videoUrl ? story.durationSeconds : 8;
  if (!Number.isInteger(seconds) || seconds <= 0) return '';
  return `<time>${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2,'0')}</time>`;
}

function featureStory(story) {
  const title = story === storyExamples[0]
    ? '<span>Hey y’all</span><span>How’s it <em>going?</em></span>'
    : esc(story.title || story.name);
  return `<figure class="story-cover">${storyPoster(story)}
    <figcaption><strong>${title}</strong><small>${esc(story.name)}</small></figcaption>
    <span class="story-bolt" aria-hidden="true"><svg viewBox="0 0 48 68" fill="none"><path d="M37 3 5 39h18L13 65l31-39H27Z" fill="#ffce66" stroke="#fffcdf" stroke-width="2"/></svg></span>${storyTime(story)}
    <button class="story-play" aria-label="Play story" aria-pressed="false"><span aria-hidden="true"></span></button>
    </figure><blockquote class="story-quote"><span aria-hidden="true">“</span><p>“<span>${esc(story.quote)}</span>”</p></blockquote>`;
}

function reviewCard(review, sample) {
  const rating = sample ? 5 : review.rating;
  const stars = Number.isInteger(rating) && rating >= 1 && rating <= 5
    ? `<div class="review-stars" role="img" aria-label="${rating}/5">${Array.from({length:5},(_,i)=>`<i class="${i<rating?'filled':''}">★</i>`).join('')}</div>` : '';
  const long = review.quote.length > 160;
  const portrait = storyMedia(review.portraitUrl);
  return `<article class="reader-card">${stars}
    ${review.title ? `<h3>${esc(review.title)}</h3>` : ''}
    <p>${esc(long ? review.quote.slice(0,157).trimEnd()+'…' : review.quote)}</p>
    ${long ? '<button class="review-expand" aria-expanded="false">See more</button>' : ''}
    <footer>${portrait ? `<img src="${portrait}" alt="" loading="lazy">` : ''}<div><b>${esc(review.name)}</b>
      ${sample ? '<small>Sample review</small>' : review.date ? `<small>${esc(review.date)}</small>` : ''}</div></footer></article>`;
}

function communityShowcase() {
  const configured = communityItems('stories'), approved = communityItems('reviews');
  const stories = configured.length ? configured : storyExamples;
  const reviews = approved.length ? approved : storyExamples;
  return `<div class="community-theater"><section class="story-room" aria-labelledby="story-title">
    <header><p class="section-kicker">THE SKILLSLOTS777 COMMUNITY</p><h2 id="story-title"><span>Player Stories,</span> <em>In One Place.</em></h2>
    <p class="story-disclosure">${configured.length ? 'Stories from the Skillslots777 community.' : 'Preview stories with fictional players.'}</p></header>
    <div class="story-inner"><div id="featured-story" aria-live="polite">${featureStory(stories[0])}</div>
    <div class="story-strip">${stories.map((story,i)=>`<button class="story-choice" data-story-index="${i}" aria-controls="featured-story" aria-pressed="${i===0}">
      ${storyPoster(story)}<span class="thumb-play" aria-hidden="true">▸</span>${storyTime(story)}<span class="story-name">${esc(story.name)}</span></button>`).join('')}</div></div>
    </section>
    <section class="reader-reviews" aria-labelledby="reader-title"><header><h2 id="reader-title">Player Reviews</h2>
    ${approved.length ? '' : '<p>Community review preview</p>'}</header>
    <div class="review-carousel"><div class="reader-track" id="reader-track" tabindex="0" role="region" aria-labelledby="reader-title">${reviews.map(r=>reviewCard(r,!approved.length)).join('')}</div>
    ${reviews.length > 1 ? '<button class="review-arrow prev" aria-label="Previous review" aria-controls="reader-track">‹</button><button class="review-arrow next" aria-label="Next review" aria-controls="reader-track">›</button>' : ''}</div>
    ${reviews.length > 1 ? '<button class="btn btn-outline review-mode" aria-expanded="false" aria-controls="reader-track">View all reviews</button>' : ''}</section></div>`;
}

document.addEventListener('click', e => {
  const play = e.target.closest('.story-play');
  if (play) {
    const room = play.closest('.story-room');
    const selected = room.querySelector('.story-choice[aria-pressed="true"]');
    const items = communityItems('stories');
    const story = (items.length ? items : storyExamples)[Number(selected.dataset.storyIndex)];
    const cover = play.closest('figure');
    const url = storyMedia(story.videoUrl);
    if (url) {
      cover.innerHTML = `<video controls playsinline aria-label="${esc(story.name)}" src="${url}"></video>`;
      const clip = cover.querySelector('video');
      clip.focus();
      clip.play().catch(()=>{});
    } else if (cover.classList.contains('reading')) {
      cover.classList.remove('reading');
      play.setAttribute('aria-pressed', 'false');
    } else {
      cover.classList.add('reading');
      play.setAttribute('aria-pressed', 'true');
      if (!cover.querySelector('.story-caption')) {
        const caption = document.createElement('div');
        caption.className = 'story-caption';
        caption.textContent = story.quote;
        cover.append(caption);
      }
    }
    return;
  }
  const thumb = e.target.closest('.story-choice');
  if (thumb) {
    const list = communityItems('stories');
    const story = (list.length ? list : storyExamples)[Number(thumb.dataset.storyIndex)];
    if (!story) return;
    document.getElementById('featured-story').innerHTML = featureStory(story);
    thumb.parentElement.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el===thumb)));
    return;
  }
  const toggle = e.target.closest('.review-mode');
  if (toggle) {
    const all = document.getElementById('reader-track').classList.toggle('show-all');
    toggle.setAttribute('aria-expanded',String(all));
    toggle.textContent = all ? 'Show fewer reviews' : 'View all reviews';
    return;
  }
  const arrow = e.target.closest('.review-arrow');
  if (arrow) {
    const track = arrow.parentElement.querySelector('.reader-track');
    const last = track.scrollWidth - track.clientWidth;
    const step = track.children[1].offsetLeft - track.children[0].offsetLeft;
    const next = arrow.classList.contains('next');
    const wrap = next ? track.scrollLeft >= last - 2 : track.scrollLeft < 2;
    const left = wrap ? (next ? 0 : last) : track.scrollLeft + (next ? step : -step);
    track.scrollTo({left, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    return;
  }
  const more = e.target.closest('.review-expand');
  if (more) {
    const card = more.closest('.reader-card'), index = Array.from(card.parentNode.children).indexOf(card);
    const review = communityItems('reviews')[index];
    if (!review) return;
    const open = more.getAttribute('aria-expanded') !== 'true';
    card.querySelector('p').textContent = open ? review.quote : review.quote.slice(0,157).trimEnd()+'…';
    more.setAttribute('aria-expanded',String(open));
    more.textContent = open ? 'See less' : 'See more';
  }
});

document.addEventListener('animationend', e => {
  if (e.animationName !== 'story-clock') return;
  const cover = e.target.closest('.story-cover');
  cover?.classList.remove('reading');
  cover?.querySelector('.story-play')?.setAttribute('aria-pressed','false');
});
