const { Collection } = require('discord.js');

module.exports = {
	name: 'error',
	once: false,
	async execute(error, client) {
		client.cerr(error);
	},
};
