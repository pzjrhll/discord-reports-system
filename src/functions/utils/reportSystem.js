const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebhookClient } = require('discord.js');
const { parsePlayerList, parsePlayerInfo } = require('./playerList.js');
const { getPlayerStats } = require('./apiWrapper.js');

const Fuse = require('fuse.js');
require('dotenv').config();

async function guessUser(inputRaw, serverId) {
	let input = inputRaw.replace(/\[.*?\]/g, ''); // kasowanie tagów klanowych
	input = input.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, ''); // kasowanie znaków specjalnych
	input = input.split(/\s+/); // rozdzielenie na słowa
	input.filter((word) => word !== 'PZJR' && word !== 'NZN');

	const playerList = await parsePlayerList(serverId);
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

	const serverId = embedData?.footer?.text.toLowerCase();
	const description = embedData?.description.split(/\s+/).slice(1);
	const potentialOffender = await guessUser(description.join(' '), serverId);
	const offenderData = await parsePlayerInfo(serverId, potentialOffender?.name);
	const offenderStats = await getPlayerStats(serverId, potentialOffender?.name);
	const victim = embedData?.author?.name.split(' ').slice(0, -1).join(' ');
	const victimData = await parsePlayerInfo(serverId, victim);
	const victimStats = await getPlayerStats(serverId, victim);
	console.log(offenderStats, victimStats);

	const embed = new EmbedBuilder()
		.setColor('#f03e3e')
		.setTitle(`Zgłoszenie - NOWE`)
		.setDescription(description.join(' '))
		.addFields(
			{ name: 'Podejrzany gracz', value: offenderData?.name || 'N/A', inline: true },
			{ name: 'ID', value: offenderData?.player_id || 'N/A', inline: true },
			{ name: 'Squad', value: offenderData?.squad || 'N/A', inline: true },
			{ name: 'Czas na serwerze | połączenia', value: offenderData?.playtime || 'N/A', inline: true },
			{ name: 'Status VIP', value: offenderData?.vip || 'N/A', inline: true },
			{ name: 'Watchlist', value: offenderData?.watchlist || 'N/A', inline: true },
			{ name: 'Kary', value: offenderData?.penalty_count || 'N/A', inline: true },
			{ name: 'K/D/TK', value: offenderData?.stats || 'N/A', inline: true },
			{ name: 'Seria K/Z/TK', value: offenderData?.series || 'N/A', inline: true },

			{ name: '\u200B', value: '\u200B' },

			{ name: 'Zgłaszający', value: victimData?.name || 'N/A', inline: true },
			{ name: 'ID', value: victimData?.player_id || 'N/A', inline: true },
			{ name: 'Squad', value: victimData?.squad || 'N/A', inline: true },
			{ name: 'Czas na serwerze | połączenia', value: victimData?.playtime || 'N/A', inline: true },
			{ name: 'Status VIP', value: victimData?.vip || 'N/A', inline: true },
			{ name: 'Watchlist', value: victimData?.watchlist || 'N/A', inline: true },
			{ name: 'Kary', value: victimData?.penalty_count || 'N/A', inline: true },
			{ name: 'K/D/TK', value: victimData?.stats || 'N/A', inline: true },
			{ name: 'Seria K/Z/TK', value: victimData?.series || 'N/A', inline: true }
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
