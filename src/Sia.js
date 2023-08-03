import Client from "./Struct/Client.js";
export const client = new Client();
client.siaBuild();
process.removeAllListeners("warning");
process.on("unhandledRejection", (err) => {console.log(err)});
process.on("uncaughtException", (err) => {console.log(err)});
process.on("multipleResolves", () => {});
process.on("uncaughtExceptionMonitor", (err) => {console.log(err)});










/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/