var _ = require('lodash'),
  Dashboard = require('performanceplatform-client.js').Dashboard,
  Module = require('performanceplatform-client.js').Module,
  renderer = require('./renderer'),
  dataTransform = require('./data-transform'),
  RealtimeUpdate = require('./realtime-update');

module.exports = function (dashboardSlug, slideContainer) {
  var dashboard = new Dashboard(dashboardSlug);

  return dashboard.resolve().
    then(function (dashboardConfig) {
      var html = '',
        realTimeUpdates = [],
        preparedSlides,
        slidesToRender,
        supported = _.without(Module.prototype.supported, 'grouped_timeseries');

      _.remove(dashboardConfig.modules, function (module) {
        return _.contains(supported, module.moduleConfig['module-type']) === false;
      });

      preparedSlides = _.map(dashboardConfig.modules, function (module) {
        if (module) {
          return {
            module: module,
            data: dataTransform.prepareModuleForRender(dashboardConfig, module)
          };
        }
      });

      slidesToRender = _.filter(preparedSlides, function (slide) {
        return slide.data.displaySlide;
      });

      if (slidesToRender.length > 0) {
        _.each(slidesToRender, function (slide) {
          html += renderer.renderSlide(slide.data);
          if (slide.data.moduleType === 'realtime') {
            realTimeUpdates.push(new RealtimeUpdate(dashboard, dashboardConfig, slide.module,
              slideContainer));
          }
        });
      } else {
        html = renderer.renderErrorSlide(dashboardConfig,
          'Dashboard not currently available in big screen view');
      }

      slideContainer.innerHTML = html;

    }, function (err) {
      slideContainer.classList.add('on-screen');
      slideContainer.innerHTML = renderer.renderErrorSlide(
        { title: dashboardSlug,
          slug: dashboardSlug },
        'Dashboard not currently available in big screen view');

      throw(err);
    });

};
