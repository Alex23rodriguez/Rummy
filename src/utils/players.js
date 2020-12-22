const Deck = require("./deck");

const players = {};
const rooms = {};

const addPlayer = (id, username, room_id) => {
  players[id] = { username, cards: [], room_id };
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
  players[id].cards = players[id].cards.filter(
    (c) => c.num !== card.num || c.color !== card.color
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
  rooms[room_id].board = board;
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
