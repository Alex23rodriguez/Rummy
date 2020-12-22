var _isShiftDown = false;

window.addEventListener("keydown", (e) => {
  if (e.key.includes("Arrow")) {
    const key = e.key.replace("Arrow", "");
    if (selectedCard !== undefined) {
      // handle organizing cards
      if (key == "Left" && selectedCard > 0) {
        swap(myCards, selectedCard, selectedCard - 1);
        selectedCard--;
        renderHand();
      } else if (key == "Right" && selectedCard < myCards.length - 1) {
        swap(myCards, selectedCard, selectedCard + 1);
        selectedCard++;
        renderHand();
      }
    } else {
      // handle moving board
      moveBoard(key);
    }
  } else if (e.key == "Shift") {
    _isShiftDown = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key == "Shift") {
    _isShiftDown = false;
  }
});
