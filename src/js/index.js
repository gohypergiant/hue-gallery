/* global ColorThief */
import md5 from 'md5';
import Blazy from 'blazy';
import throttle from 'lodash/throttle';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import isVisible from './visible';

import {
  getLocalIp,
  createUser,
  getRooms,
} from './api';

const blazy = new Blazy(); // eslint-disable-line
const thief = new ColorThief();
const throttleSpeed = 200;
const colorCache = {};

const allImages = document.getElementsByTagName('img');

function printSwatches(colors, img) {
  const elSwatchBox = document.createElement('div');
  elSwatchBox.classList.add('SwatchBox');
  img.parentNode.appendChild(elSwatchBox);

  forEach(colors, color => {
    const elSwatch = document.createElement('div');
    elSwatch.classList.add('Swatch');
    elSwatch.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]}`;
    elSwatchBox.appendChild(elSwatch);
  });
}

function getSwatches(key, img) {
  const colors = thief.getPalette(img, 11);
  colorCache[key] = colors;

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

function buildRoomsDropdown(rooms) {
  const container = document.getElementById('rooms-container');

  let roomsDropdown = '<select id="rooms-dropdown">';
  // cycle through rooms and add as options
  roomsDropdown += '</select>';

  container.appendChild(roomsDropdown);
  // TODO add select change event to save current room to session storage
}

function getImage() {
  console.log(filter(allImages, isVisible));
}

function setSessionData() {
  return getLocalIp()
    .then(createUser);
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
        throttle(getImage, throttleSpeed),
        false
      );
    })
    .catch(err => console.log(err));
}

if (sessionStorage.getItem('hue_ip') && sessionStorage.getItem('hue_username')) {
  init();
} else {
  if (window.confirm('Please press Link button (large circle) on your Philips Hue bridge box.')) {
    setSessionData()
      .then(init)
      .catch(err => console.log(err));
  }
}

// if (module.hot) {
//   module.hot.accept();
// }
