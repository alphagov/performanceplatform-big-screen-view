var _ = require('underscore'),
  Dashboard = require('performanceplatform-client.js'),
  renderer = require('./renderer'),
  dataTransform = require('./data-transform'),
  RealtimeUpdate = require('./realtime-update');

module.exports = function (dashboardSlug, slideContainer) {
  var dashboard = new Dashboard(dashboardSlug);

  return dashboard.getDashboardMetrics().
    then(function (dashboardConfig) {
      var html = '',
        realTimeUpdates = [];

      _.each(dashboardConfig.modules, function (module) {
        var data = dataTransform.prepareModuleForRender(dashboardConfig, module);
        if (data.displaySlide) {
          html += renderer.renderSlide(data);
          if (data.moduleType === 'realtime') {
            realTimeUpdates.push(new RealtimeUpdate(dashboard, dashboardConfig, module,
              slideContainer));
          }
        }
      });
      slideContainer.innerHTML = html;

    }, function (err) {
      throw(err);
    });

};
