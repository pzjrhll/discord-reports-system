const { SlashCommandBuilder, EmbedBuilder, WebhookClient } = require('discord.js');
const { exec } = require('child_process');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder().setName('webhook').setDescription('Do przycisków'),
	async execute(interaction, client) {
		await interaction.deferReply({
			fetchReply: true,
			ephemeral: true,
		});
		const config = await client.config();
		const webhookUrl = process.env.REPORTS_WEBHOOK_URL;

		if (!config.devUsers.includes(interaction.user.id) || !webhookUrl) {
			return await interaction.editReply('nuh uh');
		}

		const embed = new EmbedBuilder()
			.setColor(config.colors.neutral)
			.setAuthor({ name: 'Syn Papierza                  [Allies][Team]' })
			.setDescription('!admin Ghoosters teamkilluje nas na hq xd')
			.setFooter({ text: 'Server2' });

		try {
			const webhookLog = new WebhookClient({
				url: webhookUrl,
			});
			webhookLog.send({ embeds: [embed] });
		} catch (err) {
			console.log(err);
		}

		interaction.editReply({
			content: 'oki',
		});
	},
};
