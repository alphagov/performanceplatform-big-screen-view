var fullscreen = require('./fullscreen')(document.getElementById('fs'));
var slides = require('./slides')(document.getElementById('fs')).then(function() {
  var carousel = require('./carousel');
  var slideRotationInterval = window.setInterval(carousel, (5 * 1000));
});
var analytics = require('./analytics');

document.getElementById('full-screen-toggle').onclick = fullscreen;

var dashboardSlug = window.location.pathname.split('/').pop();

analytics.setup();
