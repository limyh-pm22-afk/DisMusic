const { refreshPanel } = require("../../services/musicService");

module.exports = {
    name: "trackEnd",
    async execute(client, player) {
        await refreshPanel(client, player.guildId);
    },
};
