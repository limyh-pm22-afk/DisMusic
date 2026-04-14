const { readdirSync } = require("node:fs");
const { join } = require("node:path");

function loadCommands(client) {
    const commandsPath = join(__dirname, "..", "commands");
    const categories = readdirSync(commandsPath, { withFileTypes: true }).filter((entry) =>
        entry.isDirectory()
    );

    for (const category of categories) {
        const categoryPath = join(commandsPath, category.name);
        const commandFiles = readdirSync(categoryPath).filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(join(categoryPath, file));
            const commandName = command?.data?.toJSON?.().name;

            if (!commandName || typeof command.execute !== "function") {
                continue;
            }

            client.commands.set(commandName, command);
        }
    }
}

module.exports = {
    loadCommands,
};
