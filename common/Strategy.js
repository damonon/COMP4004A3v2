class Strategy{
    constructor(hand) {
        if (new.target === Strategy) {
          throw new TypeError("Abstract Class");
        }
    }
}

module.exports = Strategy