import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "prefix",
  aliases: ["pfx"],
  category:'Utility',
  permission: "ManageGuild",
  desc: "Sets The Custom Prefix For The Server!",
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
  run: async ({ client, message,ServerData }) => {

    if (!args[0]) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(
                ` My Prefix For This Server \` ${ServerData.prefix} \` \n\nTo Change Prefix! : prefix \`set\`, \`reset\``
              ),
          ],
        });
      }
      if (args[0].toLowerCase() === "set") {
        let prefix = args.slice(1).join(" ");
        if (!prefix) {
          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.settings.COLOR)
                .setDescription(
                  ` Use the command again, and this time provide the prefix you want to set.`
                ),
            ],
          });
        }
        if (prefix.length > 5) {
          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.settings.COLOR)
                .setDescription(
                  `The prefix's length shouldn't be longer than **5**.`
                ),
            ],
          });
        }
        if (ServerData.prefix === prefix) {
          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.settings.COLOR)
                .setDescription(
                  `\`${prefix}\` is already the prefix of this server.`
                ),
            ],
          });
        }
        ServerData.prefix = prefix;
        ServerData.save();
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(
                `\`${prefix}\` is now the prefix of this server.`
              ),
          ],
        });
      } else if (args[0].toLowerCase() === "reset") {
        if (ServerData.prefix === settings.prefix) {
          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.settings.COLOR)
                .setDescription(
                  `There's no custom prefix set for this server.`
                ),
            ],
          });
        }
        ServerData.prefix = settings.prefix;
        ServerData.save();
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(
                ` The prefix has been reset successfully!`
              ),
          ],
        });
      } else {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(
                ` Invalid subcommand!\nValid subcommands: \`set\`, \`reset\``
              ),
          ],
        });
      }
    },
  };
  














  /*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/