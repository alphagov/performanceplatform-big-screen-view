var NO_DATA = 'no data';
var Delta = require('performanceplatform-client.js').Delta;

module.exports = {

  prepareModuleForRender: function (dashboardConfig, module) {
    var data,
      deptCode;
    var moduleDataAsDelta = new Delta(module);

    deptCode = (dashboardConfig.department && dashboardConfig.department.abbr &&
    dashboardConfig.department.abbr.toLowerCase()) || '';
    data = {
      departmentCode: deptCode,
      dashboardSlug: dashboardConfig.slug,
      dashboardTitle: dashboardConfig.title,
      moduleType: module.moduleConfig['module-type'],
      slug: module.moduleConfig.slug,
      title: module.moduleConfig.title,
      latest: moduleDataAsDelta.data[0] || null,
      previous: moduleDataAsDelta.data[1] || null,
      sectionTitle: module.moduleConfig.sectionTitle || ''
    };

    data.displaySlide = this.displaySlide(data);
    if (data.displaySlide) {
      data = this.missingDataFlags(data);
      data = this.dataConversions(data);
      if (data.latest.formatted_value && data.latest.formatted_value.length > 5) {
        data.longValue = true;
      }
    }
    return data;
  },

  displaySlide: function (data) {
    var returnVal = true;

    // we're going to display realtime slides even if prior data was missing, as data might reappear
    if (data.moduleType !== 'realtime') {
      if (((data.latest === null) && (data.previous === null)) ||
        ((data.latest.formatted_value === NO_DATA) &&
        (data.previous.formatted_value === NO_DATA))) {
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
    if (data.latest.formatted_change_from_previous &&
      data.latest.formatted_change_from_previous.change === '0%') {
      data.latest.formatted_change_from_previous.change = 'No change';
    }
    return data;
  }

};
