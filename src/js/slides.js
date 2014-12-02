var _ = require('underscore'),
  Dashboard = require('performanceplatform-client.js');

module.exports = function (slideContainer) {
  var dashboard = new Dashboard('carers-allowance');

  return dashboard.getConfig().
    then(function (dashboardConfig) {

      // add dummy KPI until supplied from API
      _.each(dashboardConfig.modules, function (module) {
        module.data = '20%';
      });

      var html = '';
      var introSlideTemplate = _.template(
          '<h1>Performance data for <%= title %></h1>' +
          '<p class="data-url">Data from www.gov.uk/performance</p>'
        ),
        slideTemplate = _.template(
          '<h2><%= dashboardTitle %></h2>' +
          '<p class="content">' +
          '<span class="big-number"><%= data %></span> ' +
          '<span class="title"><%= title.toLowerCase() %></span>' +
          '<p class="data-url">www.gov.uk/performance/<%= dashboardSlug %></p>'
        );

      var introSlide = document.createElement('div');
      introSlide.classList.add('slide');
      introSlide.classList.add('intro-slide');
      introSlide.classList.add('on-screen');
      introSlide.innerHTML = introSlideTemplate(dashboardConfig);

      html += introSlide.outerHTML;

      _.each(dashboardConfig.modules, function (module) {
        var slide = document.createElement('div');

        module.dashboardSlug = dashboardConfig.slug;
        module.dashboardTitle = dashboardConfig.title;
        slide.classList.add('slide');

        slide.innerHTML = slideTemplate(module);
        slide.classList.add(dashboardConfig.department.abbr.toLowerCase());
        html += slide.outerHTML;
      });

      slideContainer.innerHTML = html;

    }, function (err) {
      throw(err);
    });

};
