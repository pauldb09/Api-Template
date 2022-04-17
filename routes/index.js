const { Router } = require('express');
module.exports.Router = class Home extends Router {
    constructor() {
        super();
        this.get('/', async function(req, res) {
            res.send("Hello word")
        });
    }
};

module.exports.name = '/';
