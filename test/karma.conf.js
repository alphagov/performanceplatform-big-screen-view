'use strict';

module.exports = function (karma) {
  karma.set({

    frameworks: ['browserify', 'mocha', 'sinon', 'chai-jquery', 'chai', 'jquery-2.1.0'],

    files: [
      'js/*.spec.js'
    ],

    reporters: ['spec'],

    preprocessors: {
      'js/*.spec.js': ['browserify']
    },

    browsers: ['PhantomJS'],

    logLevel: karma.LOG_ERROR,

    singleRun: false,
    autoWatch: true,

    // browserify configuration
    browserify: {
      debug: true,
      transform: ['brfs']
    }

  });
};
