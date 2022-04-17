const { Router } = require('express');
module.exports.Router = class Home extends Router {
    constructor() {
        super();
        this.get('/', async function(req, res) {
            res.status(200).send('Hello World!');
        });
    }
};

module.exports.name = '/';