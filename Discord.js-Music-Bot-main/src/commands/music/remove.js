const { SlashCommandBuilder } = require("discord.js");
const {
    ensureSameVoiceChannel,
    getPlayer,
    refreshPanel,
} = require("../../services/musicService");
const { truncate } = require("../../utils/formatters");
const { safeReply } = require("../../utils/replies");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Remove a track from the queue.")
        .addIntegerOption((option) =>
            option
                .setName("position")
                .setDescription("Queue position to remove.")
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

        if (!player.queue.size) {
            return safeReply(interaction, {
                content: "The queue is empty.",
                ephemeral: true,
            });
        }

        const position = interaction.options.getInteger("position", true) - 1;
        if (position < 0 || position >= player.queue.size) {
            return safeReply(interaction, {
                content: "That queue position does not exist.",
                ephemeral: true,
            });
        }

        const removed = player.queue.remove(position);
        await safeReply(interaction, {
            content: `Removed \`${truncate(removed.info.title, 70)}\` from the queue.`,
        });
        await refreshPanel(client, interaction.guildId);
    },
};
