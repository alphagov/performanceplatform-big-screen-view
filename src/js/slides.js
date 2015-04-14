var _ = require('lodash'),
  Dashboard = require('performanceplatform-client.js').Dashboard,
  Module = require('performanceplatform-client.js').Module,
  renderer = require('./renderer'),
  individualSlideData = require('./individual-slide-data'),
  RealtimeUpdate = require('./realtime-update'),
  Delta = require('performanceplatform-client.js').Delta,
  Table = require('performanceplatform-client.js').Table;

module.exports = {

  setup: function (dashboardSlug, slideContainer) {
    var dashboard = new Dashboard(dashboardSlug);

    return dashboard.resolve().
      then(_.bind(function (dashboardConfig) {
        var html = '',
          realTimeUpdates = [],
          deltaSlides,
          tableSlides,
          slidesToRender,
          supported = Module.prototype.supported;

        dashboardConfig.modules = this.createSlideDataArray(dashboardConfig.modules);

        _.remove(dashboardConfig.modules, function (module) {
          return _.contains(supported, module.moduleConfig['module-type']) === false;
        });

        deltaSlides = _.map(_.where(dashboardConfig.modules, 'dataAsDelta'), function (module) {
          return {
            module: module,
            data: individualSlideData.prepareDeltaModuleForRender(
              dashboardConfig, module.dataAsDelta
            )
          };
        });

        tableSlides = _.map(_.where(dashboardConfig.modules, 'dataAsTable'), function (module) {
          return {
            module: module,
            data: individualSlideData.prepareTableModuleForRender(
              dashboardConfig, module.dataAsTable
            )
          };
        });

        slidesToRender = _.filter(deltaSlides.concat(tableSlides), function (slide) {
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

    function applyDataView (module) {
      if (module.moduleConfig['module-type'] === 'table') {
        module.dataAsTable = new Table(module, {
          rowsLimit: 5,
          colsLimit: 1
        });
        module.dataAsTable.data = module.dataAsTable.render();

        flattenedModules.push(module);

      } else {
        // we can't currently support grouped-timeseries with a group mapping this should be done
        // in the transform
        if (module.moduleConfig['group-mapping']) {
          return;
        }
        module.dataAsDelta = new Delta(module);
        if (_.isArray(module.dataAsDelta.data) === false) {
          _.each(module.axes.y, function (yAxis) {
            var seriesData = _.cloneDeep(module);
            seriesData.moduleConfig.title += ': ' + yAxis.label;
            seriesData.dataAsDelta.data = seriesData.dataAsDelta.data[yAxis.groupId];
            flattenedModules.push(seriesData);
          });
        }

        flattenedModules.push(module);
      }
    }

    function iterateSubModules (module) {
      if (module.modules && module.modules.length) {
        module.moduleConfig.titles = [];
        _.each(module.modules, function (nestedModule) {
          nestedModule.moduleConfig.sectionTitle = module.moduleConfig.title;
          iterateSubModules(nestedModule);
        });
      } else {
        applyDataView(module);
      }
    }

    _.each(modules, function (module) {
      iterateSubModules(module);
    });
    return flattenedModules;
  }
};
