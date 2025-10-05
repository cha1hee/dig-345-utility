Work Hard Play Hard — Extension (Manifest V3)

This repository contains a Chrome/Chromium extension that helps users manage time and reduce web distractions. It uses a background service worker, a content script injected into pages, and a popup UI.

Quick status
- Manifest: `manifest.json` (Manifest V3)
- Background: `js/background.js` (service worker) — now persists settings in `chrome.storage.local`
- Content script: `js/content.js` (injected into pages)
- Popup: `pages/popup.html` + `pages/popup.js`

How to load locally (Chrome / Edge / Brave)
1. Open Chrome and navigate to chrome://extensions/.
2. Enable "Developer mode" (top-right).
3. Click "Load unpacked" and select this project folder (the folder that contains `manifest.json`).
4. The extension should appear as "Work Hard Play Hard" and be active.

Quick test (smoke test)
1. Load the extension as above.
2. Open any website (e.g., https://example.com).
3. Click the extension icon to open the popup. Change "Session Time Limit" and "Mode".
4. Open DevTools for the page (Cmd+Option+I) and the extension service worker (via chrome://extensions/ -> "Service worker (Inspect)").
5. In the service worker console run:

```
chrome.storage.local.get(null, console.log);
```

This prints persisted `storage`, `modes`, `timers`, and `today` keys.

Notes about persistence
- The background now persists three keys in `chrome.storage.local`: `storage` (time limits per domain), `modes` (mode per domain), and `timers` (accumulated seconds per domain), plus `today` (day-of-month to reset daily timers).
- The popup and content script still communicate via messages to the background. Persistence means settings survive service worker unloads and browser restarts.

Debugging tips
- Reload extension: chrome://extensions/ -> Click "Reload" for this extension after editing files.
- Inspect popup: open the popup and right-click -> Inspect.
- Inspect background/service worker: chrome://extensions/ -> find the extension -> click "service worker" under "Inspect views".
- Inspect content script: open DevTools for any page where the content script runs.

Development notes
- The extension currently uses message passing; to reduce messages you could read/write `chrome.storage` directly from the popup and content scripts.
- The extension uses `window.open` in the content script for the "gentle" mode reminder. Popup blockers or cross-origin policies may affect behavior.

Next improvements (suggested)
- Move popup and content script to use `chrome.storage` directly for reads/writes.
- Add unit tests or a small harness to simulate timers for easier development.

If you'd like, I can update `pages/popup.js` and `js/content.js` to read/write `chrome.storage` directly (I'll make that change and run quick smoke checks).
