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


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { status: "reload" }, function (response) {
        console.log(response);
      });
    });
  }
});

// Receive messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
  if (request.status === "descriptionLoaded"){
    console.log("Description box is loaded");
    console.log("Request links");
    sendResponse({ status: "fetchLinks" });
  } else if (request.links){
    console.log(`Received ${request.links.length} links`);
    sendResponse({ status: "linksReceived" });
    fetchLinks(request.links);
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
      getProductInfo(newUrl, sendProductInfo);
    } else {
      // console.log(`HEAD request to ${url} failed. Send GET request instead.`);
      getProductInfo(url, sendProductInfo);
    }
  }
  return longUrl;
}

function getProductInfo(url, sendProductInfo){
  const req = new XMLHttpRequest();
  req.open('GET', `${url}`, true);
  req.responseType = "document";
  req.send();
  req.onreadystatechange = function () {
    if (req.response) {
      const metaTags = Array.from(req.response.querySelectorAll('meta'));
      let product = [];

      metaTags.forEach((tag) => {
        if (tag.hasAttribute("property")) {
          let props = {}
          const attrs = Array.from(tag.attributes);
          attrs.map((attr) => {
            props[attr.name] = attr.value;
          });
          product.push(props);
        }
      });

      if (product.length > 0){
        sendProductInfo(product, url);
      }
    }
  }
}

function fetchLinks(links) {
  let productInfo = [];
  links.map((link) => {
    let newUrl = checkForShortURL(link, getProductInfo);
  });
}

function sendProductInfo(product, url) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { card: product, url: url }, function (response) {
      console.log(response.status);
    });
  });
}
