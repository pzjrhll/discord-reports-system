const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: {
		name: `report-claim`,
	},

	async execute(interaction, client, actionId) {
		await interaction.deferReply({
			fetchReply: true,
			ephemeral: true,
		});
		const triggerMsg = await interaction.channel.messages.fetch(actionId);
		const embedData = triggerMsg?.embeds[0]?.data;
		const guildMember = await interaction.guild.members.fetch(interaction.user.id);

		if (!embedData) {
			await interaction.qEditReply(interaction, 'error', 'Wystąpił błąd.');
			return await client.logAction(`Wystąpił błąd.`, interaction, null, false);
		}

		const row = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId(`report-close:${actionId}`).setLabel('Ogarnięte').setStyle(ButtonStyle.Success)]);

		const fields = [
			...embedData.fields,
			{ name: '\u200B', value: '\u200B' },
			{ name: 'Rozpatrujący zgłoszenie', value: `${interaction.user.toString()} ${guildMember.nickname || interaction.user.displayName}` },
		];
		const embed = new EmbedBuilder()
			.setColor('#edad18')
			.setDescription(embedData.description)
			.addFields(fields)
			.setTitle('Zgłoszenie - W TRAKCIE')
			.setFooter({ text: embedData?.footer?.text });

		await triggerMsg.edit({
			embeds: [embed],
			components: [row],
		});

		await client.qEditReply(interaction, 'success', `Pomyślnie __przejęto__ zgłoszenie o ID \`${actionId}\`.`);
		return await client.logAction(`Administrator **PRZEJĄŁ** zgłoszenie o ID \`${actionId}\``, interaction, null, true);
	},
};
