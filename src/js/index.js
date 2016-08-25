/* global ColorThief */
import md5 from 'md5';
import Blazy from 'blazy';
import throttle from 'lodash/throttle';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import isVisible from './visible';

const allImages = document.getElementsByTagName('img');

const blazy = new Blazy(); // eslint-disable-line
const thief = new ColorThief();
const throttleSpeed = 200;
const colorCache = {};

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

forEach(allImages, img => {
  const key = md5(img.getAttribute('src'));

  img.addEventListener('load', e => {
    getSwatches(key, e.target);
  }, false);
});

function getImage() {
  console.log(filter(allImages, isVisible));
}

window.addEventListener('scroll', throttle(getImage, throttleSpeed), false);

if (module.hot) {
  module.hot.accept();
}
