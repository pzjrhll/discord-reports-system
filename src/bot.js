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

const localConfig = JSON.parse(fs.readFileSync('./src/config/local.json', 'utf-8'));

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

client.config = () => {
	let obj = localConfig;
	obj.logsAllWebhook = process.env.LOGS_WEBHOOK_URL;
	return obj;
};

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
	if (folder !== 'handlers') continue;
	const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith('.js'));
	for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
// client.on('debug', (e) => {
// 	console.warn(e);
// 	console.log('xdddddd');
// });

client.login(process.env.DISCORD_BOT_TOKEN);
// console.log(chalk())
// process.exit(0);
