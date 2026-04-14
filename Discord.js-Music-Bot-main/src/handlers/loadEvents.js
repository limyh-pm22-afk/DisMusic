const { readdirSync } = require("node:fs");
const { join } = require("node:path");

function registerClientEvents(client, eventsPath) {
    const files = readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

    for (const file of files) {
        const event = require(join(eventsPath, file));
        const handler = (...args) => event.execute(client, ...args);

        if (event.once) {
            client.once(event.name, handler);
        } else {
            client.on(event.name, handler);
        }
    }
}

function registerRiffyEvents(client, eventsPath) {
    const files = readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

    for (const file of files) {
        const event = require(join(eventsPath, file));
        client.riffy.on(event.name, (...args) => event.execute(client, ...args));
    }
}

function loadEvents(client) {
    registerClientEvents(client, join(__dirname, "..", "events", "client"));
    registerRiffyEvents(client, join(__dirname, "..", "events", "riffy"));

    const buttonHandler = require(join(
        __dirname,
        "..",
        "components",
        "buttons",
        "musicControls.js"
    ));

    client.buttonHandlers.set(buttonHandler.idPrefix, buttonHandler);
}

module.exports = {
    loadEvents,
};
