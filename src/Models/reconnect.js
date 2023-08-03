import { Schema, model } from "mongoose";

let reconnectAuto = new Schema({
  GuildId: { type: String, required: true },
  TextId: {type: String, required: true},
  VoiceId: {type: String,required: true},
});
export default model("autoreconnect ", reconnectAuto);








/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/