let socket = io('http://localhost:3000')
let el;

socket.on('time', (timeString) => {
  el = document.getElementById('server-time');
  el.innerHTML = 'Server time: ' + timeString;
});