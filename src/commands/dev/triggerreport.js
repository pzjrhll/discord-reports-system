const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { processReport } = require('../../functions/utils/reportSystem.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('triggerreport')
		.setDescription('Wywołuje sztuczne zgłoszenie !admin - tylko do testów')
		.addStringOption((option) => option.setName('autor').setDescription('Autor zgłoszenia').setRequired(true))
		.addStringOption((option) => option.setName('tresc').setDescription('Treść zgłoszenia').setRequired(true))
		.addStringOption((option) => option.setName('server').setDescription('Server (np. server1)').setRequired(true)),

	async execute(interaction, client) {
		await interaction.deferReply({
			fetchReply: true,
			ephemeral: true,
		});
		const reason = '!admin ' + interaction.options.getString('tresc');
		const author = interaction.options.getString('autor');
		const server = interaction.options.getString('server');

		const config = await client.config();
		if (!config.devUsers.includes(interaction.user.id)) {
			return await interaction.editReply('nuh uh');
		}

		await processReport(reason, author, server, client);
		await client.qEditReply(interaction, 'success', 'Sprawdź kanał z zgłoszeniami.');
	},
};
