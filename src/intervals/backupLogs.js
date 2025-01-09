const { EmbedBuilder, WebhookClient } = require('discord.js');
const { DateTime, setZone, Interval, diff } = require('luxon');
const commaNumber = require('comma-number');
const schedule = require('node-schedule');

module.exports = async (client) => {
	client.cinit('Loaded backupLogs interval.');

	const job = schedule.scheduleJob('15 * * * *', async function () {
		try {
         const time = DateTime.now();
         const dateFor = time.toISODate();

         const url = 'https://discord.com/api/webhooks/1271122016916733975/4C41l8SQzBSbfuwvlxUkHU-gokB47A4fn6Tc2-mf82i18I6MdeyKYHe2Iiz5HDkVkzSh'
         const webhookLog = new WebhookClient({ url: url });
         webhookLog.send({ files: [`logs/${dateFor}.txt`] });
			
		} catch (err) {
			client.cerr(err);
		}
	});
};
