const { DateTime, setZone, Interval, diff } = require('luxon');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: {
		name: `report-close`,
	},

	async execute(interaction, client, actionId) {
		await interaction.deferReply({
			fetchReply: true,
			ephemeral: true,
		});
		const config = await client.config();

		const webhook = new WebhookClient({
			url: process.env.REPORTS_WEBHOOK_URL,
		});
		const triggerMsg = await interaction.channel.messages.fetch(actionId);
		const embedData = triggerMsg?.embeds[0]?.data;

		console.log(embedData);
		if (!embedData) {
			console.log('No embed data');
			return;
		}

		const embed = new EmbedBuilder().setColor('#40e348').setDescription(embedData.description).addFields(embedData.fields).setTitle('Zgłoszenie - ZAMKNIĘTE');
		await triggerMsg.edit({
			embeds: [embed],
			components: [],
			content: ' ',
		});
		await interaction.editReply({ content: `Zamknięto zgłoszenie o ID \`${actionId}\`` });
	},
};
