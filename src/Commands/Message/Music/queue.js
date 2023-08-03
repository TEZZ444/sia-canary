import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";

export default {
  name: "queue",
  aliases: ["q"],
  category: "Music",
  permission: "",
  options: {
    owner: false,
    inVc: true,
    sameVc: true,
    player: {
      playing: false,
      active: true,
    },
    premium: false,
    vote: false,
  },
  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, emojis, args: string[] }} params
   */
  run: async ({ client, message, emojis, args }) => {
    const player = client.kazagumo.players.get(message.guild.id);
    if (!player) {
      const embed = new EmbedBuilder()
       .setAuthor({ name: "No Player Found For This Guild", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setColor(client.settings.COLOR);

      return message.channel.send({ embeds: [embed] });
    }
    if (player.queue == 0) {
      const embed = new EmbedBuilder()
        .setAuthor({ name: "Queue Is Empty", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setColor(client.settings.COLOR);

      return message.channel.send({ embeds: [embed] });
    }
    async  function ButtonS(page){
    const buttonsRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("first")
          .setLabel("First")
          .setStyle(client.Buttons.grey)
          .setDisabled(page === 1),
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("Previous")
          .setStyle(client.Buttons.grey)
          .setDisabled(page === 1),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next")
          .setStyle(client.Buttons.grey)
          .setDisabled(page === totalPages),
        new ButtonBuilder()
          .setCustomId("last")
          .setLabel("Last")
          .setStyle(client.Buttons.grey)
          .setDisabled(page === totalPages)
      );
    return buttonsRow;
    }
    const SiatotalSongsPerPage = 10;
    const totalPages = Math.ceil(player.queue.length / SiatotalSongsPerPage);
    let page = 1;
    if (args[0]) {
      if (isNaN(args[0])) {
        const embed = new EmbedBuilder()
          .setAuthor({ name: "Invalid Page Number", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setColor(client.settings.COLOR);

        return message.channel.send({ embeds: [embed] });
      }
      if (args[0] > totalPages) {
        const embed = new EmbedBuilder()
          .setAuthor({ name: "Invalid Page Number", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setColor(client.settings.COLOR);

        return message.channel.send({ embeds: [embed] });
      }
      page = parseInt(args[0]);
    }
    const start = (page - 1) * SiatotalSongsPerPage;
    const end = page * SiatotalSongsPerPage;
    const tracks = player.queue.slice(start, end);
    const embed = new EmbedBuilder()
      .setAuthor({ name: `Queue of ${message.guild.name}` , iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setColor(client.settings.COLOR)
      .setDescription(
        tracks
          .map(
            (track, index) =>
              `( \`${start + (index + 1)}\` ) [${track.title}](${track.uri}) [ ${track.requester} ] `
          )
          .join("\n")
      )
      .setFooter({text:`Page ${page} of ${totalPages}`});
    const msg = await message.channel.send({ embeds: [embed], components: [await ButtonS(page)] });
    const filter = (interaction) =>
      interaction.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 60000*10,
    });
    collector.on("collect", async (interaction) => {
      if (interaction.customId === "first") {
        page = 1;
        const start = (page - 1) * SiatotalSongsPerPage;
        const end = page * SiatotalSongsPerPage;
        const tracks = player.queue.slice(start, end);
        const embed = new EmbedBuilder()
          .setAuthor({ name: `Queue of ${message.guild.name}` , iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setColor(client.settings.COLOR)
          .setDescription(
            tracks
              .map(
                (track, index) =>
                  `( \`${start + (index + 1)}\` ) [${track.title}](${track.uri}) [ ${track.requester} ] `
              )
              .join("\n")
          )
          .setFooter({text:`Page ${page} of ${totalPages}`});
        await interaction.update({ embeds: [embed], components: [await ButtonS(page)] });
      }
      if (interaction.customId === "previous") {
        page--;
        const start = (page - 1) * SiatotalSongsPerPage;
        const end = page * SiatotalSongsPerPage;
        const tracks = player.queue.slice(start, end);
        const embed = new EmbedBuilder()
          .setAuthor({ name: `Queue of ${message.guild.name}` , iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setColor(client.settings.COLOR)
          .setDescription(
            tracks
              .map(
                (track, index) =>
                  `( \`${start + (index + 1)}\` ) [${track.title}](${track.uri}) [ ${track.requester} ] `
              )
              .join("\n")
          )
          .setFooter({text:`Page ${page} of ${totalPages}`});
        await interaction.update({ embeds: [embed], components: [await ButtonS(page)] });
      }
      if (interaction.customId === "next") {
        page++;
        const start = (page - 1) * SiatotalSongsPerPage;
        const end = page * SiatotalSongsPerPage;
        const tracks = player.queue.slice(start, end);
        const embed = new EmbedBuilder()
          .setAuthor({ name: `Queue of ${message.guild.name}` , iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setColor(client.settings.COLOR)
          .setDescription(
            tracks
              .map(
                (track, index) =>
                  `( \`${start + (index + 1)}\` ) [${track.title}](${track.uri}) [ ${track.requester} ] `
              )
              .join("\n")
          )
          .setFooter({text:`Page ${page} of ${totalPages}`});
        await interaction.update({ embeds: [embed], components: [await ButtonS(page)] });
      }
      if (interaction.customId === "last") {
        page = totalPages;
        const start = (page - 1) * SiatotalSongsPerPage;
        const end = page * SiatotalSongsPerPage;
        const tracks = player.queue.slice(start, end);
        const embed = new EmbedBuilder()
          .setAuthor({ name: `Queue of ${message.guild.name}` , iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setColor(client.settings.COLOR)
          .setDescription(
            tracks
              .map(
                (track, index) =>
                  `( \`${start + (index + 1)}\` ) [${track.title}](${track.uri}) [ ${track.requester} ] `
              )
              .join("\n")
          )
          .setFooter({text:`Page ${page} of ${totalPages}`});
        await interaction.update({ embeds: [embed], components: [await ButtonS(page)] });
      }
    });
    collector.on("end", async () => {
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Queue of ${message.guild.name}` , iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setColor(client.settings.COLOR)
        .setDescription(
          tracks
            .map(
              (track, index) =>
                `( \`${start + (index + 1)}\` ) [${track.title}](${track.uri}) [ ${track.requester} ] `
            )
            .join("\n")
        )
        .setFooter({text:`Page ${page} of ${totalPages}`});
      await msg.edit({ embeds: [embed], components: [] });
    }
    );
  },
};













/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/