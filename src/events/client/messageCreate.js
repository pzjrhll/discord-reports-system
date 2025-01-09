const { DateTime, setZone, Interval, diff } = require('luxon');

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message, client) {
		try {
			// if (message.author.bot) return;
		} catch (err) {
			client.cerr(err);
		}
	},
};
