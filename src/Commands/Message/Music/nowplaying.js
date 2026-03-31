import { EmbedBuilder } from "discord.js";
import { buildNowPlayingCard, formatDuration } from "../../../Struct/musicUtils.js";

export default {
  name: "nowplaying",
  aliases: ["np"],
  category: "Music",
  permission: "",
  desc: "Shows the current song with a rich Canvas card.",
  options: {
    owner: false,
    inVc: false,
    sameVc: false,
    player: {
      playing: true,
      active: true,
    },
    premium: false,
    vote: false,
  },
  run: async ({ client, message }) => {
    const player = client.kazagumo.players.get(message.guild.id);
    const track = player?.queue?.current;
    if (!player || !track) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription("Nothing is playing right now."),
        ],
      });
    }

    const card = await buildNowPlayingCard(player, track);
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setTitle("Now Playing")
          .setDescription(
            `**[${track.title}](${track.uri || "https://discord.gg/wcqmHgNzDn"})**\n` +
              `By **${track.author || "Unknown"}**\n` +
              `Duration: \`${track.isStream ? "LIVE" : formatDuration(track.length)}\``
          )
          .setImage("attachment://nowplaying.png"),
      ],
      files: [card],
    });
  },
};
