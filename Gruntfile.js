/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespace.js',
            'js/CacheEventSpace.js',
            'js/CacheEvent.js',
            'js/ChangeEvent.js',
            'js/AccessEvent.js',
            'js/EventedTree.js',
            'js/exports.js'
        ],

        test: [
            'js/jsTestDriver.conf'
        ],

        globals: {
            dessert: true,
            troop  : true,
            sntls  : true,
            evan   : true
        }
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
