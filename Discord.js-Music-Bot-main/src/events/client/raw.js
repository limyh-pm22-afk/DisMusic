const { GatewayDispatchEvents } = require("discord.js");

module.exports = {
    name: "raw",
    execute(client, payload) {
        if (
            ![
                GatewayDispatchEvents.VoiceStateUpdate,
                GatewayDispatchEvents.VoiceServerUpdate,
            ].includes(payload.t)
        ) {
            return;
        }

        client.riffy.updateVoiceState(payload);
    },
};
