const { SlashCommandBuilder, EmbedBuilder, WebhookClient } = require('discord.js');
const { exec } = require('child_process');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder().setName('webhook').setDescription('Do przycisków'),
	async execute(interaction, client) {
		// await interaction.deferReply({
		// 	fetchReply: true,
		// 	ephemeral: true,
		// });
		const config = await client.config();
		const webhookUrl = process.env.REPORTS_WEBHOOK_URL;

		const embed = new EmbedBuilder()
			.setColor(config.colors.neutral)
			.setAuthor({ name: 'Llama Warrior [Axis][Team]' })
			.setDescription('!admin gracz exekk teamkilluje nas na hq xd')
			.setFooter({ text: 'Server1' });

		try {
			const webhookLog = new WebhookClient({
				url: webhookUrl,
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
