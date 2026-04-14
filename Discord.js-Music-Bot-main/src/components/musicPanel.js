const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    MessageFlags,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
} = require("discord.js");
const { formatDuration, getQueueLines, truncate } = require("../utils/formatters");

function buildMusicPanel(player, guildName) {
    const current = player?.current || null;
    const queueSize = player?.queue?.size || 0;
    const state = !player
        ? "Idle"
        : player.paused
          ? "Paused"
          : player.playing
            ? "Playing"
            : "Connected";

    const title = current ? truncate(current.info.title, 70) : "Nothing is playing";
    const artist = current ? truncate(current.info.author, 50) : "Queue up a track with /play";
    const duration = current ? formatDuration(current.info.length) : "--:--";
    const requester = current?.info?.requester ? `<@${current.info.requester.id}>` : "Unknown";

    const controls = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("music:toggle_pause")
            .setLabel(player?.paused ? "Resume" : "Pause")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(!player || (!player.playing && !player.paused)),
        new ButtonBuilder()
            .setCustomId("music:skip")
            .setLabel("Skip")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(!player || !current),
        new ButtonBuilder()
            .setCustomId("music:shuffle")
            .setLabel("Shuffle")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(!player || queueSize < 2),
        new ButtonBuilder()
            .setCustomId("music:stop")
            .setLabel("Stop")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(!player)
    );

    const container = new ContainerBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`## ${guildName} Music Panel`)
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                [
                    `**State:** ${state}`,
                    `**Now Playing:** ${title}`,
                    `**Artist:** ${artist}`,
                    `**Duration:** ${duration}`,
                    `**Requester:** ${requester}`,
                    `**Up Next:** ${queueSize} track(s)`,
                ].join("\n")
            )
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`### Queue Preview\n${getQueueLines(player)}`)
        )
        .addActionRowComponents(controls);

    return {
        flags: MessageFlags.IsComponentsV2,
        components: [container],
    };
}

module.exports = {
    buildMusicPanel,
};
