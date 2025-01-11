const { SlashCommandBuilder, EmbedBuilder, WebhookClient } = require('discord.js');
const { exec } = require('child_process');
const excludedWords = require('../../config/excluded-words.json');
const playerSample = require('../../config/players.json');
const Fuse = require('fuse.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder().setName('rozpoznaj').setDescription('Do przycisków'),
	async execute(interaction, client) {
		const inputRaw = 'osama';
		let input = inputRaw.replace(/\[.*?\]/g, ''); // kasowanie tagów klanowych
		input = input.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, ''); // kasowanie znaków specjalnych
		input = input.split(/\s+/); // rozdzielenie na słowa

		let list = [];
		playerSample.result.forEach((player) => {
			list.push({
				name: player[0],
				nameParsed: player[0]
					.replace(/\[.*?\]/g, '') // kasowanie tagów klanowych
					.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, '') // kasowanie znaków specjalnych
					.split(/\s+/),
				id: player[1],
			});
		});

		const options = {
			includeScore: true,
			keys: ['nameParsed'],
			minMatchCharLength: 3,
			threshold: 0.5,
		};
		const fuse = new Fuse(list, options);

		let results = [];
		for (const word of input) {
			if (word.length < 4) continue;
			results = [...results, ...fuse.search(word)];
		}

		results.sort((a, b) => a.score - b.score);
		// const result = fuse.search(inputRaw);
		const best = results[0];
		console.log(best);

		await interaction.reply({
			ephemeral: true,
			content: `Najbardziej pasuje: ${best.item.name} (${best.item.id})`,
		});
	},
};
