import toNumber from 'lodash/toNumber';

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
