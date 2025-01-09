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

		console.log(t(time.toISODate() + ' ' + time.toLocaleString(DateTime.TIME_24_WITH_SECONDS	)) + info(' [Startup Procedure]: ') + chalk.bold(`Successfully logged in as ${client.user.tag}.`));
		client.commands = new Collection();
		client.commandArray = [];
		client.buttons = new Collection();
		client.antyPingKampera = new Collection();
		client.interviewedUsers = new Collection();

		await client.handleTools();
		await client.handleCommands();
		await client.handleComponents();
		await client.handleIntervals(client);

		// const guild = await client.guilds.fetch('846532807978123304');
		// const member = await guild.members.fetch('351598984529313812');
		// await member.timeout(null, 'jebac czarna malpe');
		// await member.roles.add('846532808029896734');

		// const xd = await client.sql('SELECT * FROM sp_grades ORDER BY grade ASC, unit ASC');
		// for (const x of xd) {
		// 	console.log(`{ name: '${x.name}', value: '${x.grade_server}' },`);
		// }
	},
};
