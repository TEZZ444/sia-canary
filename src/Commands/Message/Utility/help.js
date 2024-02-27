import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  ComponentBuilder,
} from "discord.js";

export default {
  name: "help",
  aliases: ["h"],
  ategory: "Utility",
  permission: "",
  desc: "Help Menu!",
  options: {
    owner: false,
    inVc: false,
    sameVc: false,
    player: {
      playing: false,
      active: false,
    },
    premium: false,
    vote: false,
  },

  run: async ({ client, message, Color,args }) => {
    if (!args[0]) {
      try {
        let commands = client.messageCommands;
        const msgs = client.helpMessages;
        const randommsg = msgs[Math.floor(Math.random() * msgs.length)];
        const embed = new EmbedBuilder()
          .setAuthor({
            name: "Sia Canary Help Panel",
            iconURL: client.user.displayAvatarURL({
              dynamic: true,
              size: 2048,
            }),
          })
          .setDescription(
            `<:info:1031928747131158599> **__Did You Know__ ?**\n${randommsg}\n\n<:Icon_Megaphone_green:1013134526899306576> **Description**\nA Best Music Bot For Discord. I Support sources like Spotify, deezer and SoundCloud and more.\nSia Uses advanced audio processing techniques to deliver crystal-clear audio, ensuring that you can enjoy your music without any compromises. Join Our [**Support Server**](https://discord.gg/wcqmHgNzDn)\n\n<:queue:1077945503603490876>**__My Features Help Menu__**\n  • **Music**\n  • **Utility**\n  • **Filters**\n  • **Owners**\n  •  **All Commands**`
          )
          .setColor(client.settings.COLOR)
          .setThumbnail(
            client.user.displayAvatarURL({ dynamic: true, size: 2048 })
          )
          .setImage(
            `https://cdn.discordapp.com/attachments/1068235210963046450/1110892161072902174/Sia_Canary_3.png`
          )
          .setFooter({
            text: `Developed With 💙 By TEZZ 444`,
            iconURL: client.user.displayAvatarURL({
              dynamic: true,
              size: 2048,
            }),
          });
        const selCtg = new ActionRowBuilder().addComponents(
          new SelectMenuBuilder()
            .setCustomId("help")
            .setPlaceholder("Select a category")
            .addOptions([
              {
                label: "Music",
                description: "Music Commands",
                value: "music",
                emoji: "1068413440672149545",
              },
              {
                label: "Utility",
                description: "Utility Commands",
                value: "utility",
                emoji: "1068413440672149545",
              },
              {
                label: "Filters",
                description: "Filters Commands",
                value: "filters",
                emoji: "1068413440672149545",
              },
              {
                label: "Owners",
                description: "Owners Commands",
                value: "owners",
                emoji: "1068413440672149545",
              },
              {
                label: "All Commands",
                description: "All Commands",
                value: "all",
                emoji: "1068413440672149545",
              },
            ])
        );
        const row2 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(client.Buttons.link)
            .setLabel("Invite Me")
            .setURL(
              `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=37088600&scope=bot%20applications.commands`
            ),
          new ButtonBuilder()
            .setStyle(client.Buttons.link)
            .setLabel("Join here")
            .setURL(`https://dsc.gg/siahome`)
        );
        const msg = await message.channel.send({
          content: `<:sia_pinkyy_heart:1077942422199337051> Hello **${message.member.user.username}**, Iam ${client.user}`,
          embeds: [embed],
          components: [selCtg, row2],
        });
        const filter = (interaction) =>
          interaction.user.id === message.author.id;
        if (!filter) {
          const embed = new EmbedBuilder()
            .setAuthor({
              name: `${message.author.username}`,
              iconURL: message.author.displayAvatarURL({
                dynamic: true,
                size: 2048,
              }),
            })
            .setDescription(`You can't use this selection menu `)
            .setColor(client.settings.COLOR);
          return message.reply({ embeds: [embed] });
        }
        const collector = msg.createMessageComponentCollector({
          filter,
          time: 550000,
        });
        try {
          collector.on("collect", async (interaction) => {
            if (interaction.customId === "help") {
              if (interaction.values[0] === "music") {
                commands = client.messageCommands
                  .filter((cmd) => cmd.category === "Music")
                  .map(
                    (cmd) =>
                      `\`${
                        cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1)
                      }\``
                  )
                  .join(", ");
                  let commands2 = client.messageCommands
                  .filter((cmd) => cmd.category === "Music")
                const embed = new EmbedBuilder()
                  .setTitle(
                    "Music Commands " + commands2.size
                      ? `\`(${commands2.size})\` Music Commands`
                      : ""
                  )
                  .setDescription(commands)
                  .setColor(client.settings.COLOR)
                  .setThumbnail(
                    interaction.user.displayAvatarURL({
                      dynamic: true,
                      size: 2048,
                    })
                  )
                  .setFooter({
                    text: `Developed With 💙 By TEZZ 444`,
                    iconURL: client.user.displayAvatarURL({
                      dynamic: true,
                      size: 2048,
                    }),
                  });
                interaction.reply({
                  embeds: [embed],
                  components: [],
                  ephemeral: true,
                });
              }
              if (interaction.values[0] === "utility") {
                commands = client.messageCommands
                  .filter((cmd) => cmd.category === "Utility")
                  .map(
                    (cmd) =>
                      `\`${
                        cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1)
                      }\``
                  )
                  .join(", ");
                  let commands2 = client.messageCommands
                  .filter((cmd) => cmd.category === "Utility")
                const embed = new EmbedBuilder()
                  .setTitle(
                    "Utility Commands " + commands2.size
                      ? `\`(${commands2.size})\` Utility Commands`
                      : ""
                  )
                  .setDescription(commands)
                  .setColor(client.settings.COLOR)
                  .setThumbnail(
                    interaction.user.displayAvatarURL({
                      dynamic: true,
                      size: 2048,
                    })
                  )
                  .setFooter({
                    text: `Developed With 💙 By TEZZ 444`,
                    iconURL: client.user.displayAvatarURL({
                      dynamic: true,
                      size: 2048,
                    }),
                  });
                interaction.reply({
                  embeds: [embed],
                  components: [],
                  ephemeral: true,
                });
              }
              if (interaction.values[0] === "filters") {
                commands = client.messageCommands
                  .filter((cmd) => cmd.category === "Filters")
                  .map(
                    (cmd) =>
                      `\`${
                        cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1)
                      }\``
                  )
                  .join(", ");
                  let commands2 = client.messageCommands
                  .filter((cmd) => cmd.category === "Filters")
                const embed = new EmbedBuilder()
                  .setTitle(
                    "Filters Commands" + commands2.size
                      ? `\`(${commands2.size})\` Filters Commands`
                      : ""
                  )
                  .setDescription(commands)
                  .setColor(client.settings.COLOR)
                  .setThumbnail(
                    interaction.user.displayAvatarURL({
                      dynamic: true,
                      size: 2048,
                    })
                  )
                  .setFooter({
                    text: `Developed With 💙 By TEZZ 444`,
                    iconURL: client.user.displayAvatarURL({
                      dynamic: true,
                      size: 2048,
                    }),
                  });
                interaction.reply({
                  embeds: [embed],
                  components: [],
                  ephemeral: true,
                });
              }
              if (interaction.values[0] === "owners") {
                commands = client.messageCommands
                  .filter((cmd) => cmd.category === "Owner")
                  .map(
                    (cmd) =>
                      `\`${
                        cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1)
                      }\``
                  )
                  .join(", ");
                  let commands2 = client.messageCommands
                  .filter((cmd) => cmd.category === "Owner")
                const embed = new EmbedBuilder()
                  .setTitle(
                    "Owners Commands" + commands2.size
                      ? `\`(${commands2.size})\` Owners Commands`
                      : ""
                  )
                  .setDescription(commands)
                  .setColor(client.settings.COLOR)
                  .setThumbnail(
                    interaction.user.displayAvatarURL({
                      dynamic: true,
                      size: 2048,
                    })
                  )
                  .setFooter({
                    text: `Developed With 💙 By TEZZ 444`,
                    iconURL: client.user.displayAvatarURL({
                      dynamic: true,
                      size: 2048,
                    }),
                  });
                interaction.reply({
                  embeds: [embed],
                  components: [],
                  ephemeral: true,
                });
              }
              if (interaction.values[0] === "all") {
                commands = client.messageCommands
                  .map(
                    (cmd) =>
                      `\`${
                        cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1)
                      }\``
                  )
                  .join(", ");
                  let commands2 = client.messageCommands
                const embed = new EmbedBuilder()
                  .setTitle(
                    "All Commands" + commands2.size
                      ? `\`(${commands2.size})\` All Commands`
                      : ""
                  )
                  .setDescription(commands)
                  .setColor(client.settings.COLOR)
                  .setThumbnail(
                    interaction.user.displayAvatarURL({
                      dynamic: true,
                      size: 2048,
                    })
                  )
                  .setFooter({
                    text: `Developed With 💙 By TEZZ 444`,
                    iconURL: client.user.displayAvatarURL({
                      dynamic: true,
                      size: 2048,
                    }),
                  });
                interaction.reply({
                  embeds: [embed],
                  components: [],
                  ephemeral: true,
                });
              }
            }
          });
          collector.on("end", () => {
            selCtg.components[0].setDisabled(true);
            msg.edit({ components: [selCtg] });
          });
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
};











/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
