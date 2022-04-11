const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("room_enter", { payload: input.value }, (msg) => console.log(`backend says: ${msg}`));
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);