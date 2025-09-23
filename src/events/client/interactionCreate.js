module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (interaction.user.id != '351598984529313812') {
			const config = await client.config();
			if (config.devlockEnabled)
				return interaction.editReply({
					content: 'Bot jest chwilowo wyłączony.',
					ephermal: true,
				});
		}

		if (interaction.isChatInputCommand()) {
			const { commands } = client;
			const { commandName } = interaction;
			const command = commands.get(commandName);

			if (!command) return;
			try {
				await command.execute(interaction, client);
			} catch (error) {
				client.cerr(error);
				try {
					await interaction.reply({
						content: 'Something went wrong while executing this command.',
						ephermal: true,
					});
				} catch (err) {
					try {
						await interaction.editReply({
							content: 'Something went wrong while executing this command.',
							ephermal: true,
						});
					} catch (err2) {}
				}
			}
		} else if (interaction.isButton()) {
			const { buttons, clickedButtons } = client;
			const { customId } = interaction;
			const [buttonClass, id] = customId.split(':');
			const button = buttons.get(buttonClass);

			if (!button) return new Error('There is no code for this button.');

			try {
				if (button?.data?.preventDoubleClick) {
					const clicked = clickedButtons.get(id);
					if (clicked) {
						await interaction.deferReply({
							ephemeral: true,
						});
						return await client.qEditReply(interaction, 'error', `Ten przycisk został już kliknięty przez innego użytkownika. Spróbuj ponownie później.`);
					}
					clickedButtons.set(id, true);
					setTimeout(() => {
						clickedButtons.delete(id);
					}, 3 * 1000);
				}
				await button.execute(interaction, client, id);
				clickedButtons.delete(id);
			} catch (error) {
				console.log(error);
			}
		} else if (interaction.isAutocomplete()) {
			const { commands } = client;
			const { commandName } = interaction;
			const command = commands.get(commandName);

			if (!command) return;

			try {
				await command.autocomplete(interaction, client);
			} catch (error) {
				client.cerr(error);
			}
		}
	},
};
