module.exports = {
  selectors: {
    dashboardTitle: '.dashboard-title',
    moduleType: '.t-slide-grouped_timeseries.on-screen',
    moduleTitle: '.module-title',
    moduleFigure: '.t-main-figure'
  },

  beforeEach: function (client) {

    // we have to wait for the dashboard title to be visible
    // as that's the last element to animate onto the screen
    // this only seems to be required for phantomjs
    client
      .url('http://localhost:8080/grouped-timeseries')
      .resizeWindow(1000, 800)
      .waitForElementVisible(this.selectors.moduleType + ' ' + this.selectors.dashboardTitle, 5000);
  },

  'Sections exist': function (client) {
    client
      .assert
        .visible(this.selectors.moduleType + ' ' + this.selectors.moduleTitle)
      .assert
        .visible(this.selectors.moduleType + ' ' + this.selectors.moduleFigure)
      .end();
  },

  'Has a title and grouped title': function (client) {
    client
      .assert
        .containsText(this.selectors.moduleType + ' ' + this.selectors.moduleTitle,
          'Number of transactions by channel (Paper form)')
        .end();
  },

  'Has a figure': function (client) {
    client
      .assert
        .containsText(this.selectors.moduleType + ' ' + this.selectors.moduleFigure,
          '2171')
        .end();
  },

  'Rotates to the next slide': function (client) {
    //This will retry the assertion for 10 seconds (so the next slide can rotate in!)
    client.globals.retryAssertionTimeout = 10000;
    client
      .assert
        .containsText(this.selectors.moduleType + ' ' + this.selectors.moduleTitle,
          'Number of transactions by channel (Digital)')
      .assert
        .containsText(this.selectors.moduleType + ' ' + this.selectors.moduleFigure,
          '3843')
        .end();
  }

};
