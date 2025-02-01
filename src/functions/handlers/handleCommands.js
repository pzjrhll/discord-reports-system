require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

module.exports = (client) => {
	client.handleCommands = async () => {
		const config = await client.config();
		const clientId = process.env.DISCORD_CLIENT_ID;
		const guildId = process.env.DISCORD_GUILD_ID;
		const commandFolders = fs.readdirSync('./src/commands');
		const { commands, commandArray } = client;
		for (const folder of commandFolders) {
			if (folder === 'onlydev' && guildId !== '984932032637464686') continue;
			const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith('.js'));

			//const {commands, commandArray } = client;
			for (const file of commandFiles) {
				const command = require(`../../commands/${folder}/${file}`);
				commands.set(command.data.name, command);
				commandArray.push(command.data.toJSON());
			}
		}

		const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN);
		try {
			client.cinit('Started refreshing application (/) commands.');

			await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
				body: commandArray,
			});

			client.cinit('Successfully registered application (/) commands.');
		} catch (error) {
			console.error(error);
		}
	};
};
