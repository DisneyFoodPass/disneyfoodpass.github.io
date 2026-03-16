// scripts/feed.js
// Lightweight client script to render a feed into #instagram-feed.
// Two integration options:
// 1) Third-party widget: paste provider script into index.html where indicated.
// 2) Worker/JSON: set WORKER_URL to your endpoint that returns JSON { items: [{image, link, caption}] }.

const FEED_CONTAINER = document.getElementById('instagram-feed');
const WORKER_URL = ''; // <-- Replace with your Cloudflare Worker or JSON endpoint if using Worker approach

function renderPlaceholders() {
  // placeholders already in HTML; keep them until feed loads
}

function renderGrid(items) {
  FEED_CONTAINER.innerHTML = '';
  items.forEach(it => {
    const a = document.createElement('a');
    a.href = it.link || '#';
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'feed-item';
    const img = document.createElement('img');
    img.src = it.image;
    img.alt = it.caption || '@DisneyFoodPass image';
    img.loading = 'lazy';
    a.appendChild(img);
    FEED_CONTAINER.appendChild(a);
  });
}

async function fetchWorkerFeed() {
  if (!WORKER_URL) return;
  try {
    const res = await fetch(WORKER_URL, {cache: 'no-store'});
    if (!res.ok) throw new Error('Feed fetch failed');
    const json = await res.json();
    if (json && Array.isArray(json.items)) {
      renderGrid(json.items);
    }
  } catch (e) {
    console.warn('Feed load error', e);
  }
}

// If you plan to use a third-party widget, paste their script tag into index.html
// where the feed container is. Most widgets will auto-render into a container ID.
// Example: provider gives <div id="widget"></div><script src="..."></script>

// Try Worker feed after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  renderPlaceholders();
  fetchWorkerFeed();
});
