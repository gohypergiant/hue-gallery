/* global ColorThief */
import md5 from 'md5';
import Blazy from 'blazy';
import debounce from 'lodash/debounce';
import forEach from 'lodash/forEach';
import getImages from './crawl';

import {
  getLocalIp,
  createUser,
  getRooms,
} from './api';

const blazy = new Blazy(); // eslint-disable-line
const thief = new ColorThief();
const debounceSpeed = 250;
const colorCache = {};

const colorBoxes = document.querySelectorAll('.Colorbox-swatch');

function isLoaded(el) {
  return el.complete && el.naturalHeight !== 0;
}

function getSwatches(key, img) {
  if (!colorCache[key]) {
    const colors = thief.getPalette(img, 2);
    colorCache[key] = colors;
  }

  return colorCache[key];
}

function setColorboxes(swatches) {
  forEach(swatches, (swatch, i) => {
    colorBoxes[i].style.backgroundColor = `rgb(${swatch[0]}, ${swatch[1]}, ${swatch[2]})`;
  });
}

function createColors() {
  const images = getImages();

  // We do not want to trigger a recolor if two images are visable at a time
  if (images.length > 1) {
    return;
  }

  forEach(images, img => {
    let swatches = null;
    let key = null;

    if (isLoaded(img)) {
      key = md5(img.getAttribute('src'));
      swatches = getSwatches(key, img);
      setColorboxes(swatches);
    } else {
      img.addEventListener('load', e => {
        const el = e.target;
        key = md5(el.getAttribute('src'));
        swatches = getSwatches(key, el);
        setColorboxes(swatches);
      }, false);
    }
  });
}

function init() {
  getLocalIp()
    .then(createUser)
    .then(getRooms)
    .then(() => {
      // Fire off color thief
      createColors();

      // Setup scroll handler
      window.addEventListener(
        'scroll',
        debounce(createColors, debounceSpeed),
        false
      );
    })
    .catch(err => console.log(err));
}

if (window.confirm('Please press Link button (large circle) on your Philips Hue bridge box.')) {
  init();
}

// if (module.hot) {
//   module.hot.accept();
// }
