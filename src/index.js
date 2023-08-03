import { ClusterManager } from  "discord-hybrid-sharding"
import token from "./config.js" 

const manager = new ClusterManager(`./src/Sia.js`, {
    totalShards: "auto",
    shardsPerClusters: 2,
    totalClusters: "auto", 
    mode: 'process',
    token: token.TOKEN,
});
manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}`));
manager.spawn({ timeout: -1});










/*

This Code Belongs To Tejas Shettigar (TEZZ 444). Modification of code is not suggested. A Credit Is Mandatory. Join SUpport Server For More Info 

Support Server - >  https://discord.gg/wcqmHgNzDn

*/