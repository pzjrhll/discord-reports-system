const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { parsePlayerList, parsePlayerInfo } = require('./playerList.js');
const { messagePlayer, getIngameAdmins } = require('./apiWrapper.js');
const Fuse = require('fuse.js');
require('dotenv').config();

const messages = {
	noDescription: 'PL: Aby zgłosić sprawę do admina, wpisz !admin <wiadomość do admina>\n\nENG: To report an issue to the admin, please type !admin <message to admin>.',
	reportSent:
		'PL: Twoje zgłoszenie została wysłane! Prosimy o niewysyłanie wielu wiadomości w sprawie tego samego zgłoszenia - ktoś wkrótce się nim zajmie.\n\nENG: Your report has been submitted! Please refrain from sending multiple reports regarding the same issue - someone will handle it shortly.',
};

const emoji = {
	orange: '🟧',
	check: '✅',
};

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

async function processReport(message, authorName, serverId, client) {
	const config = client.config();
	// const serverId = embedData?.footer?.text.toLowerCase();
	const description = message.split(/\s+/).slice(1);
	const victim = authorName;
	const victimData = await parsePlayerInfo(serverId, victim);
	if (description.length < 1) {
		return await messagePlayer(serverId, victimData?.player_id, messages.noDescription, 'System');
	}
	const potentialOffender = await guessUser(description.join(' '), serverId);
	const offenderData = await parsePlayerInfo(serverId, potentialOffender?.name);

	const embed = new EmbedBuilder()
		// .setColor('#f03e3e')
		.setTitle(`Zgłoszenie - NOWE`)
		.setDescription(description.join(' '))
		.addFields(
			{ name: '\u200B', value: '\u200B' },

			{ name: 'Zgłaszający', value: victimData?.name || 'N/A', inline: true },
			{ name: 'ID', value: victimData?.player_id || 'N/A', inline: true },
			{ name: 'Squad', value: victimData?.squad || 'N/A', inline: true },
			{ name: 'Czas na serwerze', value: victimData?.playtime || 'N/A', inline: true },
			{ name: 'Status VIP', value: victimData?.vip || 'N/A', inline: true },
			{ name: 'Watchlist', value: victimData?.watchlist?.reason || 'N/A', inline: true },
			{ name: 'Kary', value: victimData?.penalty_count || 'N/A', inline: true },
			{ name: 'Statystyki', value: victimData?.stats || 'N/A', inline: true },
			{ name: 'Serie', value: victimData?.series || 'N/A', inline: true },

			{ name: '\u200B', value: '\u200B' },

			{ name: 'Podejrzany gracz', value: offenderData?.name || 'N/A', inline: true },
			{ name: 'ID', value: offenderData?.player_id || 'N/A', inline: true },
			{ name: 'Squad', value: offenderData?.squad || 'N/A', inline: true },
			{ name: 'Czas na serwerze', value: offenderData?.playtime || 'N/A', inline: true },
			{ name: 'Status VIP', value: offenderData?.vip || 'N/A', inline: true },
			{ name: 'Watchlist', value: offenderData?.watchlist?.reason || 'N/A', inline: true },
			{ name: 'Kary', value: offenderData?.penalty_count || 'N/A', inline: true },
			{ name: 'Statystyki', value: offenderData?.stats || 'N/A', inline: true },
			{ name: 'Serie', value: offenderData?.series || 'N/A', inline: true }
		);

	const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
	const channel = await guild.channels.fetch(config.serverReportsDiscordChannelId);
	const pingText = config.servers[serverId].roles.map((role) => `<@&${role}>`).join(' ');
	const msg = await channel.send({
		// embeds: [embed],
		content: pingText || '.',
	});
	const row = new ActionRowBuilder().addComponents([
		new ButtonBuilder().setCustomId(`report-claim:${msg.id}`).setLabel(`${emoji.orange} Zajmuję się tym`).setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId(`report-close:${msg.id}`).setLabel(`${emoji.check} Ogarnięte`).setStyle(ButtonStyle.Success),
	]);

	await msg.edit({ components: [row], embeds: [embed.setFooter({ text: `ID Zgłoszenia: ${msg.id} | ${serverId}` })] });
	await msg.startThread({ name: `Zgłoszenie - ${offenderData?.nameRaw}`, autoArchiveDuration: 1440 });

	const ingameAdmins = await getIngameAdmins(serverId);
	const adminPreviewMsg = `OTRZYMANO NOWE ZGŁOSZENIE!\nOd: ${victimData?.nameRaw || 'N/A'} [${victimData?.squad}] \nNa: ${offenderData?.nameRaw || 'N/A'} [${
		offenderData?.squad
	}]\n\nTreść: ${description.join(' ')}`;
	for (const admin of ingameAdmins?.result) {
		const adminId = admin?.player_id;
		await messagePlayer(serverId, adminId, adminPreviewMsg, 'System');
	}
	return await messagePlayer(serverId, victimData?.player_id, messages.reportSent, 'System');
}

module.exports = { processReport };
