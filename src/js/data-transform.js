var NO_DATA = 'no data';

module.exports = {

  prepareModuleForRender: function (dashboardConfig, module) {
    var data = {
      departmentCode: dashboardConfig.department.abbr.toLowerCase(),
      dashboardSlug: dashboardConfig.slug,
      dashboardTitle: dashboardConfig.title,
      moduleType: module['module-type'],
      slug: module.slug,
      title: module.title,
      latest: module.data[0] || null,
      previous: module.data[1] || null
    };

    data.displaySlide = this.displaySlide(data);
    if (data.displaySlide) {
      data = this.missingDataFlags(data);
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
    if (data.latest.formatted_value !== NO_DATA) {
      data.latestAvailable = true;
    }
    if (data.previous && (data.previous.formatted_value !== NO_DATA)) {
      data.previousAvailable = true;
    }
    data.showChange = data.latestAvailable && data.previousAvailable;
    data.showPrevious = !data.latestAvailable && data.previousAvailable;

    return data;
  }

};
