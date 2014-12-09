var container = document.getElementById('fs');

var dashboardSlug = window.location.pathname.split('/').pop();
var slides = require('./slides');
slides(dashboardSlug, container).then(function () {
  var carousel = require('./carousel');
  document.querySelector('.slide').classList.add('on-screen');
  window.setInterval(carousel, (5 * 1000));
});

var fullscreen = require('./fullscreen')(container);
document.getElementById('full-screen-toggle').onclick = fullscreen;

var analytics = require('./analytics');
analytics.setup();

require('./cursor')(container);
