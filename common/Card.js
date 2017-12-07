class Card {
  constructor(value, suit, number) {
    this.value = value;
    this.suit = suit;
    this.number = number
    this.faceup = false
  }

  getSuit() { return this.suit; }
  getValue() { return this.value }
  getNumber() { return this.number }
  setFaceUp(check){this.faceup = check}
}

module.exports = Card;

