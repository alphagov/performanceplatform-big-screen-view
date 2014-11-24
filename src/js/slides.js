var _ = require('underscore');

module.exports = function (slideContainer) {
  var dashboardConfig = {
    'title': 'Carer\'s Allowance applications',
    'slug': 'carers-allowance',
    'department': {
      'abbr': 'DWP',
      'title': 'Department for Work and Pensions'
    },
    'modules': [
      {
        'title': 'Digital take-up',
        'data': '56% from 10 to 16 November'
      },
      {
        'title': 'User satisfaction',
        'data': '90% from 10 to 16 November'
      },
      {
        'title': 'Completion rate',
        'data': '68% from 10 to 16 November'
      },
      {
        'title': 'Applications breakdown',
        'data': '6,413 from 10 to 16 November'
      }
    ]
  };

  var html = '';

  var introSlideTemplate = _.template('<h3>Performance data for <%= title %></h3><p>Data from www.gov.uk/performance</p>'),
      slideTemplate = _.template('<h3><%= title %></h3><p><%= data %><p>https://www.gov.uk/performance/<%= dashboardSlug %></p>');

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
    slide.classList.add('slide');
    slide.innerHTML = slideTemplate(config);
    slide.classList.add(dashboardConfig.department.title.toLowerCase().replace(/ /g, '-'));
    html += slide.outerHTML;
  }

  slideContainer.innerHTML = html;

};
