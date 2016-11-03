# Hue Gallery Prototype

Check out video of Hue Gallery in action on [YouTube](https://www.youtube.com/watch?v=qOEEHlKU1Fw)

[![Hue Gallery in Action](https://cloud.githubusercontent.com/assets/468093/19956646/0f6589ac-a15d-11e6-80c7-8250f561223c.gif)](https://www.youtube.com/watch?v=qOEEHlKU1Fw)

Learn more about how Hue Gallery works in [Net Magazine’s](http://www.creativebloq.com/net-magazine) December 2016 issue.

### Running Locally
```
$ git clone https://github.com/bpxl-labs/hue-gallery.git
$ cd hue-gallery
$ npm install
$ npm start
```

### TODO
- [x] Cache `color-thief` calls
- [x] Implement an algorithm to get 3 brightest colors
- [x] Convert RGB to CIE 1931 X,Y format for Philips Hue
- [x] Give user control to select which room
- [ ] Improve UX for room selection
- [ ] Improve UX for initial bridge registration
- [ ] Add support for responsive images
- [ ] Save settings on a global or per-site basis

### Future enhancements/questions
- Should Hue Gallery be broken out into its own Chrome extension?
  - What sites should it initially support?
  - How do we handle more than one image in viewport?
  - How do we handle lightbox-style components?

---

Website: [blackpixel.com](https://blackpixel.com) &nbsp;&middot;&nbsp;
GitHub: [@bpxl-labs](https://github.com/bpxl-labs/) &nbsp;&middot;&nbsp;
Twitter: [@blackpixel](https://twitter.com/blackpixel) &nbsp;&middot;&nbsp;
Medium: [@bpxl-craft](https://medium.com/bpxl-craft)
