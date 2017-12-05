// STEP 1
// Open extension if user is on a YouTube page
chrome.runtime.onInstalled.addListener(function () {
  console.log("RUNNING background.js");

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { urlContains: 'www.youtube.com' },
          css: ["#description"]
        })
      ],
      actions: [ new chrome.declarativeContent.ShowPageAction(), 
      new chrome.declarativeContent.RequestContentScript( { "js": ["shill.js"] }) ]
    }]);
  });
});

// STEP 4
// Receive product link URLs, send xhr request for og: tags
let urls = [];

chrome.runtime.onConnect.addListener(function (port) {
  console.log(port.name);
  port.onMessage.addListener(function (msg) {
    urls = msg;
  });

  console.log(urls);

  // const xhr = new XMLHttpRequest();
  // xhr.open('GET', 'http://api.example.com/data.json', true);
  // xhr.onreadystatechange = function () {
  //   if (xhr.readyState == 4) {
  //     // JSON.parse does not evaluate the attacker's scripts.
  //     var resp = JSON.parse(xhr.responseText);
  //   }
  // }
  // xhr.send();
});