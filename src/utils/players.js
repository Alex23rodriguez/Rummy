const Deck = require("./deck");

const players = [];
const decks = {};

const addPlayer = (id, username, room) => {
  players.push({ id, username, room, cards: [] });
  if (!decks[room]) {
    decks[room] = new Deck();
  }
};

const removePlayer = (id) => {
  const index = players.findIndex((p) => p.id === id);

  if (index !== -1) {
    return players.splice(index, 1)[0];
  }
};

const getPlayersInRoom = (room) => {
  const ps = players.filter((p) => p.room === room);
  return Array.from(ps, (p) => {
    return { username: p.username, numCards: p.cards.length };
  });
};

function playerTakesCard(username, room) {
  const player = players.find(
    (p) => p.username === username && p.room === room
  );
  player.cards.push(decks[room].takeCard());
  return player.cards;
}

module.exports = { addPlayer, removePlayer, getPlayersInRoom, playerTakesCard };
