var container = document.getElementById('fs');

var dashboardSlug = window.location.pathname.split('/').pop();

require('./slides')(dashboardSlug, container).then(function () {
  require('./carousel').setup(document);
});

var fullscreen = require('./fullscreen')(container);
document.getElementById('full-screen-toggle').onclick = fullscreen;

var analytics = require('./analytics');
analytics.setup();

require('./cursor')(container);
