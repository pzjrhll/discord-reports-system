const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require('discord.js');
const playerSample = require('../../config/players.json');
const Fuse = require('fuse.js');
require('dotenv').config();

async function guessUser(inputRaw) {
	let input = inputRaw.replace(/\[.*?\]/g, ''); // kasowanie tagów klanowych
	input = input.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, ''); // kasowanie znaków specjalnych
	input = input.split(/\s+/); // rozdzielenie na słowa
	input.filter((word) => word !== 'PZJR' && word !== 'NZN');

	let list = [];
	playerSample.result.forEach((player) => {
		list.push({
			name: player[0],
			nameParsed: player[0]
				.replace(/\[.*?\]/g, '') // kasowanie tagów klanowych
				.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, '') // kasowanie znaków specjalnych
				.split(/\s+/)
				.filter((word) => word !== 'PZJR' && word !== 'NZN'),
			id: player[1],
		});
	});

	const options = {
		includeScore: true,
		keys: ['nameParsed'],
		threshold: 0.45,
	};
	const fuse = new Fuse(list, options);
	let results = [];
	for (const word of input) {
		if (word.length < 4) continue;
		results = [...results, ...fuse.search(word)];
	}

	results.sort((a, b) => a.score - b.score);
	return results[0]?.item;
}

async function processReport(message, client) {
	const triggerMsg = message;
	const embedData = triggerMsg?.embeds[0];
	if (!embedData) {
		console.log('No embed data');
		return;
	}

	const victim = embedData?.author?.name;
	let description = embedData?.description;
	description = description.split(/\s+/).slice(1);

	const potentialOffender = await guessUser(description.join(' '));
	console.log(potentialOffender);

	const embed = new EmbedBuilder().setColor('#e62525').setTitle(`Zgłoszenie - NOWE`).setDescription(description.join(' ')).addFields(
		{ name: 'Zgłaszający', value: victim, inline: true },
		{ name: 'ID', value: 'e872bc72ah72shhjgdas8e8727gs7272', inline: true },
		{ name: 'Status VIP', value: 'Tak', inline: true },
		{ name: 'Czas na serwerze | połączenia', value: '20h 25min | 100', inline: true },
		{ name: 'Squad', value: 'Axis | FOX | Squad Leader', inline: true },
		{ name: 'Watchlist', value: '-', inline: true },
		{ name: 'Kary', value: 'Ban: 0 | Kick: 1', inline: true },
		{ name: 'K/D/TK', value: '10/7/5', inline: true },
		{ name: 'Seria K/Z/TK', value: '2/3/1', inline: true },

		{ name: '\u200B', value: '\u200B' },

		{ name: 'Podejrzany', value: potentialOffender?.name, inline: true },
		{ name: 'ID', value: 'e872bc72ah72shhjgdas8e8727gs7272', inline: true },
		{ name: 'Status VIP', value: 'Tak', inline: true },
		{ name: 'Czas na serwerze | połączenia', value: '20h 25min | 100', inline: true },
		{ name: 'Squad', value: 'Axis | FOX | Squad Leader', inline: true },
		{ name: 'Watchlist', value: 'zachowuje się jak ameba umysłowa, ostrzegany wielokrotnie', inline: true },
		{ name: 'Kary', value: 'Ban: 1 | Kick: 2', inline: true },
		{ name: 'K/D/TK', value: '10/7/5', inline: true },
		{ name: 'Seria K/Z/TK', value: '2/3/1', inline: true }
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

	return await msg.edit({ components: [row], embeds: [embed.setFooter({ text: `ID Zgłoszenia: ${msg.id} | Server #1` })] });
}

module.exports = { processReport };
