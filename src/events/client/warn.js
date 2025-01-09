const { Collection } = require('discord.js');

module.exports = {
	name: 'warn',
	once: false,
	async execute(error, client) {
		console.error('------------- WARN HANDLER -------------');
		console.warn(error);
	},
};
