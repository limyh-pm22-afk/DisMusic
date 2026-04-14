const { SlashCommandBuilder } = require("discord.js");
const {
    ensureSameVoiceChannel,
    getPlayer,
    refreshPanel,
} = require("../../services/musicService");
const { safeReply } = require("../../utils/replies");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffle the queue."),
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
                content: "Need at least 2 queued tracks to shuffle.",
                ephemeral: true,
            });
        }

        player.queue.shuffle();
        await safeReply(interaction, { content: "Shuffled the queue." });
        await refreshPanel(client, interaction.guildId);
    },
};
