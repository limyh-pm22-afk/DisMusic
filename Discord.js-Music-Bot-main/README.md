# Discord.js Music Bot

A modular Discord music bot built with `discord.js`, `riffy`, Lavalink, and a Components v2 control panel.

## Features

- Slash-command based music controls
- Components v2 music panel with playback buttons
- Lavalink playback powered by `riffy`
- Queue management with move, remove, shuffle, and preview support
- Clean project structure with separate commands, events, handlers, and services

## Requirements

- Node.js 18 or newer
- A Discord bot application
- A running Lavalink server

## Installation

```bash
npm install
```

Copy `.env.example` to `.env` and fill in your bot token and Lavalink details.

## Environment Variables

```env
DISCORD_TOKEN=your-discord-bot-token
LAVALINK_HOST=localhost
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass
LAVALINK_SECURE=false
DEFAULT_SEARCH_PLATFORM=ytmsearch
LAVALINK_REST_VERSION=v4
```

## Running The Bot

Start your Lavalink server first, then run:

```bash
npm start
```

Optional syntax check:

```bash
npm run check
```

## Slash Commands

- `/play query:<song name or url>`
- `/pause`
- `/resume`
- `/skip`
- `/stop`
- `/shuffle`
- `/queue`
- `/nowplaying`
- `/remove position:<number>`
- `/move from:<number> to:<number>`
- `/panel`

These commands are registered automatically when the bot logs in.

## Project Structure

```text
src/
  commands/
    music/
  components/
    buttons/
  config/
  events/
    client/
    riffy/
  handlers/
  services/
  utils/
  index.js
```

## Notes

- The bot uses global application command registration through `client.application.commands.set(...)`.
- Global slash command updates can take a little time to appear in Discord.
- The `/panel` command posts the Components v2 control panel for the current server.
