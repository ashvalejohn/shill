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

// Receive messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
  if (request.status === "descriptionLoaded"){
    console.log("Description box is loaded");
    console.log("Request links");
    sendResponse({ status: "fetchLinks" });
  } else if (request.links){
    console.log("Received links");
    sendResponse({ status: "linksReceived" });
    fetchProductInfo(request.links);
  }
});

function checkForShortURL(url, getProductInfo) {
  let longUrl;
  const xhr = new XMLHttpRequest();
  xhr.open('HEAD', `${url}`, true);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (this.readyState === this.HEADERS_RECEIVED && xhr.getResponseHeader("Refresh")) {
      const refresh = xhr.getResponseHeader("Refresh").split("URL=");
      const newUrl = refresh[1];
      // console.log(`HEAD request to ${url} successful. Send GET request to ${newUrl}.`);
      getProductInfo(newUrl);
    } else {
      // console.log(`HEAD request to ${url} failed. Send GET request instead.`);
      getProductInfo(url);
    }
  }
  return longUrl;
}

function getProductInfo(url){
  const req = new XMLHttpRequest();
  req.open('GET', `${url}`, true);
  req.responseType = "document";
  req.send();
  req.onreadystatechange = function () {
    if (req.response) {
      console.log(req.response.querySelectorAll('meta'));
    }
  }
}



function fetchProductInfo(links) {
  let productInfo = [];
  console.log(links);
  links.map((link) => {
    let newUrl = checkForShortURL(link, getProductInfo);
  });
}

function sendProductInfo(info){
  // console.log(info);
}