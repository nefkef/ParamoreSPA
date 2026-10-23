// POST /api/logout  ends the admin session by clearing the cookie.

const { clearSessionCookie } = require('../lib/session');

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.setHeader('Set-Cookie', clearSessionCookie());
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ loggedIn: false });
};
