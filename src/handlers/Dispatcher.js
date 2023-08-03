import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder
} from "discord.js";
import prettyMilliseconds from "pretty-ms";
import reconnectAuto from "../Models/reconnect.js";
import { Spotify } from "spotify-info.js";
import Functions from "./../Struct/functions.js";

const spotify = new Spotify({
  clientID: "YOUR_SPOTIFY_CLIENT_ID",
  clientSecret: "YOUR_SPOTIFY_SECRET",
});
/**
 * @param {import("../Struct/Client")} client
 * @param {import("discord.js").Message} message
 * @param {import("discord.js").StringResolvable} content
 * @param {import("kazagumo").PlayerMovedState} state
 * @param {import("kazagumo").PlayerMovedChannels} channel
 */
export default async (client) => {
  client.kazagumo.on("playerStart", async (player, track) => {
    track.requester = player.previous
      ? player.queue.previous.requester
      : player.queue.current.requester;
    if (track.uri.includes("https://cdn.discordapp.com/attachments/")) {
      return;
    }
    function convert(ms) {
      return prettyMilliseconds(ms, {
        colonNotation: true,
        secondsDecimalDigits: 0,
      });
    }
    const searchUrl = await spotify.searchTrack(track.title, {
      limit: 1,
    });
    if (!searchUrl[0]) return;
    const trackSpotify = await client.kazagumo
      .search(searchUrl[0].external_urls.spotify, { engine: "spotify" })
      .then((x) => x.tracks[0]);
    if (!trackSpotify) return;
    track.title = trackSpotify.title ? trackSpotify.title : track.title;
    track.uri = trackSpotify.uri
      ? trackSpotify.uri
      : "https://discord.gg/fuZBHxzDNc";
    track.thumbnail = trackSpotify.thumbnail
      ? trackSpotify.thumbnail
      : track.thumbnail;
    track.author = trackSpotify.author ? trackSpotify.author : "Unknown";
    player.data.set("autoplayTrack", track, player);
    const channel = await client.channels.cache.get(player.textId);
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Now Playing`,
        iconURL: player.queue.previous
          ? player.queue.previous.requester.displayAvatarURL({ dynamic: true })
          : player.queue.current.requester.displayAvatarURL({ dynamic: true }),
      })
      .setColor(client.settings.COLOR)
      .setDescription(
        `**[${
          track.title.length > 50
            ? track.title.slice(0, 50) + "..."
            : track.title
        }](${track.uri})**`
      )
      .setThumbnail(track.thumbnail)
      .addFields(
        {
          name: `Requester`,
          value: `[${
            player.queue.previous
              ? player.queue.previous.requester.username
              : player.queue.current.requester.username
          }](https://discord.gg/fuZBHxzDNc)`,
          inline: true,
        },
        {
          name: `Duration`,
          value: `\`❯  ${
            track.isStream ? "** ❯ LIVE**" : convert(track.length)
          } \``,
          inline: true,
        },
        {
          name: `Author`,
          value: `[${track.author}](https://discord.gg/fuZBHxzDNc)`,
          inline: true,
        }
      );
    const set = new ButtonBuilder()
      .setStyle(client.Buttons.grey)
      .setCustomId("set")
      .setEmoji("1131847099361792082");
    const prev = new ButtonBuilder()
      .setStyle(client.Buttons.grey)
      .setCustomId("prev")
      .setEmoji("1131847086053269575")
      .setDisabled(!player.queue.previous ? true : false);
    const pauseandres = new ButtonBuilder()
      .setStyle(player.playing ? client.Buttons.grey : client.Buttons.green)
      .setCustomId("pauseandres")
      .setEmoji(player.playing ? "1131847861299068948" : "1131847088884437063");
    const skip = new ButtonBuilder()
      .setStyle(client.Buttons.grey)
      .setCustomId("skip")
      .setEmoji("1131847093925969990");
    const stop = new ButtonBuilder()
      .setStyle(client.Buttons.grey)
      .setCustomId("stop")
      .setEmoji("1131847456410316830");
    const row = new ActionRowBuilder().addComponents(
      set,
      prev,
      pauseandres,
      skip,
      stop
    );
    channel.send({ embeds: [embed], components: [row] }).then(async (msg) => {
      player.data.set("nowplaying", msg.id);
    });
  });
  client.kazagumo.on("playerResolveError", async (player, track) => {});
  client.kazagumo.on("playerDestroy", async (player, track) => {
    const channel = client.channels?.cache.get(player.textId);
    let msg = await channel?.messages.fetch(player.data.get("nowplaying"));
    if (msg) {
      await msg.delete();
    }
  });
  client.kazagumo.on("playerCreate", async (player, track) => {});
  client.kazagumo.on("playerEnd", async (player, track) => {
    const channel = client.channels?.cache.get(player.textId);
    if (channel) {
      channel.messages.fetch(player.data.get("nowplaying")).then((msg) => {
        msg.delete();
      });
    }
  });
  client.kazagumo.on("playerEmpty", async (player, track) => {
    let channel = client.channels?.cache.get(player.textId);
    let msg = await channel?.messages.fetch(player.data.get("nowplaying"));
    if (msg) {
      await msg.delete();
    }
    const ap = player.data.get("autoplay");
    if (ap) {
      return Functions.SiaAutoplay(client, player);
    } else {
      channel.send({
        embeds: [
          new EmbedBuilder().setColor(client.settings.COLOR).setAuthor({
            name: "Queue has ended! Consider Inviting Me?.",
            iconURL: client.user.displayAvatarURL({ dynamic: false }),
          }),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(client.Buttons.link)
              .setLabel("Vote")
              .setEmoji("1005077712328740864")
              .setURL(`https://discordbotlist.com/bots/sia-canary/upvote`),
            new ButtonBuilder()
              .setStyle(client.Buttons.link)
              .setLabel("Invite")
              .setEmoji("1005077708579033138")
              .setURL(
                `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=37088600&scope=bot%20applications.commands`
              )
          ),
        ],
      });
    }
  });
  client.kazagumo.on("playerClosed", async (player, track) => {});
  client.kazagumo.on("playerStuck", async (player, track) => {});
  client.kazagumo.on("playerResumed", async (player, track) => {});
  client.kazagumo.on("playerMoved", async (player, state, channel) => {
    const data = await reconnectAuto.findOne({ GuildId: player.guildId });
    const guild = client.guilds.cache.get(player.guildId);
    if (!guild) return;
    const chn = client.channels.cache.get(player.textId);
    if (channel.newChannelId === channel.oldChannelId) return;
    if (channel.newChannelId === null || !channel.newChannelId) {
      if (data) {
        if (!player) return;
        player.destroy();
        setTimeout(async () => {
          await client.kazagumo.createPlayer({
            guildId: data.GuildId,
            textId: data.TextId,
            voiceId: data.VoiceId,
            deaf: true,
          });
        }, 200);
        const embed = new EmbedBuilder()
          .setAuthor({
            name: "Reconnecting To Voice Channel Because 247 Is Enabled!",
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setColor(client.settings.COLOR);

        return await chn.send({ embeds: [embed] }).then(async (a) => {
          setTimeout(async () => {
            await a.delete().catch(() => {});
          }, 15000);
        });
      } else {
        if (!player) return;
        player.destroy();
        if (chn)
          return await chn
            .send({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `I have been Disconnected From <#${channel.oldChannelId}>.`
                  )
                  .setColor(client.settings.COLOR),
              ],
            })
            .then((a) =>
              setTimeout(async () => await a.delete().catch(() => {}), 15000)
            )
            .catch(() => {});
      }
    } else {
      if (!player) return;
      player.setVoiceChannel(channel.newChannelId);
      if (chn)
        await chn
          .send({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `Moved To New Voice Channel <#${channel.newChannelId}>.`
                )
                .setColor(client.settings.COLOR),
            ],
          })
          .then((a) =>
            setTimeout(async () => await a.delete().catch(() => {}), 15000)
          )
          .catch(() => {});
      if (player.paused) player.pause(false);
    }
  });
  client.kazagumo.on("playerException", async (player, track) => {});
  client.kazagumo.on("playerUpdate", async (player, track) => {});
};














/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
