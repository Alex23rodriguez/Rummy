function Card(num, color) {
  this.num = num;
  this.color = color;
}

function _shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function Deck(q = 1) {
  this.deck = [];
  for (var i = 0; i < q; i++) {
    for (var num = 1; num <= 13; num++) {
      ["red", "blue", "green", "black"].forEach((color) => {
        this.deck.push(new Card(num, color));
      });
    }
  }
  _shuffleArray(this.deck);

  this.takeCard = () => this.deck.pop();
  this.addCards = function (cards) {
    this.deck = this.deck.concat(cards);
  };
  this.reshuffle = function () {
    _shuffleArray(this.deck);
  };
}

module.exports = Deck;
