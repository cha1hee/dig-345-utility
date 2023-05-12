// get storage from background to refer to checked or unchecked.

const timeEl = document.getElementById("time_limit");
const modeEl = document.getElementById("mode");
var timeLimist = 10;
storing = {};
modes = {};

document.addEventListener("DOMContentLoaded", function () {
  console.log("opened popup");
  // check if time limit has already been set and change element value
  chrome.runtime.sendMessage({ get: "upon open" }, function (response) {
    storing = response.storing;
    modes = response.modeStored;
    console.log(modes);
    if (storing[response.domain]) {
      timeEl.value = parseInt(storing[response.domain]);
      modeEl.value = modes[response.domain];
    }
  });
  timeEl.addEventListener("change", (event) => {
    console.log(timeEl.value);
    chrome.runtime.sendMessage({ click: timeEl.value });
  });
  modeEl.addEventListener("change", (event) => {
    console.log(modeEl.value);
    chrome.runtime.sendMessage({ change: modeEl.value });
  });
});
