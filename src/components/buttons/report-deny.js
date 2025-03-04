const { EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: {
		name: `report-deny`,
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
		console.log(interaction.user);

		const serverId = embedData?.footer?.text?.split(' | ')[1];
		let fields = [];
		if (embedData.fields[embedData.fields.length - 1].name === 'Rozpatrujący zgłoszenie') {
			fields = [
				...embedData.fields.slice(0, -1),
				{ name: 'Rozpatrzone przez', value: `${interaction.user.toString()} ${guildMember.nickname || interaction.user.displayName}` },
			];
		} else {
			fields = [
				...embedData.fields,
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Rozpatrzone przez', value: `${interaction.user.toString()} ${guildMember.nickname || interaction.user.displayName}` },
			];
		}
		const embed = new EmbedBuilder()
			.setColor('#9e3737')
			.setDescription(embedData.description)
			.addFields(fields)
			.setTitle(`Zgłoszenie - ODRZUCONE (${serverId})`)
			.setFooter({ text: embedData?.footer?.text });
		await triggerMsg.edit({
			embeds: [embed],
			components: [],
			content: ' ',
		});
		await client.qEditReply(interaction, 'success', `Pomyślnie __odrzucono__ zgłoszenie o ID \`${actionId}\`.`);
		return await client.logAction(`Administrator **ODRZUCIŁ** zgłoszenie o ID \`${actionId}\``, interaction, null, true);
	},
};
