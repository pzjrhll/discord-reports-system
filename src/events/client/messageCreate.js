const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require('discord.js');
const { processReport } = require('../../functions/utils/reportSystem.js');
require('dotenv').config();

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message, client) {
		try {
			// if (message.author.bot) return;
			const config = client.config();

			if (config.serverReportsWebhookChannelId.includes(message.channel.id) && message.author.bot && message.author.id !== process.env.DISCORD_CLIENT_ID) {
				return processReport(message, client);
			}
		} catch (err) {
			client.cerr(err);
		}
	},
};
