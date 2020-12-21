const socket = io();

var myCards = [];

const $topZone = document.getElementById("top-zone");
const $cardZone = document.getElementById("card-zone");

const otherPlayerTemplate = document.getElementById("other-player-template")
  .innerHTML;
const cardTemplate = document.getElementById("card-template").innerHTML;

function updateCards(cards) {
  console.log("Cards changed");
  myCards = cards;

  const html = Mustache.render(cardTemplate, { cards });
  $cardZone.innerHTML = html;
}

document.getElementById("takeBtn").addEventListener("click", () => {
  socket.emit("takeCard", { id: socket.id, room }, updateCards);
});

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("updatePlayerInfo", (players) => {
  console.log(players);

  const index = players.findIndex((p) => p.username === username);

  players = players.slice(index + 1).concat(players.slice(0, index));

  const html = Mustache.render(otherPlayerTemplate, { players });
  $topZone.innerHTML = html;
});

socket.emit("join", { username, room });
