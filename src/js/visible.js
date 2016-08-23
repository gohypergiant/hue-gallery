export default function isVisible(el) {
  const { right, bottom, top, left } = el.getBoundingClientRect();
  const vWidth = window.innerWidth;
  const vHeight = window.innerHeight;

  return (
    right > 0 &&
    bottom > 0 &&
    left < vWidth &&
    top < vHeight
  );
}
