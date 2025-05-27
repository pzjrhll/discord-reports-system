const { EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: {
		name: `report-close`,
		preventDoubleClick: true,
	},

	async execute(interaction, client, actionId) {
		await interaction.deferReply({
			fetchReply: true,
			ephemeral: true,
		});
		const config = await client.config();
		const triggerMsg = await interaction.channel.messages.fetch(actionId);
		const embedData = triggerMsg?.embeds[0]?.data;
		const guildMember = await interaction.guild.members.fetch(interaction.user.id);

		if (!embedData) {
			await client.qEditReply(interaction, 'error', 'Wystąpił błąd.');
			return await client.logAction(config.logsAllWebhook, `Wystąpił błąd.`, interaction, null, false);
		}

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
			.setColor('#40e348')
			.setDescription(embedData.description)
			.addFields(fields)
			.setTitle(`Zgłoszenie - ZAMKNIĘTE (${serverId})`)
			.setFooter({ text: embedData?.footer?.text });
		await triggerMsg.edit({
			embeds: [embed],
			components: [],
			content: ' ',
		});
		await client.qEditReply(interaction, 'success', `Pomyślnie __zamknięto__ zgłoszenie o ID \`${actionId}\`.`);
		await client.logAction(config.logsCloseWebhook, `Administrator **ZAMKNĄŁ** zgłoszenie o ID \`${actionId}\``, interaction, null, true);
		return await client.logAction(config.logsAllWebhook, `Administrator **ZAMKNĄŁ** zgłoszenie o ID \`${actionId}\``, interaction, null, true);
	},
};
