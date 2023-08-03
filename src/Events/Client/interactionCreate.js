import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionsBitField,
  InteractionType,
  ButtonStyle,
} from "discord.js";
import ServerSchema from "../../Models/ServerData.js";

/**
 * @param {import("../../Struct/Client)}client
 * @param {import("discord.js").CommandInteraction} interaction
 */

export default async (client, interaction) => {
  if (!interaction.inGuild()) return;
  let ServerData = async () => {
    if (await ServerSchema.findOne({ serverID: interaction.guild.id })) {
      return await ServerSchema.findOne({ serverID: interaction.guild.id });
    } else {
      return new ServerSchema({ serverID: interaction.guild.id }).save();
    }
  };
  ServerData = await ServerData();
  let player = await client.kazagumo.players.get(interaction.guild.id);
  if (interaction.isButton()) {
    if (
      interaction.customId === "delete1" &&
      client.owner.includes(interaction.user.id)
    ) {
      interaction.message.delete();
    }
  }
  if (interaction.isButton()) {
    if (
      interaction.customId === "delete" &&
      client.owner.includes(interaction.user.id)
    ) {
      interaction.message.delete();
    }
  }
  if (interaction.isButton()) {
    const player = await client.kazagumo.players.get(interaction.guild.id);
    let requester;
    if (player)
      requester = player?.queue.previous
        ? player.queue.previous.requester
        : player.queue.current.requester;
    if (!player) requester = client.user;
    const notInvc = new EmbedBuilder();
    notInvc.setColor(client.settings.COLOR);
    notInvc.setAuthor({
      name: "Your Are Not In A Voice Channel",
      iconURL:
        interaction.user.displayAvatarURL({ dynamic: true }) ||
        client.user.avatarURL({ dynamic: true }),
    });
    const samevc = new EmbedBuilder();
    samevc.setColor(client.settings.COLOR);
    samevc.setAuthor({
      name: `You are not in the same voice channel as mine to use me`,
      iconURL:
        interaction.user.displayAvatarURL({ dynamic: true }) ||
        client.user.avatarURL({ dynamic: true }),
    });
    const musicEmbd = new EmbedBuilder();
    musicEmbd.setColor(client.settings.COLOR);
    const requesterEmebd = new EmbedBuilder();
    requesterEmebd.setColor(client.settings.COLOR);
    requesterEmebd.setAuthor({
      name: `Current Song Was Requested By ${requester.username}. So You Can't Use This Button!`,
      url: "https://discord.gg/KnyQscbbMa",
      iconURL:
        interaction.user.displayAvatarURL({ dynamic: true }) ||
        client.user.avatarURL({ dynamic: true }),
    });
    if (interaction.customId === "skip") {
      if (!player) return interaction.message.delete();

      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      if (player.paused) {
        const embed = new EmbedBuilder();
        embed.setColor(client.settings.COLOR);
        embed.setDescription(
          "**Player Is Paused! I can't Skip Tracks Right Now**"
        );
        interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        player.skip();
        musicEmbd.setAuthor({
          name: "Alright, Skipping The Current Song!",
          onURL:
            interaction.user.displayAvatarURL({ dynamic: true }) ||
            client.user.avatarURL({ dynamic: true }),
        });
        return interaction.reply({ embeds: [musicEmbd], ephemeral: true });
      }
    } else if (interaction.customId === "stop") {
      if (!player) return interaction.message.delete();

      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      player.destroy();
      musicEmbd.setAuthor({
        name: "Destroyed The Music System!",
        onURL:
          interaction.user.displayAvatarURL({ dynamic: true }) ||
          client.user.avatarURL({ dynamic: true }),
      });
      return interaction.reply({ embeds: [musicEmbd], ephemeral: true });
    } else if (interaction.customId === "prev") {
      if (!player) return interaction.message.delete();

      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      if (!player.queue.previous) {
        const embed = new EmbedBuilder();
        embed.setColor(client.settings.COLOR);
        embed.setDescription("**No Previous Tracks Found!**");
        interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        player.queue.unshift(player.queue.previous);
        player.skip();
        musicEmbd.setAuthor({
          name: "Alright, Im Now Playing The Previous Song!",
          onURL:
            interaction.user.displayAvatarURL({ dynamic: true }) ||
            client.user.avatarURL({ dynamic: true }),
        });
        return interaction.reply({ embeds: [musicEmbd], ephemeral: true });
      }
    } else if (interaction.customId === "pauseandres") {
      if (!player) return interaction.message.delete();

      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      player.pause(player.paused ? false : true);
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
        .setEmoji(
          player.playing ? "1131847861299068948" : "1131847088884437063"
        );
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
      try {
        const msg = await client.channels.cache
          .get(player.textId)
          .messages.fetch(player.data.get("nowplaying"));
        msg.edit({ components: [row] });
      } catch (e) {
        cosole.log(e);
      }
      musicEmbd.setDescription(
        `Track Is Now ${player.paused ? "**Paused**" : "**Resumed**"}`
      );

      return interaction.reply({ embeds: [musicEmbd], ephemeral: true });
    } else if (interaction.customId === "set") {
      if (!player) return interaction.message.delete();

      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      const settingRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("autoplay")
          .setStyle(
            player.data.get("autoplay")
              ? ButtonStyle.Success
              : ButtonStyle.Secondary
          )
          .setLabel(
            "Autoplay - " +
              `${player.data.get("autoplay", true) ? "Enabled" : "Disabled"}`
          ),
        new ButtonBuilder()
          .setCustomId("loop")
          .setStyle(ButtonStyle.Secondary)
          .setLabel(
            `Loop - ${
              player.loop == "none"
                ? "Off"
                : player.loop == "track"
                ? "Track"
                : "Queue"
            }`
          ),
        new ButtonBuilder()
          .setCustomId("volume")
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Volume")
      );
      return interaction.reply({ components: [settingRow], ephemeral: true });
    }
    //inside settings
    else if (interaction.customId === "loop") {
      if (!player) return interaction.message.delete();

      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      if (player.loop == "queue" && player.loop != "track") {
        player.setLoop("track");
      }
      if (player.loop == "none" && player.loop != "queue") {
        player.setLoop("queue");
      }
      if (player.loop == "track" && player.loop != "none") {
        player.setLoop("none");
      }
      const settingRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("autoplay")
          .setStyle(
            player.data.get("autoplay")
              ? ButtonStyle.Success
              : ButtonStyle.Secondary
          )
          .setLabel(
            "Autoplay - " +
              `${player.data.get("autoplay", true) ? "Enabled" : "Disabled"}`
          ),
        new ButtonBuilder()
          .setCustomId("loop")
          .setStyle(ButtonStyle.Secondary)
          .setLabel(
            `Loop - ${
              player.loop == "none"
                ? "Off"
                : player.loop == "track"
                ? "Track"
                : "Queue"
            }`
          ),
        new ButtonBuilder()
          .setCustomId("volume")
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Volume")
      );
      interaction.update({ components: [settingRow], ephemeral: true });
    }
    //autoplay
    else if (interaction.customId === "autoplay") {
      if (!player) return interaction.message.delete();

      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      if (player.data.get("autoplay", true)) {
        player.data.set("autoplay", false);
      } else {
        player.data.set("autoplay", true);
      }
      const settingRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("autoplay")
          .setStyle(
            player.data.get("autoplay")
              ? ButtonStyle.Success
              : ButtonStyle.Secondary
          )
          .setLabel(
            "Autoplay - " +
              `${player.data.get("autoplay", true) ? "Enabled" : "Disabled"}`
          ),
        new ButtonBuilder()
          .setCustomId("loop")
          .setStyle(ButtonStyle.Secondary)
          .setLabel(
            `Loop - ${
              player.loop == "none"
                ? "Off"
                : player.loop == "track"
                ? "Track"
                : "Queue"
            }`
          ),
        new ButtonBuilder()
          .setCustomId("volume")
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Volume")
      );
      interaction.update({ components: [settingRow], ephemeral: true });
    } else if (interaction.customId === "volume") {
      if (!player) return interaction.message.delete();
      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      const volumeRw = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("inc")
          .setStyle(ButtonStyle.Success)
          .setLabel("Increase"),
        new ButtonBuilder()
          .setCustomId("dec")
          .setStyle(ButtonStyle.Success)
          .setLabel("Decrease")
      );
      return interaction.reply({ components: [volumeRw], ephemeral: true });
    } else if (interaction.customId === "inc") {
      if (!player) return interaction.message.delete();
      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      const currentVolume = player.volume * 100;
      if (player.volume === 150) {
        const emd = new EmbedBuilder()
          .setDescription("You Cannot Increase Volume Above 150")
          .setColor(client.settings.COLOR);
        return interaction.reply({ embeds: [emd], ephemeral: true });
      }
      player.setVolume(currentVolume + 10);
      const emd = new EmbedBuilder()
          .setDescription(`Volume Is Now At **${currentVolume*100 + 10}** `)
          .setColor(client.settings.COLOR);
        return interaction.reply({ embeds: [emd], ephemeral: true });

    }
    else if (interaction.customId === "dec") {
      if (!player) return interaction.message.delete();
      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      const currentVolume = player.volume * 100;
      if (player.volume === 0) {
        const emd = new EmbedBuilder()
          .setDescription("You Cannot Decrease Volume Below 0")
          .setColor(client.settings.COLOR);
        return interaction.reply({ embeds: [emd], ephemeral: true });
      }
      player.setVolume(currentVolume - 10);
      const emd = new EmbedBuilder()
          .setDescription(`Volume Is Now At **${currentVolume * 100 - 10}** `)
          .setColor(client.settings.COLOR);
        return interaction.reply({ embeds: [emd], ephemeral: true });

    }
  }
};









/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
