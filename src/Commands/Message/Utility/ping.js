import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "ping",
  aliases: ["latency"],
  category:'Utility',
  permission: "",
  desc: "Gets The Latency Of Disord Api And Client!",
  options : {
    owner:false,
    inVc: false,
    sameVc:false,
    player:{
      playing:false,
      active:false,
    },
    premium :false,
    vote :false,
  },
  run: async ({ client, message }) => {
    const words = [
      "Fast and furious!",
      "Speed demon at your service.",
      "Lightning fast and always on time.",
      "Quick as a flash.",
      "The need for speed is my motto.",
      "Blazing fast and always reliable.",
      "Swift and efficient, that's me.",
      "Lightning quick and always ready to go.",
      "The fast lane is my natural habitat.",
      "Rapid response, every time.",
    ];
    const randomWord = words[Math.floor(Math.random() * words.length)];

    const msg = await message.channel.send({
        content: "Pinging The Bot...",
      });
        const embed = new EmbedBuilder()
        .setAuthor({name:`${client.user.username}'s Ping!` ,
        iconURL: message.member.user.displayAvatarURL({
          dynamic: true,
        }),
      })
          .setDescription(
            `\`\`\`nim\nShard[0] Ping    - ${
              message.guild.shard.ping < 0 ? "1" : message.guild.shard.ping
            } ms\`\`\``
          )
          .setColor(client.settings.COLOR);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("shard")
            .setLabel("Shard Ping")
            .setStyle(client.Buttons.grey)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("latency")
            .setLabel("Message Latency")
            .setStyle(client.Buttons.grey)
            .setDisabled(false)
        );
        await msg.edit({
          content: `<:siaOn:1026117180884004894> **${randomWord}**`,
          embeds: [embed],
          components: [row],
        });
        let collector = msg.createMessageComponentCollector({
          filter: (b) => {
            if (b.user.id === message.author.id) return true;
            else
              b.reply({
                content: `Only ${message.author} can use this button!`,
                ephemeral: true,
              });
          }
        });

        collector.on("collect", async interaction => {
          if (interaction.customId === "shard") {
            await interaction.deferUpdate();
            const row1 = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("shard")
                .setLabel("Shard Ping")
                .setStyle(client.Buttons.grey)
                .setDisabled(true),
              new ButtonBuilder()
                .setCustomId("latency")
                .setLabel("Message Latency")
                .setStyle(client.Buttons.grey)
                .setDisabled(false)
            );
            const shardPingEmbed = new EmbedBuilder()
            .setAuthor({name:`${client.user.username}'s Ping!` ,
        iconURL: message.member.user.displayAvatarURL({
          dynamic: true,
        }),
      })
              .setDescription(
                `\`\`\`nim\nShard[0] Ping    - ${
                  message.guild.shard.ping < 0 ? "1" : message.guild.shard.ping
                } ms\`\`\``
              )
              .setColor(client.settings.COLOR);

             await msg.edit({content: `<:siaOn:1026117180884004894> **${randomWord}**`,
              embeds: [shardPingEmbed],
              components: [row1],
            });
          } else if (interaction.customId === "latency") {
            await interaction.deferUpdate();
            const row2 = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("shard")
                .setLabel("Shard Ping")
                .setStyle(client.Buttons.grey)
                .setDisabled(false),
              new ButtonBuilder()
                .setCustomId("latency")
                .setLabel("Message Latency")
                .setStyle(client.Buttons.grey)
                .setDisabled(true)
            );
            const latencyEmbed = new EmbedBuilder()
            .setAuthor({name:`${client.user.username}'s Ping!` ,
            iconURL: message.member.user.displayAvatarURL({
              dynamic: true,
            }),
          })
              .setDescription(
                `\`\`\`nim\nResponse Time    - ${
                  msg.createdTimestamp - message.createdTimestamp
                } ms\`\`\``
              )
              .setColor(client.settings.COLOR);
              await msg.edit({
              content: `<:siaOn:1026117180884004894> **${randomWord}**`,
              embeds: [latencyEmbed],
              components: [row2],
            });
          }
        });
      }
    }

















    /*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/