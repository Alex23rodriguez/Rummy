const path = require("path");
const http = require("http");

const express = require("express");
const socketio = require("socket.io");

const {
  addPlayer,
  removePlayer,
  getPlayersInRoom,
  playerTakesCard,
} = require("./utils/players");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket) => {
  console.log("new connection");

  socket.on("join", ({ username, room }) => {
    addPlayer(socket.id, username, room);
    console.log(getPlayersInRoom(room));

    socket.join(room);

    io.to(room).emit("playerCountChange", getPlayersInRoom(room));
  });

  socket.on("takeCard", ({ username, room }, callback) => {
    const cards = playerTakesCard(username, room);
    callback(cards);
  });

  socket.on("disconnect", () => {
    removePlayer(socket.id);
  });
});

server.listen(port);
