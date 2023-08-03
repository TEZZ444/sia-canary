import { client } from "./../Sia.js";
import fs from "fs";
import path from "path";

/**
 * @param {client} client
 */
export default async (client) => {
  try {
    let messageCommandsCount = 0;
    const commandsDir = path.resolve("./src/Commands/Message");
    const commandFiles = fs.readdirSync(commandsDir);
    for (const dir of commandFiles) {
      const commandPath = path.resolve(commandsDir, dir);
      if (!fs.statSync(commandPath).isDirectory()) continue;
      const commands = fs.readdirSync(commandPath);
      for (const cmd of commands) {
        if (!cmd.endsWith(".js")) continue;
        const filePath = path.resolve(commandPath, cmd);
        const fileProtocolPath = `file://${filePath}`;
        const { default: command } = await import(fileProtocolPath);
        if (
          command &&
          typeof command === "object" &&
          typeof command.name === "string" &&
          typeof command.run === "function"
        ) {
          client.messageCommands.set(command.name, command);
          messageCommandsCount++;
          console.log(`+ Command Loaded (${command.name})`);
        } else {
          console.log(`Failed Loading Command :  (${command.name})`);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};


















/*

This Code Belongs To Tejas Shettigar (TEZZ 444) . Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/