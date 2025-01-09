require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, WebhookClient } = require('discord.js');
const { DateTime, setZone, Interval, diff } = require('luxon');
const { v4: uuidv4 } = require('uuid');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
	],
});

// ------ SQL Function ------
// const pool = mysql.createPool({
// 	connectionLimit: 5,
// 	host: process.env.SQL_AUTH_IP,
// 	user: process.env.SQL_AUTH_USERNAME,
// 	password: process.env.SQL_AUTH_PASSWORD,
// 	database: process.env.SQL_DATABASE_NAME,
// });

// pool.getConnection((err, connection) => {
// 	if (err) throw err;
// 	console.log(`[MYSQL] Connected to database successfully!`);
// 	connection.release();
// });
// client.pool = pool;

// client.config = async () => {
// 	let sqlres = await client.pool.promise().query('SELECT * FROM sp_config');
// 	sqlres = sqlres[0];
// 	let res = {};

// 	for (const entry of sqlres) {
// 		try {
// 			const value = JSON.parse(entry.config_value);
// 			const key = entry.config_key;

// 			res[key] = value;
// 		} catch (err) {
// 			console.log('---------- ERROR ----------');
// 			console.log(entry.config_key);
// 			console.log(entry.config_value);
// 			console.log(err);
// 		}
// 	}

// 	return res;
// };

client.config = async () => {
	return {
		devlockEnabled: false,
		gitPullEnabled: false,
		colors: {
			primary: '#426fc2',
			error: '#f04343',
			warning: '#f2df33',
			success: '#4df055',
			neutral: '#286feb',
		},
		logsAllWebhook: 'https://discord.com/api/webhooks/1268249202505285759/M7cyoxWdv7PtSkimOIkO5f0LECxKdVPQhQ8sFtBFu3oQxmSTd2GmfQOxP6Mp5WfVyhv1',
		images: {
			logo: 'https://cdn.discordapp.com/attachments/1267937726779359336/1268249993047838862/u3BroQd.png?ex=66abbd59&is=66aa6bd9&hm=b5339f3286e127f5e6d9d03b787b14a06d9c68c8ddd093ce9a90071722bdcfd8&',
		},
	};
};

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
	const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith('.js'));
	for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client);
}

client.fivemServers = {
	pixa: new FiveM.Server('185.219.84.142:30120'),
	realmMedium: new FiveM.Server('194.107.126.206:30120'),
	atlantis: new FiveM.Server('45.157.235.16:30120'),
	vlife: new FiveM.Server('185.219.84.164:30120'),
};

client.handleEvents();
// client.on('debug', (e) => {
// 	console.warn(e);
// 	console.log('xdddddd');
// });

client.login(process.env.DISCORD_BOT_TOKEN);
// console.log(chalk())
// process.exit(0);
