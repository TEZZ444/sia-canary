import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default{
  name: "disconnect",
  aliases: ["dc", "leave"],
  category: "Music",
  permission: "",
   desc: "Disconnects The Player From VC!",
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
  run: async ({ client, message }) => {
    try {
      const player = client.kazagumo.players.get(message.guild.id);
      if (!player) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: "No Player Found For This Guild!",
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setColor(client.settings.COLOR);
        return message.channel.send({ embeds: [embed] });
      }
      const dcemo = `<:xmark:1016092468007141447>`;
      player.queue.clear();
      player.skip();
      const track =
        "https://cdn.discordapp.com/attachments/991386628318826522/1088066308026929172/sia_disconnect.mp3";
      const res = await client.kazagumo.search(track, {
        requester: client.user,
      });
      player.queue.add(res.tracks[0]);
      if (!player.playing && !player.paused && !player.queue.size)
        player.play();
      setTimeout(() => {
        player.destroy();
      }, 4000);

      message.react(`${dcemo}`);
    } catch (err) {
      console.log(err);
      message.channel.send(`Something went wrong Please try again later`);
    }
  },
};










/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
