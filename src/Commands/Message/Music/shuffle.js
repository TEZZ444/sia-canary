import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default{
  name: "shuffle",
  aliases: ["mix"],
  category: "Music",
  permission: "",
   desc: "Shuffles The Queue!",
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
  run: async ({ client, message }) => {
    const player = client.kazagumo.players.get(message.guild.id);
    if (!player) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: "No Player Found For This Guild!",
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setColor(client.settings.COLOR);
      return message.channel.send({ embeds: [embed] });
    }
    if (player.queue.length < 3) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(`#FF0000`)
            .setDescription(
              `Not enough songs in the queue to shuffle.`
            ),
        ],
      });
    }
    player.queue.shuffle();
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setDescription("🔀 **Shuffled the whole queue.**"),
      ],
    });
  },
};






/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/