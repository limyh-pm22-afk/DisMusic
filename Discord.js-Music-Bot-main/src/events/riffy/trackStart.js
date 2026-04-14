const { refreshPanel } = require("../../services/musicService");

module.exports = {
    name: "trackStart",
    async execute(client, player, track) {
        const channel = await client.channels.fetch(player.textChannel).catch(() => null);

        if (channel?.isTextBased()) {
            await channel
                .send(`Now playing: \`${track.info.title}\` by \`${track.info.author}\`.`)
                .catch(() => null);
        }

        await refreshPanel(client, player.guildId);
    },
};
