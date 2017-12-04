class Player{
	constructor(id, name, strategy, hand){
		this.id = id;
		this.name = name;
		this.strategy = strategy;
		this.hand = hand
	}

	getHand(){return this.hand}
	getName(){return this.name}
	getStrat(){return this.strategy}
	getCard(i){return this.hand[i]}

	setHand(){this.hand = hand}
}
module.exports = Player;