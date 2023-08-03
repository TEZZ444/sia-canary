import { EmbedBuilder } from "discord.js";
import reconnectAuto from '../../../Models/reconnect.js';

export default {
  name: "247",
  aliases: ["24/7", "24/7mode", "24/7-mode"],
  category: "Music",
  permission: "",
   desc: "Enabled 247 Mode In The Server!",
    options: {
    owner: false,
    inVc: true,
    sameVc: false,
    player: {
      playing: false,
      active: false,
    },
    premium: false,
    vote: false,
  },
  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player, args: string[] }} ctx
   * @param {import("discord.js").Message} message
   */
  run: async ({ client, message }) => {
    try {
      const data = await reconnectAuto.findOne({ GuildId: message.guild.id });
      if (data) {
        await reconnectAuto.findOneAndDelete({ GuildId: message.guild.id });
        const embed = new EmbedBuilder()
          .setDescription(`**24/7 Mode Has Been Disabled In ${message.guild.name}**`)
          .setColor(client.settings.COLOR);
        return message.channel.send({ embeds: [embed] });
      }
      await reconnectAuto.create({
        GuildId: message.guild.id,
        TextId: message.channel.id,
        VoiceId: message.member.voice.channel.id,
      });
      await client.kazagumo.createPlayer({
        guildId: message.guild.id,
        textId: message.channel.id,
        voiceId: message.member.voice.channel.id,
        deaf: true
      });
      const embed = new EmbedBuilder()
      .setDescription(`**24/7 Mode Has Been Enabled In ${message.guild.name}**`)
        .setColor(client.settings.COLOR);

      message.channel.send({ embeds: [embed] });
    } catch (e) {
      console.log(e);
      message.channel.send(`**An Error Occured**`);
    }
  },
};








/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
