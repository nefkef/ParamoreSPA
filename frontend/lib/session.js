// Helpers for the admin session cookie.
// The cookie holds the username and an expiry time, signed with SESSION_SECRET
// (HMAC-SHA256), so the browser cannot change it without the server noticing.

const crypto = require('crypto');

const COOKIE_NAME = 'paramore_session';
const MAX_AGE_SECONDS = 2 * 60 * 60; // 2 hours

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET is missing or shorter than 32 characters');
  }
  return secret;
}

function sign(value) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');
}

// Compares two strings in constant time, so the response time does not leak
// how many characters were correct.
function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function cookieAttributes(maxAge) {
  const secure = process.env.LOCAL_DEV === '1' ? '' : '; Secure';
  return `Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

function createSessionCookie(username) {
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Date.now() + MAX_AGE_SECONDS * 1000 })
  ).toString('base64url');
  return `${COOKIE_NAME}=${payload}.${sign(payload)}; ${cookieAttributes(MAX_AGE_SECONDS)}`;
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; ${cookieAttributes(0)}`;
}

function readSession(req) {
  const header = req.headers.cookie || '';
  const match = header.split(';').map((c) => c.trim()).find((c) => c.startsWith(COOKIE_NAME + '='));
  if (!match) return null;

  const [payload, signature] = match.slice(COOKIE_NAME.length + 1).split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    return { username: data.u };
  } catch (e) {
    return null;
  }
}

module.exports = { createSessionCookie, clearSessionCookie, readSession, safeEqual };
