import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default{
  name: "autoplay",
  aliases: ["ap"],
  category: "Music",
  permission: "",
   desc: "Enables/Disables Autoplay !",
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
   * @param {import("discord.js").Message} message
   */
  run: async ({ client, message, ServerData, player }) => {
    if (!player) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: "No Player Found For This Guild!",
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setColor(client.settings.COLOR);
      return message.channel.send({ embeds: [embed] });
    }
    const ap = player.data.get("autoplay");
    if (ap) {
      player.data.set("autoplay", false);
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Autoplay has been disabled!`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setColor(client.settings.COLOR);
      return message.channel.send({ embeds: [embed] });
    } else {
      player.data.set("autoplay", true);
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Autoplay has been enabled!`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setColor(client.settings.COLOR);
      return message.channel.send({ embeds: [embed] });
    }
  },
};








/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
