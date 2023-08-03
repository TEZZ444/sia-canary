import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default{
  name: "grab",
  aliases: ["save"],
  category: "Music",
  permission: "",
   desc: "Gets The Info Of Playing Track And Sends You!",
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
    message.member
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setAuthor({
              name: "Song Saved",
              url: "https://discord.gg/ApSyhAdARe",
              iconURL: client.settings.icon,
            })
            .setFooter({
              text: `Message from ${message.guild.name}`,
              iconURL: message.guild.iconURL({ dynamic: true }),
            })
            .setDescription(
              `[${
                player.queue.current.title.length > 64
                  ? player.queue.current.title.substr(0, 64) + "..."
                  : player.queue.current.title
              }](${player.queue.current.uri})`
            )
            .addFields(
              {
                name: "Artist",
                value: `\`${player.queue.current.author}\``,
              },
              {
                name: "Play it",
                value: `\`${client.settings.prefix}play ${player.queue.current.uri}\``,
              }
            ),
        ],
      })
      .then(() =>
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription("**📭 Check your DMs Asap!.**"),
          ],
        })
      )
      .catch(() =>
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(` **I can't DM you.**`),
          ],
        })
      );
  },
};









/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/