# Discord Reports
You have to create both `.env` and `src/config/local.json`

-  `serverReportsWebhookChannelId` - ID of channels where reports (!admin) are sent (Server -> Discord) via a webhook
-  `serverReportsDiscordChannelId` - ID of the channel where reports visible to the administration will be sent by the Bot
-  `servers` - the name of each server must be the same as in the webhook footer
-  `hllAdminDiscordRole` - role pinged upon receiving a report
