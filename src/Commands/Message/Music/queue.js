import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import { formatDuration } from "../../../Struct/musicUtils.js";

const PAGE_SIZE = 10;

function buildQueueEmbed(client, message, player, page, totalPages) {
  const start = (page - 1) * PAGE_SIZE;
  const end = page * PAGE_SIZE;
  const tracks = player.queue.slice(start, end);
  const description = tracks
    .map((track, index) => {
      const idx = start + index + 1;
      const duration = track.isStream ? "LIVE" : formatDuration(track.length);
      return `\`${idx}.\` [${track.title}](${track.uri}) • \`${duration}\``;
    })
    .join("\n");

  return new EmbedBuilder()
    .setColor(client.settings.COLOR)
    .setAuthor({
      name: `Queue of ${message.guild.name}`,
      iconURL: message.guild.iconURL({ dynamic: true }) || undefined,
    })
    .setDescription(description || "Queue is empty.")
    .setFooter({ text: `Page ${page}/${totalPages} • ${player.queue.length} tracks` });
}

function buildButtons(client, page, totalPages) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("queue:first")
      .setLabel("First")
      .setStyle(client.Buttons.grey)
      .setDisabled(page <= 1),
    new ButtonBuilder()
      .setCustomId("queue:prev")
      .setLabel("Prev")
      .setStyle(client.Buttons.grey)
      .setDisabled(page <= 1),
    new ButtonBuilder()
      .setCustomId("queue:next")
      .setLabel("Next")
      .setStyle(client.Buttons.grey)
      .setDisabled(page >= totalPages),
    new ButtonBuilder()
      .setCustomId("queue:last")
      .setLabel("Last")
      .setStyle(client.Buttons.grey)
      .setDisabled(page >= totalPages)
  );
}

export default {
  name: "queue",
  aliases: ["q"],
  category: "Music",
  permission: "",
  desc: "Shows current queue with pagination.",
  options: {
    owner: false,
    inVc: false,
    sameVc: false,
    player: {
      playing: false,
      active: true,
    },
    premium: false,
    vote: false,
  },
  run: async ({ client, message, args }) => {
    const player = client.kazagumo.players.get(message.guild.id);
    if (!player || !player.queue.length) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription("Queue is currently empty."),
        ],
      });
    }

    const totalPages = Math.max(1, Math.ceil(player.queue.length / PAGE_SIZE));
    let page = Number.parseInt(args?.[0], 10) || 1;
    page = Math.min(totalPages, Math.max(1, page));

    const msg = await message.reply({
      embeds: [buildQueueEmbed(client, message, player, page, totalPages)],
      components: [buildButtons(client, page, totalPages)],
    });

    const collector = msg.createMessageComponentCollector({
      time: 120_000,
      filter: (i) => i.user.id === message.author.id,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "queue:first") page = 1;
      if (interaction.customId === "queue:prev") page -= 1;
      if (interaction.customId === "queue:next") page += 1;
      if (interaction.customId === "queue:last") page = totalPages;
      page = Math.min(totalPages, Math.max(1, page));

      await interaction.update({
        embeds: [buildQueueEmbed(client, message, player, page, totalPages)],
        components: [buildButtons(client, page, totalPages)],
      });
    });

    collector.on("end", async () => {
      await msg
        .edit({
          components: [],
        })
        .catch(() => {});
    });
  },
};
