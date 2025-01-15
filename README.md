# Discord Reports
Instalacja: należy utworzyć pliki .env, src/config/local.json oraz katalog /logs

Opis znaczenia wartości z pliku local.conf
-  `serverReportsWebhookChannelId` - id kanałów, na które wysyłane są zgłoszenie (Server -> Discord) przez webhook
-  `serverReportsDiscordChannelId` - id kanału, na który będą trafiać reporty widoczne dla administracji
-  `servers` - jak nazwa wskazuje, nazwa każdego serwera musi być taka sama jak w footerze webhooka (wielkość znaków nie ma znaczenia)
-  `hllAdminDiscordRole` - rola pingowana przy otrzymaniu reporta
