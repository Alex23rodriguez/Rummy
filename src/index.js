const path = require("path");
const http = require("http");

const express = require("express");
const socketio = require("socket.io");

const {
  addPlayer,
  removePlayer,
  getPlayersInfo,
  playerTakesCard,
  nextTurn,
  updateBoardInRoom,
  getBoardInRoom,
} = require("./utils/players");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket) => {
  socket.on("join", ({ username, room_id }) => {
    addPlayer(socket.id, username, room_id);
    socket.emit("updateBoard", getBoardInRoom(room_id));
    console.log(`${username} joined room ${room_id}`);

    socket.join(room_id);

    io.to(room_id).emit("updatePlayerInfo", getPlayersInfo(room_id));
  });

  socket.on("takeCard", ({ id, room_id }, callback) => {
    const cards = playerTakesCard(id);
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
