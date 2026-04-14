module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        client.riffy.init(client.user.id);

        const commandData = [...client.commands.values()].map((command) =>
            command.data.toJSON()
        );
        await client.application.commands.set(commandData);

        console.log(`Logged in as ${client.user.tag}`);
    },
};
