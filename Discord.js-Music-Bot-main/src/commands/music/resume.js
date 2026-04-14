const { SlashCommandBuilder } = require("discord.js");
const {
    ensureSameVoiceChannel,
    getPlayer,
    refreshPanel,
} = require("../../services/musicService");
const { safeReply } = require("../../utils/replies");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume playback."),
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

        if (!player.paused) {
            return safeReply(interaction, {
                content: "Playback is not paused.",
                ephemeral: true,
            });
        }

        player.pause(false);
        await safeReply(interaction, { content: "Resumed playback." });
        await refreshPanel(client, interaction.guildId);
    },
};
