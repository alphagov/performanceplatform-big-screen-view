describe('slides', function () {

  var Dashboard = require('performanceplatform-client.js');
  var Q = require('q');
  var slides = require('../../src/js/slides.js');

  beforeEach(function () {
    this.deferred = Q.defer();
    this.container = document.createElement('div');
    this.stub = sinon.stub(Dashboard.prototype, 'getDashboardMetrics').returns(this.deferred.promise);
    this.slidesPromise = slides('example-slug', this.container);
    this.dashboardConfig = {
      title: '"Dashboard title 2"',
      department: {
        abbr: 'DFT',
        title: 'Department for Transport'
      },
      modules: [{
        title: 'Transactions per year',
        'module-type': 'kpi',
        data: [{
          formatted_value: '3,520',
          formatted_start_at: 'Oct 2012',
          formatted_end_at: 'Jan 2013',
          formatted_change_from_previous: {
            change: '+5%',
            direction: 'increase'
          }
        }]
      }]
    };
  });

  afterEach(function () {
    this.stub.restore();
  });

  describe('Introduction slide', function () {
    beforeEach(function (done) {
      /* only allow execution to go through to the test once the promise has been resolved */
      this.slidesPromise.then(function () {
        done();
      });
      this.deferred.resolve(this.dashboardConfig);
    });

    it('should render the title', function () {
      $(this.container).find('.t-slide-title').should.have.text('Performance data for "Dashboard title 2"');
    });
  });

  describe('KPI slide', function () {

    describe('Full data', function () {
      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.deferred.resolve(this.dashboardConfig);
      });

      it('shows the most recent KPI figure, if available', function () {
        $(this.container).find('.t-kpi-recent').should.have.text('3,520');
      });

      it('shows change in KPI', function () {
        $(this.container).find('.t-change').should.have.text('+5% from the year ending Oct 2012');
      });
    });

    describe('Most recent KPI figure unavailable', function () {
      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.dashboardConfig.modules[0].data[0].formatted_value = 'no data';
        this.deferred.resolve(this.dashboardConfig);
      });

      it('shows "no data" instead of the most recent KPI figure', function () {
        $(this.container).find('.t-kpi-recent').should.have.text('no data');
      });

    });


  });

});

