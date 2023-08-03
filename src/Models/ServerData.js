import { Schema, model } from "mongoose";

const ServerSchema = new Schema({
  serverID: { type: String },
  prefix: { type: String, default: "+" },
  autoplay: { type: Boolean, default: false },
  botChannel: { type: String },
});

export default model("ServerData", ServerSchema);












/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/