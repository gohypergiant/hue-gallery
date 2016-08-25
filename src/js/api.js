import axios from 'axios';
import assign from 'lodash/assign';
import map from 'lodash/map';
import filter from 'lodash/filter';
import convert from 'color-convert';
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
    .then(res => filter(
      // Hue passes the ID as the object key by default so we assign it
      // to the room object for easier access. Also, we only want groups
      // of the type "Room" for this demonstration.
      map(res.data, (d, id) => assign(d, { id })),
      { type: 'Room' }
    ));
}

export function setRoomColor(rgb) {
  const ip = localStorage.getItem('hue_ip');
  const username = localStorage.getItem('hue_username');
  const room = localStorage.getItem('hue_room');
  const hsl = convert.rgb.hsl(rgb);
  const xy = rgbToCie(rgb);

  console.log(xy);

  return axios
    .put(`http://${ip}/api/${username}/groups/${room}/action`, {
      on: true,
      hue: hsl[0],
      sat: hsl[1],
      bri: hsl[2],
      xy,
    })
    .then(res => console.log(res));
}
