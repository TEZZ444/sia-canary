import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default{
  name: "vote",
  aliases: [],
  category: "Utility",
  permission: "",
  desc: "Voting Link To Vote Sia Canary!",
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
  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message }}
   */
  run: async ({ client, message }) => {
    return message.reply({
      content: "\u200b",
      embeds: [
        new EmbedBuilder()
        .setColor(client.settings.COLOR)
          .setTitle("Here Is The Vote Link")
          .setDescription("Thanks For Choosing **Sia Canary!** \`💚\`"),],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(client.Buttons.link)
            .setLabel("Vote")
            .setURL(`https://discordbotlist.com/bots/sia-canary/upvote`)
        ),
      ],
    });
  },
};





/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/