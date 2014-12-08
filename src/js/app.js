var dashboardSlug = window.location.pathname.split('/').pop();

var fullscreen = require('./fullscreen')(document.getElementById('fs'));
var slides = require('./slides');
slides(dashboardSlug, document.getElementById('fs')).then(function () {
  var carousel = require('./carousel');
  document.querySelector('.slide').classList.add('on-screen');
  window.setInterval(carousel, (5 * 1000));
});
var analytics = require('./analytics');

document.getElementById('full-screen-toggle').onclick = fullscreen;

analytics.setup();
