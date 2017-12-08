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

function parseProductInfo(doc) {
  console.log(doc.querySelectorAll('meta'));
  // let metaTags = [];
  // const meta = doc.querySelectorAll('meta');
  // meta.forEach((tag) => {
  //   if (tag.hasAttribute("property")) {
  //     let props = {}
  //     const attrs = Array.from(tag.attributes);
  //     attrs.map((attr) => {
  //       props[attr.name] = attr.value;
  //     });
  //     metaTags.push(props);
  //   }
}


function checkForShortURL(url, getProductInfo) {
  let longUrl;
  const req = new XMLHttpRequest();
  req.open('HEAD', `${url}`, true);
  req.send();
  req.done = function () {
    if (this.readyState === this.HEADERS_RECEIVED && req.getResponseHeader("Refresh")) {
      const refresh = req.getResponseHeader("Refresh").split("URL=");
      const newUrl = refresh[1];
      // console.log(`HEAD request to ${url} successful. Send GET request to ${newUrl}.`);
      getProductInfo(newUrl);
    } else if (req.status === 200) {
      // console.log(`HEAD request to ${url} failed. Send GET request instead.`);
      getProductInfo(url);
    } else {
      console.log(req.response);
    }
  }
  return longUrl;
}

function getProductInfo(url, parseProductInfo){
  const req = new XMLHttpRequest();
  req.open('GET', `${url}`, true);
  req.response = "document";
  req.send();
  req.done = function () {
    if (req.status === 200) {
      parseProductInfo(req.response);
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