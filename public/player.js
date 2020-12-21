const socket = io();

var myCards = [];

const $otherPlayers = document.getElementById("top-zone");

const otherPlayerTemplate = document.getElementById("other-player-template")
  .innerHTML;

function updateCards(cards) {
  console.log("received card");
  myCards = cards;
}

document.getElementById("takeBtn").addEventListener("click", () => {
  socket.emit("takeCard", { id: socket.id, room }, updateCards);
});

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("updatePlayerInfo", (players) => {
  //   console.log(players);

  const index = players.findIndex((p) => p.username === username);

  players = players.slice(index + 1).concat(players.slice(0, index));

  const html = Mustache.render(otherPlayerTemplate, { players });
  $otherPlayers.innerHTML = html;
});

socket.emit("join", { username, room });
