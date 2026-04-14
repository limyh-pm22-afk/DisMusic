const requiredEnv = [
    "DISCORD_TOKEN",
    "LAVALINK_HOST",
    "LAVALINK_PORT",
    "LAVALINK_PASSWORD",
];

function validateEnv() {
    for (const key of requiredEnv) {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    }
}

module.exports = {
    validateEnv,
};
