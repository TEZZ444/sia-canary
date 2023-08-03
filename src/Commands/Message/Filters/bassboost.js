import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "basboost",
  aliases: ["bb"],
  category: "Filters",
  permission: "",
  desc: "Toggles Bass Boost filter!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player, args: string[] }} ctx
   * @param {import("discord.js").Message} message
   */
  run: async ({ client, message, emojis, player, args }) => {
    try {
      if (!args[0]) {
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("on")
            .setLabel("On")
            .setStyle(client.Buttons.grey),
          new ButtonBuilder()
            .setCustomId("off")
            .setLabel("Off")
            .setStyle(client.Buttons.grey)
        );
        const embed = new EmbedBuilder()
          .setDescription(
            `<a:dch_catheart:1071384664083808346> **Bassboost Filter**`
          )
          .setColor(client.settings.COLOR);
        message.channel
          .send({ embeds: [embed], components: [row] })
          .then(async (msg) => {
            const filter = (i) => i.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({
              filter,
              time: 15000,
            });
            collector.on("collect", async (i) => {
              if (i.customId === "on") {
                const data = {
                  op: "filters",
                  guildId: message.guild.id,
                  equalizer: [
                    { band: 0, gain: 0.1 },
                    { band: 1, gain: 0.1 },
                    { band: 2, gain: 0.05 },
                    { band: 3, gain: 0.05 },
                    { band: 4, gain: -0.05 },
                    { band: 5, gain: -0.05 },
                    { band: 6, gain: 0 },
                    { band: 7, gain: -0.05 },
                    { band: 8, gain: -0.05 },
                    { band: 9, gain: 0 },
                    { band: 10, gain: 0.05 },
                    { band: 11, gain: 0.05 },
                    { band: 12, gain: 0.1 },
                    { band: 13, gain: 0.1 },
                  ],
                };
                player.send(data);
                const embed = new EmbedBuilder()
                  .setDescription(
                    `<:serverinforight:1026436118192848906> | **Bassboost Turned On**`
                  )
                  .setColor(client.settings.COLOR);
                msg.edit({ embeds: [embed], components: [] });
              } else if (i.customId === "off") {
                const data = {
                  op: "filters",
                  guildId: message.guild.id,
                  equalizer: [
                    { band: 0, gain: 0 },
                    { band: 1, gain: 0 },
                    { band: 2, gain: 0 },
                    { band: 3, gain: 0 },
                    { band: 4, gain: 0 },
                    { band: 5, gain: 0 },
                    { band: 6, gain: 0 },
                    { band: 7, gain: 0 },
                    { band: 8, gain: 0 },
                    { band: 9, gain: 0 },
                    { band: 10, gain: 0 },
                    { band: 11, gain: 0 },
                    { band: 12, gain: 0 },
                    { band: 13, gain: 0 },
                  ],
                };
                player.send(data);
                const embed = new EmbedBuilder()
                  .setDescription(
                    `<:cross1:1070079184413663333> | **Bassboost Turned Off**`
                  )
                  .setColor(client.settings.COLOR);
                msg.edit({ embeds: [embed], components: [] });
              }
            });
          });
      } else {
        const level = parseInt(args[0]);
        if (isNaN(level))
          return message.channel.send({
            content: `<:cross1:1070079184413663333> | Invalid number!`,
          });
        if (
          (message.author.id !== client.settings.owner && level > 10) ||
          level < 0
        )
          return message.channel.send({
            content: `<:cross1:1070079184413663333> | Level must be between 0 and 10!`,
          });
        const data = {
          op: "filters",
          guildId: message.guild.id,
          equalizer: [
            { band: 0, gain: args[0] / 10 },
            { band: 1, gain: args[0] / 10 },
            { band: 2, gain: args[0] / 10 },
            { band: 3, gain: args[0] / 10 },
            { band: 4, gain: args[0] / 10 },
            { band: 5, gain: args[0] / 10 },
            { band: 6, gain: args[0] / 10 },
            { band: 7, gain: 0 },
            { band: 8, gain: 0 },
            { band: 9, gain: 0 },
            { band: 10, gain: 0 },
            { band: 11, gain: 0 },
            { band: 12, gain: 0 },
            { band: 13, gain: 0 },
          ],
        };
        player.send(data);
        const embed = new EmbedBuilder()
          .setDescription(
            `<:serverinforight:1026436118192848906> | **Bassboost Level Set To ${args[0]}**`
          )
          .setColor(client.settings.COLOR);
        message.channel.send({ embeds: [embed] });
      }
    } catch (e) {
      console.log(e);
      message.channel.send({
        content: `<:cross1:1070079184413663333> | Unable To Apply Bassboost Filter!`,
      });
    }
  },
};












/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/