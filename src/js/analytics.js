_ = require('underscore');

module.exports = {
  startTime: new Date().getTime(),
  setup: function () {
    var interval = 10 * 60 * 1000;
    window.setInterval(_.bind(this.fireEvent, this), interval);
  },
  getCurrentTime: function () {
    return new Date().getTime();
  },
  fireEvent: function () {
    var currentTime,
        elapsedMinutes;

    currentTime = this.getCurrentTime();
    elapsedMinutes = Math.round(((currentTime - this.startTime) / 1000) / 60);
    ga('send', {
      'hitType': 'event',
      'eventCategory': location.pathname,
      'eventAction': 'minutes-since-page-load',
      'eventLabel': '',
      'eventValue': elapsedMinutes,
      'nonInteraction': true
    });
  }
};
