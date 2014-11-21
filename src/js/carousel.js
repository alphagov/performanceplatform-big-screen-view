module.exports = function () {
  var slides = document.getElementsByClassName('slide'),
      numberOfSlides = slides.length;

  this.currentSlideIndex = this.currentSlideIndex || 0;

  for (var i=0; i < numberOfSlides; i++) {
    slides[i].classList.remove('previously-on-screen');
  }

  slides[this.currentSlideIndex].classList.add('previously-on-screen');
  slides[this.currentSlideIndex].classList.remove('on-screen');

  this.currentSlideIndex += 1;

  if (this.currentSlideIndex === slides.length) {
    this.currentSlideIndex = 0;
  }

  slides[this.currentSlideIndex].classList.add('on-screen');
};
