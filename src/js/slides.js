var _ = require('underscore'),
  Dashboard = require('performanceplatform-client.js');

module.exports = function (slideContainer) {
  var dashboard = new Dashboard();

  function getMockJson() {
    var json = require('../../test/fixtures/dashboard-config.json');
    for (var module in json.modules) {
      json.modules[module].data = '20%';
    }
    return json;
  }

  return dashboard.getConfig('carers-allowance').
    fin(function (dashboardConfig) {
      dashboardConfig = getMockJson();
      var html = '';
      var introSlideTemplate = _.template('<h1>Performance data for <%= title %></h1><p class="data-url">Data from www.gov.uk/performance</p>'),
        slideTemplate = _.template('<h2><%= dashboardTitle %></h2><p class="content"><span class="big-number"><%= data %></span> <span class="title"><%= title.toLowerCase() %></span><p class="data-url">www.gov.uk/performance/<%= dashboardSlug %></p>');

      var introSlide = document.createElement('div');
      introSlide.classList.add('slide');
      introSlide.classList.add('intro-slide');
      introSlide.classList.add('on-screen');
      introSlide.innerHTML = introSlideTemplate(dashboardConfig);

      html += introSlide.outerHTML;

      for (var module in dashboardConfig.modules) {
        var config = dashboardConfig.modules[module],
          slide = document.createElement('div');

        config.dashboardSlug = dashboardConfig.slug;
        config.dashboardTitle = dashboardConfig.title;
        slide.classList.add('slide');

        slide.innerHTML = slideTemplate(config);
        slide.classList.add(dashboardConfig.department.abbr.toLowerCase());
        html += slide.outerHTML;
      }

      slideContainer.innerHTML = html;

    }, function (err) {
      throw(err);
    });

};
