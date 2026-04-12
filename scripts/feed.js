// Minimal scripts: form handling only
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('early-form');
  const msg = document.getElementById('form-msg');

  if (!form) return; // prevents errors if form isn't on the page

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
});
