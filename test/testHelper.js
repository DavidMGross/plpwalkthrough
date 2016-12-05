'use strict';


var path = require('path');
var fs = require('fs');

var restify = require('restify');
var restifyClients = require('restify-clients');
var bunyan = require('bunyan');
var assert = require('assert-plus');
var Verror = require('verror');

var LOG = bunyan.createLogger({
    level: (process.env.LOG_LEVEL || bunyan.INFO),
    name: 'testlog',
    streams: [{
        level: bunyan.TRACE,
        type: 'raw',
        stream: new restify.bunyan.RequestCaptureStream({
            level: bunyan.WARN,
            maxRecords: 100,
            maxRequestIds: 100,
            stream: process.stderr
        })
    }],
    serializers: bunyan.stdSerializers
});
var appRoot = require('app-root-path').path;

/**
 * @private
 * create dtrace object for unit test
 * @returns {Object} dtrace object
 */
function getDtrace() {
    var dtp;

    try {
        var d = require('dtrace-provider');
        dtp = d.createDTraceProvider('nqBootstrapUnitTest');
    } catch (e) {
        dtp = null;
    }

    return (dtp);
}

/**
 * read file synchronously, throw Verror
 * on error, log the error message
 * @public
 * @param  {String} fpath  file path
 * @param  {Object} log    log object
 * @param  {String} errMsg Custom error message
 * @returns {String}        Content of the file
 */
function readFile(fpath, log, errMsg) {
    var content;
    var errObj;

    try {
        content = fs.readFileSync(fpath, 'utf8');
    } catch (err) {
        errObj = new Verror(err, errMsg + '%s', fpath);
        log.error(errObj);
        throw errObj;
    }
    return content;
}
/**
 * @private
 * json parse a file's content synchronously
 * read from disk
 * @throws {Error} If JSON.parse fails
 * @param  {String} fpath file path
 * @returns {Object}  file content as object
 */
function loadConf(fpath) {
    var confObj;

    try {
        confObj = JSON.parse(readFile(
            path.resolve(fpath),
            LOG, 'Can not find test config file '));
    } catch (err) {
        LOG.error(err);
        throw err;
    }
    assert.object(confObj, 'test config object');
    assert.number(confObj.port, 'server port from config object');
    assert.string(confObj.host,
        'server hostname or ip from config object');
    return confObj;
}




/**
 * @public
 * create restify json client object
 * @returns {Object} restify json client object
 */
module.exports.createClient = function createClient() {
    var confObj = loadConf(appRoot + '/build/container-info.json');
    var dtra = getDtrace();
    var client = restifyClients.createJsonClient({
        url: 'http://' + confObj.host + ':' + confObj.port,
        dtrace: dtra,
        retry: false
    });
    return client;
};


