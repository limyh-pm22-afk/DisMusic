const { SlashCommandBuilder } = require("discord.js");
const {
    ensureSameVoiceChannel,
    getPlayer,
} = require("../../services/musicService");
const { getQueueLines, truncate } = require("../../utils/formatters");
const { safeReply } = require("../../utils/replies");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Show the current queue."),
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

        const currentTitle = player.current
            ? truncate(player.current.info.title, 70)
            : "Nothing is playing";

        return safeReply(interaction, {
            content: [`Now Playing: ${currentTitle}`, "", getQueueLines(player, 10)].join("\n"),
            ephemeral: true,
        });
    },
};
