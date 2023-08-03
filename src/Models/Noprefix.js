import { Schema, model } from "mongoose";

const noprefixSchema = new Schema({
    userId: { type: String },
    userName:{type: String},
    count: { type: Number, default: 0 },
    endTime: { type: Number, default: 0 },    
});
export default model("noprefix", noprefixSchema);











/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/