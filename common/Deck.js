const Card = require('./Card');
class Deck{
    constructor(){
        this.deck = []
        this.values = ['a','2','3','4','5','6','7','8','9','10','j','q','k']
        this.suits = ['clubs', 'hearts', 'spades', 'diams']
        this.number = ['1','2','3','4','5','6','7','8','9','10','11','12','13']
        this.letter = ['c','h','s','d']
    }

    createDeck(){
        for (let i=0; i<this.suits.length; i++) {
            for(let j=0; j<this.values.length; j++) {
              this.push(new Card(this.values[j],this.suits[i], this.number[j], this.letter[i]));
            }
        }
        return this.getDeck();
    }
    getDeck(){return this.deck}

    shuffleDeck(){
        this.createDeck()
        var currentIndex = this.deck.length;
        var tmpElement;
        var randomIndex;
    
        // While there are unshuffled elements
        while (currentIndex) {
    
            // Pick a random index
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
    
            // Swap the random index element with the current one
            tmpElement = this.deck[currentIndex];
            this.deck[currentIndex] = this.deck[randomIndex];
            this.deck[randomIndex] = tmpElement;
        }
        return this.deck
    }

    pop() {return this.deck.pop()}
    push(card){this.deck.push(card)}
}

module.exports = Deck;

