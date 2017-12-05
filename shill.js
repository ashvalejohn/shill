console.log("RUNNING shill.js");
const port = chrome.runtime.connect({ name: "shill" });

// STEP 2
// Grab all links in the #description box
// const sendUrls = setTimeout(() => { 
//   const links = Array.from(document.querySelectorAll('#description > a'));
//   const urls = links.map(link => (
//     link.textContent
//   ));

//   // STEP 3
//   // Send URLs to background as message
//   port.postMessage({ urls: urls });
// }, 5000);
const desc = Array.from(document.querySelectorAll("#description > a"));
const links = desc.map(link => (
  link.textContent
));
console.log(links);



// STEP 5
// Display product cards
