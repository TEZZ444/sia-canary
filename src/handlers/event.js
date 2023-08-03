import fs from "fs";
import chalk from "chalk";

export default class EventLoader{
  constructor(client) {
    this.client = client;
  }
  async LoadClientEvents() {
    let eventcount = 0;
    const events = fs.readdirSync("./src/Events/Client").filter((file) => file.endsWith(".js"));
    for (let file of events) {
      let event = (await import(`../Events/Client/${file}`)).default;
      this.client.on(file.split(".")[0], event.bind(null, this.client));
      eventcount++;
    }
    console.log(chalk.green(`Client Events Loaded - ${eventcount}`));
  }
}







/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/
