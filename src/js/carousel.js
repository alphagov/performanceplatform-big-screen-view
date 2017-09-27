var _ = require('lodash');

module.exports = {

  setup: function (container) {
    var interval;
    this.container = container;
    this.currentSlideIndex = 0;
    this.container.querySelector('.slide').className += ' on-screen';
    if (this.container.querySelectorAll('.slide').length > 1) {
      try {
        interval = parseInt(this.getQueryStringValueByKey('interval'), 10) * 1000;
      } finally {
        this.interval = interval || 5000;
        window.setInterval(_.bind(this.animate, this), this.interval);
      }
    }
  },

  animate: function () {
    var slides = this.container.getElementsByClassName('slide'),
      previous = slides[this.currentSlideIndex];

    previous.className += ' previously-on-screen';
    previous.className = previous.className.replace(' on-screen', '');
    previous.addEventListener('transitionend', function () {
      previous.className = previous.className.replace(' previously-on-screen', '');
    }, false);

    this.currentSlideIndex += 1;
    if (this.currentSlideIndex === slides.length) {
      this.currentSlideIndex = 0;
    }

    slides[this.currentSlideIndex].className += ' on-screen';
  },

  getQueryStringValueByKey: function (key) {
    var val;
    _.map(this.getQueryString().substring(1).split('&'), function (params) {
      var p = params.split('=');
      if (p[0] === key) {
        val = decodeURIComponent(p[1]);
      }
    });
    return val;
  },

  getQueryString: function () {
    return window.location.search;
  }

};
