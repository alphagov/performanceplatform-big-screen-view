var _ = require('underscore');

module.exports = {
  interval: 10 * 60 * 1000,
  startTime: new Date().getTime(),
  setup: function () {
    setInterval(_.bind(this.fireEvent, this), this.interval);
  },
  getCurrentTime: function () {
    return new Date().getTime();
  },
  fireEvent: function () {
    var currentTime,
        elapsedMinutes;

    currentTime = this.getCurrentTime();
    elapsedMinutes = Math.round(((currentTime - this.startTime) / 1000) / 60);
    window.ga('send', {
      'hitType': 'event',
      'eventCategory': window.location.pathname,
      'eventAction': 'minutes-since-page-load',
      'eventLabel': '',
      'eventValue': elapsedMinutes,
      'nonInteraction': true
    });
  }
};
