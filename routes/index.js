const { Router } = require('express');
module.exports.Router = class Home extends Router {
    constructor() {
        super();
        this.get('/', async function(req, res) {
            console.log("Got a request");
        });
    }
};

module.exports.name = '/';