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
      secondLatest: module.data[1] || null
    };

    data.displaySlide = this.displaySlide(data);
    if (data.displaySlide) {
      data = this.checkForMissingData(data);
    }
    return data;
  },

  displaySlide: function (data) {
    var returnVal = true;

    if ((!data.latest && !data.secondLatest) ||
      ((data.latest.formatted_value === NO_DATA) &&
      (data.secondLatest.formatted_value === NO_DATA))) {
      returnVal = false;
    }
    return returnVal;
  },

  checkForMissingData: function (data) {
    if (data.latest.formatted_value !== NO_DATA) {
      data.latestAvailable = true;
    }
    if (data.secondLatest && (data.secondLatest.formatted_value !== NO_DATA)) {
      data.secondLatestAvailable = true;
    }
    data.showChange = data.latestAvailable && data.secondLatestAvailable;
    data.showSecondLatest = !data.latestAvailable && data.secondLatestAvailable;

    return data;
  }

};
