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
      data = this.dataConversions(data);
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
    data.showChange = data.latestAvailable && data.previousAvailable &&
      data.latest.formatted_change_from_previous;
    data.showPrevious = !data.latestAvailable && data.previousAvailable;

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