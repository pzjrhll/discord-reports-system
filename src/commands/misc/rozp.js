const { SlashCommandBuilder, EmbedBuilder, WebhookClient } = require('discord.js');
const { exec } = require('child_process');
const excludedWords = require('../../config/excluded-words.json');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder().setName('rozpoznaj').setDescription('Do przycisków'),
	async execute(interaction, client) {
		let input = 'siema generlanie frajer z nickiem osamabinladen spawn skibdi frajer_jebany sigmeuszkilluje smiec jebany xddd TK TK TK !!!!';
		input = input.toLowerCase();
		input = input.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, '');
		input = input.split(' ').filter((word) => !excludedWords.exclude.includes(word));
		console.log(input);

		let matchingPlayers = [];

		const playerNicknames = ['osamabinladen tk', 'skibidi sigmeusz', 'frajer_jebany'];
		for (const player of playerNicknames) {
			const lowerPlayer = player.toLowerCase();
			for (const potential of lowerPlayer.split(' ').filter((word) => !excludedWords.exclude.includes(word))) {
				if (input.includes(potential)) {
					input = input.map((word) => (word === potential ? player : word));
					matchingPlayers.push(player);
				}
			}
		}
		console.log(matchingPlayers);

		await interaction.reply({
			ephemeral: true,
			content: input.join(' '),
		});
	},
};
