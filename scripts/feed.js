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
      const data = await response.json();

      const posts = data.data;
      const feedGrid = document.getElementById("feed-grid");
      feedGrid.innerHTML = "";

      posts.forEach(post => {
        const isVideo = post.media_type === "VIDEO";
        const imgUrl = isVideo
          ? (post.thumbnail_url || post.media_url)
          : post.media_url;

        const item = document.createElement("a");
        item.className = "feed-item";
        item.href = post.permalink;
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
      const data = await response.json();

      const posts = data.data;
      const featuredItems = document.querySelectorAll("[data-featured-id]");

      featuredItems.forEach(item => {
        const id = item.getAttribute("data-featured-id");

        // Support carousel syntax: shortcode-2 means second slide
        const [shortcode, index] = id.split("-");
        const slideIndex = index ? parseInt(index) - 1 : 0;

        // Find matching post by shortcode
        const post = posts.find(p => p.permalink.includes(shortcode));
        if (!post) return;

        let mediaUrl = post.media_url;
        let mediaType = post.media_type;

        // If carousel, override with slide media
        if (post.media_type === "CAROUSEL_ALBUM" && post.children?.length) {
          const child = post.children[slideIndex] || post.children[0];
          mediaUrl = child.media_url;
          mediaType = child.media_type;
        }

        // VIDEO (Reels, etc.)
        if (mediaType === "VIDEO") {
          item.innerHTML = `
            <a href="${post.permalink}" target="_blank">
              <video
                src="${mediaUrl}"
                muted
                autoplay
                loop
                playsinline
                style="width:100%;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
              </video>
            </a>
          `;
        } else {
          // IMAGE
          item.innerHTML = `
            <a href="${post.permalink}" target="_blank">
              <img
                src="${mediaUrl}"
                alt="Featured Post"
                style="width:100%;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
              </img>
            </a>
          `;
        }
      });

    } catch (err) {
      console.error("Featured posts failed:", err);
    }
  }

  loadFeaturedPosts();
});
