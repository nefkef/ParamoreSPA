# Paramore SPA

A bilingual (Greek / English) single-page website about the band Paramore, with a server-side admin login. I first built it for a university web development course and later reworked it: fixed bugs, made it responsive, added the language switch and replaced the original client-side login with a real one.

**Live site:** [paramore-spa.vercel.app](https://paramore-spa.vercel.app)

> Unofficial fan site for learning purposes. It is not affiliated with Paramore, and the photos belong to their respective owners.

## Features

- **Single-page navigation** with URL hashes (`/#biography`, `/#photos` …), so the Back button, refresh and direct links work.
- **Greek / English switch.** The chosen language is remembered in the browser.
- **Responsive layout:** a side menu on desktop and a collapsible top menu on phones.
- **Server-side admin login** built with Vercel serverless functions:
  - Credentials live in environment variables on the server, never in the front-end code.
  - The session is an `HttpOnly`, `Secure`, `SameSite=Strict` cookie signed with HMAC-SHA256, so the browser can't read or change it. It expires after 2 hours.
  - Credentials are compared in constant time, and failed attempts are delayed to slow down guessing.
- **Accessibility:** alt text on images, keyboard focus styles, `aria-current` on the active menu item, `aria-expanded` on the mobile menu.

## Tech stack

HTML, CSS, vanilla JavaScript, Node.js serverless functions on Vercel. No frameworks or dependencies.

## Project structure

```
frontend/
├── index.html      # all page sections, in Greek and English
├── styles.css      # layout, responsive menu, language switch
├── main.js         # navigation, language switch, login calls
├── api/
│   ├── login.js    # POST /api/login: checks credentials, sets the session cookie
│   ├── logout.js   # POST /api/logout: clears the session cookie
│   └── me.js       # GET /api/me: tells the page whether the admin is signed in
├── lib/
│   └── session.js  # signing and checking the session cookie
└── *.jpg, *.webp   # photos
```

## Deploying on Vercel

1. Import the repository in Vercel and set **Root Directory** to `frontend`.
2. In **Settings → Environment Variables**, add:

   | Name | Value |
   | --- | --- |
   | `ADMIN_USERNAME` | the admin username |
   | `ADMIN_PASSWORD` | a strong password |
   | `SESSION_SECRET` | a random string of at least 32 characters |

3. Redeploy. Without these variables, the site still works and the login shows "not available".

## What I changed from the course version

- Fixed a JavaScript error on every page load (`disconnectButton is not defined`).
- Replaced the hard-coded username and password in `main.js` with a server-side login.
- Made the layout responsive and fixed the home image overflowing the screen.
- Fixed invalid HTML, Windows-style file paths (`.\file`) and the web font that was never loaded.
- Corrected facts and typos in the biography and discography, and added the English version.
