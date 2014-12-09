var fs = require('fs');
var Mustache = require('mustache');
var NO_DATA = 'no data';

module.exports = {

  renderSlide: function (data) {
    var slideType;

    data.displaySlide = true;
    slideType = data['module-type'];

    data.displaySlide = this.displaySlide(data);
    if (data.displaySlide) {
      data = this.checkForMissingData(data);
    }

    return data.displaySlide ? Mustache.render(this.getTemplate(slideType), data) : '';
  },

  getTemplate: function (slideType) {
    /* Must call readFileSync with string literals not variables as first param so that BRFS can
     inline the template during build - https://github.com/substack/brfs/issues/36 */
    switch (slideType) {
      case 'kpi': {
        return fs.readFileSync(__dirname + '/templates/kpi.mus', 'utf8');
      }
      case 'single_timeseries': {
        return fs.readFileSync(__dirname + '/templates/single_timeseries.mus', 'utf8');
      }
    }
  },

  displaySlide: function (data) {
    var latest,
      secondLatest,
      returnVal = true;

    latest = data.data[0];
    secondLatest = data.data[1];

    if ((!latest && !secondLatest) ||
      ((latest.formatted_value === NO_DATA) &&
      (secondLatest.formatted_value === NO_DATA))) {
      returnVal = false;
    }
    return returnVal;
  },

  checkForMissingData: function (data) {
    var latest,
      secondLatest;

    latest = data.data[0];
    secondLatest = data.data[1];

    if (latest.formatted_value !== NO_DATA) {
      data.latestAvailable = true;
    }
    if (secondLatest && (secondLatest.formatted_value !== NO_DATA)) {
      data.secondLatestAvailable = true;
    }
    data.showChange = data.latestAvailable && data.secondLatestAvailable;
    data.showSecondLatest = !data.latestAvailable && data.secondLatestAvailable;

    return data;
  }

};
