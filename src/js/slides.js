var _ = require('lodash'),
  Dashboard = require('performanceplatform-client.js').Dashboard,
  Module = require('performanceplatform-client.js').Module,
  renderer = require('./renderer'),
  individualSlideData = require('./individual-slide-data'),
  RealtimeUpdate = require('./realtime-update'),
  Delta = require('performanceplatform-client.js').Delta,

module.exports = {

  setup: function (dashboardSlug, slideContainer) {
    var dashboard = new Dashboard(dashboardSlug);

    return dashboard.resolve().
      then(_.bind(function (dashboardConfig) {
        var html = '',
          realTimeUpdates = [],
          preparedSlides,
          slidesToRender,
          supported = Module.prototype.supported;

        dashboardConfig.modules = this.createSlideDataArray(dashboardConfig.modules);

        _.remove(dashboardConfig.modules, function (module) {
          return _.contains(supported, module.moduleConfig['module-type']) === false;
        });

        preparedSlides = _.map(dashboardConfig.modules, function (module) {
          return {
            module: module,
            data: individualSlideData.prepareModuleForRender(dashboardConfig, module.dataAsDelta)
          };
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

      }, this), function (err) {
        slideContainer.classList.add('on-screen');
        slideContainer.innerHTML = renderer.renderErrorSlide(
          {
            title: dashboardSlug,
            slug: dashboardSlug
          },
          'Dashboard not currently available in big screen view');

        throw(err);
      });
  },

  /**
   * Take an array of modules and flatten / transform into an array of data object, each of which
   * will correspond to a slide. Eg a grouped time series module will generate a set of objects,
   * one for each individual time series
   * @param modules
   * @returns {Array}
   */
  createSlideDataArray: function (modules) {
    var flattenedModules = [];
    _.each(modules, function (module) {

      if (module.moduleConfig['module-type'] === 'section') {
        _.each(module.modules, function (nestedModule) {
          nestedModule.moduleConfig.sectionTitle = module.moduleConfig.title;

          nestedModule.dataAsDelta = new Delta(nestedModule);
          flattenedModules.push(nestedModule);
        });
      } else {
        module.dataAsDelta = new Delta(module);

        if (_.isArray(module.dataAsDelta.data) === false) {
          _.each(module.dataAsDelta.data, function (series, key) {
            var seriesData = _.cloneDeep(module);
            seriesData.moduleConfig.title += ': ' +
              _.pluck(_.where(module.axes.y, {'groupId': key}), 'label');
            seriesData.dataAsDelta.data = series;
            flattenedModules.push(seriesData);
          });
        }

        flattenedModules.push(module);
      }
    });
    return flattenedModules;
  }
};
