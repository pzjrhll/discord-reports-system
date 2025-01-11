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

		if (!embedData) {
			await interaction.qEditReply(interaction, 'error', 'Wystąpił błąd.');
			return await client.logAction(`Wystąpił błąd.`, interaction, null, false);
		}

		// const fields = [...embedData.fields.slice(0, 2), { name: 'Admin', value: `<@${interaction.user.id}>`, inline: true }, ...embedData.fields.slice(3)];
		const embed = new EmbedBuilder()
			.setColor('#40e348')
			.setDescription(embedData.description)
			.addFields(embedData.fields)
			.setTitle('Zgłoszenie - ZAMKNIĘTE')
			.setFooter({ text: embedData?.footer?.text });
		await triggerMsg.edit({
			embeds: [embed],
			components: [],
			content: ' ',
		});
		await client.qEditReply(interaction, 'success', `Pomyślnie __zamknięto__ zgłoszenie o ID \`${actionId}\`.`);
		return await client.logAction(`Administrator ZAMKNĄŁ zgłoszenie o ID \`${actionId}\``, interaction, null, true);
	},
};
