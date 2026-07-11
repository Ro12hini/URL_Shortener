const express = require("express");
const router = express.Router();
const {
  shortenUrl,
  redirectToLongUrl,
  getStats,
} = require("../controllers/urlController");

// API routes
router.post("/api/shorten", shortenUrl);
router.get("/api/stats/:shortCode", getStats);

// Redirect route (must stay separate from /api so it doesn't clash)
router.get("/:shortCode", redirectToLongUrl);

module.exports = router;
