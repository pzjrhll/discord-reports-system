require('dotenv').config();
const { getPlayerIds, getPlayerDetailedInfo, getPlayerStats } = require('./apiWrapper');

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

	const stats = await getPlayerStats(serverid, playername);
	const totalPlaytimeSeconds = player?.profile?.total_playtime_seconds || 0;
	const hours = Math.floor(totalPlaytimeSeconds / 3600);
	const minutes = Math.floor((totalPlaytimeSeconds % 3600) / 60);
	const penalties = player?.profile?.penalty_count;
	const punishNum = player?.profile?.received_actions.filter(
		(action) => action.by !== 'SeedingRulesAutomod' && action.by !== 'NoLeaderWatch' && !action.by.toLowerCase().includes('automod')
	).length;

	let playerInfo = {
		name: `${player?.name} (${player?.level})`,
		nameRaw: player?.name,
		player_id: player?.player_id,
		squad: `${player?.team?.charAt(0)?.toUpperCase() + player?.team.slice(1)} | ${player?.unit_name?.toUpperCase()} | ${
			player?.role?.charAt(0)?.toUpperCase() + player?.role?.slice(1)
		}`,
		playtime: `${hours}h ${minutes}m | ${player?.profile?.sessions_count} sesji`,
		vip: player?.is_vip ? 'Tak' : 'Nie',
		watchlist: player?.profile?.watchlist || '-',
		penalty_count: `Ban: ${penalties?.PERMABAN + penalties?.TEMPBAN} | Kick: ${penalties?.KICK} | Punish: ${punishNum}`,
		stats: `K: ${stats?.kills} | D: ${stats?.deaths} | TK: ${stats?.teamkills} | KPM: ${stats?.kills_per_minute}`,
		series: `K: ${stats?.kills_streak} | D: ${stats?.deaths_without_kill_streak} | TK: ${stats?.teamkills_streak}`,
	};
	return playerInfo;
}

module.exports = { parsePlayerList, parsePlayerInfo };
