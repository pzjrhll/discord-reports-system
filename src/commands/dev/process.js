const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('process')
		.setDescription('Zarządzanie botem')
		.addSubcommand((subcommand) => subcommand.setName('restart').setDescription('Zrestartuj bota'))
		.addSubcommand((subcommand) => subcommand.setName('kill').setDescription('Wyłącz bota')),

	async execute(interaction, client) {
		await interaction.deferReply({
			fetchReply: true,
			ephemeral: true,
		});
		const config = await client.config();
		if (interaction.user.id != '351598984529313812') {
			return await interaction.editReply('nuh uh');
		}

		const subCommand = await interaction.options.getSubcommand();
		switch (subCommand) {
			case 'restart':
				console.log('[PROCESS_CMD] Restarting...');
				await interaction.editReply('Bot zostanie wkrótce zrestartowany...');
				process.exit(0);
				break;
			case 'kill':
				console.log('[PROCESS_CMD] Shutting down...');
				await interaction.editReply('Bot zostanie wkrótce wyłączony...');
				client.destroy();
            while (true) {}
				break;
			default:
				break;
		}
	},
};
