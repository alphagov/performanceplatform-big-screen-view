module.exports = {
  selectors: {
    dashboardTitle: '.dashboard-title',
    moduleType: '.t-slide-realtime.on-screen',
    moduleTitle: '.module-title',
    moduleFigure: '.t-main-figure'
  },

  beforeEach: function (client) {

    // we have to wait for the dashboard title to be visible
    // as that's the last element to animate onto the screen
    // this only seems to be required for phantomjs
    client
      .url('http://localhost:8080/realtime')
      .resizeWindow(1000, 800)
      .waitForElementVisible(this.selectors.moduleType + ' ' + this.selectors.dashboardTitle, 5000);
  },

  after: function (client) {
    client.end();
  },

  'Sections exist': function (client) {
    client
      .assert
        .visible(this.selectors.moduleType + ' ' + this.selectors.moduleTitle)
      .assert
        .visible(this.selectors.moduleType + ' ' + this.selectors.moduleFigure);
  },

  'Has a title': function (client) {
    client
      .assert
        .containsText(this.selectors.moduleType + ' ' + this.selectors.moduleTitle,
          'Live service usage');
  },

  'Has a figure': function (client) {
    client
      .assert
        .containsText(this.selectors.moduleType + ' ' + this.selectors.moduleFigure, '43');
  }

};
