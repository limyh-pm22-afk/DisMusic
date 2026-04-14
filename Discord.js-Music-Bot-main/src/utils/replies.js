const { MessageFlags } = require("discord.js");

function normalizeReplyPayload(payload) {
    if (!payload || !payload.ephemeral) {
        return payload;
    }

    const nextPayload = { ...payload };
    delete nextPayload.ephemeral;
    nextPayload.flags = (nextPayload.flags || 0) | MessageFlags.Ephemeral;

    return nextPayload;
}

async function safeReply(interaction, payload) {
    const normalizedPayload = normalizeReplyPayload(payload);

    if (interaction.deferred || interaction.replied) {
        return interaction.followUp(normalizedPayload);
    }

    return interaction.reply(normalizedPayload);
}

module.exports = {
    normalizeReplyPayload,
    safeReply,
};
