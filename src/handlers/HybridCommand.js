import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import { getServerData } from "../Struct/serverDataCache.js";

function toStringArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => `${v}`);
  return [`${value}`];
}

function resolvePermFlag(name) {
  if (!name || typeof name !== "string") return null;
  return PermissionsBitField.Flags[name] ?? null;
}

function hasRequiredPerms(member, permissionConfig) {
  const required = toStringArray(permissionConfig)
    .map(resolvePermFlag)
    .filter(Boolean);

  if (!required.length) return true;
  return member.permissions.has(required, true);
}

const SLASH_OPTIONS = {
  play: [
    {
      name: "query",
      description: "Song name or URL",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  playnext: [
    {
      name: "query",
      description: "Song name or URL",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  search: [
    {
      name: "query",
      description: "Song name or URL",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  spotify: [
    {
      name: "query",
      description: "Spotify query or URL",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  soundcloud: [
    {
      name: "query",
      description: "SoundCloud query or URL",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  seek: [
    {
      name: "time",
      description: "Seek time (e.g. 1:30)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  loop: [
    {
      name: "mode",
      description: "Loop mode",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        { name: "track", value: "track" },
        { name: "queue", value: "queue" },
        { name: "off", value: "off" },
      ],
    },
  ],
  volume: [
    {
      name: "value",
      description: "Volume value",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  skip: [
    {
      name: "value",
      description: "Amount to skip",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  remove: [
    {
      name: "value",
      description: "Queue index to remove",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  queue: [
    {
      name: "value",
      description: "Page number",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  help: [
    {
      name: "command",
      description: "Specific command name",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  prefix: [
    {
      name: "action",
      description: "Prefix action",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        { name: "set", value: "set" },
        { name: "reset", value: "reset" },
      ],
    },
    {
      name: "value",
      description: "New prefix value",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
};

function buildSlashData(command) {
  const options = SLASH_OPTIONS[command.name] || [];

  return {
    name: command.name,
    description: command.desc?.slice(0, 100) || `${command.name} command`,
    dmPermission: false,
    options,
  };
}

export async function registerSlashCommands(client) {
  const slashPayload = client.messageCommands
    .filter((cmd) => cmd?.name && cmd?.options?.owner !== true)
    .map(buildSlashData);

  client.slashCommands = new Map();
  for (const payload of slashPayload) {
    client.slashCommands.set(payload.name, payload);
  }

  if (!client.application) return;
  await client.application.commands.set(slashPayload);
  console.log(`Registered ${slashPayload.length} slash commands`);
}

function createInteractionMessage(interaction) {
  const sentMessages = [];

  const safeReply = async (payload) => {
    if (!interaction.isRepliable()) return null;
    if (!interaction.deferred && !interaction.replied) {
      await interaction.reply(payload);
      const msg = await interaction.fetchReply();
      sentMessages.push(msg);
      return msg;
    }
    if (interaction.deferred && !interaction.replied) {
      const msg = await interaction.editReply(payload);
      sentMessages.push(msg);
      return msg;
    }
    const msg = await interaction.followUp(payload);
    sentMessages.push(msg);
    return msg;
  };

  const channel = {
    send: safeReply,
    sendTyping: async () => {},
  };

  return {
    ...interaction,
    author: interaction.user,
    member: interaction.member,
    guild: interaction.guild,
    client: interaction.client,
    content: "",
    channel,
    reply: safeReply,
    delete: async () => {},
    inGuild: () => interaction.inGuild(),
    createdTimestamp: Date.now(),
    sentMessages,
  };
}

function extractArgs(interaction) {
  const args = [];
  const keys = ["query", "value", "time", "mode", "action", "command"];
  for (const key of keys) {
    const raw = interaction.options.getString(key, false);
    const v = typeof raw === "string" ? raw.trim() : raw;
    if (!v) continue;
    args.push(v);
  }
  return args;
}

export async function runHybridCommand(client, interaction) {
  if (!interaction.inGuild() || !interaction.isChatInputCommand()) return false;

  const command =
    client.messageCommands.get(interaction.commandName) ||
    client.messageCommands.get(client.messageCommandAliases?.get(interaction.commandName));
  if (!command) return false;

  const serverData = await getServerData(client, interaction.guild.id);
  const color = client.settings.COLOR;
  const player = client.kazagumo.players.get(interaction.guild.id);
  const args = extractArgs(interaction);

  if (command.options?.owner && !client.owner.includes(interaction.user.id)) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(color)
          .setDescription("You are not allowed to use this command."),
      ],
      ephemeral: true,
    });
    return true;
  }

  const permissionText = Array.isArray(command.permission)
    ? command.permission.join(", ")
    : command.permission;
  if (command.permission && !hasRequiredPerms(interaction.member, command.permission)) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(color)
          .setDescription(`You need \`${permissionText}\` permission to run this command.`),
      ],
      ephemeral: true,
    });
    return true;
  }

  if (command.options?.inVc && !interaction.member.voice?.channel) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(color)
          .setDescription("You are not in a voice channel."),
      ],
      ephemeral: true,
    });
    return true;
  }

  if (
    command.options?.sameVc &&
    interaction.guild.members.me?.voice?.channelId &&
    interaction.guild.members.me.voice.channelId !== interaction.member.voice?.channelId
  ) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(color)
          .setDescription("You must be in my voice channel to use this command."),
      ],
      ephemeral: true,
    });
    return true;
  }

  if (command.options?.player?.active && !player && !client.owner.includes(interaction.user.id)) {
    await interaction.reply({
      embeds: [new EmbedBuilder().setColor(color).setDescription("No active player in this guild.")],
      ephemeral: true,
    });
    return true;
  }

  if (
    command.options?.player?.playing &&
    player &&
    !player.playing &&
    !client.owner.includes(interaction.user.id)
  ) {
    await interaction.reply({
      embeds: [new EmbedBuilder().setColor(color).setDescription("Nothing is playing right now.")],
      ephemeral: true,
    });
    return true;
  }

  const message = createInteractionMessage(interaction);
  await command.run({
    client,
    message,
    args,
    emojis: { check: "✅", cross: "❌" },
    player,
    ServerData: serverData,
    Color: color,
  });

  return true;
}
