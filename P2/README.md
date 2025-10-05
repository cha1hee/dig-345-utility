# Work Hard Play Hard — Chrome Extension (Manifest V3)

This repository contains a Chrome/Chromium extension designed to help users manage their time and reduce web distractions. It leverages a background service worker, a content script injected into web pages, and a popup user interface.

## Quick Overview

**Manifest**: `manifest.json` (Manifest V3)

**Background**: `js/background.js` (service worker) — persists settings in `chrome.storage.local`

**Content Script**: `js/content.js` (injected into pages)

**Popup UI**: `pages/popup.html` + `pages/popup.js`

## How to Load Locally (Chrome / Edge / Brave)

1. Open your browser and navigate to `chrome://extensions/.`

2. Enable **Developer mode** (toggle in the top-right corner).

3. Click **Load unpacked** and select this project folder (the folder containing `manifest.json`).

4. The extension should appear as **Work Hard Play Hard** and be active.

## Quick Test (Smoke Test)

1. Load the extension as described above.

2. Open any website (e.g., https://example.com).

3. Click the extension icon to open the popup. Change the **Session Time Limit** and **Mode** settings.

4. Open DevTools on the webpage (Cmd+Option+I or Ctrl+Shift+I) and open the extension's service worker console via `chrome://extensions/` → click **Service worker (Inspect)** under the extension.

5. In the service worker console, run:

<pre>```js chrome.storage.local.get(null, console.log);```</pre>

This will output the persisted keys: `storage`, `modes`, `timers`, and `today`.

## Notes About Persistence

- The background service worker persists the following keys in `chrome.storage.local`:

  - `storage` — time limits per domain
  - `modes` — mode settings per domain
  - `timers` — accumulated seconds per domain
  - `today` — day of the month to reset daily timers

The popup and content script communicate with the background service worker via messages. Persistence ensures settings survive service worker unloads and browser restarts.

## Debugging Tips

- **Reload extension:** `Go to chrome://extensions/` → click **Reload** for this extension after editing files.

- **Inspect popup:** Open the popup, then right-click → **Inspect**.

- **Inspect background/service worker:** Go to `chrome://extensions/` → find the extension → click **service worker** under **Inspect views**.

- **Inspect content script:** Open DevTools on any page where the content script is injected.

## Development Notes

- Currently, the extension uses message passing between components. The popup and content scripts use sendMessage and sendResponse to communicate with the background service worker, demonstrating clear message passing logic.

- While directly accessing `chrome.storage` from popup and content scripts could simplify the code and reduce message traffic, this approach highlights inter-component messaging and coordination.

- The content script uses `window.open` to show a "gentle" mode reminder. Popup blockers or cross-origin restrictions may affect this behavior.

## Suggested Next Improvements

- Refactor popup and content scripts to directly access `chrome.storage` for reads and writes, reducing message passing.

- Add unit tests or a test harness to simulate timers for easier development and debugging.
