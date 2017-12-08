console.log("RUN shill.js");
let pageStatus = "default";

chrome.runtime.sendMessage({ status: "descriptionLoaded" }, function (response) {
  pageStatus = response.status;
  checkStatus();
});

function checkStatus(){
  switch(pageStatus) {
    case "fetchLinks":
      console.log("Calling fetchLinks()");
      fetchLinks();
    case "linksReceived":
      console.log("Background received links");
    default:
      null;
  }
}

function fetchLinks(){
  const desc = document.getElementById("description");
  desc.insertAdjacentHTML('afterbegin', "<div id='shill-cards'></div>");

  document.querySelector('head').insertAdjacentHTML('afterbegin', `<link rel='stylesheet' type='text/css' href='${chrome.runtime.getURL("shill-style.css")}'>`);

  const descLinks = Array.from(document.querySelectorAll("#description > a"));

  const links = descLinks.map(link => (
    link.textContent
  ));
  
  chrome.runtime.sendMessage({ links: links }, function (response) {
    pageStatus = response.status;
    checkStatus();
  });
}

// // STEP 6
// // Receive card information
// port.onMessage.addListener((card) => {
//   const cardInfo = {
//     description: '',
//   };

//   const ogTags = card.metaTags.filter(attrs => attrs.property.includes('og:'));

//   ogTags.forEach(tag => {
//     if (tag.property === 'og:title') {
//       if (tag.content !== undefined) {
//         cardInfo['title'] = tag.content;
//       }
//     } else if (tag.property === 'og:image') {
//       if (tag.content.slice(0, 4) === 'http') {
//         cardInfo['imgSrc'] = tag.content;
//       }
//     } else if (tag.property === 'og:description') {
//       if (tag.content !== undefined) {
//         cardInfo['description'] = tag.content;
//       }
//     }
//   });


//   if (cardInfo.imgSrc === undefined || cardInfo.imgSrc === '') {
//     console.log('Card missing information')
//   } else {
//     // STEP 7
//     // Display product card
//     const shillCards = document.getElementById('shill-cards');
//     shillCards.insertAdjacentHTML('afterbegin', `<div class='shill-card'><a class='shill-card-img' href='${card.url}' target='_blank' style="background-image: url('${cardInfo.imgSrc}')" alt='${cardInfo.title}'></a><a href='${card.url}'><h1 class='shill-title'>${cardInfo.title}</h1></a><p class='shill-description'>${cardInfo.description}</p></div>`);
//   }
// });


