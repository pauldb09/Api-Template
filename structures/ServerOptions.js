const ServerError = require("./ServerError");

class ServerOptions {
    constructor(options) {
        this._options = options;
        this.options = options;
        this.validated = this._validate();
    }

    _validate() {
        if (!this.options.port || isNaN(this.options.port)) return new ServerError("[ServerOptions] The port option is required and must be a valid port number.");
        if (this.allowedIps || !isNaN(this.options.allowedIps) && this.options.allowedIps != -1 || isNaN(this.options.allowedIps) && ) return new ServerError("[ServerOptions] The port option must be a number.");

    }
}
module.exports = ServerOptions;