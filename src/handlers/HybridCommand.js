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

function buildSlashData(command) {
  const options = [];
  if (command.name === "play" || command.name === "search") {
    options.push({
      name: "query",
      description: "Song name or URL",
      type: ApplicationCommandOptionType.String,
      required: true,
    });
  } else if (command.name === "volume" || command.name === "skip" || command.name === "remove") {
    options.push({
      name: "value",
      description: "Command value",
      type: ApplicationCommandOptionType.String,
      required: false,
    });
  } else if (command.name === "seek") {
    options.push({
      name: "time",
      description: "Seek time (e.g. 1:30)",
      type: ApplicationCommandOptionType.String,
      required: true,
    });
  } else if (command.name === "loop") {
    options.push({
      name: "mode",
      description: "Loop mode",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        { name: "track", value: "track" },
        { name: "queue", value: "queue" },
        { name: "off", value: "off" },
      ],
    });
  } else if (command.name === "prefix") {
    options.push({
      name: "action",
      description: "Prefix action",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        { name: "set", value: "set" },
        { name: "reset", value: "reset" },
      ],
    });
    options.push({
      name: "value",
      description: "New prefix value",
      type: ApplicationCommandOptionType.String,
      required: false,
    });
  } else if (command.name === "help") {
    options.push({
      name: "command",
      description: "Specific command name",
      type: ApplicationCommandOptionType.String,
      required: false,
    });
  }

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

  const channel = {
    send: async (payload) => {
      if (interaction.deferred || interaction.replied) {
        const msg = await interaction.followUp(payload);
        sentMessages.push(msg);
        return msg;
      }

      await interaction.reply(payload);
      const msg = await interaction.fetchReply();
      sentMessages.push(msg);
      return msg;
    },
  };

  return {
    ...interaction,
    author: interaction.user,
    member: interaction.member,
    guild: interaction.guild,
    client: interaction.client,
    channel,
    reply: channel.send,
    delete: async () => {},
    inGuild: () => interaction.inGuild(),
    createdTimestamp: Date.now(),
    sentMessages,
  };
}

function extractArgs(commandName, interaction) {
  const args = [];
  const keys = ["query", "value", "time", "mode", "action", "command"];
  for (const key of keys) {
    const raw = interaction.options.getString(key, false);
    const v = typeof raw === "string" ? raw.trim() : raw;
    if (!v) continue;
    if (key === "query") {
      args.push(v);
    } else {
      args.push(v);
    }
  }
  return args;
}

export async function runHybridCommand(client, interaction) {
  if (!interaction.inGuild() || !interaction.isChatInputCommand()) return false;

  const command =
    client.messageCommands.get(interaction.commandName) ||
    client.messageCommands.find(
      (cmd) => Array.isArray(cmd.aliases) && cmd.aliases.includes(interaction.commandName)
    );
  if (!command) return false;

  const serverData = await getServerData(client, interaction.guild.id);
  const color = client.settings.COLOR;
  const player = client.kazagumo.players.get(interaction.guild.id);
  const args = extractArgs(command.name, interaction);

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

  if (command.permission && !hasRequiredPerms(interaction.member, command.permission)) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(color)
          .setDescription(`You need \`${command.permission}\` permission to run this command.`),
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
