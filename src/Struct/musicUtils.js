import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import { Canvas, loadImage } from "@napi-rs/canvas";
import prettyMilliseconds from "pretty-ms";

export function formatDuration(ms) {
  if (!ms || ms < 0) return "0:00";
  return prettyMilliseconds(ms, {
    colonNotation: true,
    secondsDecimalDigits: 0,
  });
}

export async function ensurePlayer(client, message) {
  const voiceChannel = message.member?.voice?.channel;
  if (!voiceChannel) {
    await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setDescription("Join a voice channel first."),
      ],
    });
    return null;
  }

  return client.kazagumo.createPlayer({
    guildId: message.guild.id,
    textId: message.channel.id,
    voiceId: voiceChannel.id,
    deaf: true,
    shardId: message.guild.shardId,
  });
}

export async function resolveQuery(client, query, requester, engine) {
  const options = { requester };
  if (engine) options.engine = engine;
  return client.kazagumo.search(query, options);
}

export async function queueFromSearchResult(player, result) {
  if (!result?.tracks?.length) return 0;
  if (result.type === "PLAYLIST") {
    for (const track of result.tracks) player.queue.add(track);
    return result.tracks.length;
  }
  player.queue.add(result.tracks[0]);
  return 1;
}

export async function playIfIdle(player) {
  if (!player.playing && !player.paused) {
    await player.play();
  }
}

async function drawBackground(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#1f2937");
  gradient.addColorStop(1, "#111827");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawProgress(ctx, player, track, width) {
  const barX = 36;
  const barY = 230;
  const barW = width - 72;
  const barH = 10;
  ctx.fillStyle = "#374151";
  ctx.fillRect(barX, barY, barW, barH);

  const progress = track.isStream
    ? 0
    : Math.max(0, Math.min(1, player.position / Math.max(track.length, 1)));
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(barX, barY, Math.floor(barW * progress), barH);

  ctx.fillStyle = "#d1d5db";
  ctx.font = "18px sans-serif";
  ctx.fillText(formatDuration(player.position), barX, barY + 30);
  ctx.fillText(
    track.isStream ? "LIVE" : formatDuration(track.length),
    barX + barW - 80,
    barY + 30
  );
}

export async function buildNowPlayingCard(player, track) {
  const width = 960;
  const height = 300;
  const canvas = Canvas.createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  await drawBackground(ctx, width, height);

  if (track.thumbnail) {
    try {
      const image = await loadImage(track.thumbnail);
      ctx.drawImage(image, 24, 24, 220, 220);
    } catch {}
  }

  ctx.fillStyle = "#f9fafb";
  ctx.font = "bold 30px sans-serif";
  ctx.fillText("Now Playing", 270, 62);

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "bold 26px sans-serif";
  const title = track.title?.length > 42 ? `${track.title.slice(0, 42)}...` : track.title;
  ctx.fillText(title || "Unknown Track", 270, 112);

  ctx.fillStyle = "#9ca3af";
  ctx.font = "22px sans-serif";
  ctx.fillText(track.author || "Unknown Artist", 270, 150);

  drawProgress(ctx, player, track, width);

  const buffer = await canvas.encode("png");
  return new AttachmentBuilder(buffer, { name: "nowplaying.png" });
}
