const ServerOptions = require("./options/ServerOptions");
const RouteOptions = require("./options/RouteOptions");
const ServerState = require("./ServerState");
const ServerError = require("./ServerError");
const express = require("express");

class Server extends EventEmitter {
    constructor(options) {
        super();
        this.app = express();
        this.routes = [];
        this.state = ServerState.CONNECTING;
        this.options = new ServerOptions(options);
        if (!this.options.validated) return process.exit(1)
    }
    async loadRoutes(options = {}) {
        options = new RouteOptions(options);
        if (!options.validated) return;

    }
    async handleRateLimite(req, res, next) {

    }
    async start() {
        if (this.state !== ServerState.CONNECTING) {
            return new ServerError("[Server Start] Could not start the server because it's already connected.\n Use the .reconnect() method if you want to reconnect it.");
        }
        if (!this.routes.loaded) {
            return new ServerError("[Server Start] Could not start the server because the routes are not loaded.\n Use the .loadRoutes() method if you want to load the routes.");
        }
        this.app
            .use(express.json())
            .use(express.urlencoded({ extended: false }))
            .set('trust proxy', true)
            .set("port", this.options.port)
            .use((req, res, next) => {
                this.handleRateLimite(req, res, next);
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                res.setHeader('Access-Control-Allow-Credentials', true);
                req.server = this;
                next();
            })
            .use(this.routes)
            .listen(this.options.port, () => {
                this.state = ServerState.CONNECTED;
                this.emit("ready", true)
                this.emit("debug", `[Server] Server started on port ${this.options.port}`);
            }).catch((err) => {
                this.emit("error", `${err}`);
                this.state = ServerState.ERRORED;
                return new ServerError(`[Server Start] Could not start the server.\n ${err}`);
            })
    }
}
module.exports = Server;