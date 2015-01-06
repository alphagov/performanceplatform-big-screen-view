describe('slides', function () {

  var Dashboard = require('performanceplatform-client.js');
  var Q = require('q');
  var slides = require('../../src/js/slides.js');
  var dashboardConfig = require(
    '../../node_modules/performanceplatform-client.js/test/fixtures/dashboard-processed.json'
  );
  var moduleConfig = require(
    '../../node_modules/performanceplatform-client.js/test/fixtures/module-processed.json'
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
        $(this.container).find('.t-change').first()
          .should.have.text('-0.27% from the year ending Mar 2014');
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

      it('promotes previous period value to main figure', function () {
        $(this.container).find('.t-main-figure').first().should.have.text('46m');
      });

      it('doesnt show data value for the second-most-recent period or change %', function () {
        expect($(this.container).find('.t-second-most-recent').length).to.equal(0);
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
        expect($(this.container).find('.t-slide-kpi').first()
          .find('.t-second-most-recent,.t-change').length).to.equal(0);
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

  describe('User satisfaction slide', function () {

    beforeEach(function (done) {
      this.slidesPromise.then(function () {
        done();
      });
      this.deferred.resolve(this.dashboardConfig);
    });

    it('shows the most recent figure, if available', function () {
      $(this.container).find('.t-slide-user_satisfaction_graph .t-main-figure')
        .should.have.text('85.6%');
    });

    it('shows change since last period', function () {
      $(this.container).find('.t-slide-user_satisfaction_graph .t-change')
        .should.have.text('-1.4% on previous week');
    });

  });

  describe('Realtime usage slide', function () {

    beforeEach(function (done) {
      this.clock = sinon.useFakeTimers();
      this.slidesPromise.then(function () {
        done();
      });
      this.moduleDeferred = Q.defer();
      this.getModuleStub = sinon
        .stub(Dashboard.prototype, 'getModule')
        .returns(this.moduleDeferred.promise);
      this.deferred.resolve(this.dashboardConfig);
      this.moduleConfig = JSON.parse(JSON.stringify(moduleConfig));
    });

    afterEach(function () {
      this.clock.restore();
      this.getModuleStub.restore();
    });

    it('shows the most recent figure, if available', function () {
      $(this.container).find('.t-slide-realtime .t-main-figure')
        .should.have.text('1,492');
    });

    describe('Poll for an update successfully', function () {

      beforeEach(function (done) {
        this.moduleDeferred.promise.fin(function () {
          done();
        });

        this.clock.tick(150000);
        this.moduleDeferred.resolve(this.moduleConfig);
      });

      it('updates the figure after 2 minutes', function () {
        $(this.container).find('.t-slide-realtime .t-main-figure')
          .should.have.text('1,563');
      });
    });

    describe('Poll for updates even after a failed poll', function () {

      beforeEach(function (done) {
        this.moduleDeferred.promise.fin(function () {
          done();
        });

        this.clock.tick(150000);
        this.moduleDeferred.reject();
      });

      describe('Polls a second time', function () {

        beforeEach(function (done) {
          this.moduleDeferred.promise.fin(function () {
            done();
          });
          // we have to re-stub getModule with a new promise as the last one was resolved
          this.getModuleStub.restore();
          this.moduleDeferred = Q.defer();
          this.getModuleStub = sinon
            .stub(Dashboard.prototype, 'getModule')
            .returns(this.moduleDeferred.promise);
          this.clock.tick(150000); // 5 mins have now elapsed, enough time for 2 polls to have happened
          this.moduleConfig.data[0].formatted_value = '999';
          this.moduleDeferred.resolve(this.moduleConfig);
        });

        it('updates the figure', function () {
          $(this.container).find('.t-slide-realtime .t-main-figure')
            .should.have.text('999');
        });

      });

    });

  });

  describe('Dashboard not available slide', function () {

    describe('If not modules then display message', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.deferred.resolve({
          title: 'FooService',
          slug: 'foo-service',
          modules: []
        });
      });

      it('error should be there', function () {

        $(this.container).find('.error-message')
          .should.exist;
      });

    });

    describe('If no valid modules then display message', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.deferred.resolve({
          title: 'FooService',
          slug: 'foo-service',
          modules: [{
            slug: 'foo-module',
            title: 'FooModule',
            'module-type': 'single_timeseries',
            data: [
              { formatted_value: 'no data' },
              { formatted_value: 'no data' }
            ]
          }]
        });
      });

      it('error should be there', function () {

        $(this.container).find('.error-message')
          .should.exist;
      });

    });

    describe('If valid modules then don\'t display message', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.deferred.resolve({
          title: 'FooService',
          slug: 'foo-service',
          modules: [{
            slug: 'foo-module',
            title: 'FooModule',
            'module-type': 'single_timeseries',
            data: [
              { formatted_value: 'foo' },
              { formatted_value: 'bar' }
            ]
          }]
        });
      });

      it('error should not be there', function () {

        $(this.container).find('.error-message')
          .should.not.exist;
      });

    });

    describe('If it errors it displays a message', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        }, function() {
          done();
        });
        this.deferred.reject();
      });

      it('error should be there', function () {

        $(this.container).find('.error-message')
          .should.exist;
      });

      it('should be on screen', function () {
        $(this.container).should.have.class('on-screen');
      });

    });
  });

});

