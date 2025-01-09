const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
	data: new SlashCommandBuilder().setName('button').setDescription('Test button.'),
	async execute(interaction, client) {
		// await interaction.deferReply({
		// 	fetchReply: true,
		// 	ephemeral: true,
		// });
		const config = await client.config();

		const embed = new EmbedBuilder().setColor(config.colors.neutral).setTitle('Test przycisku').setDescription('Wybierz opcję poniżej');
		const msg = await interaction.channel.send({
			embeds: [embed],
			content: '@geje',
		});
		const row = new ActionRowBuilder().addComponents([
			new ButtonBuilder().setCustomId(`report-claim:${msg.id}`).setLabel('Claim').setStyle(ButtonStyle.Secondary),
			new ButtonBuilder().setCustomId(`report-close:${msg.id}`).setLabel('Close').setStyle(ButtonStyle.Danger),
		]);

		await msg.edit({ components: [row] });

		interaction.reply({
			ephemeral: true,
			embeds: [client.embed('success', 'Wygenerowano przycisk od wchodzenia na służbę.')],
		});
	},
};
