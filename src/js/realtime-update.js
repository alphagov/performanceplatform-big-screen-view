var _ = require('underscore');

var RealtimeUpdate = function (dashboard, dashboardConfig, module, slideContainer) {
  this.slideContainer = slideContainer;
  this.dashboard = dashboard;
  this.fetchModuleUpdate(module);
};

RealtimeUpdate.prototype.fetchModuleUpdate = function (module) {

  this.timer = setTimeout(_.bind(function () {

    this.dashboard.getModule(module)
      .then(_.bind(function (moduleUpdate) {
        var el = this.slideContainer.querySelector('[data-module-slug="' + module.slug + '"] ' +
          ' .js-main-figure');
        el.innerHTML = moduleUpdate.data[0].formatted_value;
      }, this))
      .fin(_.bind(function () { // make the next poll even if the last one failed
        clearTimeout(this.timer);
        this.fetchModuleUpdate(module);
      }, this));

  }, this), 120000);

};

module.exports = RealtimeUpdate;
