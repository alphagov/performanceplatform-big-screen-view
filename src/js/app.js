var backbone = require('backbone');

var dashboardSlug = window.location.pathname.split('/').pop();

document.getElementById('dashboard-name').innerHTML = 'This is the ' + dashboardSlug + ' dashboard';
