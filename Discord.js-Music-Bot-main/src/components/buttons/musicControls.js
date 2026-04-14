const { normalizeReplyPayload } = require("../../utils/replies");
const {
    ensureSameVoiceChannel,
    getPlayer,
    refreshPanel,
} = require("../../services/musicService");

module.exports = {
    idPrefix: "music:",
    async execute(client, interaction) {
        const player = getPlayer(client, interaction.guildId);
        if (!player) {
            return interaction.reply(normalizeReplyPayload({
                content: "There is no active player in this server.",
                ephemeral: true,
            }));
        }

        const sameChannelError = ensureSameVoiceChannel(interaction, player);
        if (sameChannelError) {
            return interaction.reply(
                normalizeReplyPayload({ content: sameChannelError, ephemeral: true })
            );
        }

        const action = interaction.customId.slice(this.idPrefix.length);

        if (action === "toggle_pause") {
            player.pause(!player.paused);
            await interaction.reply(normalizeReplyPayload({
                content: player.paused ? "Paused playback." : "Resumed playback.",
                ephemeral: true,
            }));
        } else if (action === "skip") {
            if (!player.current) {
                return interaction.reply(normalizeReplyPayload({
                    content: "There is no track to skip.",
                    ephemeral: true,
                }));
            }

            player.stop();
            await interaction.reply(
                normalizeReplyPayload({
                    content: "Skipped the current track.",
                    ephemeral: true,
                })
            );
        } else if (action === "shuffle") {
            if (player.queue.size < 2) {
                return interaction.reply(normalizeReplyPayload({
                    content: "Need at least 2 queued tracks to shuffle.",
                    ephemeral: true,
                }));
            }

            player.queue.shuffle();
            await interaction.reply(
                normalizeReplyPayload({
                    content: "Shuffled the queue.",
                    ephemeral: true,
                })
            );
        } else if (action === "stop") {
            player.destroy();
            await interaction.reply(normalizeReplyPayload({
                content: "Stopped playback and disconnected.",
                ephemeral: true,
            }));
        }

        await refreshPanel(client, interaction.guildId);
    },
};
