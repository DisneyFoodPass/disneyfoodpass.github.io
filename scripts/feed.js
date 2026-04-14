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
  // MAIN INSTAGRAM FEED LOADER
  // ===============================
  async function loadInstagramFeed() {
    try {
      const response = await fetch("https://disneyfoodpass-instagram.disneyfoodpass.workers.dev/instagram");
      const posts = await response.json();

      const feedGrid = document.getElementById("feed-grid");
      feedGrid.innerHTML = "";

      posts.forEach(post => {
        const imgUrl = post.media_url;
        const link = post.permalink;

        const item = document.createElement("a");
        item.className = "feed-item";
        item.href = link;
        item.target = "_blank";

        item.innerHTML = `
          <img src="${imgUrl}" alt="Instagram Post">
        `;

        feedGrid.appendChild(item);
      });

    } catch (err) {
      document.getElementById("feed-grid").innerHTML = "Error loading feed.";
    }
  }

  loadInstagramFeed();


  // ===============================
  // FEATURED POSTS AUTO-LOADER
  // ===============================
  async function loadFeaturedPosts() {
    try {
      const response = await fetch("https://disneyfoodpass-instagram.disneyfoodpass.workers.dev/instagram");
      const posts = await response.json();

      const featuredItems = document.querySelectorAll("[data-featured-id]");

      featuredItems.forEach(item => {
        const id = item.getAttribute("data-featured-id");

        // Support carousel syntax: shortcode-2 means second slide
        const [shortcode, index] = id.split("-");
        const slideIndex = index ? parseInt(index) - 1 : 0;

        // Find matching post by shortcode
        const post = posts.find(p => p.permalink.includes(shortcode));
        if (!post) return;

        // If carousel, use children array
        const imageUrl =
          post.children?.[slideIndex]?.media_url || post.media_url;

        item.innerHTML = `
          <a href="${post.permalink}" target="_blank">
            <img src="${imageUrl}" alt="Featured Post">
          </a>
        `;
      });

    } catch (err) {
      console.error("Featured posts failed:", err);
    }
  }

  loadFeaturedPosts();
});
