require('dotenv').config();
const apiKey = process.env.RCON_API_KEY;
const axios = require('axios');
const localConfig = require('../../config/local.json');

async function getPlayerIds(serverId) {
	const server = localConfig.servers[serverId];
	const url = `${server.apiBaseUrl}/get_playerids`;

	try {
		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching player IDs:', error);
		throw error;
	}
}

async function getPlayerStats(serverId, playerName) {
	const server = localConfig.servers[serverId];
	const url = `${server.apiBaseUrl}/get_live_game_stats`;

	try {
		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		});
		const data = response?.data?.result?.stats.filter((player) => player.player === playerName);
		return data[0] || null;
	} catch (error) {
		console.error('Error fetching player IDs:', error);
		throw error;
	}
}

async function getPlayerDetailedInfo(serverId, playerName) {
	const server = localConfig.servers[serverId];
	const url = `${server.apiBaseUrl}get_detailed_player_info?player_name=${playerName}`;

	try {
		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching player IDs:', error);
		throw error;
	}
}

async function messagePlayer(serverId, playerId, message, sender) {
	const server = localConfig.servers[serverId];
	const url = `${server.apiBaseUrl}message_player`;

	try {
		const response = await axios.post(
			url,
			{
				player_id: playerId,
				message: message,
				by: sender,
			},
			{
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error messaging a player:', error);
		throw error;
	}
}

module.exports = { getPlayerIds, getPlayerDetailedInfo, getPlayerStats, messagePlayer };
