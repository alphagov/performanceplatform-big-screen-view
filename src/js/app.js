var backbone = require('backbone');
var carousel = require('./carousel');

var dashboardSlug = window.location.pathname.split('/').pop();

document.getElementById('dashboard-name').innerHTML = 'This is the ' + dashboardSlug + ' dashboard';

var slideRotationInterval = window.setInterval(carousel, (2 * 1000));
