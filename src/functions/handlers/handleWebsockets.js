const fs = require('fs');
const WebSocket = require('ws');
require('dotenv').config();
const localConfig = require('../../config/local.json');

const authToken = process.env.RCON_API_KEY;

module.exports = (client) => {
	client.handleWebsockets = async () => {
		//
		console.log(Object.keys(localConfig.servers));
		for (const serverKey of Object.keys(localConfig.servers)) {
			const { name, wsUrl } = localConfig.servers[serverKey];
			client.cout(`Connecting to WebSocket for server: ${name}`);

			let ws = null;
			let isAlive = false;
			let heartbeatInterval;

			const heartbeat = () => {
				isAlive = true;
			};

			const checkConnection = () => {
				if (!isAlive) {
					client.cout('Websocket connection terminated, reconnecting...');
					ws.terminate();
					return;
				}

				isAlive = false;
				ws.ping();
			};

			const connectWebSocket = () => {
				// Clear any existing interval
				if (heartbeatInterval) clearInterval(heartbeatInterval);

				ws = new WebSocket(wsUrl, {
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				});

				ws.on('open', () => {
					isAlive = true;
					ws.send(JSON.stringify({ logs: true }));
					client.cinit(`WebSocket ${name} connection established`);

					// Start heartbeat checking
					heartbeatInterval = setInterval(checkConnection, 3000);
				});

				ws.on('ping', heartbeat);
				ws.on('pong', heartbeat);

				ws.on('message', (data) => {
					try {
						const message = JSON.parse(data);
						message?.logs?.forEach((element) => {
							// console.log(element?.log, name);
							if (element?.log?.action.startsWith('CHAT')) {
								console.log(element?.log);
							}
						});
						// heartbeat(); // Reset heartbeat on message received
					} catch (error) {
						client.cout('Websocket message error');
						client.cerr(error);
					}
				});

				ws.on('error', (error) => {
					client.cout('Websocket client error');
					client.cerr(error);
					isAlive = false;
				});

				ws.on('close', () => {
					client.cout('WebSocket disconnected. Reconnecting...');
					isAlive = false;
					clearInterval(heartbeatInterval);
					setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
				});
			};

			// Initial connection
			connectWebSocket();
		}
	};
};
