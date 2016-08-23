import filter from 'lodash/filter';
import isVisible from './visible';

export default function getImages() {
  return filter(
    document.getElementsByTagName('img'),
    isVisible
  );
}
