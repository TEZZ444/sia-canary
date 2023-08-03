/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/



// Insert Api here down

const apiKey = "musixmatch_api_key ";


import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";
import axios from "axios";


export default {
  name: "lyrics",
  aliases: [""],
  category: "Music",
  permission: "",
   desc: "Fetches The Lyrics!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, args: string[], player: import("kazagumo").Player }}
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {import("kazagumo").Player} player
   * @returns
   */

  run: async ({ client, message, ServerData, player }) => {
    try {
      const songName = player.queue.current.title
        ? player.queue.current.title
        : "SHiddat Title Track";
      const song = songName.replace(/ /g, "%20");
      const authorName = player.queue.current.author;
      const author = authorName.replace(/ /g, "%20");
      const response = await axios.get(
        `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${song}&q_artist=${author}&apikey=${apiKey}`
      );
      const data = response.data;
      const lyrics = data.message.body.lyrics.lyrics_body;
      await message.channel.sendTyping()
      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setDescription(`\`\`\`${lyrics}\`\`\``);
     await message.reply({ embeds: [embed] });
    } catch (err) {
      console.log(err);
      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setDescription("No lyrics found");
      message.reply({ embeds: [embed] });
    }
  },
};










/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
