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
    case "productInfoReceived":
      console.log("Product info received");
    default:
      null;
  }
}

function fetchLinks(){
  const desc = document.getElementById("description");
  const head = document.querySelector('head');
  desc.insertAdjacentHTML('afterbegin', "<div id='shill-cards'></div>");
  head.insertAdjacentHTML('afterbegin', `<link rel='stylesheet' type='text/css' href='${chrome.runtime.getURL("shill-style.css")}'>`);

  const descLinks = Array.from(document.querySelectorAll("#description > a"));
  const links = descLinks.map(link => (
    link.textContent
  ));
  
  chrome.runtime.sendMessage({ links: links }, function (response) {
    pageStatus = response.status;
    checkStatus();
  });
}


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    sendResponse({ status: "Content Script received cards" });
    // console.log("******");
    console.log(request.card);
    const ogTags = request.card.filter((attrs) => attrs.property.includes("og:"));
      
    const cardInfo = {
      description: '',
      price: '',
      currency: '',
      type: '',
    };

    ogTags.forEach(tag => {
      if (tag.property === 'og:title') {
        if (tag.content !== undefined) {
          cardInfo['title'] = tag.content;
        }
      } else if (tag.property === 'og:image') {
        if (tag.content.slice(0, 4) === 'http') {
          cardInfo['imgSrc'] = tag.content;
        }
      } else if (tag.property === 'og:description') {
        if (tag.content !== undefined) {
          cardInfo['description'] = tag.content;
        }
      } else if (tag.property === 'og:price:amount') {
        cardInfo['price'] = tag.content;
      } else if (tag.propery === 'og:price:currency') {
        cardInfo['currency'] = tag.content;
      } else if (tag.property === 'og:type') {
        cardInfo['type'] === tag.content;
      }
    });
    
    const shillCards = document.getElementById('shill-cards');
    const template = `<a class='shill-card' href='${request.card.url}' target='_blank' style="background-image: url('${cardInfo.imgSrc}')" alt='${cardInfo.title}'><div class='shill-info'><h1 class='shill-title'>${cardInfo.title}</h1></div></a>`;

    if (cardInfo.imgSrc === undefined || cardInfo.imgSrc === '' ||cardInfo.type === "yt-fb-app:channel" || cardInfo.type === "profile" || cardInfo.title === "Pinterest") {
      console.log('Card missing information, non-product');
    }
    else {
      console.log(cardInfo);
      shillCards.insertAdjacentHTML('afterbegin', template);
    }
  });


