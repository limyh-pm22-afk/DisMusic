const { SlashCommandBuilder } = require("discord.js");
const {
    ensureSameVoiceChannel,
    getPlayer,
    refreshPanel,
} = require("../../services/musicService");
const { safeReply } = require("../../utils/replies");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop playback and disconnect."),
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

        player.destroy();
        await safeReply(interaction, { content: "Stopped playback and left the voice channel." });
        await refreshPanel(client, interaction.guildId);
    },
};
