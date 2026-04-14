const { SlashCommandBuilder } = require("discord.js");
const {
    createPlayer,
    ensureGuildVoice,
    ensureSameVoiceChannel,
    getPlayer,
    refreshPanel,
    resolveAndQueue,
} = require("../../services/musicService");
const { safeReply } = require("../../utils/replies");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song, video, or playlist.")
        .addStringOption((option) =>
            option
                .setName("query")
                .setDescription("Song name, search terms, or URL.")
                .setRequired(true)
        ),
    async execute(client, interaction) {
        const voiceError = ensureGuildVoice(interaction);
        if (voiceError) {
            return safeReply(interaction, { content: voiceError, ephemeral: true });
        }

        const existingPlayer = getPlayer(client, interaction.guildId);
        const sameChannelError = ensureSameVoiceChannel(interaction, existingPlayer);
        if (sameChannelError) {
            return safeReply(interaction, { content: sameChannelError, ephemeral: true });
        }

        await interaction.deferReply();

        const player = existingPlayer || createPlayer(client, interaction);
        const query = interaction.options.getString("query", true);
        const result = await resolveAndQueue(client, interaction, player, query);

        await interaction.editReply({ content: result });
        await refreshPanel(client, interaction.guildId);
    },
};
