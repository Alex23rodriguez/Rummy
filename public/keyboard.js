var isShiftDown = false;

window.addEventListener("keydown", (e) => {
  if (e.key.includes("Arrow")) {
    const key = e.key.replace("Arrow", "");
    if (boardSelected) {
      // handle moving board
    } else if (selectedCard !== undefined) {
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
    }
  } else if (e.key == "Shift") {
    isShiftDown = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key == "Shift") {
    isShiftDown = false;
  }
});
