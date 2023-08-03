import SpotiPro from "spoti-pro";
const clientId = "YOUR_SPOTIFY_CLIENT_ID";
const clientSecret = "YOUR_SPOTIFY_SECRET";
const spoti = new SpotiPro(clientId, clientSecret);
let client;
export default class Functions {
  constructor(c) {
    client = c;
  }
  static async SiaAutoplay(client, player) {
    const limit = 10;
    const country = "IN";
    const track = player.data.get("autoplayTrack");
    const q = track.author + " different Songs";
    const trackUrl = await spoti.searchSpotify(q, limit, country);
    if (trackUrl) {
      const randomIndex = Math.floor(Math.random() * trackUrl.length);
      const randomTrack = trackUrl[randomIndex];
      let res = await client.kazagumo.search(randomTrack, {
        engine: "youtube",
        requester: track.requester,
      });
      if (!res || !res.tracks.length) return;
      player.queue.add(res.tracks[0]);
      if (!player.playing && !player.paused) player.play();
    }
  }
}

/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
