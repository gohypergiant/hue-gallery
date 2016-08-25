import forEach from 'lodash/forEach';

export function printSwatches(colors, img) {
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

export function buildRoomsDropdown(rooms) {
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
