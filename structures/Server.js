const ServerOptions = require("./options/ServerOptions");
const RouteOptions = require("./options/RouteOptions");
const ServerState = require("./ServerState");
const ServerError = require("./ServerError");
const express = require("express");
const fs = require("fs")
const path = require("path")
const EventEmitter = require("events");

class Server extends EventEmitter {
    constructor(options) {
        super();
        this.app = express();
        this.routes = [];
        this.cooldowns = [];
        this.state = ServerState.CONNECTING;
        this.options = new ServerOptions(options);
        if (!this.options.validated) return process.exit(1)
        this.options = this.options.options;
    }
    async loadRoutes(file, options) {
        options = new RouteOptions(options, file);
        if (!options.validated) return;
        const files = fs.readdirSync(file).filter(e => e.endsWith(".js"));
        files.forEach(route => {
            let route_file;
            try {
                route_file = require(path.join(`${file}/${route}`));
            } catch (error) {
                this.debug(`[Server] Could not load the route ${route}`);
            }
            if (!route_file || !route_file.Router) return;
            this.routes.push({ name: route_file.name, router: new route_file.Router() });
        })
        this.routes.loaded = true;
        this.start()
    }
    async handleRateLimite(req, res, next) {
        const ip = req.ip;
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
            });

        this.routes.filter(r => r.name).forEach(route => {
            this.app.use(route.name, route.router);
        });
        this.app
            .get("*", (req, res) => {
                res.status(404).json({ code: 404, error: true, message: "The route you requested does not exist." });
            })
            .use(function(err, req, res, next) {
                this.emit("error", err);
                res.status(500).json({ code: 500, error: true, message: "Internal Server Error." });
            });
        console.log(this.options)
        const port = this.options.port
        try {
            this.app.listen(port, () => {
                this.state = ServerState.CONNECTED;
                this.emit("ready", true)
                this.emit("debug", `[Server] Server started on port ${port}`);
            })
        } catch (error) {
            this.emit("error", `${err}`);
            this.state = ServerState.ERRORED;
            return new ServerError(`[Server Start] Could not start the server.\n ${err}`);
        }
    }
}

module.exports = Server;