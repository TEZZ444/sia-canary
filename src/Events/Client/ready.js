import { ActivityType } from "discord.js";
import chalk from "chalk";
import reconnectAuto from "../../Models/reconnect.js";
/**
 * @param {import("../Struct/Client")} client
 */
export default async (client) => {
  client.cluster
    .broadcastEval((c) => c.guilds.cache.size)
    .then((results) =>
      console.log(
        `Total Servers - ${results.reduce((prev, val) => prev + val, 0)}`
      )
    );
  client.cluster
    .broadcastEval((c) => c.channels.cache.size)
    .then((results) =>
      console.log(
        `Total Channels - ${results.reduce((prev, val) => prev + val, 0)}`
      )
    );
  client.cluster
    .broadcastEval((c) => c.users.cache.size)
    .then((results) =>
      console.log(
        `Total Users - ${results.reduce((prev, val) => prev + val, 0)}`
      )
    );
  let totalUsers = 0;
  client.guilds.cache.forEach((guild) => {
    totalUsers += guild.available ? guild.memberCount : 0;
  });
  console.log(chalk.green(`${client.user.tag} Ready In Action!`));
  const maindata = await reconnectAuto.find();
  console.log(
    `Auto Reconnect found ${
      maindata.length
        ? `${maindata.length} queue ${
            maindata.length > 1 ? "s" : ""
          }. Resuming all auto reconnect queue`
        : "0 queue"
    }`,
    "player"
  );
  for (const data of maindata) {
    const index = maindata.indexOf(data);
    setTimeout(async () => {
        const text = client.channels.cache.get(data.TextId);
        const guild = client.guilds.cache.get(data.GuildId);
        const voice = client.channels.cache.get(data.VoiceId);
        if (!guild || !text || !voice) return;
        const player = await client.kazagumo.createPlayer({
            guildId: guild.id,
            textId: text.id,
            voiceId: voice.id,
            deaf: true,
            shardId: guild.shardId,
        });
    },
    ), index * 5000;
}
  console.log(`Reconnected to ${maindata.length} guilds`);
  console.log(chalk.green(`Cluster #${client.cluster.id} Is Stable!`));
  setInterval(() => {
    let statuses = [`+help`,`dsc.gg/sia`];
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    client.user.setActivity(status, { type: ActivityType.Listening });
  }, 5000);
};







/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/