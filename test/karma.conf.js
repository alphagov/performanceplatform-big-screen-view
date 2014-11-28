'use strict';

module.exports = function (karma) {
  karma.set({

    frameworks: ['browserify', 'mocha', 'sinon', 'chai'],

    files: [
      'js/*.spec.js'
    ],

    reporters: ['spec'],

    preprocessors: {
      'js/*.spec.js': ['browserify']
    },

    browsers: ['PhantomJS'],

    logLevel: karma.DEBUG_INFO,

    singleRun: true,
    autoWatch: false,

    // browserify configuration
    browserify: {
      debug: true,
      transform: ['brfs']
    }

  });
};
