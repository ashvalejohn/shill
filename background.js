// STEP 1: Open extension if user is on a YouTube page
  const onYouTube = [
    {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { urlContains: 'www.youtube.com' },
          css: ["#description"]
        })
      ],
      actions: [
        new chrome.declarativeContent.ShowPageAction(),
        new chrome.declarativeContent.RequestContentScript({ "js": ["shill.js"] })
      ]
    }
  ];

  chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
      chrome.declarativeContent.onPageChanged.addRules(onYouTube);
    });
  });

// Receive message that description is loaded
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
  if (request.status === "descriptionLoaded"){
    console.log("Description box is loaded");
    console.log("Request links");
    sendResponse({ status: "grabLinks" });
  } else if (request.links){
    console.log("Received links");
    console.log(request.links);
    sendResponse({ status: "linksReceived" });
  }
});

 
// Send message to content_script.js to grab description links
    // chrome.tabs.executeScript({ file: "shill.js" }, function(){
    //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, { status: "grabLinks" }, function (response) {
    //       console.log(response.links);
    //     });
    //   });
    // })



// STEP 4
// Receive product link URLs, send xhr request for og: tags
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.links === )
//   port.onMessage.addListener((msg) => {
//     console.log(`Received ${msg.urls.length} links from shill.js`);

//     msg.urls.map((url) => {
//       const req = new XMLHttpRequest();
//       req.open('HEAD', `${url}`, true);
//       console.log(req);
//       req.onload = function () {
//         console.log(req.response;)
//       });
//       req.send();
//     });
//   });
