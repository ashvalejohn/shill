// STEP 1
// Open extension if user is on a YouTube page
chrome.runtime.onInstalled.addListener(function () {
  console.log("RUN background.js");
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
chrome.runtime.onConnect.addListener(function (port) {
  console.log(`shill.js started port ${port.name}`);
  port.onMessage.addListener((msg) => (
    msg.urls.map((url) => {
      const req = new XMLHttpRequest();
      req.open('GET', `${url}`, true);
      req.responseType = "document";
      req.onreadystatechange = function () {
        console.log(`Sending request to: ${url}`);
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
          // JSON.parse does not evaluate the attacker's scripts.
          let ogInfo = [];
          const doc = req.response;
          if (doc) {
            const meta = doc.querySelectorAll('meta');
            meta.forEach((tag) => {
              if (tag.hasAttribute("property")) {
                let props = {};
                const attrs = Array.from(tag.attributes);
                attrs.map((attr) => {
                  props[attr.name] = attr.value;
                });
                ogInfo.push(props);
              }
            });
          }
          console.log(ogInfo);
        }
      }
      req.send();
    })
  ));
});