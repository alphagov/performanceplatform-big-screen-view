describe('carousel', function () {

  var html = '<div><div class="slide"></div><div class="slide"></div>' +
    '<div class="slide"></div></div>';

  beforeEach(function () {
    this.dom = $(html)[0];
    this.clock = sinon.useFakeTimers();
    this.carousel = require('../../src/js/carousel');
    this.carousel.setup(this.dom);
  });

  it('should have changed the current slide to previous', function () {
    this.dom.firstChild.className.should.not.contain('previously-on-screen');
    this.clock.tick(this.carousel.interval + 500);
    this.dom.firstChild.className.should.contain('previously-on-screen');
  });
});
