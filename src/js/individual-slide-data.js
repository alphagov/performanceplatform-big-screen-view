var NO_DATA = 'no data';
var _ = require('lodash');

module.exports = {

  prepareModuleForRender: function (dashboardConfig, slideData) {
    var data,
      deptCode;

    deptCode = (dashboardConfig.department && dashboardConfig.department.abbr &&
    dashboardConfig.department.abbr.toLowerCase()) || '';
    data = {
      departmentCode: deptCode,
      dashboardSlug: dashboardConfig.slug,
      dashboardTitle: dashboardConfig.title,
      moduleType: slideData.moduleConfig['module-type'],
      slug: slideData.moduleConfig.slug,
      title: slideData.moduleConfig.title,
      sectionTitle: slideData.moduleConfig.sectionTitle || ''
    };

    return data;
  },

  prepareDeltaModuleForRender: function (dashboardConfig, slideData) {
    var data = this.prepareModuleForRender(dashboardConfig, slideData);

    data.latest = slideData.data[0] || null;
    data.previous = slideData.data[1] || null;

    data.displaySlide = this.displaySlide(data);
    if (data.displaySlide) {
      data = this.missingDataFlags(data);
      data = this.dataConversions(data);
      if (data.latest) {
        if (data.latest.formatted_value && data.latest.formatted_value.length > 5) {
          data.longValue = true;
        }
        if (data.latest.formatted_value === 'no data') {
          data.latest.formatted_value = 'Latest data not available';
        }
      }
    }
    return data;
  },

  prepareTableModuleForRender: function (dashboardConfig, slideData) {
    var data = this.prepareModuleForRender(dashboardConfig, slideData);

    data.displaySlide = true;
    data.tableHead = _.map(slideData.data, function (item) {
      return item[0];
    });

    var tr = [];
    _.each(slideData.data[0], function (row, rowIndex) {
      var td = [];
      _.each(slideData.data, function (col) {
        td.push({td: col[rowIndex]});
      });
      if (rowIndex > 0) {
        tr.push({tr: td});
      }
    });

    data.tableBody = tr;

    return data;
  },

  displaySlide: function (data) {
    var returnVal = true;

    // we're going to display realtime slides even if prior data was missing, as data might reappear
    if (data.moduleType !== 'realtime') {
      if ((data.latest === null) && (data.previous === null)) {
        returnVal = false;
      }
    }
    return returnVal;
  },

  missingDataFlags: function (data) {
    var period;

    if (data.latest.formatted_value !== NO_DATA) {
      data.latestAvailable = true;
    }
    if (data.previous && (data.previous.formatted_value !== NO_DATA)) {
      data.previousAvailable = true;
    }
    data.showChange = data.latestAvailable && data.previousAvailable &&
      data.latest.formatted_change_from_previous;

    if (!data.latestAvailable && data.previousAvailable) {
      period = data.latest.period;
      data.latest = data.previous;
      data.latest.period = period;
      data.latestAvailable = true;
      delete data.previous;
    }

    return data;
  },

  dataConversions: function (data) {
    //TODO - move to client / API
    if (data.latest) {
      if (data.latest.formatted_change_from_previous &&
        data.latest.formatted_change_from_previous.change === '0%') {
        data.latest.formatted_change_from_previous.change = 'No change';
      }
    }

    return data;
  }

};
