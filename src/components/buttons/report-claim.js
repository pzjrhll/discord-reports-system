const { DateTime, setZone, Interval, diff } = require('luxon');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require('discord.js');

module.exports = {
	data: {
		name: `report-claim`,
	},

	async execute(interaction, client, actionId) {
		await interaction.deferReply({
			fetchReply: true,
			ephemeral: true,
		});
		const config = await client.config();

		const webhook = new WebhookClient({
			url: 'https://discord.com/api/webhooks/1326981971871797308/XSihmxRrmrg2MX9b7a_rXaQtAapNox5yCfBrjbA1WkZ8VjVbd3APVdtPtp3Wncb1v3iL',
		});
		const triggerMsg = await interaction.channel.messages.fetch(actionId);
		const embedData = triggerMsg?.embeds[0]?.data;

		console.log(embedData);
		if (!embedData) {
			console.log('No embed data');
			return;
		}

		const row = new ActionRowBuilder().addComponents([
			// new ButtonBuilder().setCustomId(`report-unclaim:${actionId}`).setLabel('Jednak tego nie ruszam').setStyle(ButtonStyle.Secondary),
			new ButtonBuilder().setCustomId(`report-close:${actionId}`).setLabel('Ogarnięte').setStyle(ButtonStyle.Success),
		]);

		const fields = [...embedData.fields.slice(0, 2), { name: 'Admin', value: `<@${interaction.user.id}>`, inline: true }, ...embedData.fields.slice(2)];

		const embed = new EmbedBuilder().setColor('#ccedce').setDescription(embedData.description).addFields(fields).setTitle('Zgłoszenie - W TRAKCIE');
		await triggerMsg.edit({
			embeds: [embed],
			components: [row],
		});
		await interaction.editReply({ content: `Zclaimowano zgłoszenie o ID \`${actionId}\`` });
	},
};
