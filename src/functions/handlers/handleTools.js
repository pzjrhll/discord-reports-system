const fs = require('fs');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { DateTime, setZone, Interval, diff } = require('luxon');
const chalk = require('chalk');
const path = require('path');
const localConfig = JSON.parse(fs.readFileSync('src/config/local.json', 'utf-8'));

module.exports = (client) => {
	client.getLine = (e = new Error()) => {
		const num = 2;
		// const e = new Error();
		const regex = /\((.*):(\d+):(\d+)\)$/;
		const match = regex.exec(e.stack.split('\n')[num]);
		const filepath = match[1];
		const fileName = path.basename(filepath);
		const filePathRelative = path.relative('./src/', filepath);
		const line = match[2];
		const column = match[3];
		return {
			filepath,
			fileName,
			filePathRelative,
			line,
			column,
			str: `${filePathRelative}:${line}:${column}`,
		};
	};

	client.writeLog = async (msg, type, loc, time, date) => {
		if (!localConfig?.backupLogsLocally) return;
		const newData = `\n${date} ${time} | ${type} | ${loc} | ${JSON.stringify(msg)}`;
		fs.appendFile(`logs/${date}.txt`, newData, (err) => {
			if (err) console.error(err);
		});
	};

	client.handleTools = async () => {
		const config = await client.config();

		client.cinit = (msg) => {
			const info = chalk.green.bold;
			const txt = chalk.bold;
			const time = DateTime.now();
			const t = chalk.bgGreen;

			const loc = client.getLine(new Error());
			const dateFor = time.toISODate();
			const timeFor = time.toLocaleString(DateTime.TIME_24_WITH_SECONDS);

			console.log(t(dateFor + ' ' + timeFor) + info(' [Startup Procedure]: ') + chalk.bold(msg));
			client.writeLog(msg, 'Startup Procedure', loc?.str, timeFor, dateFor);
		};

		client.cout = (msg) => {
			const info = chalk.blue.bold;
			const txt = chalk.bold;
			const time = DateTime.now();
			const t = chalk.bgBlue;

			const loc = client.getLine(new Error());
			const dateFor = time.toISODate();
			const timeFor = time.toLocaleString(DateTime.TIME_24_WITH_SECONDS);

			if (typeof msg == 'number' || typeof msg == 'boolean' || typeof msg == 'string' || typeof msg == 'undefined' || msg === null) {
				console.log(t(dateFor + ' ' + timeFor) + info(' [System Output]: ') + txt(msg));
			} else {
				console.log(t(dateFor + ' ' + timeFor) + info(' [System Output]: ') + txt('Avaiable below:'));
				console.log(msg);
			}
			client.writeLog(msg, 'System Output', loc?.str, timeFor, dateFor);
		};

		client.cerr = (msg) => {
			const info = chalk.red.bold;
			const txt = chalk.bold;
			const time = DateTime.now();
			const t = chalk.bgRed;

			const loc = client.getLine(new Error());
			const dateFor = time.toISODate();
			const timeFor = time.toLocaleString(DateTime.TIME_24_WITH_SECONDS);

			console.log(t(dateFor + ' ' + timeFor) + info(' [System Error]: ') + txt(msg));
			console.error(msg);
			client.writeLog(msg, 'System Error', loc?.str, timeFor, dateFor);
		};

		client.sql = async (query, args) => {
			let res;
			try {
				res = await client.pool.promise().query(query, args);
				res = res[0];
			} catch (err) {
				client.cerr(err);
			}
			return res;
		};

		client.sqlOne = async (query, args) => {
			let res;
			try {
				res = await client.pool.promise().query(query, args);
				res = res[0][0];
			} catch (err) {
				client.cerr(err);
			}
			return res;
		};

		// ------ Embed Builder ------=
		client.embed = (type, message) => {
			let embed = new EmbedBuilder();

			if (type === 'error') {
				embed.setColor(config.colors.error).setDescription(`:x: ${message}`);
			} else if (type === 'warning') {
				embed.setColor(config.colors.warning).setDescription(`:warning: ${message}`);
			} else if (type === 'success') {
				embed.setColor(config.colors.success).setDescription(`:white_check_mark: ${message}`);
			} else if (type === 'neutral') {
				embed.setColor(config.colors.neutral).setDescription(`${message}`);
			}
			return embed;
		};

		// ------ Interaction reply ------
		client.qEditReply = async (interaction, type, message) => {
			await interaction.editReply({
				embeds: [client.embed(type, message)],
			});
		};

		// ------ Command Usage Logs ------
		client.logAction = async (actionStr, interaction, targetUserId, success) => {
			if (!config.logsAllWebhook) return;
			const log_id = uuidv4();
			const timeNow = DateTime.now().setZone('Europe/Warsaw').setLocale('pl').toISO();
			const userId = interaction.user.id;
			let command;
			if (interaction.isButton()) {
				const { customId } = interaction;
				const [buttonClass, id] = customId.split(':');
				command = buttonClass;
			} else {
				if (interaction.options?._subcommand) command = `${interaction.commandName}-${interaction.options._subcommand}`;
				else command = interaction.commandName;
			}

			try {
				let embed = new EmbedBuilder()
					.setColor(success ? config.colors.success : config.colors.error)
					.setTitle(command)
					.setFooter({ text: log_id, iconURL: config.images.logo })
					.setTimestamp();
				if (targetUserId) {
					embed.addFields({ name: 'User', value: `<@${userId}>` }, { name: 'Cel', value: `<@${targetUserId}>` }, { name: 'Akcja', value: actionStr });
				} else {
					embed.addFields({ name: 'User', value: `<@${userId}>` }, { name: 'Akcja', value: actionStr });
				}

				const webhookLog = new WebhookClient({ url: config.logsAllWebhook });
				webhookLog.send({ embeds: [embed] });
			} catch (err) {
				client.cerr(err);
			}
		};

		client.logActionManual = async (actionStr, cmdname, interaction, targetUserId, success) => {
			if (!config.logsAllWebhook) return;
			const log_id = uuidv4();
			const timeNow = DateTime.now().setZone('Europe/Warsaw').setLocale('pl').toISO();
			const userId = interaction.user.id;
			let command = cmdname;
			try {
				let embed = new EmbedBuilder()
					.setColor(success ? config.colors.success : config.colors.error)
					.setTitle(command)
					.setFooter({ text: log_id, iconURL: config.images.logo })
					.setTimestamp();
				if (targetUserId) {
					embed.addFields({ name: 'User', value: `<@${userId}>` }, { name: 'Cel', value: `<@${targetUserId}>` }, { name: 'Akcja', value: actionStr });
				} else {
					embed.addFields({ name: 'User', value: `<@${userId}>` }, { name: 'Akcja', value: actionStr });
				}

				const webhookLog = new WebhookClient({ url: config.logsAllWebhook });
				webhookLog.send({ embeds: [embed] });
			} catch (err) {
				client.cerr(err);
			}
		};

		// console.log('[TOOLS] Loaded useful functions.');
		client.cinit('Loaded developer utility tools.');
	};
};
