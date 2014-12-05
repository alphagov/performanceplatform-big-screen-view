var fs = require('fs');
var Mustache = require('mustache');

module.exports = {

  renderSlide: function (data) {
    var slideType = data['module-type'] || 'introduction';
    data = this.transformData(data);
    return data.displaySlide === false ? '' : Mustache.render(this.getTemplate(slideType), data);
  },

  getTemplate: function (slideType) {
    /* Must call readFileSync with string literals not variables as first param so that BRFS can
    inline the template during build - https://github.com/substack/brfs/issues/36 */
    switch (slideType) {
      case 'introduction': {
        return fs.readFileSync(__dirname + '/templates/introduction.mus', 'utf8');
      }
      case 'kpi': {
        return fs.readFileSync(__dirname + '/templates/kpi.mus', 'utf8');
      }
      default : {
        return fs.readFileSync(__dirname + '/templates/default.mus', 'utf8');
      }
    }
  },

  transformData: function (data) {
    var mostRecent;

    // if it's the dashboard config for the intro slide, no transform required
    if (data.modules) {
      return data;
    }

    mostRecent = data.data[0];
    if (mostRecent.formatted_value !== 'no data') {
      data.latestAvailable = true;
    } else if (data.data[1].formatted_value === 'no data') {
      data.displaySlide = false;
    }
    return data;
  }

};
