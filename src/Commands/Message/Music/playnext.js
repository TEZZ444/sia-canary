import { EmbedBuilder } from "discord.js";
import {
  ensurePlayer,
  playIfIdle,
  resolveQuery,
} from "../../../Struct/musicUtils.js";

export default {
  name: "playnext",
  aliases: ["pn", "nextplay"],
  category: "Music",
  permission: "",
  desc: "Queues a track to play next.",
  options: {
    owner: false,
    inVc: true,
    sameVc: false,
    player: {
      playing: false,
      active: false,
    },
    premium: false,
    vote: false,
  },
  run: async ({ client, message, args }) => {
    const query = args.join(" ").trim();
    if (!query) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription("Provide a song name or URL."),
        ],
      });
    }

    const player = await ensurePlayer(client, message);
    if (!player) return;

    const result = await resolveQuery(client, query, message.author);
    if (!result?.tracks?.length) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription("No results found for your query."),
        ],
      });
    }

    const track = result.tracks[0];
    player.queue.unshift(track);
    await playIfIdle(player);

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setDescription(`Queued **${track.title}** to play next.`),
      ],
    });
  },
};
