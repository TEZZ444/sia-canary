import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "previous",
  aliases: ["playprevious", "back", "pichla", "prev"],
  category: "Music",
  permission: "",
  desc: "Plays Prevoius Song!",
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
  run: async ({ client, message, player }) => {
    try {
      if (!player) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: "No Player Found For This Guild!",
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setColor(client.settings.COLOR);
        return message.channel.send({ embeds: [embed] });
      }
      if (!player.queue.previous) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(`#FF0000`)
              .setDescription(`**No previous track found**`),
          ],
        });
      }
      player.queue.unshift(player.queue.previous);
      player.skip();
    } catch (err) {
      console.log(err);
      message.channel.send(`Something went wrong Please try again later`);
    }
  },
};











/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
