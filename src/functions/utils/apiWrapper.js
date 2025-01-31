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

module.exports = { getPlayerIds, getPlayerDetailedInfo };
