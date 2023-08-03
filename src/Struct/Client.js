import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ButtonStyle,
} from "discord.js";
import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import { Connectors } from "shoukaku";
import { Kazagumo, Plugins } from "kazagumo";
import Deezer from "kazagumo-deezer";
import Config from "./../config.js";
import mongoose from "mongoose";
import Spotify from "kazagumo-spotify";
import Functions from "./functions.js";
import SiaEvents from "../handlers/event.js";
const Intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildInvites,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildWebhooks,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.DirectMessages,
];
/**
 * @param {import(discord.js).Message} message
 * @param {import(Kazagumo).KazagumoPlayer} player
 */

export default class SiaClient extends Client {
  constructor() {
    super({
      allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false,
      },
      intents: [Intents],
      partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.User,
        Partials.Reaction,
      ],
      ws: {
        large_threshold: 50,
        version: 10,
      },
      rest: {
        retries: 3,
        authPrefix: "Bot",
        api: "https://discord.com/api",
        cdn: "https://cdn.discordapp.com/",
        version: "10",
        rejectOnRateLimit: null,
      },
      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,
    });
    this.Buttons = {
      green: ButtonStyle.Success,
      blue: ButtonStyle.Primary,
      grey: ButtonStyle.Secondary,
      red: ButtonStyle.Danger,
      link: ButtonStyle.Link,
    };
    this.owner = Config.OWNER;
    this.cluster = new ClusterClient(this);
    this.functions = new Functions(this);
    this.commands = new Collection();
    this.settings = Config;
    this.ClientEvents = new SiaEvents(this).LoadClientEvents();
    this.messageCommands = new Collection();
    (this.helpMessages = [
      "You can buy premium for free by joining our [support server](https://discord.gg/5CXpzxtgA6) and report bugs!",
      "You can setup a request channel of sia canary where you can play any song without using its prefix (<prefix>setup)",
      "By Typing <prefix>help <command> to get more info about a command",
      "Run <prefix>invite to invite Sia Canary to your server",
      "You can use the command <prefix>vote to vote for sia on Discord Bots list",
      "Premium is free free freeee! Just Invite Sia to any 5 servers and join our [support server](https://discord.gg/5CXpzxtgA6) and report bugs!",
      "You can use the command <prefix>ping to check sia's ping",
      "Sia Canary Can Play Song In Sources Like SoundCloud, Spotify, Deezer, Youtube, NicoNico, And More!",
      "Premium System Has Been Merged With Guild And User",
      "**Player Mode** Is Sia Exclusive Feature!",
      "Moderation Commands Are Now Available!",
      "[TEZZ 444](https://discord.com/users/900981299022536757) is the **Developer** of Sia Canary",
    ]),
      (this.Nodes = Config.NODES);
    this.kazagumo = new Kazagumo(
      {
        plugins: [
          new Plugins.PlayerMoved(this),
          new Deezer({
            playlistLimit: 30,
          }),
          new Spotify({
            clientId: "83c98500a89a4a5eae6fa819643644b8",
            clientSecret: "b2627d1bf6c846d98e102fe58e656892",
            playlistPageLimit: 50,
            albumPageLimit: 10,
            searchLimit: 10,
            searchMarket: "IN",
          }),
        ],
        defaultSearchEngine: "youtube",
        defaultYoutubeThumbnail: "hq720",
        send: (guildId, payload) => {
          const guild = this.guilds.cache.get(guildId);
          if (guild) guild.shard.send(payload);
        },
      },
      new Connectors.DiscordJS(this),
      this.Nodes,
      Spotify
    );
    /**
     * @param {String} id
     * @param {import("kazagumo").KazagumoTrack} track
     * @returns {void}
     */
    this.kazagumo.shoukaku.on("ready", async (name) => {
      console.log(`Lavalink ${name} -  Ready`);
    });
    this.kazagumo.shoukaku.on("error", async (name, error) => {
      console.error(`Lavalink ${name} -  Error`, error);
    });
    this.kazagumo.shoukaku.on("close", async (name, code, reason) => {
      console.warn(
        `Lavalink ${name} - Closed, Code ${code}, Reason ${
          reason || "No reason"
        }`
      );
    });
    this.kazagumo.shoukaku.on("disconnect", async (name, players, moved) => {
      if (moved) return;
      players.map((player) => player.connection.disconnect());
      console.warn(`Lavalink ${name} - Disconnected`);
    });
  }

  async siaBuild() {
    await loadHandlers(this);
    this.login(Config.TOKEN)
      .then(() => {
        mongoose.set("strictQuery", true);
        const Options = {
          useNewUrlParser: true,
          autoIndex: false,
          connectTimeoutMS: 10000,
          family: 4,
          useUnifiedTopology: true,
        };
        mongoose
          .connect(this.settings.MONGO, Options)
          .then(() => {
            console.log(`Connected to MongoDB Database`);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    return this;
  }
}
async function loadHandlers(client) {
  const handlerFiles = ["MessageCommand", "Dispatcher"];
  for (const file of handlerFiles) {
    let handler = await import(`./../handlers/${file}.js`).then(
      (r) => r.default
    );
    await handler(client);
  }
}











/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/