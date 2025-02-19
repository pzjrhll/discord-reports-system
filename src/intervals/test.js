const { EmbedBuilder, WebhookClient } = require('discord.js');
const { DateTime, setZone, Interval, diff } = require('luxon');
const schedule = require('node-schedule');
require('dotenv').config();

module.exports = async (client) => {
	return;

	const job = schedule.scheduleJob('15 * * * *', async function () {
		try {
			//
		} catch (err) {
			client.cerr(err);
		}
	});
};
