const { pool } = require("../config/db");
const { encodeBase62 } = require("../utils/base62");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Very small sanity check — not bulletproof, just enough to reject junk input
function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// POST /api/shorten
async function shortenUrl(req, res) {
  const { longUrl } = req.body;

  if (!longUrl || !isValidUrl(longUrl)) {
    return res.status(400).json({ error: "Please provide a valid URL (must start with http:// or https://)." });
  }

  try {
    // Step 1: insert the row without a short_code yet, so MySQL gives us
    // a guaranteed-unique auto-increment id to encode.
    const [insertResult] = await pool.execute(
      "INSERT INTO urls (long_url) VALUES (?)",
      [longUrl]
    );

    const newId = insertResult.insertId;
    const shortCode = encodeBase62(newId);

    // Step 2: save the generated code back onto that same row.
    await pool.execute("UPDATE urls SET short_code = ? WHERE id = ?", [
      shortCode,
      newId,
    ]);

    return res.status(201).json({
      longUrl,
      shortCode,
      shortUrl: `${BASE_URL}/${shortCode}`,
    });
  } catch (err) {
    console.error("Error creating short URL:", err.message);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

// GET /:shortCode  -> redirect to the original URL
async function redirectToLongUrl(req, res) {
  const { shortCode } = req.params;

  try {
    const [rows] = await pool.execute(
      "SELECT long_url FROM urls WHERE short_code = ?",
      [shortCode]
    );

    if (rows.length === 0) {
      return res.status(404).send("Short URL not found.");
    }

    // Fire-and-forget click increment — don't make the user wait on this
    pool.execute("UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?", [
      shortCode,
    ]);

    return res.redirect(302, rows[0].long_url);
  } catch (err) {
    console.error("Error redirecting:", err.message);
    return res.status(500).send("Something went wrong.");
  }
}

// GET /api/stats/:shortCode -> click analytics for one link
async function getStats(req, res) {
  const { shortCode } = req.params;

  try {
    const [rows] = await pool.execute(
      "SELECT long_url, short_code, clicks, created_at FROM urls WHERE short_code = ?",
      [shortCode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Short URL not found." });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching stats:", err.message);
    return res.status(500).json({ error: "Something went wrong." });
  }
}

module.exports = { shortenUrl, redirectToLongUrl, getStats };
