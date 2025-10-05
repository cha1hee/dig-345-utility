var currDomain;
var timeLimit;

// Keys persisted in chrome.storage.local: { storage: {...}, modes: {...}, timers: {...}, today: <number> }

// Helper to ensure default objects exist
function ensureStorageDefaults(callback) {
  chrome.storage.local.get(
    ["storage", "modes", "timers", "today"],
    function (items) {
      const storage = items.storage || {};
      const modes = items.modes || {};
      const timers = items.timers || {};
      const today = typeof items.today !== "undefined" ? items.today : null;
      callback({ storage, modes, timers, today });
    }
  );
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // we will call sendResponse asynchronously when we use chrome.storage APIs
  // sender may not always be present; handle domain from request
  if (request.domain) currDomain = request.domain;

  // request from content and getting current domain or initial info
  if (request.domain || request.info) {
    ensureStorageDefaults(function (items) {
      const { storage, modes, timers, today } = items;
      var boolin = false;
      if (storage[currDomain]) boolin = true;

      // reset timers if it's a new day (compare with stored 'today')
      let now = new Date();
      if (today !== now.getDate()) {
        // reset persisted timers
        chrome.storage.local.set(
          { timers: {}, today: now.getDate() },
          function () {
            sendResponse({
              storing: storage,
              domain: currDomain,
              timerBool: boolin,
              allTimers: {},
              modeStored: modes,
            });
          }
        );
      } else {
        sendResponse({
          storing: storage,
          domain: currDomain,
          timerBool: boolin,
          allTimers: timers,
          modeStored: modes,
        });
      }
    });
    return true;
  }

  //  request from popup onload for storage
  if (request.get) {
    ensureStorageDefaults(function (items) {
      sendResponse({
        storing: items.storage,
        domain: currDomain,
        modeStored: items.modes,
      });
    });
    return true;
  }

  // when the time limit is changed update in storage
  if (typeof request.click !== "undefined") {
    // get current storage, update then persist
    ensureStorageDefaults(function (items) {
      const storage = items.storage;
      const modes = items.modes;
      if (request.click > -1) {
        if (currDomain) {
          storage[currDomain] = request.click;
          chrome.storage.local.set({ storage: storage }, function () {
            console.log("logging click");
          });
        }
      } else {
        if (currDomain) {
          delete storage[currDomain];
          delete modes[currDomain];
          chrome.storage.local.set(
            { storage: storage, modes: modes },
            function () {
              console.log("removed domain settings");
            }
          );
        }
      }
    });
  }

  if (typeof request.endTimer !== "undefined") {
    // persist timers[request.domain] = request.endTimer
    ensureStorageDefaults(function (items) {
      const timers = items.timers;
      timers[request.domain] = request.endTimer;
      chrome.storage.local.set({ timers: timers }, function () {});
    });
  }

  // if a timer already exists, add to it, if not make new one (only if forbidden)
  if (typeof request.closing !== "undefined" && request.closingDomain) {
    ensureStorageDefaults(function (items) {
      const storage = items.storage;
      const timers = items.timers;
      if (storage[request.closingDomain]) {
        timers[request.closingDomain] = request.closing;
        chrome.storage.local.set({ timers: timers }, function () {});
      }
    });
  }

  // log timer day value
  if (typeof request.today !== "undefined") {
    chrome.storage.local.set({ today: request.today }, function () {});
  }

  // if mode is changed change in storage
  if (typeof request.change !== "undefined") {
    ensureStorageDefaults(function (items) {
      const modes = items.modes;
      if (currDomain) {
        modes[currDomain] = request.change;
        chrome.storage.local.set({ modes: modes }, function () {
          console.log("logging change");
        });
      }
    });
  }
});
