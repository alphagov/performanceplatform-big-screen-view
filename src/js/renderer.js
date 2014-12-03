var fs = require('fs');
var Mustache = require('mustache');

module.exports = {

  renderSlide: function (data) {
    var slideType = data['module-type'] || 'introduction';
    return Mustache.render(this.getTemplate(slideType), data);
  },

  getTemplate: function (slideType) {
    switch (slideType) {
      case 'introduction': {
        /* Must use string literal not variable as first param
        - https://github.com/substack/brfs/issues/36 */
        return fs.readFileSync(__dirname + '/templates/introduction.mus', 'utf8');
      }
      case 'kpi': {
        return fs.readFileSync(__dirname + '/templates/kpi.mus', 'utf8');
      }
      default : {
        return fs.readFileSync(__dirname + '/templates/default.mus', 'utf8');
      }
    }
  }

};
