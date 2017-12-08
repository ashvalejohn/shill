# Shill
A Chrome extension that displays product information listed in the description box of a YouTube video. 

[Download the Chrome Extension](https://chrome.google.com/webstore/detail/shill/ncbganmkllkdoiadgkanolmnnfpkfdei)

### Shill turns this:

![Default YouTube Description Box](http://res.cloudinary.com/ashvalejohn/image/upload/c_scale,w_500/v1512761346/before_ychiyc.png)

### Into this:

![Shill-ified YouTube Description Box](http://res.cloudinary.com/ashvalejohn/image/upload/c_scale,w_500/v1512761346/after_h5uoph.png)

## Features
- Shill is a [page action](https://developer.chrome.com/extensions/pageAction), so it knows when you're on YouTube and searches for links without needing to be told.
- For each link in the description box, Shill sends an XHR request and retrieves product information.
- Shill renders a linked image inside the description box, which makes it easy to find and buy what you're interested in.


## Challenges

### Fetching Product Information
I needed a consistent way to grab relevant product information from each link to display in my card template. I used the [Open Graph Protocol](http://ogp.me/), which is used by social media sites to display previews of linked content. 

```html
<meta property="og:title" content="Dyson Supersonic Hair Dryer with 3 Attachments &amp; Case — QVC.com">
<meta property="og:type" content="product">
<meta property="og:image" content="//images.qvc.com/is/image/a/02/a297602.001">
<meta property="og:price:amount" content="$399.00">
```


### Shortened Links
Most YouTube creators use some kind of shortened or affiliate links in their description boxes. I needed a way to check whether a link was shortened before sending my final request to grab data:

```javascript
function checkForShortURL(url, getProductInfo) {
  let longUrl;
  const xhr = new XMLHttpRequest();
  xhr.open('HEAD', `${url}`, true);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (this.readyState === this.HEADERS_RECEIVED && xhr.getResponseHeader("Refresh")) {
      const refresh = xhr.getResponseHeader("Refresh").split("URL=");
      const newUrl = refresh[1];
      getProductInfo(newUrl, sendProductInfo);
    } else {
      getProductInfo(url, sendProductInfo);
    }
  }
  return longUrl;
}
```
