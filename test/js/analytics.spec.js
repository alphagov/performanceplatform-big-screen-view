describe('analytics', function () {
  
  beforeEach(function () {
    var analytics;
    this.clock = sinon.useFakeTimers();
    window.ga = function () { };
    this.spy = sinon.spy(window, 'ga');
    analytics = require('../../src/js/analytics');
    analytics.setup();
    this.clock.tick(analytics.interval + 500);
  });

  it('should send the elapsed time and action with the GA event', function () {
    var event = this.spy.args[0][1];
    this.spy.calledOnce.should.equal(true);
    event.eventValue.should.equal(10);
    event.eventAction = 'minutes-since-page-load';
  });
});
