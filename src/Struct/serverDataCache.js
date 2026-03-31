import ServerSchema from "../Models/ServerData.js";

const CACHE_TTL = 60_000;

function ensureCache(client) {
  if (!client.serverDataCache) client.serverDataCache = new Map();
  return client.serverDataCache;
}

export async function getServerData(client, guildId) {
  const cache = ensureCache(client);
  const now = Date.now();
  const cached = cache.get(guildId);

  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const data = await ServerSchema.findOneAndUpdate(
    { serverID: guildId },
    { $setOnInsert: { serverID: guildId } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  cache.set(guildId, {
    data,
    expiresAt: now + CACHE_TTL,
  });

  return data;
}

export function invalidateServerData(client, guildId) {
  if (!client.serverDataCache) return;
  client.serverDataCache.delete(guildId);
}
