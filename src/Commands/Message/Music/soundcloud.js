import { EmbedBuilder } from "discord.js";

export default {
  name: "soundcloud",
  aliases: ["sc"],
  category: "Music",
  permission: "",
   desc: "Search And Play Songs From SoundCloud!",
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
   *
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, args, ServerData, emojis }) => {
    const query = args.join(" ");
    if (!query) {
      const embed = new EmbedBuilder()
        .setColor(`#FF0000`)
        .setDescription(
          ` **${ServerData.prefix}soundcloud** \`<track name/url>\``
        );
      return message.reply({ embeds: [embed] });
    }
    const { channel } = message.member.voice;
    let player = await client.kazagumo.createPlayer({
      guildId: message.guild.id,
      textId: message.channel.id,
      voiceId: channel.id,
      deaf: true,
    });
    let result = await client.kazagumo.search(query, {
      engine: "soundcloud",
      requester: message.author,
    });
    if (!result.tracks.length) return message.reply("No results found!");
    if (result.type === "PLAYLIST")
      for (let track of result.tracks) player.queue.add(track);
    else player.queue.add(result.tracks[0]);
    if (!player.playing && !player.paused) player.play();
    if (result.type === "PLAYLIST") {
      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `**Added \`${result.tracks.length}\` Tracks From Playlist \`${result.playlist.name}\`**`
        );
      return message.reply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `Added To Queue [${result.tracks[0].title}](${result.tracks[0].uri}) by **${result.tracks[0].author}**`
        );
      return message.reply({ embeds: [embed] });
    }
  },
};







/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/