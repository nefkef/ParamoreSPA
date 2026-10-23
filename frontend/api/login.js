// POST /api/login  { "username": "...", "password": "..." }
// Checks the credentials against the ADMIN_USERNAME and ADMIN_PASSWORD
// environment variables (set in Vercel, never stored in the code).

const { createSessionCookie, safeEqual } = require('../lib/session');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword || !process.env.SESSION_SECRET) {
    return res.status(500).json({ error: 'Login is not configured' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  // Check both values every time, so a wrong username takes as long as a wrong password.
  const userOk = safeEqual(username, expectedUser);
  const passwordOk = safeEqual(password, expectedPassword);

  if (!(userOk && passwordOk)) {
    await wait(700); // slows down password guessing
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.setHeader('Set-Cookie', createSessionCookie(username));
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ loggedIn: true, username });
};
