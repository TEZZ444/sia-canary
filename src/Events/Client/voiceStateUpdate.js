import {
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionsBitField,
} from "discord.js";
import  delay  from 'delay';
import reconnect from "../../Models/reconnect.js";

export default async (client, oldState, newState) => {
  let player = client.kazagumo.players.get(newState.guild.id);
  const reconnectAuto = await reconnect.findOne({ GuildId: newState.guild.id })
  if (!player) return;
  if (oldState.id === client.user.id) return;
  if (
    !newState.guild.members.cache.get(client.user.id).voice.channelId ||
    !oldState.guild.members.cache.get(client.user.id).voice.channelId
  )
    return;
  if (!newState.guild.members.me.voice.channel) {
    player.destroy();
  }
  if (newState.id === client.user.id && newState.serverMute)
    newState.setMute(false);
  if (reconnectAuto) return;
  else {
    if (oldState.guild.members.me.voice.channelId === oldState.channelId) {
      if (oldState.guild.members.me.voice.channel) {
        await delay(150000);
        if (oldState.guild.members.cache.get(client.user.id).voice.channel.members.size === 1) {
          player.destroy();
          let channel = client.channels.cache.get(player.textId);
          if (channel) {
            const embed = new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setAuthor({name:`Sia Canary Alert!`, iconURL:client.user.displayAvatarURL()})
              .setDescription(`> **I Left The Voice Channel.** Because No One Was Listening Music With me. Enabled 247 Mode To Keep Me In VC!!!`
              );
            await channel.send({ embeds: [ embed ] })
          }
        }
      };
    }
  }
};











/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
