const { Collection } = require('discord.js');
const chalk = require('chalk');
const info = chalk.green.bold;
const t = chalk.bgGreen;
const { DateTime, setZone, Interval, diff } = require('luxon');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const time = DateTime.now();

		console.log(
			t(time.toISODate() + ' ' + time.toLocaleString(DateTime.TIME_24_WITH_SECONDS)) +
				info(' [Startup Procedure]: ') +
				chalk.bold(`Successfully logged in as ${client.user.tag}.`)
		);
		client.commands = new Collection();
		client.commandArray = [];
		client.buttons = new Collection();
		client.antyPingKampera = new Collection();
		client.interviewedUsers = new Collection();

		await client.handleTools();
		await client.handleCommands();
		await client.handleComponents();
		await client.handleIntervals(client);
	},
};
