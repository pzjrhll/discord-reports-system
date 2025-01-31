require('dotenv').config();
const { getPlayerIds, getPlayerDetailedInfo } = require('./apiWrapper');

async function parsePlayerList(serverId) {
	let list = [];
	const data = await getPlayerIds(serverId);
	data?.result?.forEach((player) => {
		list.push({
			name: player[0],
			id: player[1],
		});
	});
	return list;
}

async function parsePlayerInfo(serverid, playername) {
	const fetch = await getPlayerDetailedInfo(serverid, playername);
	const player = fetch?.result;
	if (!player) return null;

	const totalPlaytimeSeconds = player?.profile?.total_playtime_seconds || 0;
	const hours = Math.floor(totalPlaytimeSeconds / 3600);
	const minutes = Math.floor((totalPlaytimeSeconds % 3600) / 60);
	const penalties = player?.profile?.penalty_count;
	const punishNum = player?.profile?.received_actions.filter(
		(action) => action.by !== 'SeedingRulesAutomod' && action.by !== 'NoLeaderWatch' && !action.by.toLowerCase().includes('automod')
	).length;

	let playerInfo = {
		name: player?.name,
		player_id: player?.player_id,
		squad: `${player?.team} | ${player?.unit_name} | ${player?.role}`,
		playtime: `${hours}h ${minutes}m | ${player?.profile?.sessions_count}`,
		vip: player?.is_vip ? 'Tak' : 'Nie',
		watchlist: player?.profile?.watchlist || '-',
		penalty_count: `Ban: ${penalties?.PERMABAN + penalties?.TEMPBAN} | Kick: ${penalties?.KICK} | Punish: ${punishNum}`,
		stats: `WIP`,
		series: `WIP`,
	};
	return playerInfo;
}

module.exports = { parsePlayerList, parsePlayerInfo };
