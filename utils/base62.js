const CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const BASE = CHARS.length; // 62

/**
 * Encodes a positive integer (e.g. an auto-increment DB id) into a
 * short base62 string. Because every id is unique, every code is
 * unique too — no collision checking needed.
 *
 * Example: 125 -> "cb"
 */
function encodeBase62(num) {
  if (num === 0) return CHARS[0];

  let result = "";
  while (num > 0) {
    result = CHARS[num % BASE] + result;
    num = Math.floor(num / BASE);
  }
  return result;
}

module.exports = { encodeBase62 };
