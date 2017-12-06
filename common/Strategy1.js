class Strategy1{
    constructor(hand){
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

        this.pairIndex = -1
        this.tripleIndex = -1
        this.oneIndex = -1
        this.twoIndex = -1
    }

    getHand(){
        return this.hand
    }

    setHand(){
        this.hand = hand
    }

    checkHand(callback){
        this.checkPair()
        this.check2Pair()
        this.checkThree()
        this.checkStraight()
        this.checkFlush()
        this.checkStraightFlush()
        this.checkRoyalFlush()
        this.checkFour()
        this.checkFullHouse()
        
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
        else if(this.pair){
            var getNewHand = this.hand.slice(this.pairIndex, this.pairIndex+2)
            return {checkHold:false, getNewHand, msg:"Pair"}
        }
        else if(this.twopair){
            var firstPair = this.hand.slice(this.oneIndex,this.oneIndex+2)
            var secondPair = this.hand.slice(this.twoIndex, this.twoIndex+2)
            var getNewHand = firstPair.push(secondPair)
            console.log(newHand[0].number)
            console.log(newHand[1].number)
            console.log(newHand[2].number)
            console.log(newHand[3].number)
            return {checkHold: false, getNewHand, msg:"Two Pair"}
        }
        else if(this.threeOfAKind){
            var getNewHand = this.hand.slice(this.tripleIndex, this.tripleIndex+3)
            return {checkHold: false, getNewHand, msg:"Three of A Kind"}
        }
        else if(this.fourOfAKind){
            return {checkHold: true, msg:"Four of a kind"}
        }
        else if(this.fullhouse){
            return {checkHold: true, msg:"FullHouse"}
        }
        else{
            return {checkHold: false, msg:"Shit Hand"}
        }
    }

    checkStraight(){
        this.hand.sort((a, b) => parseInt(a.number) - parseInt(b.number));
        if((parseInt(this.hand[0].number) + 1 == this.hand[1].number) && (parseInt(this.hand[1].number) + 1 == this.hand[2].number) && (parseInt(this.hand[2].number) + 1 == this.hand[3].number) && (parseInt(this.hand[3].number) + 1 == this.hand[4].number)){
            this.straight = true
        }
        else if((this.hand[0].number == 2) && (this.hand[1].number == 3) && (this.hand[2].number == 4) && (this.hand[3].number == 5) && (this.hand[4].number == 14)){
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
            console.log("checkFlush")
        }
        else{
            this.flush = false
            return
        }
    }

    checkStraightFlush(){
        
        this.hand.sort((a, b) => parseInt(a.number) - parseInt(b.number));
        if(this.flush){
            if((parseInt(this.hand[0].number) + 1 == this.hand[1].number) && (parseInt(this.hand[1].number) + 1 == this.hand[2].number) && (parseInt(this.hand[2].number) + 1 == this.hand[3].number) && (parseInt(this.hand[3].number) + 1 == this.hand[4].number)){
                this.straight = false
                this.flush = false
                this.straightFlush = true
            }
            else if((this.hand[0].number == 2) && (this.hand[1].number == 3) && (this.hand[2].number == 4) && (this.hand[3].number == 5) && (this.hand[4].number == 14)){
                this.straight = false
                this.flush = false
                this.straightFlush = true
            }
            else {
                console.log("Get IN here")
                this.flush = true
                return
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

    check2Pair(){
        this.hand.sort((a, b) => parseInt(a.number) - parseInt(b.number))
        for(var i = 0; i < this.hand.length-1; i++){
            if(this.hand[i].number === this.hand[i+1].number){
                if(this.pair){
                    this.pair = false
                    this.twoIndex = i
                    this.twopair = true
                }
                else{
                    this.pair = true
                    this.oneIndex = i
                }
            }
        }
    }
    checkPair(){
        this.hand.sort((a, b) => parseInt(a.number) - parseInt(b.number))
        for (var i=0; i<this.hand.length-1; i++) {
            if (this.hand[i].number === this.hand[i+1].number) {
              this.threeOfAKind = false
              this.pair = true
              this.twopair = false
              this.pairIndex = i
            }
        }
    }

    checkThree(){
        this.hand.sort((a, b) => parseInt(a.number) - parseInt(b.number))
        for(var i = 0; i < this.hand.length-2; i++){
            if((this.hand[i].number === this.hand[i+1].number)&&(this.hand[i].number === this.hand[i+2].number)){
                this.pair = false
                this.threeOfAKind = true
                this.tripleIndex = i
            }
        }
    }

    checkFour(){
        this.hand.sort((a, b) => parseInt(a.number) - parseInt(b.number))

        if(((this.hand[0].number === this.hand[1].number)&&(this.hand[0].number === this.hand[2].number) &&(this.hand[0].number === this.hand[3].number)) || ((this.hand[1].number === this.hand[2].number)&&(this.hand[1].number === this.hand[3].number) &&(this.hand[1].number === this.hand[4].number))){
            this.pair = false
            this.threeOfAKind = false
            this.fourOfAKind = true
        }
    }

    checkFullHouse(){
        this.hand.sort((a, b) => parseInt(a.number) - parseInt(b.number))

        var ifPair = false
        var ifTriple = false
        var indexIfNeeded = -1

        for(var i = 0; i < this.hand.length-2; i++){
            if((this.hand[i].number === this.hand[i+1].number)&&(this.hand[i].number === this.hand[i+2].number)){
                ifTriple = true
                indexIfNeeded = i
            }
        }

        if(ifTriple){
            if(indexIfNeeded === 2){
                var checkForPair = this.hand.slice(0,2);
                if(checkForPair[0].number === checkForPair[1].number){
                    ifPair = true
                }
            }
            else if(indexIfNeeded===0){
                var checkForPair = this.hand.slice(3,6)
                if(checkForPair[0].number === checkForPair[1].number){
                    ifPair = true
                }
            }
        }

        if(ifTriple && ifPair){
            this.pair = false
            this.threeOfAKind = false
            this.fullhouse = true
        }
    }

}
module.exports = Strategy1;