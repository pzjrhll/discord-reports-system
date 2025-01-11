const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require('discord.js');
const { proccessReport } = require('../../functions/utils/reportWebhook.js');
require('dotenv').config();

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message, client) {
		try {
			// if (message.author.bot) return;

			if (message.channel.id === process.env.REPORTS_WEBHOOK_CHANNEL_ID && message.author.bot && message.author.id !== process.env.DISCORD_CLIENT_ID) {
				return proccessReport(message, client);
			}
		} catch (err) {
			client.cerr(err);
		}
	},
};
