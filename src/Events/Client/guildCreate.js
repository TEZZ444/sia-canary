import {
  WebhookClient,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "discord.js";
const webHookurl = "Insert a webhook url";
const hook = new WebhookClient({ url: webHookurl });

export default async (client, guild) => {
  await client.guilds.fetch({ cache: true });
  client.cluster.broadcastEval((c) => c.guilds.cache.size);
  client.cluster.broadcastEval((c) => c.channels.cache.size);
  client.cluster.broadcastEval((c) => c.users.cache.size);
  const embed = new EmbedBuilder()
    .setDescription(
      `I Joined **${guild.name}** (Members ${guild.memberCount + 1} )`
    )
    .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
    .setColor(client.settings.COLOR);
  hook.send({
    content: "**Server Joined <@900981299022536757>**",
    embeds: [embed],
  });
  const serversendingembed = new EmbedBuilder()
    .setAuthor({
      name: `Thanks For Adding Me To Your Server`,
      url: "https://discord.gg/KnyQscbbMa",
      iconURL: guild.iconURL({ dynamic: true }),
    })

    .setURL(`https://discord.gg/KnyQscbbMa`)
    .setTitle(
      `**Hey! Iam Sia Canary A Top Quality Music Bot With Lots Of Commands. 24/7 And Autoplay Like Premium Features Are Free**`
    )
    // .setURL("https://discord.gg/KnyQscbbMa")
    .setDescription(
      `\n\n**[Invite](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=37088600&scope=bot%20applications.commands) • [Support Server](https://dsc.gg/siahome) • [Vote](https://discordbotlist.com/bots/sia-canary/upvote)**\n`
    )
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .setColor(client.settings.COLOR);
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("playerselect")
      .setLabel("Select Player")
      .setStyle(client.Buttons.grey)
      .setEmoji("1068864782234570822")
  );
  const serverChannel = guild.channels.cache.find(
    (channel) =>
      channel.name.includes("logs") ||
      channel.name.includes("log") ||
      channel.name.includes("setup") ||
      channel.name.includes("bot") ||
      channel.name.includes("bot-logs") ||
      channel.name.includes("music") ||
      channel.name.includes("music-logs") ||
      channel.name.includes("music-req") ||
      channel.name.includes("chat") ||
      channel.name.includes("general")
  );
  if (!serverChannel) return;
  serverChannel.send({ embeds: [serversendingembed], components: [] });
};

/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
