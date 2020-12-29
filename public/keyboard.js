var _isShiftDown = false;

window.addEventListener("keydown", (e) => {
  if (e.key.includes("Arrow")) {
    const key = e.key.replace("Arrow", "");
    if (selectedCard !== undefined) {
      // handle organizing cards
      moveHand(key);
    } else {
      // handle moving board
      moveBoard(key);
    }
  } else if (e.key == "Shift") {
    _isShiftDown = true;
  }
});

function moveHand(key) {
  if (key == "Left" && selectedCard > 0) {
    swap(myCards, selectedCard, selectedCard - 1);
    selectedCard--;
  } else if (key == "Right" && selectedCard < myCards.length - 1) {
    swap(myCards, selectedCard, selectedCard + 1);
    selectedCard++;
  }
  renderHand();
}

window.addEventListener("keyup", (e) => {
  if (e.key == "Shift") {
    _isShiftDown = false;
  }
});
