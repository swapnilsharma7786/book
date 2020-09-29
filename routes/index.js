const express = require('express');
const router = express.Router();
var bookRouter = require('./book');

module.exports = function(app) {
    router.get('/', function(req, res, next) {
        res.status(200).send({
            message: 'Welcome to Book Library',
            status: "success"
        });
    });
    app.use('/', router);
    app.use('/api/book', bookRouter);
};