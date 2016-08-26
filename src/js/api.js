import axios from 'axios';
import assign from 'lodash/assign';
import map from 'lodash/map';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import pull from 'lodash/pull';
import chunk from 'lodash/chunk';
import take from 'lodash/take';
import { rgbToCie } from './color';

export function getLocalIp() {
  return axios
    .get('https://www.meethue.com/api/nupnp')
    .then(res => {
      if (!res.data.length) {
        return new Error('No Hue bridge found.');
      }

      // This is the local IP address of your Hue bridge box
      const ip = res.data[0].internalipaddress;

      // We will also save the ip in storage for easy lookup later
      localStorage.setItem('hue_ip', ip);

      return ip;
    });
}

export function createUser(ip) {
  return axios
    .post(`http://${ip}/api`, { devicetype: 'netmagazine#mycomputer' })
    .then(res => {
      if (!res.data.length) {
        return new Error('Error creating bridge user.');
      }

      // Hue generates a random username string that we
      // need to save for future API calls
      const username = res.data[0].success.username;

      // We will also save the username in storage for easy lookup later
      localStorage.setItem('hue_username', username);

      return username;
    });
}

export function getRooms() {
  const ip = localStorage.getItem('hue_ip');
  const username = localStorage.getItem('hue_username');

  return axios
    .get(`http://${ip}/api/${username}/groups`)
    .then(res => {
      forEach(res.data, (room, id) => {
        localStorage.setItem(
          `room_${id}_lights`,
          JSON.stringify(room.lights)
        );
      });

      // Hue passes the ID as the object key by default so we assign it
      // to the room object for easier access. Also, we only want groups
      // of the type "Room" for this demonstration.
      return filter(
        map(res.data, (d, id) => assign(d, { id })),
        { type: 'Room' }
      );
    });
}

function setLightColor(id, xy) {
  const ip = localStorage.getItem('hue_ip');
  const username = localStorage.getItem('hue_username');

  return axios
    .put(`http://${ip}/api/${username}/lights/${id}/state`, {
      on: true,
      xy,
    });
}

export function setRoomColor(colors) {
  const room = localStorage.getItem('hue_room');
  const lights = JSON.parse(localStorage.getItem(`room_${room}_lights`));
  const cieColors = map(colors, rgbToCie);
  const apiCalls = [];

  if (lights.length > 3) {
    const primaryChunkSize = Math.floor(lights.length * 0.66);
    const leftoverChunkSize = (lights.length - primaryChunkSize) / 2;
    const primaryChunk = take(lights, primaryChunkSize);

    // Remove primary chunk values
    pull(lights, ...primaryChunk);

    // Create an array of arrays for light ID's
    const chunkedIds = chunk(lights, leftoverChunkSize);

    // Add our primary chunk back into leftover array
    chunkedIds.unshift(primaryChunk);

    forEach(chunkedIds, (group, colorIndex) => {
      forEach(group, id => {
        apiCalls.push(setLightColor(id, cieColors[colorIndex]));
      });
    });
  } else {
    forEach(lights, (id, colorIndex) => {
      apiCalls.push(setLightColor(id, cieColors[colorIndex]));
    });
  }

  return axios.all(apiCalls);
}
