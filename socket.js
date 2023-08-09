// const socket = io('https://ddtsocketserver.herokuapp.com/')
const socket = io('http://localhost:3000')
// const socket = io()

tags = document.getElementById('tags');

Array.from(tags.children).map((tag, index) => socket.on(tag.dataset.name, data => tag.textContent = data));

// socket.on('2400-HSO-2153', data => console.log(data));

socket.on('time', (timeString) => {
    el = document.getElementById('server-time');
    el.innerHTML = 'Server time: ' + timeString;
    console.log('Server time: ' + timeString);
    
  });

