var storage = {};
var timers = {};
var modes = {};
var currDomain;
var timeLimit;
var newDay;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // request from content and getting current domain
  if (request.domain || request.info) {
    currDomain = request.domain;
    var boolin = false;
    if (storage[currDomain]) {
      boolin = true;
    }
    // reset timers if its a new day
    let now = new Date();
    if (newDay !== now.getDate()) {
      timers = {};
    }
    sendResponse({
      storing: storage,
      domain: currDomain,
      timerBool: boolin,
      allTimers: timers,
      modeStored: modes,
    });
  }
  //  request from popup onload for storage
  if (request.get) {
    sendResponse({ storing: storage, domain: currDomain, modeStored: modes });
  }
  // when the time limit is changed update in storage
  if (request.click) {
    if (request.click > -1) {
      storage[currDomain] = request.click;
      console.log("logging click");
      // if (typeof modes[currDomain] == "undefined") {
      //   modes[currDomain] = "gentle";
      // }
    } else {
      delete storage[currDomain];
      delete modes[currDomain];
    }
  }
  if (request.endTimer) {
    if (storage[request.domain]) {
      timers[request.domain] = request.endTimer;
    }
  }
  // if a timer already exists, add to it, if not make new one (only if forbidden)
  if (request.closing && storage[request.closingDomain]) {
    currDomain = request.closingDomain;
    timers[currDomain] = request.closing;
  }
  // log timer
  if (request.today) {
    newDay = request.today;
  }
  // if mode is changed change in storage
  if (request.change) {
    console.log("logging change");
    modes[currDomain] = request.change;
  }
});
