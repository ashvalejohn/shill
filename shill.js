
// STEP 1
// Check that user is on YouTube
const onYouTube = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostEquals: 'www.youtube.com', schemes: ['https'] },
      css: ["#description"]
    })
  ],
  actions: [ new chrome.declarativeContent.showPageAction() ]
}