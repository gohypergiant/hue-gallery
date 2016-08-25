import toNumber from 'lodash/toNumber';
import map from 'lodash/map';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';

// http://stackoverflow.com/a/36061908
export function rgbToCie(rgb) {
  const red = rgb[0];
  const green = rgb[1];
  const blue = rgb[2];

  const r = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
  const g = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
  const b = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);

  const x = (0.664511 * r) + (0.154324 * g) + (0.162028 * b);
  const y = (0.283881 * r) + (0.668433 * g) + (0.047685 * b);
  const z = (0.000088 * r) + (0.072310 * g) + (0.986039 * b);

  return [
    toNumber((x / (x + y + z)).toPrecision(4)),
    toNumber((y / (x + y + z)).toPrecision(4)),
  ];
}

// http://stackoverflow.com/a/9493060
function rgbToHsl(rgb) {
  const red = rgb[0];
  const green = rgb[1];
  const blue = rgb[2];

  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;

    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [h, s, l];
}

function lightnessFilter(colors) {
  return filter(colors, c => (c[1] * 100) > 20);
}

function saturationSort(colors) {
  return sortBy(colors, c => -c[1]);
}

export function colorAlgorithm(colors) {
  const hslColors = map(colors, rgbToHsl);
  const filteredAndSortedColors = saturationSort(lightnessFilter(hslColors));
  console.log(filteredAndSortedColors);

  // TODO switch values back to RGB
  return filteredAndSortedColors;
}
