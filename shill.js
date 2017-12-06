console.log("RUN shill.js");
const port = chrome.runtime.connect({name: 'shill'})

// STEP 2
// Grab all links in the #description box
const desc = Array.from(document.querySelectorAll("#description > a"));
const links = desc.map(link => (
  link.textContent
));
if(links){
  console.log("shill.js grabbed links from description");
}


// STEP 3
// Send URLs to background as message
port.postMessage({ urls: links });

// STEP 6
// Receive card information
port.onMessage.addListener((cards) => {
  console.log(cards);
});


// STEP 7
// Display product cards
