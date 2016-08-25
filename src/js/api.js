import axios from 'axios';

export function getLocalIp() {
  return axios
    .get('https://www.meethue.com/api/nupnp')
    .then(res => {
      if (!res.data.length) {
        return new Error('No Hue bridge found.');
      }

      const ip = res.data[0].internalipaddress;

      // Save in storage for easy lookup
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

      const username = res.data[0].success.username;

      // Save in storage for easy lookup
      localStorage.setItem('hue_username', username);
      return username;
    });
}

export function getRooms() {
  const ip = localStorage.getItem('hue_ip');
  const username = localStorage.getItem('hue_username');

  console.log(ip);
  console.log(username);

  return axios
    .post(`http://${ip}/api/${username}/groups`)
    .then(res => {
      if (!res.data.length) {
        return new Error('No groups / rooms found.');
      }

      console.log(res);
      return res.data;
    });
}
