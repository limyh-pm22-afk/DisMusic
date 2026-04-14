function createNodes() {
    return [
        {
            host: process.env.LAVALINK_HOST,
            password: process.env.LAVALINK_PASSWORD,
            port: Number(process.env.LAVALINK_PORT),
            secure: process.env.LAVALINK_SECURE === "true",
        },
    ];
}

function createRiffyOptions(client) {
    return {
        send: (payload) => {
            const guild = client.guilds.cache.get(payload.d.guild_id);
            if (guild) {
                guild.shard.send(payload);
            }
        },
        defaultSearchPlatform: process.env.DEFAULT_SEARCH_PLATFORM || "ytmsearch",
        restVersion: process.env.LAVALINK_REST_VERSION || "v4",
    };
}

module.exports = {
    createNodes,
    createRiffyOptions,
};
