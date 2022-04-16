const ServerError = require("../ServerError");

class RouteOptions {
    constructor(options) {
        this.options = options;
        this.validated = this._validate();
    }

    _validate() {
        if (this.options.ignoreError && typeof(this.options.ignoreError) !== "boolean") return new ServerError("[RouteOptions] The ignoreErrors option is required and must be a boolean.");
        return true;
    }
}

module.exports = RouteOptions;