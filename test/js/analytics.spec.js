describe('analytics', function () {

  var analytics,
      window;

  beforeEach(function () {
    window = {
      ga: function () {
      },
      location: {
        pathname: 'mypath/'
      }
    };
    analytics = require('../../src/js/analytics');
    analytics.startTime = 0;
    analytics.getCurrentTime = function () {
      return 1000 * 60 * 10;
    }
  });


  it('should send the elapsed time with the event', function () {
    var spy;

    spy = sinon.spy(window, 'ga');

    analytics.fireEvent(window);
    spy.calledOnce.should.equal(true);
    spy.args[0][1].eventValue.should.equal(10);
  });
});
