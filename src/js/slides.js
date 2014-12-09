var _ = require('underscore'),
  Dashboard = require('performanceplatform-client.js'),
  renderer = require('./renderer'),
  dataTransform = require('./data-transform');


module.exports = function (dashboardSlug, slideContainer) {
  var dashboard = new Dashboard(dashboardSlug);

  return dashboard.getDashboardMetrics().
    then(function (dashboardConfig) {
      var html = '';

      _.each(dashboardConfig.modules, function (module) {
        var data = dataTransform.prepareModuleForRender(dashboardConfig, module);
        if (data.displaySlide) {
          html += renderer.renderSlide(data);
        }
      });
      slideContainer.innerHTML = html;

    }, function (err) {
      throw(err);
    });

};
