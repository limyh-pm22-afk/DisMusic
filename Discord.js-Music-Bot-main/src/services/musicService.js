const { buildMusicPanel } = require("../components/musicPanel");
const { truncate } = require("../utils/formatters");

function getPlayer(client, guildId) {
    return client.riffy.players.get(guildId) || null;
}

function ensureGuildVoice(interaction) {
    if (!interaction.inGuild()) {
        return "This command can only be used inside a server.";
    }

    const memberChannelId = interaction.member?.voice?.channelId;
    if (!memberChannelId) {
        return "Join a voice channel first.";
    }

    return null;
}

function ensureSameVoiceChannel(interaction, player) {
    const memberChannelId = interaction.member?.voice?.channelId;
    if (!memberChannelId) {
        return "Join a voice channel first.";
    }

    if (player && player.voiceChannel !== memberChannelId) {
        return "Use the same voice channel as the bot to control playback.";
    }

    return null;
}

function createPlayer(client, interaction) {
    return client.riffy.createConnection({
        guildId: interaction.guildId,
        voiceChannel: interaction.member.voice.channelId,
        textChannel: interaction.channelId,
        deaf: true,
    });
}

async function resolveAndQueue(client, interaction, player, query) {
    const resolve = await client.riffy.resolve({
        query,
        requester: interaction.user,
    });
    const { loadType, tracks, playlistInfo } = resolve;

    if (loadType === "playlist") {
        for (const track of tracks) {
            track.info.requester = interaction.user;
            player.queue.add(track);
        }

        if (!player.playing && !player.paused) {
            await player.play();
        }

        return `Added \`${tracks.length}\` tracks from \`${playlistInfo.name}\`.`;
    }

    if (loadType === "search" || loadType === "track") {
        const track = tracks.shift();
        if (!track) {
            return "There were no results for that query.";
        }

        track.info.requester = interaction.user;
        player.queue.add(track);

        if (!player.playing && !player.paused) {
            await player.play();
        }

        return `Added \`${truncate(track.info.title, 70)}\` to the queue.`;
    }

    return "There were no results for that query.";
}

async function refreshPanel(client, guildId) {
    const panel = client.musicPanels.get(guildId);
    if (!panel) {
        return;
    }

    const channel = await client.channels.fetch(panel.channelId).catch(() => null);
    if (!channel?.isTextBased()) {
        return;
    }

    const message = await channel.messages.fetch(panel.messageId).catch(() => null);
    if (!message) {
        client.musicPanels.delete(guildId);
        return;
    }

    const player = getPlayer(client, guildId);
    await message.edit(buildMusicPanel(player, message.guild?.name || "Music"));
}

async function storePanelMessage(client, guildId, channelId, messageId) {
    client.musicPanels.set(guildId, { channelId, messageId });
    await refreshPanel(client, guildId);
}

module.exports = {
    createPlayer,
    ensureGuildVoice,
    ensureSameVoiceChannel,
    getPlayer,
    refreshPanel,
    resolveAndQueue,
    storePanelMessage,
};
