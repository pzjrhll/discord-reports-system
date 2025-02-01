require('dotenv').config();
const fs = require('fs');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, WebhookClient } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
	],
});

const localConfig = JSON.parse(fs.readFileSync('./src/config/local.json', 'utf-8'));

client.config = () => {
	let obj = localConfig;
	obj.logsAllWebhook = process.env.LOGS_WEBHOOK_URL;
	return obj;
};

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
	if (folder !== 'handlers') continue;
	const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith('.js'));
	for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.login(process.env.DISCORD_BOT_TOKEN);
