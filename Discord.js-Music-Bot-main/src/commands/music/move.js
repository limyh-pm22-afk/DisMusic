const { SlashCommandBuilder } = require("discord.js");
const {
    ensureSameVoiceChannel,
    getPlayer,
    refreshPanel,
} = require("../../services/musicService");
const { safeReply } = require("../../utils/replies");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("move")
        .setDescription("Move a queued track to another position.")
        .addIntegerOption((option) =>
            option
                .setName("from")
                .setDescription("Current queue position.")
                .setMinValue(1)
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("to")
                .setDescription("New queue position.")
                .setMinValue(1)
                .setRequired(true)
        ),
    async execute(client, interaction) {
        const player = getPlayer(client, interaction.guildId);
        if (!player) {
            return safeReply(interaction, {
                content: "There is no active player in this server.",
                ephemeral: true,
            });
        }

        const sameChannelError = ensureSameVoiceChannel(interaction, player);
        if (sameChannelError) {
            return safeReply(interaction, { content: sameChannelError, ephemeral: true });
        }

        if (player.queue.size < 2) {
            return safeReply(interaction, {
                content: "Need at least 2 queued tracks to move one.",
                ephemeral: true,
            });
        }

        const from = interaction.options.getInteger("from", true) - 1;
        const to = interaction.options.getInteger("to", true) - 1;

        if (from < 0 || to < 0 || from >= player.queue.size || to >= player.queue.size) {
            return safeReply(interaction, {
                content: "One of those queue positions is invalid.",
                ephemeral: true,
            });
        }

        player.queue.move(from, to);
        await safeReply(interaction, {
            content: `Moved track from position ${from + 1} to ${to + 1}.`,
        });
        await refreshPanel(client, interaction.guildId);
    },
};
