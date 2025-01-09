const fs = require('fs');

module.exports = (client) => {
	client.handleIntervals = async (client2) => {
		const intervalFiles = fs.readdirSync(`./src/intervals`).filter((file) => file.endsWith('.js'));

		for (const file of intervalFiles) {
			try {
				const interval = require(`../../intervals/${file}`)(client2);
			} catch (err) {
				client.cerr(err);
			}
		}
	};
};
