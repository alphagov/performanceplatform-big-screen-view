var carousel = require('./carousel');
var fullscreen = require('./fullscreen')(document.getElementById('fs'));
var slides = require('./slides')(document.getElementById('fs'));

document.getElementById('full-screen-toggle').onclick = fullscreen;

var dashboardSlug = window.location.pathname.split('/').pop();

var slideRotationInterval = window.setInterval(carousel, (2 * 1000));
