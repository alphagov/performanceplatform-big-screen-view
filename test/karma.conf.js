'use strict';

module.exports = function (karma) {
  karma.set({

    basePath: '../',

    frameworks: ['browserify', 'mocha', 'sinon', 'chai-jquery', 'chai', 'jquery-2.1.0'],

    files: [
      'test/js/*.spec.js'
    ],

    reporters: ['spec'],

    preprocessors: {
      'test/js/*.spec.js': ['browserify']
    },

    browsers: ['PhantomJS'],

    logLevel: karma.LOG_INFO,

    singleRun: false,
    autoWatch: true,

    browserNoActivityTimeout: 20000,

    // browserify configuration
    browserify: {
      debug: true,
      transform: ['brfs']
    }

  });
};
