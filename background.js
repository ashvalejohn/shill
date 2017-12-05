
// STEP 1
// Check that user is on YouTube
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
      actions: [ new chrome.declarativeContent.ShowPageAction() ]
    }]);
  });
});


// STEP 4
// Receive product link URLs, send AJAx request for og: tags