var Strategy = require('./Strategy')

class Strategy1 extends Strategy{
    constructor(hand){
        super()
        this.hand = hand
        this.pair = false
        this.twopair = false
        this.threeOfAKind = false
        this.straight = false
        this.flush = false
        this.fullhouse = false
        this.fourOfAKind = false
        this.straightFlush = false
        this.royalFlush = false
    }

    getHand(){
        return this.hand
    }

    setHand(){
        this.hand = hand
    }

    checkHand(callback){
        this.checkPair()
        //this.check2Pair()
        this.checkThree()
        this.checkStraight()
        this.checkFlush()
        this.checkStraightFlush()
        this.checkRoyalFlush()
        //this.checkFour()
        //this.checkFullHouse()
        
        callback(this.hold())
    }

    hold(){
        if(this.straight){
            return {checkHold: true, msg:"Straight"}
        }
        else if(this.flush){
            return {checkHold: true, msg:"Flush"}
        }
        else if(this.straightFlush){
            return {checkHold: true, msg:"Straight Flush"}
        }
        else if(this.royalFlush){
            return {checkHold: true, msg:"Royal Flush"}
        }
        else{
            return {checkHold: false, msg:"Shit Hand"}
        }
    }

    checkStraight(){
        this.hand.sort((a, b) => parseInt(a.number) - parseInt(b.number));
        if((this.hand[0].value + 1 === this.hand[1].value) && (this.hand[1].value + 1 === this.hand[2].value) && (this.hand[2].value + 1 === this.hand[3].value) && (this.hand[0].value + 1 === this.hand[1].value)){
            this.straight = true
        }
        else{
            this.straight = false
            return
        }
    }

    checkFlush(){
        this.hand.sort((a, b) => parseInt(a.number) - parseInt(b.number));
        if ((this.hand[0].suit === this.hand[1].suit) && (this.hand[0].suit === this.hand[2].suit) && (this.hand[0].suit === this.hand[3].suit) && (this.hand[0].suit === this.hand[4].suit)){
            this.flush = true
        }
        else{
            this.flush = false
            return
        }
    }

    checkStraightFlush(){
        this.hand.sort((a, b) => parseInt(a.number) - parseInt(b.number));
        if(this.flush){
            for (let i=0; i<this.hand.length-1; i++) {
                if (this.hand[i+1].number === (this.hand[i].number + 1)) {
                  this.straight = false
                  this.flush = false
                  this.straightFlush = true
                } else {
                  this.straight = false
                  return
                }
              }
        }
    }

    checkRoyalFlush(){
        this.hand.sort((a, b) => parseInt(a.number) - parseInt(b.number))
        if(this.straightFlush){
            if((this.hand[0].number == 10)&&(this.hand[1].number == 11) && (this.hand[2].number == 12) && (this.hand[3].number == 13) && (this.hand[4].number == 14)){
                this.straightFlush = false
                this.royalFlush = true
            }
            else{
                this.straightFlush = true
                return
            }
        }
    }

    checkPair(){
        this.hand.sort((a, b) => parseInt(a.number) - parseInt(b.number))
        for (let i=0; i<this.hand.length-1; i++) {
            if (this.hand[i].number === this.hand[i+1].number) {
              this.threeOfAKind = false
              this.pair = true
              this.indexOfPair = i
            }
        }
    }

    checkThree(){
        this.hand.sort((a, b) => parseInt(a.number) - parseInt(b.number));
        
    }


}
module.exports = Strategy1;