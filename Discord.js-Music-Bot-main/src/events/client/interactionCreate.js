const { normalizeReplyPayload } = require("../../utils/replies");

module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        try {
            if (interaction.isChatInputCommand()) {
                const command = client.commands.get(interaction.commandName);
                if (!command) {
                    return;
                }

                await command.execute(client, interaction);
                return;
            }

            if (interaction.isButton()) {
                const handler = [...client.buttonHandlers.values()].find((entry) =>
                    interaction.customId.startsWith(entry.idPrefix)
                );

                if (!handler) {
                    return;
                }

                await handler.execute(client, interaction);
            }
        } catch (error) {
            console.error("Interaction error:", error);

            const payload = {
                content: "Something went wrong while handling that action.",
                ephemeral: true,
            };

            if (interaction.deferred || interaction.replied) {
                await interaction.followUp(normalizeReplyPayload(payload)).catch(() => null);
            } else {
                await interaction.reply(normalizeReplyPayload(payload)).catch(() => null);
            }
        }
    },
};
