# Discord Reports
Instalacja: należy utworzyć pliki .env, src/config/local.json

Opis znaczenia wartości z pliku local.conf
-  `serverReportsWebhookChannelId` - id kanałów, na które wysyłane są zgłoszenie (Server -> Discord) przez webhook
-  `serverReportsDiscordChannelId` - id kanału, na który będą trafiać reporty widoczne dla administracji
-  `servers` - nazwa każdego serwera musi być taka sama jak w footerze webhooka
-  `hllAdminDiscordRole` - rola pingowana przy otrzymaniu reporta
