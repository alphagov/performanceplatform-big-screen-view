module.exports = {
  selectors: {
    dashboardTitle: '.dashboard-title',
    moduleType: '.t-slide-kpi.on-screen',
    moduleTitle: '.module-title',
    moduleFigure: '.t-main-figure',
    modulePeriod: '.year-ending',
    moduleDelta: '.t-change'
  },

  beforeEach: function (client) {

    // we have to wait for the dashboard title to be visible
    // as that's the last element to animate onto the screen
    // this only seems to be required for phantomjs
    client
      .url('http://localhost:8080/kpi-with-delta')
      .resizeWindow(1000, 800)
      .waitForElementVisible(this.selectors.moduleType + ' ' + this.selectors.dashboardTitle, 5000)
  },

  after: function (client) {
    client.end();
  },

  'Sections exist': function (client) {
    client
      .assert
        .visible(this.selectors.moduleType + ' ' + this.selectors.moduleTitle)
      .assert
        .visible(this.selectors.moduleType + ' ' + this.selectors.moduleFigure)
      .assert
        .visible(this.selectors.moduleType + ' ' + this.selectors.modulePeriod)
      .assert
        .visible(this.selectors.moduleType + ' ' + this.selectors.moduleDelta);
  },

  'Has a figure': function (client) {
    client
      .assert
        .containsText(this.selectors.moduleType + ' ' + this.selectors.moduleTitle,
          'Transactions per year');
  },

  'Has a total': function (client) {
    client
      .assert
        .containsText(this.selectors.moduleType + ' ' + this.selectors.moduleFigure,
          '248k');
  },

  'Has a period': function (client) {
    client
      .assert
        .containsText(this.selectors.moduleType + ' ' + this.selectors.modulePeriod,
          'for the year ending 30 September 2014');
  },

  'Has a delta': function (client) {
    client
      .assert
        .containsText(this.selectors.moduleType + ' ' + this.selectors.moduleDelta,
          '+2.65% from the year ending 30 June 2014');
  }

};
