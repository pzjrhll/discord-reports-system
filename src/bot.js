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

const localConfig = require('../local.json');
client.config = () => {
	let obj = localConfig;
	obj.logsAllWebhook = process.env.LOGS_WEBHOOK_URL;
	obj.logsClaimWebhook = process.env.LOGS_WEBHOOK_CLAIM_URL;
	obj.logsCloseWebhook = process.env.LOGS_WEBHOOK_CLOSE_URL;
	obj.logsDenyWebhook = process.env.LOGS_WEBHOOK_DENY_URL;
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
