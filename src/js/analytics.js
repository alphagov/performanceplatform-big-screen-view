var _ = require('lodash');

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

    GOVUK.analytics.trackEvent(window.location.pathname, 'minutes-since-page-load', {
      value: elapsedMinutes,
      nonInteraction: true // event will not affect bounce rate
    });
  }
};
