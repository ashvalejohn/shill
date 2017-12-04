
// STEP 1
// Check that user is on YouTube
chrome.runtime.onInstalled.addListener(function () {
  console.log("Loaded shill");
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { urlContains: 'www.youtube.com' },
          css: ["#description"]
        })
      ],
      actions: [ new chrome.declarativeContent.ShowPageAction() ]
    }], () => (console.log("On youtube!")));
  });
});

// STEP 2
// Grab all links in the #description box
const desc = window.document;
console.log(desc);

// STEP 3
// Make API calls to each, return og: tag information

// STEP 4
// Display product cards
