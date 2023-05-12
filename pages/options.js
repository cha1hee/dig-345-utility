const inDescription = document.getElementById("description");
const changed = document.getElementById("mode");

const descriptions = [
  { gentleReminder: `<h1>This is gentle</h1>` },
  { danger: `<h1>This is danger</h1>` },
  { passiveAggressive: `<h1>This is passive aggressive</h1>` },
];

changed.addEventListener("change", (event) => {
  var formVal = changed.value;
  if (formVal == "gentle") {
    $("#description").html(descriptions.gentleReminder);
    chrome.runtime.sendMessage({ mode: "gentle" });
  }
  if (formVal == "danger") {
    chrome.runtime.sendMessage({ mode: "danger" });
  }
  if (formVal == "p-a") {
    chrome.runtime.sendMessage({ mode: "p-a" });
  }
});

inDescription.addEventListener("click", function () {});
