import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "skip",
  aliases: ["s", "next", "agla"],
  category: "Music",
  permission: "",
   desc: "Skips The Current Song!",
    options: {
    owner: false,
    inVc: true,
    sameVc: true,
    player: {
      playing: true,
      active: true,
    },
    premium: false,
    vote: false,
  },
  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, args, player }) => {
    if (!player) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: "No Player Found For This Guild!",
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setColor(client.settings.COLOR);
      return message.channel.send({ embeds: [embed] });
    }
    if (player.paused) {
      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setDescription(`**Cannot Skip Song While Paused**`);
      return message.channel.send({ embeds: [embed] });
    }
    if (!args[0]) {
      await player.skip();
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(`**Skipped** ( ${player.queue.current.title} )`),
        ],
      });
    }

    if (isNaN(args[0]))
      return message.channel.send("Please provide a valid number!");
    if (args[0] > player.queue.length)
      return message.channel.send("The queue is not that long!");
    player.queue.remove(0, parseInt(args[0]));
    player.skip();
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setDescription(
            `Skipped ${args[0]} song. <a:ver:980573276747227177>`
          ),
      ],
    });
  },
};












/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/