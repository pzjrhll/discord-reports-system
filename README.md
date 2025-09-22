# HLL Discord Reports System
[![License](https://img.shields.io/github/license/pzjrhll/discord-reports-system)](./LICENSE)
![Node.js version](https://img.shields.io/badge/node-%3E%3D22.12.0-brightgreen)
![Docker](https://img.shields.io/badge/docker-ready-blue)
[![GitHub stars](https://img.shields.io/github/stars/pzjrhll/discord-reports-system?style=social)](https://github.com/pzjrhll/discord-reports-system/stargazers)

This Discord bot is based on [CRCON](https://github.com/MarechJ/hll_rcon_tool). It efficiently scans admin ping messages for reported player names (using fuzzy-search algorithm) and provides important information to help your admins make quick and informed decisions. It includes details such as player names, Steam IDs, number of team kills, team kill streaks, and total game time on the server.

![Preview 1](https://github.com/user-attachments/assets/1f32f74d-d95a-41aa-baf9-0309b8087f7e)

## Requirements
- Node.js `v22.12.0`
- Docker & Docker Compose

## Build and run
`docker compose build && docker compose up -d`

## Config files
You have to create both `.env` and `local.json`

- `serverReportsWebhookChannelId` - ID of channels where reports (!admin) are sent (Server -> Discord) via a webhook
- `serverReportsDiscordChannelId` - ID of the channel where reports visible to the administration will be sent by the Bot
- `servers` - the name of each server must be the same as in the webhook footer
Everything else is self explanatory.

## Credits
Credits to [Kacper Jaworski](https://github.com/iotamale) and [Kamil C.](https://github.com/kamilkamilc)
