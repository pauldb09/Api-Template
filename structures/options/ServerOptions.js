const ServerError = require("../ServerError");

class ServerOptions {
    constructor(options) {
        this._options = options;
        this.options = options;
        this.validated = this._validate();
    }

    _validate() {
        if (!this.options.port || isNaN(this.options.port)) return new ServerError("[ServerOptions] The port option is required and must be a valid port number.");
        if (!this.allowedIps || !isNaN(this.options.allowedIps) && this.options.allowedIps != -1 || isNaN(this.options.allowedIps) && typeof(this.options.allowedIps) !== "array") return new ServerError("[ServerOptions] The allowedIps option must be equals to -1 or an array of allowed ips.");
        if (!this.options.rateLimiteTimeout || isNaN(this.options.rateLimiteTimeout)) return new ServerError("[ServerOptions] The rateLimiteTimeout option is required and must be a valid number.");
        if (!this.options.maxRequestsPerSecond || isNaN(this.options.maxRequestsPerSecond)) return new ServerError("[ServerOptions] The maxRequestsPerSecond option is required and must be a valid number.");
        if (!this.options.acceptMultipleIps || typeof(this.options.acceptMultipleIps) !== "boolean") return new ServerError("[ServerOptions] The acceptMultipleIps option is required and must be a boolean.");
        return true;
    }
}

module.exports = ServerOptions;