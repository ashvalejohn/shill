console.log("RUN shill.js");
const port = chrome.runtime.connect({name: 'shill'})

// STEP 2
// Grab all links in the #description box
const desc = document.getElementById("description");
const descLinks = Array.from(document.querySelectorAll("#description > a"));
const links = descLinks.map(link => (
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
let cards = [];
port.onMessage.addListener((card) => {
  const cardInfo = {};
  const ogTags = card.metaTags.filter(attrs => attrs.property.includes('og:'));
  ogTags.forEach( tag => {
    if (tag.property === 'og:title') {
        cardInfo['title'] = tag.content;
    } else if (tag.property === 'og:image') {
        cardInfo['img-src'] = tag.content;
    } else if (tag.property === 'og:description') {
      cardInfo['description'] = tag.content;
    }
  });
  console.log(cardInfo);
  // card.map((link) => {
  //   desc.insertAdjacentHTML('afterbegin', `<div>${link.content}</div>`)
  // })
});


// STEP 7
// Display product cards
const cardTemplate = document.createElement('div');

desc.insertAdjacentHTML('afterbegin', "<div id='shill-cards' style='background-color: pink'></div>");
