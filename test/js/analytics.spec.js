describe('analytics', function () {
  
  beforeEach(function () {
    var analytics;
    this.clock = sinon.useFakeTimers();
    window.GOVUK = {
      analytics: {
        trackEvent: function() {}
      }
    };
    this.spy = sinon.spy(window.GOVUK.analytics, 'trackEvent');
    analytics = require('../../src/js/analytics');
    analytics.setup();
    this.clock.tick(analytics.interval + 500);
  });

  it('should send the elapsed time and action with the GA event', function () {
    console.log(this.spy.args[0]);
    var callArgs = this.spy.args[0];
    this.spy.calledOnce.should.equal(true);
    callArgs[2].value.should.equal(10);
    callArgs[1].should.equal('minutes-since-page-load');
  });
});
