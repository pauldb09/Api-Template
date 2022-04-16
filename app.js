const { Server } = require("./structures/Server");
const routes = require('./routes');
const serv = new Server({
    port: 3000,
    allowedIps: -1, // -1 for all
    rateLimiteTimeout: 1000,
    maxRequestsPerSecond: 10,
    acceptMultipleIps: false,

})

await serv.loadRoutes(routes, {
    ignoreError: true,
})

serv.on("debug", (msg) => {
    console.log(msg);
})
serv.on("ready", () => {
    console.log("Server is ready");
})