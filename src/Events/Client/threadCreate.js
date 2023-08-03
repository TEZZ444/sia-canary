/**
 * @param {import("discord.js").ThreadChannel} thread
 */

export default async (_, thread) => {
  if (thread.joinable && !thread.joined) {
    await thread.join();
  }
};






/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/