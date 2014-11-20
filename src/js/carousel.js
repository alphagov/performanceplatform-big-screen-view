module.exports = function () {
  var slides = document.getElementsByClassName('slide'),
      numberOfSlides = slides.length,
      currentSlideIndex = 0;

  for (var i=0; i < numberOfSlides; i++) {
    slides[i].classList.remove('previously-on-screen');
  }

  slides[currentSlideIndex].classList.add('previously-on-screen');
  slides[currentSlideIndex].classList.remove('on-screen');

  currentSlideIndex += 1;

  if (currentSlideIndex === slides.length) {
    currentSlideIndex = 0;
  }

  slides[currentSlideIndex].classList.add('on-screen');
};
