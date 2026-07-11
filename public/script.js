const form = document.getElementById("shorten-form");
const input = document.getElementById("long-url");
const result = document.getElementById("result");
const shortUrlText = document.getElementById("short-url-text");
const copyBtn = document.getElementById("copy-btn");
const errorText = document.getElementById("error-text");
const stats = document.getElementById("stats");
const clickCount = document.getElementById("click-count");

let currentShortCode = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorText.classList.add("hidden");
  result.classList.add("hidden");
  stats.classList.add("hidden");

  const longUrl = input.value.trim();

  try {
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ longUrl }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorText.textContent = data.error || "Something went wrong.";
      errorText.classList.remove("hidden");
      return;
    }

    shortUrlText.textContent = data.shortUrl;
    result.classList.remove("hidden");
    currentShortCode = data.shortCode;

    fetchStats(currentShortCode);
  } catch (err) {
    errorText.textContent = "Could not reach the server.";
    errorText.classList.remove("hidden");
  }
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(shortUrlText.textContent);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
});

async function fetchStats(shortCode) {
  try {
    const res = await fetch(`/api/stats/${shortCode}`);
    const data = await res.json();
    if (res.ok) {
      clickCount.textContent = data.clicks;
      stats.classList.remove("hidden");
    }
  } catch {
    // silently ignore — stats are a nice-to-have, not critical
  }
}
