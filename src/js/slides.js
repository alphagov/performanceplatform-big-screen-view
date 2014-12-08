var _ = require('underscore'),
  Dashboard = require('performanceplatform-client.js'),
  renderer = require('./renderer');


module.exports = function (dashboardSlug, slideContainer) {
  var dashboard = new Dashboard(dashboardSlug);

  return dashboard.getDashboardMetrics().
    then(function (dashboardConfig) {
      var html = '';

      html += renderer.renderSlide(dashboardConfig);

      _.each(dashboardConfig.modules, function (module) {
        html += renderer.renderSlide(_.extend(module, {
          departmentCode: dashboardConfig.department.abbr.toLowerCase(),
          dashboardSlug: dashboardConfig.slug,
          dashboardTitle: dashboardConfig.title
        }));
      });

      slideContainer.innerHTML = html;

    }, function (err) {
      throw(err);
    });

};
