const path = require("path");
const http = require("http");

const express = require("express");
const socketio = require("socket.io");

const {
  addPlayer,
  removePlayer,
  getPlayersInfo,
  playerTakesNewCard,
  nextTurn,
  updateBoardInRoom,
  getBoardInRoom,
  playerPlacesCard,
  playerReturnsCard,
} = require("./utils/players");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket) => {
  socket.on("join", ({ username, room_id }, callback) => {
    socket.join(room_id);

    // add player
    const initialDeck = addPlayer(socket.id, username, room_id);
    // setup board for that player
    socket.emit("updateBoard", getBoardInRoom(room_id));

    // setup initialdeck
    callback(initialDeck);

    console.log(`${username} joined room ${room_id}`);
    io.to(room_id).emit("updatePlayerInfo", getPlayersInfo(room_id));
  });

  socket.on("takeCard", ({ id, room_id }, callback) => {
    const cards = playerTakesNewCard(id);
    io.to(room_id).emit("updatePlayerInfo", getPlayersInfo(room_id));
    callback(cards);
  });

  socket.on("nextTurn", (room_id) => {
    nextTurn(room_id);
    io.to(room_id).emit("updatePlayerInfo", getPlayersInfo(room_id));
  });

  socket.on("updateBoard", ({ room_id, minBoard }) => {
    updateBoardInRoom(room_id, minBoard);
    socket.broadcast.to(room_id).emit("updateBoard", minBoard);
  });

  socket.on("placeCard", ({ id, room_id, card }) => {
    playerPlacesCard(id, card);
    io.to(room_id).emit("updatePlayerInfo", getPlayersInfo(room_id));
  });

  socket.on("returnCard", ({ id, room_id, card }) => {
    playerReturnsCard(id, card);
    io.to(room_id).emit("updatePlayerInfo", getPlayersInfo(room_id));
  });

  socket.on("disconnect", () => {
    room_id = removePlayer(socket.id);
    if (!room_id) {
      return;
    }
    console.log("player left");
    io.to(room_id).emit("updatePlayerInfo", getPlayersInfo(room_id));
  });
});

server.listen(port);
