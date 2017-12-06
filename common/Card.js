class Card {
  constructor(value, suit, number) {
    this.value = value;
    this.suit = suit;
    this.number = number
    this.facedown = false
  }

  getSuit() { return this.suit; }
  getValue() { return this.value }
  getNumber() { return this.number }
  setFacedown(check){this.facedown = check}
}

module.exports = Card;

