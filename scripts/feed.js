// Minimal scripts: form handling and optional Worker feed loader
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('early-form');
  const msg = document.getElementById('form-msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = 'Sending...';
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        msg.textContent = 'Thanks — you are on the list. Check your inbox for confirmation.';
        form.reset();
      } else {
        const json = await res.json();
        msg.textContent = json.error || 'Submission failed. Try again.';
      }
    } catch (err) {
      msg.textContent = 'Network error. Try again later.';
    }
  });

  // Optional: set WORKER_URL to your Cloudflare Worker or JSON endpoint that returns:
  // { items: [{ image: "https://...", link: "https://...", caption: "..." }, ...] }
  const WORKER_URL = ''; // <-- paste your Worker or JSON endpoint here

  async function loadWorkerFeed() {
    if (!WORKER_URL) return;
    try {
      const r = await fetch(WORKER_URL);
      if (!r.ok) return;
      const j = await r.json();
      if (!Array.isArray(j.items)) return;
      const grid = document.getElementById('instagram-feed');
      grid.innerHTML = '';
      j.items.forEach(it => {
        const a = document.createElement('a');
        a.href = it.link || '#';
        a.target = '_blank';
        a.rel = 'noopener';
        const img = document.createElement('img');
        img.src = it.image;
        img.alt = it.caption || '@DisneyFoodPass image';
        img.loading = 'lazy';
        a.appendChild(img);
        grid.appendChild(a);
      });
    } catch (e) {
      console.warn('Feed load error', e);
    }
  }

  loadWorkerFeed();
});
