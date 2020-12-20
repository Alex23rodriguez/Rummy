const socket = io();

var myCards = [];

function updateCards(cards) {
  console.log("received card");
  myCards = cards;
}

document.getElementById("takeBtn").addEventListener("click", () => {
  socket.emit("takeCard", { username, room }, updateCards);
});

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("playerCountChange", (players) => {
  console.log("a player has joined or left");
  console.log(players);
});

socket.emit("join", { username, room });
