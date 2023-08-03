import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default{
  name: "pause",
  aliases: ["freeze","ruk"],
  category: "Music",
  permission: "",
   desc: "This Will Pause The Player!",
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
  run: async ({ client, message, player, ServerData }) => {
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
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(`#FF0000`)
            .setDescription(`The player is already paused.`),
        ],
      });
    }
    player.pause(true);
    const embed = new EmbedBuilder()
    .setColor(client.settings.COLOR)
    .setDescription(`⏸️ Paused The Song. Type \`${ServerData.prefix}resume\` to continue playing.`)
    const resumebutton = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("resume")
        .setLabel("Resume")
        .setStyle(client.Buttons.green)
    )
    return message.channel.send({ embeds: [embed], components: [resumebutton] }).then((msg) => {
      const filter = (button) => button.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({ filter});
      collector.on("collect", async (button) => {
        if (button.customId === "resume") {
          if (player.paused) {
            player.pause(false);
            embed.setDescription(`▶️ Resumed The Song.`)
            button.update({ embeds: [embed], components: [] });
          } else {
            embed.setDescription(`The player is already playing.`)
            button.update({ embeds: [embed], components: [] });
          }
        }
      });
    });
  },
};













/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
