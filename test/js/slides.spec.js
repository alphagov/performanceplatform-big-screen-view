describe('slides', function () {

  var Dashboard = require('performanceplatform-client.js');
  var Q = require('q');
  var slides = require('../../src/js/slides.js');
  var dashboardConfig = require(
    '../../node_modules/performanceplatform-client.js/test/fixtures/dashboard-processed.json'
  );


  /* ============= SETUP FOR ALL TESTS ============== */

  beforeEach(function () {
    this.deferred = Q.defer();
    this.container = document.createElement('div');
    this.stub = sinon
      .stub(Dashboard.prototype, 'getDashboardMetrics')
      .returns(this.deferred.promise);
    this.slidesPromise = slides('example-slug', this.container);

    // make a fresh clone of the JSON object for each test
    this.dashboardConfig = JSON.parse(JSON.stringify(dashboardConfig));

  });

  afterEach(function () {
    this.stub.restore();
  });

  describe('KPI slide', function () {

    describe('No data', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.dashboardConfig.modules[0].data = [];
        this.deferred.resolve(this.dashboardConfig);
      });

      it('doesn\'t show the slide', function () {
        expect($(this.container).find('.t-slide-kpi').length).to.equal(2);
      });

    });

    describe('Full data', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.deferred.resolve(this.dashboardConfig);
      });

      it('shows the slide title', function () {
        $(this.container).find('.t-module-title').first().should.have.text('Transactions per year');
      });

      it('shows the most recent KPI figure, if available', function () {
        $(this.container).find('.t-main-figure').first().should.have.text('45.8m');
      });

      it('shows change in KPI', function () {
        $(this.container).find('.t-change').first().should.have.text('-0.27% from the year ending July 2013');
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
        $(this.container).find('.t-main-figure').first().should.have.text('no data');
      });

      it('shows data value for the second-most-recent period instead of change %', function () {
        $(this.container).find('.t-second-most-recent').first()
          .should.have.text('46m for year ending Mar 2014');
      });

    });

    describe('Second most recent KPI figure unavailable', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.dashboardConfig.modules[0].data[1].formatted_value = 'no data';
        this.deferred.resolve(this.dashboardConfig);
      });

      it('doesn\'t show data for second most recent period', function () {
        expect($(this.container).find('.t-slide-kpi').first().find('.t-second-most-recent,.t-change').length).to.equal(0);
      });

    });

    describe('2 most recent KPI figures are unavailable', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.dashboardConfig.modules[0].data[0].formatted_value = 'no data';
        this.dashboardConfig.modules[0].data[1].formatted_value = 'no data';
        this.deferred.resolve(this.dashboardConfig);
      });

      it('doesn\'t show the slide', function () {
        expect($(this.container).find('.t-slide-kpi').length).to.equal(2);
      });

    });

  });

  describe('Single time series slide', function () {

    describe('Full data', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.deferred.resolve(this.dashboardConfig);
      });

      it('shows the most recent figure, if available', function () {
        $(this.container).find('.t-slide-single_timeseries .t-main-figure')
          .should.have.text('37m 51s');
      });

      it('shows change since last period', function () {
        $(this.container).find('.t-slide-single_timeseries .t-change')
          .should.have.text('-5s on previous week');
      });

    });
  });

});

