import { EmbedBuilder, ButtonBuilder, ActionRowBuilder ,PermissionsBitField} from "discord.js";

export default{
  name: "join",
  aliases: ["j"],
  category: "Music",
  permission: "",
   desc: "Joins The Voice Channel!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, player }) => {
    try{
      
    if (player && player.state === "CONNECTED") {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(
              `I'm already connected in ${
                player?.voiceChannel
                  ? `<#${player.voiceChannel}>`
                  : `\`Unknown Channel\``
              }`
            ),
        ],
      });
    }
    
    const permissions = message.guild.members.cache.get(client.user.id);
    if (!permissions.has(PermissionsBitField.ViewChannel)){
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(
              ` I don't have the permission to **view** your voice channel`
            ),
        ],
      });
    }
    if (!permissions.has(PermissionsBitField.Connect)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(
              `I don't have the permission to **connect** to your voice channel`
            ),
        ],
      });
    }
    if (!permissions.has(PermissionsBitField.Speak)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(
              `I don't have the permission to **speak** in your voice channel`
            ),
        ],
      });
    }
    if (
      !message.guild.me.voice.channel &&
      !message.member.voice.channel.joinable
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(
              `I can't join your voice channel because it's full.`
            ),
        ],
      });
    }
    if (!player) {
      player = client.kazagumo.createPlayer({
        guildId: message.guild.id,
        voiceId: message.member.voice.channel.id,
        textId: message.channel.id,
        deaf: true,
      });
    }
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setDescription(
            `**Joined ${message.member.voice.channel}**<a:ver:980573276747227177>`
          ),
      ],
    });
  }catch(err){
    console.log(err)
    message.channel.send(`An error occured! While trying to join Voice Channel!`)
  }

  },
};









/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
