export default function isVisible(el) {
  const { bottom, top } = el.getBoundingClientRect();

  return (
    bottom > 0 &&
    top < window.innerHeight
  );
}
