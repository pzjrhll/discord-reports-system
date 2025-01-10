const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require('discord.js');
require('dotenv').config();

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message, client) {
		try {
			// if (message.author.bot) return;

			// SYSTEM REPORTÓW - ODCZYTYWANIE WEBHOOKA
			if (message.channel.id === process.env.REPORTS_WEBHOOK_CHANNEL_ID && message.author.bot && message.author.id !== process.env.DISCORD_CLIENT_ID) {
				const triggerMsg = message;
				const embedData = triggerMsg?.embeds[0];
				if (!embedData) {
					console.log('No embed data');
					return;
				}

				const victim = embedData?.author?.name;
				let description = embedData?.description;
				description = description.split(/\s+/).slice(1);
				const embed = new EmbedBuilder()
					.setColor('#e62525')
					.setTitle(`Zgłoszenie - NOWE`)
					.setDescription(description.join(' '))
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

				const channel = await message.guild.channels.fetch(process.env.REPORTS_PREVIEW_CHANNEL_ID);
				const msg = await channel.send({
					// embeds: [embed],
					content: '<@&847932479696404550>',
				});
				const row = new ActionRowBuilder().addComponents([
					new ButtonBuilder().setCustomId(`report-claim:${msg.id}`).setLabel('Zajmuję się tym').setStyle(ButtonStyle.Primary),
					new ButtonBuilder().setCustomId(`report-close:${msg.id}`).setLabel('Ogarnięte').setStyle(ButtonStyle.Success),
				]);

				await msg.edit({ components: [row], embeds: [embed.setFooter({ text: `ID Zgłoszenia: ${msg.id}` })] });
			}
		} catch (err) {
			client.cerr(err);
		}
	},
};
