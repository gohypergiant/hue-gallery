/* global ColorThief */
import md5 from 'md5';
import debounce from 'lodash/debounce';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import isVisible from './visible';

import {
  getLocalIp,
  createUser,
  getRooms,
  setRoomColor,
} from './api';

import {
  printSwatches,
  buildRoomsDropdown,
} from './dom';

const allImages = document.getElementsByTagName('img');
const thief = new ColorThief();
const debounceSpeed = 400;
const colorCache = {};

function getSwatches(key, img) {
  const colors = thief.getPalette(img, 11);
  // TODO only assign a single color to the cache key
  // this will probably be where we add in the algorithm
  colorCache[key] = colors[0]; // hardcoded to first one for now

  printSwatches(colors, img);
  return colorCache[key];
}

function getPalette() {
  forEach(allImages, img => {
    const key = md5(img.getAttribute('src'));

    img.addEventListener('load', e => {
      getSwatches(key, e.target);
    }, false);
  });
}

function getImage() {
  const imgs = filter(allImages, isVisible);

  // Only run when a single image is in view
  if (imgs.length > 1) {
    return;
  }

  const key = md5(imgs[0].getAttribute('src'));

  // Make sure we have the key in our color cache
  if (!{}.hasOwnProperty.call(colorCache, key)) {
    return;
  }

  setRoomColor(colorCache[key]);
}

function hasLocalData() {
  return (
    localStorage.getItem('hue_ip') &&
    localStorage.getItem('hue_username')
  );
}

function setLocalData() {
  return getLocalIp().then(createUser);
}

function init() {
  getRooms()
    .then(buildRoomsDropdown)
    .then(() => {
      // Fire off color thief
      getPalette();

      // Setup scroll handler
      window.addEventListener(
        'scroll',
        debounce(getImage, debounceSpeed),
        false
      );
    })
    .catch(err => console.log(err));
}

if (hasLocalData()) {
  init();
} else {
  if (window.confirm('Please press Link button (large circle) on your Philips Hue bridge box.')) {
    setLocalData()
      .then(init)
      .catch(err => console.log(err));
  }
}

// if (module.hot) {
//   module.hot.accept();
// }
