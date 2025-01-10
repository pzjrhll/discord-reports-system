const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder().setName('fetch-webhook').setDescription('Do przycisków'),
	async execute(interaction, client) {
		const config = await client.config();

		try {
			const webhookUrl = process.env.REPORTS_WEBHOOK_URL;
			const webhook = new WebhookClient({
				url: webhookUrl,
			});
			const triggerMsg = await webhook.fetchMessage('1327334650401656899');
			const embedData = triggerMsg?.embeds[0];
			if (!embedData) {
				console.log('No embed data');
				return;
			}

			const victim = embedData?.author?.name;
			let message = embedData?.description;
			message = message.split(/\s+/).slice(1);
			const originalMessage = message.join(' ');
			const embed = new EmbedBuilder()
				.setColor('#e62525')
				.setTitle(`Zgłoszenie - NOWE`)
				.setDescription(originalMessage)
				.addFields(
					{ name: 'Nick zgłaszającego', value: victim, inline: true },
					{ name: 'Squad zgłaszającego', value: 'Allies | FOX', inline: true },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Info o zgłaszanym 1', value: 'Ala ma kota', inline: true },
					{ name: 'Info o zgłaszanym 1', value: 'Ala ma kota', inline: true },
					{ name: 'Info o zgłaszanym 1', value: 'Ala ma kota', inline: true },
					{ name: 'Info o zgłaszanym 1', value: 'Ala ma kota', inline: true },
					{ name: 'Info o zgłaszanym 1', value: 'Ala ma kota', inline: true },
					{ name: 'Info o zgłaszanym 1', value: 'Ala ma kota', inline: true }
				);
			const msg = await interaction.channel.send({
				// embeds: [embed],
				content: '<@&847932479696404550>',
			});
			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder().setCustomId(`report-claim:${msg.id}`).setLabel('Zajmuję się tym').setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId(`report-close:${msg.id}`).setLabel('Ogarnięte').setStyle(ButtonStyle.Success),
			]);

			await msg.edit({ components: [row], embeds: [embed.setFooter({ text: `ID Zgłoszenia: ${msg.id}` })] });

			console.log(victim, message);
		} catch (err) {
			console.log(err);
		}

		interaction.reply({
			ephemeral: true,
			content: 'oki',
		});
	},
};
