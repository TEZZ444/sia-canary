import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";
import pkg from "discord.js";
const { splitMessage } = pkg;
import { inspect } from "util";

export default {
  name: "eval",
  aliases: ["jsk"],
  category: "Owner",
  permission: "Administrator",
  desc: "Evals The Code!",
  options: {
    owner: true,
    inVc: false,
    sameVc: false,
    player: {
      playing: false,
      active: false,
    },
    premium: false,
    vote: false,
  },
  run: async ({ client, message, args, player, Color, ServerData }) => {
    const code = args.join(" ");
    if (!code) {
      const embed = new EmbedBuilder()
        .setColor(Color)
        .setDescription(`Please provide code to eval!`);
      return message.channel.send({ embeds: [embed] });
    }
    try {
      let evaled;
      try {
        evaled = await eval(code);
        evaled = inspect(evaled, { depth: 0 });
      } catch (e) {
        evaled = inspect(e, { depth: 0 });
      }
      if (typeof evaled !== "string") {
        evaled = inspect(evaled, { depth: 0 });
      }
      if (evaled.includes(client.settings.TOKEN)) {
        evaled = evaled.replace(client.settings.TOKEN, "Nikal Bsdk");
      }
      if (evaled.includes(client.settings.MONGO)) {
        evaled = evaled.replace(client.settings.MONGO, "Nikal Bsdk");
      }
      return message.channel.send({
        content: `\`\`\`js\n${evaled}\n\`\`\``,
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(client.Buttons.red)
              .setCustomId("delete1")
              .setLabel("Delete")
          ),
        ],
      });
    } catch (e) {
      return message.channel.send({
        content: `\`\`\`js\n${e}\n\`\`\``,
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(client.Buttons.red)
              .setCustomId("delete1")
              .setLabel("Delete")
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
