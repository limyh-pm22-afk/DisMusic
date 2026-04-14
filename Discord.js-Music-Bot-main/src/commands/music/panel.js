const { SlashCommandBuilder } = require("discord.js");
const { buildMusicPanel } = require("../../components/musicPanel");
const { getPlayer, storePanelMessage } = require("../../services/musicService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setDescription("Post the player control panel."),
    async execute(client, interaction) {
        const player = getPlayer(client, interaction.guildId);
        const payload = buildMusicPanel(player, interaction.guild.name);
        const response = await interaction.reply({
            ...payload,
            withResponse: true,
        });

        const messageId = response.resource?.message?.id;
        if (messageId) {
            await storePanelMessage(
                client,
                interaction.guildId,
                interaction.channelId,
                messageId
            );
        }
    },
};
