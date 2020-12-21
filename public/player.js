const socket = io();

var myCards = [];
var selectedCard;
var boardSelected = false;

const $topZone = document.getElementById("top-zone");
const $cardZone = document.getElementById("card-zone");
const $nextTurn = document.getElementById("next-turn");
const $botZone = document.getElementById("bot-zone");

$botZone.addEventListener("click", (e) => deselect(e));

function swap(array, i, j) {
  [array[i], array[j]] = [array[j], array[i]];
  [array[i].index, array[j].index] = [i, j];
}

document.addEventListener("keydown", (e) => {
  if (e.key.includes("Arrow")) {
    const key = e.key.replace("Arrow", "");
    if (boardSelected) {
      // handle moving board
    } else if (selectedCard !== undefined) {
      // handle organizing cards
      if (key == "Left" && selectedCard > 0) {
        swap(myCards, selectedCard, selectedCard - 1);
        selectedCard--;
        renderCards();
      } else if (key == "Right" && selectedCard < myCards.length - 1) {
        swap(myCards, selectedCard, selectedCard + 1);
        selectedCard++;
        renderCards();
      }
    }
  }
});

const otherPlayerTemplate = document.getElementById("other-player-template")
  .innerHTML;
const cardTemplate = document.getElementById("card-template").innerHTML;

function updateCards(cards) {
  myCards = cards;
  renderCards();
}

function addCard(card) {
  card.index = myCards.length;
  card.selected = false;
  myCards.push(card);
  renderCards();
}

function renderCards() {
  const html = Mustache.render(cardTemplate, { cards: myCards });
  $cardZone.innerHTML = html;
}

function changeSelectedCard(index) {
  if (selectedCard !== undefined) {
    myCards[selectedCard].selected = false;
  }
  selectedCard = index;
  myCards[selectedCard].selected = true;
  renderCards();
}

function deselect(e) {
  if (
    selectedCard !== undefined &&
    ["bot-zone", "card-zone"].includes(e.target.id)
  ) {
    myCards[selectedCard].selected = false;
    selectedCard = undefined;
    renderCards();
  }
}

document.getElementById("take-btn").addEventListener("click", () => {
  socket.emit("takeCard", { id: socket.id, room_id }, addCard);
});

$nextTurn.addEventListener("click", () => {
  socket.emit("nextTurn", room_id);
});

const { username, room: room_id } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("updatePlayerInfo", (players) => {
  //   console.log(players);

  const index = players.findIndex((p) => p.username === username);

  // enable / disable nextTurn button
  if (players[index].turn) {
    $nextTurn.removeAttribute("disabled");
  } else {
    $nextTurn.setAttribute("disabled", "disabled");
  }

  players = players.slice(index + 1).concat(players.slice(0, index));

  const html = Mustache.render(otherPlayerTemplate, { players });
  $topZone.innerHTML = html;
});

socket.emit("join", { username, room_id });
