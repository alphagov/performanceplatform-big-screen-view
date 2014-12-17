var _ = require('underscore');

module.exports = {

  interval: 5000,

  setup: function (container) {
    this.container = container;
    this.container.querySelector('.slide').classList.add('on-screen');
    if (this.container.querySelectorAll('.slide').length > 1) {
      window.setInterval(_.bind(this.animate, this), this.interval);
    }
  },

  animate: function () {
    var slides = this.container.getElementsByClassName('slide'),
      previous;

    this.currentSlideIndex = this.currentSlideIndex || 0;

    previous = slides[this.currentSlideIndex];
    previous.classList.add('previously-on-screen');
    previous.classList.remove('on-screen');
    previous.addEventListener('transitionend', function () {
      previous.classList.remove('previously-on-screen');
    }, false);

    this.currentSlideIndex += 1;
    if (this.currentSlideIndex === slides.length) {
      this.currentSlideIndex = 0;
    }

    slides[this.currentSlideIndex].classList.add('on-screen');
  }

};
