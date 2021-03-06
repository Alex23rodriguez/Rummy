const board = [];
var selectedInBoard = [];

const HEIGHT = 10;
const WIDTH = 25;

for (var i = 0; i < HEIGHT * WIDTH; i++) {
  board.push({ index: i });
}

function deselectBoard() {
  if (!selectedInBoard.length) return;
  for (i of selectedInBoard) {
    board[i].selected = false;
  }
  selectedInBoard = [];
  renderBoard();
}

function boardClick(index) {
  if (!isMyTurn) return;
  if (board[index].is_card) {
    if (_isShiftDown) {
      returnCardToHand(index);
    } else {
      if (_hasMoved) {
        deselectBoard();
        _hasMoved = false;
      }
      board[index].selected = !board[index].selected;
      if (board[index].selected) {
        deselectHand();
        selectedInBoard.push(index);
        selectedInBoard = selectedInBoard.sort((i, j) => i > j);
      } else {
        selectedInBoard = selectedInBoard.filter((ind) => ind !== index);
      }
    }
  } else if (selectedCard !== undefined) {
    placeCard(index);
  } else if (selectedInBoard.length === 1) {
    const first = selectedInBoard[0];
    deselectBoard();
    swap(board, index, first);
    socket.emit("updateBoard", { minBoard: getMinBoard(), room_id });
  } else {
    deselectBoard();
  }
  renderBoard();
}

function renderBoard() {
  const html = Mustache.render(placedCardTemplate, { board });
  $board.innerHTML = html;
}

function placeCard(index) {
  const card = myCards.splice(selectedCard, 1)[0];
  for (var i = selectedCard; i < myCards.length; i++) {
    myCards[i].index--;
  }
  board[index] = {
    is_card: true,
    color: card.color,
    num: card.num,
    selected: false,
    index,
  };
  deselectHand();

  socket.emit("updateBoard", { minBoard: getMinBoard(), room_id });
  socket.emit("placeCard", {
    id: socket.id,
    room_id,
    card: { num: card.num, color: card.color },
  });
  updateButtonText();
}

function updateButtonText() {
  if (myCards.length === _numStartingCards) {
    $takeAndFinishButton.innerText = "Take card and finish turn";
  } else {
    $takeAndFinishButton.innerText = "Finish turn";
  }
}

function returnCardToHand(index) {
  const card = board[index];
  board[index] = { index };
  myCards.push({
    color: card.color,
    num: card.num,
    index: myCards.length,
    selected: false,
  });
  renderHand();
  socket.emit("updateBoard", { minBoard: getMinBoard(), room_id });
  socket.emit("returnCard", {
    id: socket.id,
    room_id,
    card: { num: card.num, color: card.color },
  });
  updateButtonText();
}

function getMinBoard() {
  const mb = {};
  for (i in board) {
    if (board[i].is_card) {
      mb[i] = { color: board[i].color, num: board[i].num };
    }
  }
  return mb;
}

function setBoard(minBoard) {
  for (var i = 0; i < WIDTH * HEIGHT; i++) {
    if (minBoard[i]) {
      board[i] = {
        is_card: true,
        color: minBoard[i].color,
        num: minBoard[i].num,
        selected: false,
        index: i,
      };
    } else {
      board[i] = { index: i };
    }
  }
}

function moveBoard(dir) {
  if (!selectedInBoard.length) return;
  // check borders
  var add;

  switch (dir) {
    case "Up":
      if (selectedInBoard.some((index) => Math.floor(index / WIDTH) === 0))
        return;
      add = -WIDTH;
      break;
    case "Down":
      if (
        selectedInBoard.some(
          (index) => Math.floor(index / WIDTH) === HEIGHT - 1
        )
      )
        return;
      add = WIDTH;
      break;
    case "Left":
      if (selectedInBoard.some((index) => index % WIDTH === 0)) return;
      add = -1;
      break;
    case "Right":
      if (selectedInBoard.some((index) => index % WIDTH === WIDTH - 1)) return;
      add = 1;
      break;
  }
  const indexes = [...selectedInBoard];
  if (["Down", "Right"].includes(dir)) {
    indexes.reverse();
  }
  indexes.forEach((index) => {
    swap(board, index, index + add, false);
  });

  _hasMoved = true;

  selectedInBoard = selectedInBoard.map((i) => i + add);
  renderBoard();

  socket.emit("updateBoard", { minBoard: getMinBoard(), room_id });
}
