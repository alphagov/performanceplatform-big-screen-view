var container = document.getElementById('fs');

var dashboardSlug = window.location.pathname.split('/').pop();

require('./slides').setup(dashboardSlug, container).then(function () {
  require('./carousel').setup(document);
});

var fullscreen = require('./fullscreen')(container);
document.getElementById('full-screen-toggle').onclick = fullscreen;

require('govuk_frontend_toolkit/javascripts/govuk/analytics/google-analytics-classic-tracker');
require('govuk_frontend_toolkit/javascripts/govuk/analytics/google-analytics-universal-tracker');
require('govuk_frontend_toolkit/javascripts/govuk/analytics/tracker');
require('./analytics-init');
var analytics = require('./analytics');
analytics.setup();

require('./cursor')(container);
