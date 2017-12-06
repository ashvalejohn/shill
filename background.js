// STEP 1
// Open extension if user is on a YouTube page
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

// STEP 4
// Receive product link URLs, send xhr request for og: tags
chrome.runtime.onConnect.addListener(function(port) {
  console.log(`Open port: ${port.name}`);
  
  port.onMessage.addListener((msg) => {
    console.log(`Received ${msg.urls.length} links from shill.js`);
    
    msg.urls.map((url) => {
      const req = new XMLHttpRequest();
      req.open('GET', `${url}`, true);
      req.responseType = "document";
      req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
          const doc = req.response;
          if (doc) {
            let metaTags = [];
            const meta = doc.querySelectorAll('meta');
            meta.forEach((tag) => {
              if (tag.hasAttribute("property")) {
                let props = {}
                const attrs = Array.from(tag.attributes);
                attrs.map((attr) => {
                  props[attr.name] = attr.value;
                });
                metaTags.push(props);
              }
            });

            // STEP 5
            // Send cardInfo to content_script
            if (metaTags.length > 0) {
              port.postMessage({ metaTags })
            }
          }
        }
      }
      req.send();
    });
  });
});
