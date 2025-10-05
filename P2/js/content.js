var timer = 0;
var storage = {};
var timers = {};
var modes = {};
var limit;

chrome.runtime.sendMessage({ info: "pls send info" }, function (response) {
  checkDomain();
  // if allTimers isn't an empty object then check if timer exists
  if (Object.keys(response.allTimers).length !== 0) {
    timers = response.allTimers;
    // check for existing for timer from background
    if (timers[currDomain]) {
      timer = timers[currDomain];
    }
  }
});

setInterval(function () {
  // if on page and the page isn't undefined
  if (document.hasFocus() && typeof window.location.href !== "undefined") {
    checkDomain();
    //get storage info first and send current state
    chrome.runtime.sendMessage({ domain: currDomain }, function (response) {
      storage = response.storing;
      modes = response.modeStored;
      //if timer of forbidden page already exists, add to it
      // if forbidden page, turn timer on
      if (response.timerBool == true) {
        timer++;
        let date = new Date();
        chrome.runtime.sendMessage({
          closing: timer,
          closingDomain: currDomain,
          today: date.getDate(),
        });
        limit = response.storing[currDomain];
        if (timer / 60 > limit) {
          if (modes[currDomain] == "gentle") {
            gentlePopup();
          }
          if (modes[currDomain] == "danger") {
            var ofs = 0;
            makeRec();
            let onPage = document.getElementById("over");
            window.setInterval(function () {
              onPage.style.background =
                "rgba(255,0,0," + Math.abs(Math.sin(ofs)) + ")";
              ofs += 0.01;
            }, 10);
          }
          if (modes[currDomain] == "pasagg") {
            close();
          }
        }
      }
    });
  }
}, 1000);

function checkDomain() {
  const currHREF = window.location.href;
  const url = new URL(currHREF);
  currDomain = url.hostname;
}

//create overlay
function makeRec() {
  var canvas = document.createElement("canvas"); //Create a canvas element
  canvas.id = "over";
  //Set canvas width/height
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  //Position canvas
  canvas.style.position = "absolute";
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.zIndex = 100000;
  canvas.style.pointerEvents = "none"; //Make sure you can click 'through' the canvas
  document.body.appendChild(canvas); //Append canvas to body element
}
//create new popup
function gentlePopup() {
  popupWindow = window.open(
    "https://cha1hee.github.io/DIG345UtilityExtensionPopup/",
    "popUpWindow",
    "height=300,width=900,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes"
  );
}
