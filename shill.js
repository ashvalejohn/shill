console.log("RUN shill.js");

chrome.runtime.sendMessage({ status: "descriptionLoaded" }, function (response) {
  fetchLinks();
});

function fetchLinks(){
  console.log("fetching links");
  const desc = document.getElementById("description");
  const head = document.querySelector('head');
  desc.insertAdjacentHTML('afterbegin', "<div id='shill-cards'></div>");
  head.insertAdjacentHTML('afterbegin', `<link rel='stylesheet' type='text/css' href='${chrome.runtime.getURL("shill-style.css")}'>`);

  const descLinks = Array.from(document.querySelectorAll("#description > a"));
  const links = descLinks.map(link => (
    link.textContent
  ));
  
  chrome.runtime.sendMessage({ links: links }, function (response) {
  });
}

// Message Listeners
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.status === "reload") {
        sendResponse({ status: "Content Script should reload"})
        reloadCards();
      } else {
        sendResponse({ status: "Content Script received cards" });
        renderCards(request);
      }
    }
  );

function renderCards(request) {
  let renderedUrls = {};
  if (renderedUrls[request.url] === undefined) {
    renderedUrls[request.url] = true;
    const ogTags = request.card.filter((attrs) => attrs.property.includes("og:"));
    const cardInfo = {
      url: request.url,
      title: '',
      description: '',
      price: '',
      currency: '',
      type: '',
      imgSrc: ''
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
    const template = `<a class='shill-card' href='${cardInfo.url}' target='_blank' style="background-image: url('${cardInfo.imgSrc}')" alt='${cardInfo.title}'><div class='shill-info'><h1 class='shill-title'>${cardInfo.title}</h1></div></a>`;
    console.log("**********");
    console.log(cardInfo);
    if (cardInfo.imgSrc === undefined || cardInfo.imgSrc === '' || cardInfo.type === "yt-fb-app:channel" || cardInfo.type === "profile" || cardInfo.title === "Pinterest" || cardInfo.title.includes("404") || cardInfo.url === undefined || cardInfo.url.includes("outube") || cardInfo.imgSrc.includes("stagram") || cardInfo.url.includes("acebook") || cardInfo.title === '' || cardInfo.url.includes("blog")) {
      console.log('Card missing information, non-product');
    }
    else {
      // console.log(cardInfo);
      shillCards.insertAdjacentHTML('afterbegin', template);
    }
  } else {
    console.log("Link already on page");
  }
}

function reloadCards(fetchLinks) {
  const cards = document.getElementById('shill-cards');
  cards.innerHTML = '';
  if (cards.innerHTML = ''){
    console.log('desc is empty, ready to fetch')
    chrome.runtime.sendMessage({ status: "descriptionLoaded" }, function (response) {
      fetchLinks();
    });
  }
}