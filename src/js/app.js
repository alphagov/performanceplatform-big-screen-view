var carousel = require('./carousel');
var fullscreen = require('./fullscreen')(document.getElementById('fs'));

document.getElementById('fullScreenToggle').onclick = fullscreen;

var dashboardSlug = window.location.pathname.split('/').pop();

document.getElementById('dashboard-name').innerHTML = 'This is the ' + dashboardSlug + ' dashboard';

var slideRotationInterval = window.setInterval(carousel, (2 * 1000));