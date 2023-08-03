import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";
export default{
  name: "volume",
  aliases: ["vol"],
  category: "Music",
  permission: "",
   desc: "Controls The Volume Of The Player!",
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
    if (!args[0]) {
      const embed = new EmbedBuilder()
      .setColor(client.settings.COLOR)
      .setDescription(`The current volume is **${player.volume* 100}**`)
      const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId("volumedown")
        .setLabel("Vol -")
        .setStyle(client.Buttons.grey)
        .setEmoji("🔉"),
        new ButtonBuilder()
        .setCustomId("volumeup")
        .setLabel("Vol +")
        .setStyle(client.Buttons.grey)
        .setEmoji("🔊"),
      );
      return message.channel.send({ embeds: [embed], components: [row] }).then((msg) => {
        const filter = (button) => button.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter });
        collector.on("collect", async (button) => {
          const currentVolume = player.volume * 100;
          if (button.customId === "volumedown") {
            if (player.volume === 0) {
              embed.setDescription(`The volume is already at 0%`)
              button.update({ embeds: [embed], components: [] });
            } else {
              player.setVolume(currentVolume - 10);
              embed.setDescription(`The volume is now at **${player.volume* 100}**`)
              button.update({ embeds: [embed], components: [] });
            }
          } else if (button.customId === "volumeup") {
              player.setVolume(currentVolume + 10);
              embed.setDescription(`The volume is now at **${player.volume* 100}**`)
              button.update({ embeds: [embed], components: [] });
          }
        }
        );
      });

    }
    if (!message.member.voice.channel) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(`#FF0000`)
            .setDescription(`\`❌\` **|** You must be in a voice channel.`),
        ],
      });
    }
    if (
      message.guild.me.voice.channel &&
      !message.guild.me.voice.channel.equals(message.member.voice.channel)
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(`#FF0000`)
            .setDescription(
              `You must be in the same voice channel as ${client.user}.`
            ),
        ],
      });
    }
    if (args[0] < 1 || args[0] > 200) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(`#FF0000`)
            .setDescription(
              `Use the command again, and this time enter a volume amount between \`1 - 200\``
            ),
        ],
      });
    }
    if (player.volume === args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(
              ` Volume is already **${args[0] * 100}**. Use the command again, and this time enter a volume amount between \`1 - 200\``
            ),
        ],
      });
    }
    player.setVolume(args[0]);
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setDescription(
            ` Volume is now set to **${args[0]}**`
          ),
      ],
    });
  },
};












/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/