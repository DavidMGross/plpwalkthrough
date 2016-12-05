/*
 * NodeQuark service plpwalkthrough - helloworld
 * Auto-generated hello world route
 *
 * Copyright (c) 2016 Netflix, Inc.
 */

'use strict';

var restify = require('restify');

var bodyParser = restify.bodyParser({
    mapParams:false
});

function doGet(req, res) {
    res.send(200, {
        message: 'Hello World 1.0.0'
    });
}

function doPost(req, res) {
    res.send(200, {
        message: 'Hello World 1.0.0',
        postBody: req.body
    });
}

function helloworld(req, res, next) {
    if (req.method === 'GET') {
        doGet(req, res);
    } else if (req.method === 'POST') {
        doPost(req, res);
    }
    return next();
}

/*
 * Exported restify middleware and route handlers
 */
module.exports = [
    bodyParser,
    helloworld
];
