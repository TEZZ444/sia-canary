import {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import {
  ensurePlayer,
  playIfIdle,
  resolveQuery,
} from "../../../Struct/musicUtils.js";

export default {
  name: "search",
  aliases: ["se", "find"],
  category: "Music",
  permission: "",
  desc: "Interactive search and select for tracks.",
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
            .setDescription("Provide a search query."),
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
            .setDescription("No results found."),
        ],
      });
    }

    const tracks = result.tracks.slice(0, 10);
    const menu = new StringSelectMenuBuilder()
      .setCustomId("search-pick")
      .setPlaceholder("Select a track")
      .addOptions(
        tracks.map((track, index) => ({
          label: `${index + 1}. ${track.title.slice(0, 90)}`,
          value: `${index}`,
          description: (track.author || "Unknown").slice(0, 90),
        }))
      );

    const row = new ActionRowBuilder().addComponents(menu);
    const prompt = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setTitle("Search Results")
          .setDescription("Pick one track below."),
      ],
      components: [row],
    });

    const collector = prompt.createMessageComponentCollector({
      time: 20_000,
      filter: (i) => i.user.id === message.author.id,
    });

    collector.on("collect", async (interaction) => {
      const index = Number(interaction.values[0]);
      const picked = tracks[index];
      if (!picked) {
        await interaction.reply({
          content: "Invalid selection.",
          ephemeral: true,
        });
        return;
      }
      player.queue.add(picked);
      await playIfIdle(player);
      await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(`Added **${picked.title}** to queue.`),
        ],
        components: [],
      });
      collector.stop("selected");
    });

    collector.on("end", async (_collected, reason) => {
      if (reason === "selected") return;
      await prompt.edit({ components: [] }).catch(() => {});
    });
  },
};
