class Card {
  constructor(value, suit, number) {
    this.value = value;
    this.suit = suit;
    this.number = number
  }

  getSuit() { return this.suit; }
  getValue() { return this.value }
  getNumber() { return this.number }
}

module.exports = Card;

