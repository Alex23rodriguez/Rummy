const Deck = require("./deck");

const NUM_STARTING_CARDS = 13;

const players = {};
const rooms = {};

const addPlayer = (id, username, room_id) => {
  if (!rooms[room_id]) {
    rooms[room_id] = {
      deck: new Deck(),
      players: [id],
      turn: 0,
      board: {},
    };
  } else {
    rooms[room_id].players.push(id);
  }
  const intitialDeck = Array(NUM_STARTING_CARDS)
    .fill()
    .map(rooms[room_id].deck.takeCard);

  players[id] = { username, cards: intitialDeck, room_id };
  return intitialDeck;
};

const removePlayer = (id) => {
  const p = players[id];
  if (!p) {
    console.error("non existing player left");
    return;
  }
  const room = rooms[p.room_id];
  const playersList = room.players;
  // remove from dict of players
  delete players[id];
  // remove from room players
  const index = playersList.indexOf(id);
  playersList.splice(index, 1);
  // check if turn needs adjustment
  if (index == room.turn) {
    room.turn = index % room.players.length;
  }
  if (index < room.turn) {
    room.turn--;
  }
  // return cards to deck
  room.deck.addCards(p.cards);
  //   room.deck.reshuffle();

  // check if room is empty
  if (room.players.length === 0) {
    console.log(`room ${p.room_id} empty. removing room`);
    delete rooms[p.room_id];
    return;
  }
  return p.room_id;
};

const getPlayersInfo = (room_id) => {
  room = rooms[room_id];
  let ans = [];
  for (i in room.players) {
    p = players[room.players[i]];
    ans.push({
      username: p.username,
      numCards: p.cards.length,
      turn: parseInt(i) === room.turn,
    });
  }
  return ans;
};

function playerTakesNewCard(id) {
  const player = players[id];
  const newCard = rooms[player.room_id].deck.takeCard();
  player.cards.push(newCard);
  return newCard;
}

function playerPlacesCard(id, card) {
  players[id].cards.splice(
    players[id].cards.findIndex(
      (c) => c.num !== card.num || c.color !== card.color
    ),
    1
  );
}

function playerReturnsCard(id, card) {
  players[id].cards.push(card);
}

function nextTurn(room_id) {
  room = rooms[room_id];
  room.turn += 1;
  room.turn %= room.players.length;
  return room;
}

function updateBoardInRoom(room_id, board) {
  try {
    rooms[room_id].board = board;
  } catch {
    console.error("ROOM NON EXISTENT! ", room_id);
  }
}

function getBoardInRoom(room_id) {
  return rooms[room_id].board;
}

module.exports = {
  addPlayer,
  removePlayer,
  getPlayersInfo,
  playerTakesNewCard,
  nextTurn,
  updateBoardInRoom,
  getBoardInRoom,
  playerPlacesCard,
  playerReturnsCard,
};
