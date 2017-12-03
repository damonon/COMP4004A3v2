var module = module || {};
var require = require || function() {};
var __dirname = __dirname || "";

function Player(id, name) {
	this.id = id;
	this.name = name;
	//this.hands = [];
}

module.exports = Player;