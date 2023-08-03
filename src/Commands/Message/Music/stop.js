import { EmbedBuilder } from "discord.js";

export default{
  name: "stop",
  aliases: ["Stop", "destroy"],
  category: "Music",
  permission: "",
   desc: "Stops The Player!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, player }) => {
    if (!player) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: "No Player Found For This Guild!",
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setColor(client.settings.COLOR);
      return message.channel.send({ embeds: [embed] });
    }
    if (!player.playing) {
      return message.channel.send(
        new EmbedBuilder()
        .setColor(client.settings.COLOR)
          .setDescription("I'm not playing anything right now!")
      );
    }
    player.destroy(); 
    return  message.channel.send(
      new EmbedBuilder()
      .setColor(client.settings.COLOR)
        .setDescription("**Music Stopped Playing!**")
    );
  }
};










/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/