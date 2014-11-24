module.exports = {
  startTime: new Date().getTime(),
  setup: function () {
    var interval = 30 * 60 * 1000;
    window.setInterval(this.fireEvent, interval);
  },
  getCurrentTime: function () {
    return new Date().getTime();
  },
  fireEvent: function (w) {
    var currentTime,
        elapsedMinutes;

    currentTime = this.getCurrentTime();
    elapsedMinutes = Math.round(((currentTime - this.startTime) / 1000) / 60);
    w.ga('send', {
      'hitType': 'event',
      'eventCategory': w.location.pathname,
      'eventAction': 'minutes-since-page-load',
      'eventLabel': '',
      'eventValue': elapsedMinutes,
      'nonInteraction': true
    });
  }
};
