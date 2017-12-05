// STEP 2
// Grab all links in the #description box
console.log("RUNNING shill.js");

const sendUrls = setTimeout(() => { 
  const links = Array.from(document.querySelectorAll('#description > a'));
  const urls = links.map(link => (
    link.textContent
  ));
  return urls;
}, 5000);

// // STEP 3
// Send URLs to background as message
const port = chrome.runtime.connect({ name: "knockknock" });
port.postMessage({ urls: [sendUrls] });

// STEP 5
// Display product cards
