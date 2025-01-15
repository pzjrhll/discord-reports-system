const playerSample = require('../../config/players.json');
const playersSampleFull = require('../../config/playersFull.json');
require('dotenv').config();

async function getPlayers() {
	let list = [];
	playerSample?.result?.forEach((player) => {
		list.push({
			name: player[0],
			id: player[1],
		});
	});
	return list;
}

async function getPlayersFull() {}

module.exports = { getPlayers, getPlayersFull };
