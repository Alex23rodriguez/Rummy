const socket = io();

const { username, room: room_id } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const myCards = [];
var selectedCard;
var isMyTurn = false;
var _hasMoved = false;
var _hasPlaced = false;
var _numStartingCards;

const $topZone = document.getElementById("top-zone");
const $board = document.getElementById("board");
const $botZone = document.getElementById("bot-zone");
const $cardZone = document.getElementById("card-zone");
// const $nextTurn = document.getElementById("next-turn");
const $takeAndFinishButton = document.getElementById("take-btn");

const otherPlayerTemplate = document.getElementById("other-player-template")
  .innerHTML;
const cardTemplate = document.getElementById("card-template").innerHTML;
const placedCardTemplate = document.getElementById("placed-card-template")
  .innerHTML;

$botZone.addEventListener("click", (e) => {
  deselectBoard();
  if (
    selectedCard !== undefined &&
    ["bot-zone", "card-zone", "actions-zone"].includes(e.target.id)
  ) {
    deselectHand();
  }
});

function swap(array, i, j) {
  [array[i], array[j]] = [array[j], array[i]];
  [array[i].index, array[j].index] = [i, j];
}

function addManyCards(cards) {
  cards.forEach((card, index) => {
    card.index = index + myCards.length;
  });
  myCards.splice(myCards.length, 0, ...cards);
  renderHand();
}

function addCard(card) {
  if (!card) {
    console.log("Deck is empty!");
    return;
  }
  card.index = myCards.length;
  card.selected = false;
  myCards.push(card);
  renderHand();
}

function renderHand() {
  const html = Mustache.render(cardTemplate, { cards: myCards });
  $cardZone.innerHTML = html;
}

function changeSelectedCard(index) {
  if (index === undefined) {
    console.error("ALERT: index is undefined");
  }
  if (selectedCard !== undefined) {
    myCards[selectedCard].selected = false;
  }
  deselectBoard();
  selectedCard = index;
  myCards[selectedCard].selected = true;
  renderHand();
}

function deselectHand() {
  if (selectedCard === undefined) return;
  if (selectedCard < myCards.length) myCards[selectedCard].selected = false;
  selectedCard = undefined;
  renderHand();
}

$takeAndFinishButton.addEventListener("click", () => {
  if ($takeAndFinishButton.innerText.includes("Take")) {
    socket.emit("takeCard", { id: socket.id, room_id }, addCard);
  }
  deselectBoard();
  socket.emit("nextTurn", room_id);
});

socket.on("updatePlayerInfo", (players) => {
  const index = players.findIndex((p) => p.username === username);

  // enable / disable nextTurn button
  if (players[index].turn) {
    if (!isMyTurn) {
      alert("Your turn!");
      _numStartingCards = myCards.length;
      updateButtonText();
    }
    isMyTurn = true;
    $takeAndFinishButton.removeAttribute("disabled");
  } else {
    isMyTurn = false;
    $takeAndFinishButton.setAttribute("disabled", "disabled");
  }

  //   players = players.slice(index + 1).concat(players.slice(0, index));

  const html = Mustache.render(otherPlayerTemplate, { players });
  $topZone.innerHTML = html;
});

socket.on("updateBoard", (minBoard) => {
  setBoard(minBoard);
  renderBoard();
});

socket.emit("join", { username, room_id }, addManyCards);
renderBoard();
