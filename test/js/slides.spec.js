describe('slides', function () {

  var Dashboard = require('performanceplatform-client.js').Dashboard;
  var Q = require('q');
  var _ = require('lodash');

  var slides = require('../../src/js/slides.js');
  var dashboardConfig = require(
    '../../node_modules/performanceplatform-client.js/test/fixtures/dashboard-response.json'
  );

  var dashboardWithSectionConfig = require(
    '../../node_modules/performanceplatform-client.js/test/fixtures/dashboard-response-section.json'
  );
  var singleTimeseriesConfig = require(
    '../../node_modules/performanceplatform-client.js/test/fixtures/module-config-single-time-series.json'
  );
  var kpiConfig = require(
    '../../node_modules/performanceplatform-client.js/test/fixtures/module-config-kpi.json'
  );
  var userSatisfactionConfig = require(
    '../../node_modules/performanceplatform-client.js/test/fixtures/module-config-user-satisfaction-graph.json'
  );
  var realtimeConfig = require(
    '../../node_modules/performanceplatform-client.js/test/fixtures/module-config-realtime.json'
  );
  var groupedTimeseriesConfig = require(
    '../../node_modules/performanceplatform-client.js/test/fixtures/module-config-grouped-time-series.json'
  );
  var sectionConfig = require(
    '../../node_modules/performanceplatform-client.js/test/fixtures/module-config-section.json'
  );
  var tableConfig = require(
    '../../node_modules/performanceplatform-client.js/test/fixtures/module-config-table.json'
  );


  dashboardConfig.modules = [];
  dashboardConfig.modules[0] = kpiConfig;
  dashboardConfig.modules[1] = singleTimeseriesConfig;
  dashboardConfig.modules[2] = userSatisfactionConfig;
  dashboardConfig.modules[3] = realtimeConfig;
  dashboardConfig.modules[4] = tableConfig;


  /* ============= SETUP FOR ALL TESTS ============== */

  beforeEach(function () {
    this.deferred = Q.defer();
    this.container = document.createElement('div');
    this.stub = sinon.stub(Dashboard.prototype, 'resolve').returns(this.deferred.promise);
    this.slidesPromise = slides.setup('example-slug', this.container);

    // make a fresh copy of the JSON object for each test
    this.dashboardConfig = _.cloneDeep(dashboardConfig);

  });

  afterEach(function () {
    this.stub.restore();
  });

  describe('Sections', function () {

    beforeEach(function (done) {
      this.slidesPromise.then(function () {
        done();
      });
      this.dashboardConfig = _.cloneDeep(dashboardWithSectionConfig);
      this.dashboardConfig.modules = [];
      this.dashboardConfig.modules.push(sectionConfig);
      this.deferred.resolve(this.dashboardConfig);
    });

    it('Should add the section title to the title on the slide', function () {
      $(this.container).find('.module-title').first().text()
        .should.equal('Public digital service: User satisfaction');
    });

  });

  describe('KPI slide', function () {

    describe('No data', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.dashboardConfig.modules[0].dataSource.data = [];
        this.deferred.resolve(this.dashboardConfig);
      });

      it('doesn\'t show the slide', function () {
        $(this.container).find('.t-slide-kpi').length.should.equal(0);
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
          .should.have.text('−0.27% from the year ending 31 March 2014');
      });

    });

    describe('Most recent KPI figure unavailable', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.dashboardConfig.modules[0].dataSource.data[0].number_of_transactions = null;
        this.deferred.resolve(this.dashboardConfig);
      });

      it('promotes previous period value to main figure', function () {
        $(this.container).find('.t-main-figure').first().should.have.text('46m');
      });

      it('doesnt show data value for the second-most-recent period or change %', function () {
        $(this.container).find('.t-second-most-recent').length.should.equal(0);
      });

    });

    describe('Second most recent KPI figure unavailable', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.dashboardConfig.modules[0].dataSource.data[1].number_of_transactions = null;
        this.deferred.resolve(this.dashboardConfig);
      });

      it('doesn\'t show data for second most recent period', function () {
        $(this.container).find('.t-slide-kpi').first()
          .find('.t-second-most-recent,.t-change').length.should.equal(0);
      });

    });

    describe('2 most recent KPI figures are unavailable', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.dashboardConfig.modules[0].dataSource.data[0].number_of_transactions = null;
        this.dashboardConfig.modules[0].dataSource.data[1].number_of_transactions = null;
        this.deferred.resolve(this.dashboardConfig);
      });

      it('doesn\'t show the slide', function () {
        $(this.container).find('.t-slide-kpi').length.should.equal(0);
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
        .should.have.text('82.9%');
    });

    it('shows change since last period', function () {
      $(this.container).find('.t-slide-single_timeseries .t-change')
        .should.have.text('+11.57% on previous month');
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
        .should.have.text('85.8%');
    });

    it('shows change since last period', function () {
      $(this.container).find('.t-slide-user_satisfaction_graph .t-change')
        .should.have.text('−0.46% on previous 7 days');
      $(this.container).find('.t-slide-user_satisfaction_graph .t-change').length.should.equal(1);
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
      this.moduleConfig = JSON.parse(JSON.stringify(realtimeConfig));
    });

    afterEach(function () {
      this.clock.restore();
      this.getModuleStub.restore();
    });

    it('shows the most recent figure, if available', function () {
      $(this.container).find('.t-slide-realtime .t-main-figure')
        .should.have.text('482');
    });

    describe('Poll for an update successfully', function () {

      beforeEach(function (done) {
        this.moduleDeferred.promise.fin(function () {
          done();
        });

        this.clock.tick(150000);
        this.moduleConfig.dataSource.data[0].unique_visitors = 599;
        this.moduleDeferred.resolve(this.moduleConfig);
      });

      it('updates the figure after 2 minutes', function () {
        $(this.container).find('.t-slide-realtime .t-main-figure')
          .should.have.text('599');
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
          // 5 mins have now elapsed, enough time for 2 polls to have happened
          this.clock.tick(150000);
          this.moduleConfig.dataSource.data[0].unique_visitors = 999;
          this.moduleDeferred.resolve(this.moduleConfig);
        });

        it('updates the figure', function () {
          $(this.container).find('.t-slide-realtime .t-main-figure')
            .should.have.text('999');
        });

      });

    });

  });

  describe('Table slide', function () {

    beforeEach(function (done) {
      this.slidesPromise.then(function () {
        done();
      });
      this.deferred.resolve(this.dashboardConfig);
    });

    it('renders a table', function () {
      $(this.container).find('.t-slide-table')
        .should.exist;
    });

    it('renders a table header', function () {
      $(this.container).find('.t-slide-table thead')
        .should.exist;

      $(this.container).find('.t-slide-table thead').should.contain('Url');
      $(this.container).find('.t-slide-table thead').should.contain('Date');
    });

    it('renders a table body', function () {
      $(this.container).find('.t-slide-table tbody')
        .should.exist;

      $(this.container).find('.t-slide-table tbody tr:nth-of-type(1)')
        .should.contain('/performance/dft-renew-driving-licence');
      $(this.container).find('.t-slide-table tbody tr:nth-of-type(2)')
        .should.contain('/performance/tax-disc');
      $(this.container).find('.t-slide-table tbody tr:nth-of-type(3)')
        .should.contain('/performance');
      $(this.container).find('.t-slide-table tbody tr:nth-of-type(4)')
        .should.contain('/performance/dwp-jobseekers-allowance-jsa-new-claims');
      $(this.container).find('.t-slide-table tbody tr:nth-of-type(5)')
        .should.contain('/performance/register-to-vote');
    });

    it('limits the table columns to two', function () {
      $(this.container).find('.t-slide-table thead td').length.should.equal(2);
    });

    it('limits the rows to 5', function () {
      $(this.container).find('.t-slide-table tbody tr').length.should.equal(5);
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
        $(this.container).find('.error-message').should.exist;
      });

    });

    describe('If no valid modules then display message', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.dashboardConfig.modules = [];
        this.deferred.resolve(this.dashboardConfig);
      });

      it('error should be there', function () {
        $(this.container).find('.error-message').should.exist;
      });

    });

    describe('If valid modules then don\'t display message', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        });
        this.deferred.resolve(this.dashboardConfig);
      });

      it('error should not be there', function () {
        $(this.container).find('.error-message').should.not.exist;
      });

    });

    describe('If it errors it displays a message', function () {

      beforeEach(function (done) {
        this.slidesPromise.then(function () {
          done();
        }, function () {
          done();
        });
        this.deferred.reject();
      });

      it('error should be there', function () {
        $(this.container).find('.error-message').should.exist;
      });

      it('should be on screen', function () {
        $(this.container).should.have.class('on-screen');
      });

    });
  });

  describe('Grouped timeseries', function () {

    beforeEach(function (done) {
      this.slidesPromise.then(function () {
        done();
      });

      this.dashboardConfig.modules = [];
      this.dashboardConfig.modules[0] = groupedTimeseriesConfig;
      this.deferred.resolve(this.dashboardConfig);
    });

    it('shows the most recent figure, if available', function () {
      $(this.container).find('.t-slide-grouped_timeseries:first .t-main-figure')
        .should.have.text('2.63m');
    });

    it('shows change since last period', function () {
      $(this.container).find('.t-slide-grouped_timeseries:first .t-change')
        .should.have.text('+21.90% on previous month');
    });

  });
});

