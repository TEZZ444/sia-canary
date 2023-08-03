import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";
import SpotiPro from "spoti-pro";
const clientId = "YOUR_SPOTIFY_CLIENT_ID";
const clientSecret = "YOUR_SPOTIFY_SECRET";
const spoti = new SpotiPro(clientId, clientSecret);
const limit = 5;
const country = "IN";

export default {
  name: "spotify",
  aliases: ["sp"],
  category: "Music",
  permission: "",
  desc: "Start Playing Your Song from spotify!",
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
  run: async ({ client, message, args, ServerData, Color }) => {
    let prefix = ServerData.prefix;
    const query = args.join(" ");
    if (!query) {
      setTimeout(() => {
        message.delete();
      }, 15000);
      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setAuthor({
          name: `${message.author.username}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `Your Din't Provide A Query Or Song Link. Please contiue with **${prefix}spotify <query/url>**`
        );
      return message.reply({ embeds: [embed] }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 14500);
      });
    }
    const { channel } = message.member.voice;
    let player = await client.kazagumo.createPlayer({
      guildId: message.guild.id,
      textId: message.channel.id,
      voiceId: channel.id,
      deaf: true,
    });
    if (
      /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(
        args.join(" ")
      )
    ) {
      try {
        const msg = await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(Color)
              .setDescription(
                `**Resolving Your Link Unsupported Source Link....**`
              ),
          ],
        });

        const res = await client.kazagumo
          .search(args.join(" "), { requester: message.author })
          .then((x) => x.tracks[0]);
        if (!res) return;
        const trackName = res.title;
        const trackUrls = await spoti.searchSpotify(trackName, limit, country);
        if (!trackUrls[0]) return;

        const query2 = trackUrls[0];
        let result = await client.kazagumo.search(query2, {
          requester: message.author,
        });
        if (!result.tracks.length) return message.reply("No results found!");
        if (result.type === "PLAYLIST")
          for (let track of result.tracks) player.queue.add(track);
        else player.queue.add(result.tracks[0]);
        if (!player.playing && !player.paused) player.play();
        if (result.type === "PLAYLIST") {
          const embed = new EmbedBuilder()
            .setColor(Color)
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
              `<:serverinforight:1026436118192848906> **Added \`${result.tracks.length}\` Tracks From Playlist \`${result.playlist.name}\`**`
            );
          return msg.edit({ embeds: [embed] });
        } else {
          const embed = new EmbedBuilder()
            .setColor(Color)
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
              `<:serverinforight:1026436118192848906> **Added To Queue [${result.tracks[0].title}](${query2}) by ${result.tracks[0].author}**`
            );
          return msg.edit({ embeds: [embed] });
        }
      } catch (err) {
        console.log(err);
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(Color)
              .setDescription(`**Something Went Wrong**`),
          ],
        });
      }
    } else {
        const trackUrls = await spoti.searchSpotify(query, limit, country);
        const nextQuery = trackUrls[0];
      let result = await client.kazagumo.search(nextQuery, {
        requester: message.author,
      });
      if (!result.tracks.length) {
        const embed = new EmbedBuilder()
          .setColor(Color)
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(`**No Results Found For Your Query**`);
        return message.reply({ embeds: [embed] });
      }
      if (result.type === "PLAYLIST")
        for (let track of result.tracks) player.queue.add(track);
      else player.queue.add(result.tracks[0]);
      if (!player.playing && !player.paused) player.play();
      if (result.type === "PLAYLIST") {
        const embed = new EmbedBuilder()
          .setColor(Color)
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `<:serverinforight:1026436118192848906> Added To Queue **${result.tracks.length}** Tracks From The Playlist`
          );
        return message.reply({ embeds: [embed] });
      }
      if (player.queue.size > 0) {
        const link = result.tracks[0].uri.replace(
          "https://www.youtube.com/watch?v=" + result.tracks[0].identifier,
          "https://www.google.com/search?q=" +
            result.tracks[0].title.replace(/ /g, "%20") +
            "by" +
            result.tracks[0].author.replace(/ /g, "%20")
        );
        const embed = new EmbedBuilder()
          .setColor(Color)
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `<:serverinforight:1026436118192848906> Added [${
              result.tracks[0].title.length > 50
                ? result.tracks[0].title.slice(0, 50) + "..."
                : result.tracks[0].title
            }](${link}) to queue`
          );
        return message.channel.send({ embeds: [embed] });
      }
    }
  },
};








/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/