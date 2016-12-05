'use strict';

var assert = require('chai').assert;
var helper = require('./testHelper');

describe('plpwalkthrough -  nodequark service test', function() {
    it('must be awesome', function() {
        var client = helper.createClient();
        client.get(
             '/helloworld',
            function(err, req, res, obj) {
                if (err) {
                    done(err);
                }
                assert.equal(obj.message, 'Hello World!',
                          'awesome name endpoint response.');
                done();
            });
    });
});
