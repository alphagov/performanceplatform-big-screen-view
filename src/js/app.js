var backbone = require('backbone');

var dashboardSlug = window.location.pathname.split('/').pop();

document.getElementById('dashboard-name').innerHTML = 'This is the ' + dashboardSlug + ' dashboard';

// Rotating slides

var slides = document.getElementsByClassName('slide'),
    numberOfSlides = slides.length,
    currentSlideIndex = 0;

var rotateSlides = function () {
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

var slideRotationInterval = window.setInterval(rotateSlides, (2 * 1000));
