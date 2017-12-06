console.log("RUN shill.js");
const port = chrome.runtime.connect({name: 'shill'})
const desc = document.getElementById("description");
// const shillStyle = chrome.runtime.getURL;
document.querySelector('head').insertAdjacentHTML('afterbegin', `<link rel='stylesheet' type='text/css' href='${chrome.runtime.getURL("shill-style.css")}'>`);

// STEP 2
// Grab all links in the #description box
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
port.onMessage.addListener((card) => {
  const cardInfo = {};
  const ogTags = card.metaTags.filter(attrs => attrs.property.includes('og:'));

  ogTags.forEach( tag => {
    if (tag.property === 'og:title') {
        cardInfo['title'] = tag.content;
    } else if (tag.property === 'og:image') {
        cardInfo['imgSrc'] = tag.content;
    } else if (tag.property === 'og:description') {
      cardInfo['description'] = tag.content;
    }
  });

  desc.insertAdjacentHTML('afterbegin', `<div class='shill-card'><img src='${cardInfo.imgSrc}'<h1>${cardInfo.title}</h1><p>${cardInfo.description}</p></div>`);
});



// STEP 7
// Display product cards
const cardTemplate = document.createElement('div');
