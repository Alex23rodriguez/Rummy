const path = require("path");
const http = require("http");

const express = require("express");
const socketio = require("socket.io");

const {
  addPlayer,
  removePlayer,
  getPlayersInfo,
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
    console.log(getPlayersInfo(room));

    socket.join(room);

    io.to(room).emit("updatePlayerInfo", getPlayersInfo(room));
  });

  socket.on("takeCard", ({ id, room }, callback) => {
    const cards = playerTakesCard(id);
    io.to(room).emit("updatePlayerInfo", getPlayersInfo(room));
    callback(cards);
  });

  socket.on("disconnect", () => {
    room_id = removePlayer(socket.id);
    if (!room_id) {
      console.error("non registered player disconnected");
      return;
    }
    console.log("player left");
    io.to(room_id).emit("updatePlayerInfo", getPlayersInfo(room_id));
  });
});

server.listen(port);
