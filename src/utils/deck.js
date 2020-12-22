const NUM_DECKS = 1;
const NUM_JOKERS = 4;

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

function Deck() {
  this.deck = Array(NUM_JOKERS).fill(new Card("⭐️", "black"));
  for (var i = 0; i < NUM_DECKS; i++) {
    ["red", "blue", "green", "black"].forEach((color) => {
      this.deck.push(new Card("A", color));
      for (var num = 2; num <= 13; num++) {
        this.deck.push(new Card(num, color));
      }
    });
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
