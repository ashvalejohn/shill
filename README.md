# Shill
Shill is a [Chrome extension](https://developer.chrome.com/extensions) that displays product information listed in the description box of a YouTube video.
![Shill gif](http://res.cloudinary.com/ashvalejohn/image/upload/v1512718487/shill_r2qj2r.gif)

## Functionality & MVP
- [ ] Chrome extension
  - [ ] [Write a manifest](https://developer.chrome.com/extensions/manifest)
- [ ] Knows you're on YouTube
- [ ] Searches description box, send `GET` request to link, return array of href's inside #description
- [ ] Go to each link in the background, check for `<meta property="og:type" name="og:type" content="product">`
  - [ ] Return contents of `og:title, og:image, og:url`
  - [Use open graph protocol metadata](http://ogp.me/)
  - Prioritize links with images
- [ ] Render grid of images using [an iframe](http://jsfiddle.net/yboss/q29tP/)

## Wireframes
### Without Shill
![Shill mockup](http://res.cloudinary.com/ashvalejohn/image/upload/c_scale,h_800/v1512365992/Current_nx6ygu.png)

### With Shill
![Shill mockup](http://res.cloudinary.com/ashvalejohn/image/upload/c_scale,h_800/v1512365992/With_Shill_bp5s0d.png)

## Architecture & Technologies
- Chrome extension
- jQuery (to make GET request to product page)

## Bonus Features
- [ ] Use `og:description`, `<meta itemprop="price">` to include description and price on `:hover`

![Expandable product image](http://res.cloudinary.com/ashvalejohn/image/upload/c_scale,h_800/v1512368686/Bonus_l0yhtv.png)
