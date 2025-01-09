const { SlashCommandBuilder, EmbedBuilder, WebhookClient } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
	data: new SlashCommandBuilder().setName('webhook').setDescription('Do przycisków'),
	async execute(interaction, client) {
		// await interaction.deferReply({
		// 	fetchReply: true,
		// 	ephemeral: true,
		// });
		const config = await client.config();

		const embed = new EmbedBuilder()
			.setColor(config.colors.neutral)
			.setAuthor({ name: 'AdolfRizzler' })
			.setDescription('!admin gracz skibidsigmeusz teamkilluje nas co chwile :(((');

		try {
			const webhookLog = new WebhookClient({
				url: 'https://discord.com/api/webhooks/1326981971871797308/XSihmxRrmrg2MX9b7a_rXaQtAapNox5yCfBrjbA1WkZ8VjVbd3APVdtPtp3Wncb1v3iL',
			});
			webhookLog.send({ embeds: [embed] });
		} catch (err) {
			console.log(err);
		}

		interaction.reply({
			ephemeral: true,
			content: 'oki',
		});
	},
};
