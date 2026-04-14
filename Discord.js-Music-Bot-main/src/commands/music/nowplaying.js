const { SlashCommandBuilder } = require("discord.js");
const {
    ensureSameVoiceChannel,
    getPlayer,
} = require("../../services/musicService");
const { truncate } = require("../../utils/formatters");
const { safeReply } = require("../../utils/replies");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Show the current track."),
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

        if (!player.current) {
            return safeReply(interaction, {
                content: "Nothing is playing right now.",
                ephemeral: true,
            });
        }

        return safeReply(interaction, {
            content: `Now playing \`${truncate(player.current.info.title, 70)}\` by \`${truncate(player.current.info.author, 40)}\`.`,
            ephemeral: true,
        });
    },
};
