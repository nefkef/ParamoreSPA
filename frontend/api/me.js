// GET /api/me  tells the page whether the visitor is signed in as admin.

const { readSession } = require('../lib/session');

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  let session = null;
  try {
    session = readSession(req);
  } catch (e) {
    return res.status(500).json({ error: 'Login is not configured' });
  }
  if (!session) return res.status(200).json({ loggedIn: false });
  return res.status(200).json({ loggedIn: true, username: session.username });
};
