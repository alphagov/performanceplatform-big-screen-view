var fs = require('fs');
var Mustache = require('mustache');

module.exports = {

  renderSlide: function (data) {
    var self = this;

    data.contents = function () {
      var html = self.getContentsTemplate(this.moduleType);
      return html === '' ? html : Mustache.render(html, this);
    };
    return data.displaySlide ? Mustache.render(this.getTemplate(), data) : '';
  },

  renderErrorSlide: function (dashboard, str) {
    return Mustache.render(this.getTemplate(), {
      dashboardTitle: dashboard.title,
      dashboardSlug: dashboard.slug,
      contents: '<p class="error-message">' + str + '</p>'
    });
  },

  getTemplate: function () {
    return fs.readFileSync(__dirname + '/templates/layout.mus', 'utf8');
  },

  getContentsTemplate: function (slideType) {
    /* Must call readFileSync with string literals not variables as first param so that BRFS can
     inline the template during build - https://github.com/substack/brfs/issues/36 */
    switch (slideType) {
      case 'kpi': {
        return fs.readFileSync(__dirname + '/templates/kpi.mus', 'utf8');
      }
      case 'single_timeseries':
      case 'user_satisfaction_graph': {
        return fs.readFileSync(__dirname + '/templates/single_timeseries.mus', 'utf8');
      }
      default : {
        return '';
      }

    }
  }

};
