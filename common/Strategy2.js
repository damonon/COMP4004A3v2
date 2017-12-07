var Strategy = require('./Strategy')
var Strategy1 = require('./Strategy1')

class Strategy2 extends Strategy{
    constructor(hand, faceUpCards){
        super()
        this.hand = hand
        this.faceUpCards = faceUpCards

        this.pair = false
        this.twopair = false

        this.pairIndex = -1
        this.oneIndex = -1
        this.secondIndex = -1

    }

    checkHand(callback){
        callback(this.choice())
    }

    choice(){
        console.log("IM IN THE FUNCTION CHOICE")
        console.log(this.faceUpCards)
        if(!this.faceUpCards){
            console.log("Using Strategy1 if no visible cards are on the table")
            var complete = []
            var useStrategy1 = new Strategy1(this.hand)
            useStrategy1.checkHand(results =>{
                complete = results
            })
            console.log("1 " + complete)
            return complete
        }
        this.hand.sort((a, b) => parseInt(a.number) - parseInt(b.number))
        console.log("This is Hand Inside Strat2 " + this.hand[0])
        console.log("This is Hand Inside Strat2 " + this.hand[1])
        console.log("This is Hand Inside Strat2 " + this.hand[2])
        console.log("This is Hand Inside Strat2 " + this.hand[3])
        console.log("This is Hand Inside Strat2 " + this.hand[4])

        for(var j = 0; j < this.faceUpCards.length; j++){
            console.log("Im in this sort loop")
            for(var k = 0; k < this.faceUpCards[j].length; k++){
                console.log("Im in this second sort loop")
                this.faceUpCards[j].sort((a,b) => parseInt(a.number) - parseInt(b.number))
            }
        }

        console.log("This is visible Inside Strat2 " + this.faceUpCards[0])
        for(var i = 0; i < this.faceUpCards.length; i++){
            
            if(this.faceUpCards[i].length < 3){
                continue
            }
            for(var a = 0; a < this.faceUpCards[i].length-2; a++){
                
                if((this.faceUpCards[i][a].number === this.faceUpCards[i][a+1].number) && (this.faceUpCards[i][a].number === this.faceUpCards[i][a+2].number)){
                    for(var forPair = 0; forPair < this.hand.length-1; forPair++){
                        if(this.hand[forPair].number === this.hand[forPair+1].number){
                            if(this.pair){
                                this.pair = false
                                this.twopair = true
                                this.twoIndex = forPair
                            }
                            else{
                                this.pair = true
                                this.oneIndex = forPair
                                this.pairIndex = forPair
                            }
                        }
                    }

                    if(this.pair){
                        var getNewHand = this.hand.slice(this.pairIndex, this.pairIndex+2)
                        return {checkHold:"swap", msg:"Pair", getNewHand}
                    }
                    else if(this.twopair){
                        var secondPair = this.hand.slice(this.twoIndex, this.twoIndex+2)
                        var firstPair = this.hand.slice(this.oneIndex,this.oneIndex+2)
                        var getNewHand = firstPair.concat(secondPair)
                        
                        return {checkHold: "swap", msg:"Two Pair", getNewHand}
                    }
                    else{
                        console.log("Using Strategy 1 if there is visible triple but AI has no pairs")
                        var complete = []
                        var useStrategy1 = new Strategy1(this.hand)
                        useStrategy1.checkHand(results =>{
                            complete = results
                        })
                        return complete
                    }
                }
                else{
                    console.log("Using Strategy 1 if there is no visible triple ")
                    var complete = []
                    var useStrategy1 = new Strategy1(this.hand)
                    useStrategy1.checkHand(results =>{
                        complete = results
                        
                    })
                    return complete
                }
            }
        }
    }
}

module.exports = Strategy2;