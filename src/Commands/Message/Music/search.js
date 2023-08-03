import { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder } from "discord.js";
export default {
  name: "search",
  aliases: ["se", "Dhund"],
  category: "Music",
  permission: "",
   desc: "Search A Song Based On Your Intrest!",
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
  run: async ({ client, message, args, ServerData }) => {
    try {
      await message.channel.sendTyping()
      const query = args.join(" ");
      if (!query) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(`#FF0000`)
              .setDescription(` **${ServerData.prefix}search** \`<track name>\``),
          ],
        });
      }
      if (
        /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(
          args.join(" ")
        )
      ) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(
                `We Have Removed Support Platform Of Youtube, please try using a different platform or provide a search query to use our default platform.`
              ),
          ],
        });
      }
      const { channel } = message.member.voice;
      let player = await client.kazagumo.createPlayer({
        guildId: message.guild.id,
        textId: message.channel.id,
        voiceId: channel.id,
        deaf: true,
        loadBalancer: true,
      });
      let result = await client.kazagumo.search(query, {
        requester: message.author,
      });
      if (!result.tracks.length)
        return message.reply(`No results found for \`${query}\``);
      let resultCompoment = await client.kazagumo.search(
        query,
        { engine: "spotify" },
        { requester: message.author }
      );
      const results = resultCompoment.tracks.map((track, index) => ({
        label: `${index + 1}. ${
          track.titlelength > 20
            ? track.title.slice(0, 20) + "..."
            : track.title
        }`,
        value: track.uri,
      }));

      const select = new SelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("❯ Select a song to play")
        .addOptions(results || []);
      const replacingoptionifnotfound = new SelectMenuBuilder()
        .setCustomId("select2")
        .setPlaceholder("❯ Select a song to play")
        .addOptions([
          {
            label: `No Similar Songs Found`,
            value: "no",
          },
        ]);
      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setAuthor({
          name: `Select a song to play`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        });

      const msg = await message.channel.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(select)],
      });
      const filter = (i) => i.user.id === message.author.id;
      const collector = message.channel.createMessageComponentCollector({
        filter,
        time: 15000,
      });
      collector.on("collect", async (i) => {
        if (i.customId === "select") {
          if (i.values[0] === "no") return;
          if (
            !i.member.voice.channelId &&
            i.user.id !== client.user.id &&
            i.user.id !== client.settings.owner
          )
            return i.reply({
              content: "**You are not in a voice channel!**",
              ephemeral: true,
            });
          if (
            i.member.voice.channelId !== player.voiceId &&
            i.user.id !== client.settings.owner
          )
            return i.reply({
              content: `You are not in ${
                player.voiceId
                  ? `<#${player.voiceId}> To Use Me!`
                  : "the same voice channel!"
              }`,
              ephemeral: true,
            });
          const track = await client.kazagumo
            .search(i.values[0], { engine: "youtube" , requester: i.user })
            .then((x) => x.tracks[0]);
          if (!track) return;
          player.queue.add(track);
          if (!player.playing && !player.paused && !player.queue.size)
            player.play();
          i.update({
            embeds: [
              embed
                .setAuthor({
                  name: `Added to queue`,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(`**[${track.title}](${track.uri})**`),
            ],
            components: [],
          });
        }
      });
      collector.on("end", async (i) => {
        if (i.size === 0) {
          msg.edit({
            embeds: [
              embed
                .setAuthor({
                  name: `Selection Was Timed Out`,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(`**No song was selected**`),
            ],
            components: [
              new ActionRowBuilder().addComponents(replacingoptionifnotfound),
            ],
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  },
};










/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
