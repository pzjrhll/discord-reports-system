const { EmbedBuilder, WebhookClient } = require('discord.js');
const { DateTime, setZone, Interval, diff } = require('luxon');
const schedule = require('node-schedule');
require('dotenv').config();

module.exports = async (client) => {
	return;
	client.cinit('Loaded backupLogs interval.');

	const job = schedule.scheduleJob('15 * * * *', async function () {
		try {
			const time = DateTime.now();
			const dateFor = time.toISODate();

			const url = process.env.LOGS_TXT_WEBHOOK_URL;
			const webhookLog = new WebhookClient({ url: url });
			webhookLog.send({ files: [`logs/${dateFor}.txt`] });
		} catch (err) {
			client.cerr(err);
		}
	});
};
