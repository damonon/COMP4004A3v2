var module = module || {};
var require = require || function() {};
var __dirname = __dirname || "";

function Player(id, name, strategy) {
	this.id = id;
	this.name = name;
	this.strategy = strategy;
	//this.hands = [];
}

module.exports = Player;