let tags = []

let tagsEle = document.getElementById('tags')

const socket = io('http://localhost:3000')       

socket.on("connect", () => {
    console.log("Connected to server");
    [...tagsEle.children].map((item) =>{
        socket.emit("addTag", { name: item.dataset.tag, ioTag: item.dataset.io_tag})
        socket.on(item.dataset.io_tag, (data) => {item.textContent = data.val});
    })
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

socket.on("server_message", (data) => {
    console.log("Received server message:", data.message);
  });

// socket.on("tag-1", (data) => {
//     console.log("tag1:", data.message);
// });

