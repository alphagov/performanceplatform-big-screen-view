var fs = require('fs');
var Mustache = require('mustache');

module.exports = {

  renderSlide: function (data) {
    return data.displaySlide ? Mustache.render(this.getTemplate(data.moduleType), data) : '';
  },

  getTemplate: function (slideType) {
    /* Must call readFileSync with string literals not variables as first param so that BRFS can
     inline the template during build - https://github.com/substack/brfs/issues/36 */
    switch (slideType) {
      case 'kpi': {
        return fs.readFileSync(__dirname + '/templates/kpi.mus', 'utf8');
      }
      case 'realtime': {
        return fs.readFileSync(__dirname + '/templates/realtime.mus', 'utf8');
      }
      case 'single_timeseries': {
        return fs.readFileSync(__dirname + '/templates/single_timeseries.mus', 'utf8');
      }
    }
  }

};
