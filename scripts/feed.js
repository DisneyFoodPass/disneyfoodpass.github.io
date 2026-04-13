// ===============================
// EMAIL FORM HANDLING
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('early-form');
  const msg = document.getElementById('form-msg');

  if (form) {
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
  }

  // ===============================
  // INSTAGRAM FEED LOADER
  // ===============================
  async function loadInstagramFeed() {
    try {
      const response = await fetch("https://disneyfoodpass-instagram.disneyfoodpass.workers.dev/instagram");
      const data = await response.json();

      if (!data.data) {
        document.getElementById("feed-grid").innerHTML = "Unable to load Instagram feed.";
        return;
      }

      const posts = data.data;

      const html = posts.map(post => `
        <a href="${post.permalink}" target="_blank" class="feed-item">
          <img src="${post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url}" alt="Instagram Post">
        </a>
      `).join("");

      document.getElementById("feed-grid").innerHTML = html;

    } catch (err) {
      document.getElementById("feed-grid").innerHTML = "Error loading feed.";
    }
  }

  loadInstagramFeed();
});
