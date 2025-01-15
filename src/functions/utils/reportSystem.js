const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require('discord.js');
const { getPlayers, getPlayersFull } = require('./playerList.js');
const Fuse = require('fuse.js');
require('dotenv').config();

async function guessUser(inputRaw) {
	let input = inputRaw.replace(/\[.*?\]/g, ''); // kasowanie tagów klanowych
	input = input.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, ''); // kasowanie znaków specjalnych
	input = input.split(/\s+/); // rozdzielenie na słowa
	input.filter((word) => word !== 'PZJR' && word !== 'NZN');

	const playerList = await getPlayers();
	let list = [];
	playerList.forEach((player) => {
		list.push({
			name: player.name,
			nameParsed: player.name
				.replace(/\[.*?\]/g, '') // kasowanie tagów klanowych
				.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, '') // kasowanie znaków specjalnych
				.split(/\s+/)
				.filter((word) => word !== 'PZJR' && word !== 'NZN'),
			id: player.id,
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
	const config = client.config();
	const triggerMsg = message;
	const embedData = triggerMsg?.embeds[0];
	if (!embedData) return console.log('No embed data');

	const victim = embedData?.author?.name.split(' ').slice(0, -1).join(' ');
	const description = embedData?.description.split(/\s+/).slice(1);
	const potentialOffender = await guessUser(description.join(' '));
	const serverId = embedData?.footer?.text;

	const embed = new EmbedBuilder().setColor('#f03e3e').setTitle(`Zgłoszenie - NOWE`).setDescription(description.join(' ')).addFields(
		{ name: 'Zgłaszający', value: victim, inline: true },
		{ name: 'ID', value: 'e872bc72ah72shhjgdas8e8727gs7272', inline: true },
		{ name: 'Squad', value: 'Axis | FOX | Squad Leader', inline: true },
		{ name: 'Czas na serwerze | połączenia', value: '20h 25min | 100', inline: true },
		{ name: 'Status VIP', value: 'Tak', inline: true },
		{ name: 'Watchlist', value: '-', inline: true },
		{ name: 'Kary', value: 'Ban: 0 | Kick: 1', inline: true },
		{ name: 'K/D/TK', value: '10/7/5', inline: true },
		{ name: 'Seria K/Z/TK', value: '2/3/1', inline: true },

		{ name: '\u200B', value: '\u200B' },

		{ name: 'Podejrzany', value: potentialOffender?.name, inline: true },
		{ name: 'ID', value: 'e872bc72ah72shhjgdas8e8727gs7272', inline: true },
		{ name: 'Squad', value: 'Axis | FOX | Squad Leader', inline: true },
		{ name: 'Czas na serwerze | połączenia', value: '20h 25min | 100', inline: true },
		{ name: 'Status VIP', value: 'Tak', inline: true },
		{ name: 'Watchlist', value: 'zachowuje się jak ameba umysłowa, ostrzegany wielokrotnie', inline: true },
		{ name: 'Kary', value: 'Ban: 1 | Kick: 2', inline: true },
		{ name: 'K/D/TK', value: '10/7/5', inline: true },
		{ name: 'Seria K/Z/TK', value: '2/3/1', inline: true }
	);

	const channel = await message.guild.channels.fetch(config.serverReportsDiscordChannelId);
	const msg = await channel.send({
		// embeds: [embed],
		content: `<@&${config.hllAdminDiscordRole}>`,
	});
	const row = new ActionRowBuilder().addComponents([
		new ButtonBuilder().setCustomId(`report-claim:${msg.id}`).setLabel('Zajmuję się tym').setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId(`report-close:${msg.id}`).setLabel('Ogarnięte').setStyle(ButtonStyle.Success),
	]);

	return await msg.edit({ components: [row], embeds: [embed.setFooter({ text: `ID Zgłoszenia: ${msg.id} | ${serverId}` })] });
}

module.exports = { processReport };
