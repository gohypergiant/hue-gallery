// http://stackoverflow.com/a/20283502
export function rgbToCie(rgb) {
  const r = rgb[0];
  const g = rgb[1];
  const b = rgb[2];

  const x = (0.4124 * r) + (0.3576 * g) + (0.1805 * b);
  const y = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
  const z = (0.0193 * r) + (0.1192 * g) + (0.9505 * b);

  return [
    x / (x + y + z),
    y / (x + y + z),
  ];
}
