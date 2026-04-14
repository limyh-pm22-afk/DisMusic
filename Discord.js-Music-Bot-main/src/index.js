require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { Riffy } = require("riffy");
const { validateEnv } = require("./config/env");
const { createNodes, createRiffyOptions } = require("./config/lavalink");
const { loadCommands } = require("./handlers/loadCommands");
const { loadEvents } = require("./handlers/loadEvents");

validateEnv();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.commands = new Map();
client.buttonHandlers = new Map();
client.musicPanels = new Map();

client.riffy = new Riffy(client, createNodes(), createRiffyOptions(client));

loadCommands(client);
loadEvents(client);

client.login(process.env.DISCORD_TOKEN);
