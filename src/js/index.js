/* global ColorThief */
import md5 from 'md5';
import throttle from 'lodash/throttle';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import isVisible from './visible';

import {
  getLocalIp,
  createUser,
  getRooms,
  setRoomColor,
} from './api';

const thief = new ColorThief();
const throttleSpeed = 400;
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
  const roomsList = document.createDocumentFragment();
  const container = document.getElementById('rooms-container');
  const roomsDropdown = document.createElement('select');
  roomsDropdown.setAttribute('id', 'rooms-dropdown');

  // By default we want to set first value as current room
  localStorage.setItem('hue_room', rooms[0].id);

  forEach(rooms, room => {
    const option = document.createElement('option');
    option.textContent = room.name;
    option.setAttribute('value', room.id);
    roomsList.appendChild(option);
  });

  roomsDropdown.appendChild(roomsList);
  container.appendChild(roomsDropdown);

  roomsDropdown.addEventListener('change', e => {
    localStorage.setItem('hue_room', e.target.value);
  }, false);
}

function getImage() {
  const img = filter(allImages, isVisible);

  if (img.length > 1) {
    return;
  }

  const key = md5(img[0].getAttribute('src'));
  setRoomColor(colorCache[key][0]);
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
        throttle(getImage, throttleSpeed),
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
