// get storage from background to refer to checked or unchecked.

const timeEl = document.getElementById("time_limit");
const modeEl = document.getElementById("mode");
var timeLimist = 10;
storing = {};

document.addEventListener("DOMContentLoaded", function () {
  console.log("opened popup");
  // check if time limit has already been set and change element value
  chrome.runtime.sendMessage({ get: "upon open" }, function (response) {
    storing = response.storing;
    if (storing[response.domain]) {
      timeEl.value = parseInt(storing[response.domain]);
    }
  });
  timeEl.addEventListener("change", (event) => {
    chrome.runtime.sendMessage({ click: timeEl.value });
  });
  modeEl.addEventListener("change", (event) => {
    console.log(typeof modeEl.value);
    chrome.runtime.sendMessage({ change: modeEl.value });
  });
});
