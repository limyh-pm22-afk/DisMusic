const { refreshPanel } = require("../../services/musicService");

module.exports = {
    name: "queueEnd",
    async execute(client, player) {
        const channel = await client.channels.fetch(player.textChannel).catch(() => null);
        player.destroy();

        if (channel?.isTextBased()) {
            await channel.send("Queue has ended.").catch(() => null);
        }

        await refreshPanel(client, player.guildId);
    },
};
