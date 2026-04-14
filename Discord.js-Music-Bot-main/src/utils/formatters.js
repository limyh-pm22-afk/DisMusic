function truncate(value, maxLength = 80) {
    if (!value) {
        return "Unknown";
    }

    return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}

function formatDuration(ms) {
    if (!ms || ms < 0) {
        return "Live";
    }

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
    }

    return [minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}

function getQueueLines(player, limit = 5) {
    if (!player || !player.queue?.size) {
        return "No tracks queued.";
    }

    return player.queue
        .slice(0, limit)
        .map((track, index) => {
            return `${index + 1}. ${truncate(track.info.title, 55)} (${formatDuration(track.info.length)})`;
        })
        .join("\n");
}

module.exports = {
    truncate,
    formatDuration,
    getQueueLines,
};
