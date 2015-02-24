describe('carousel', function () {

  beforeEach(function () {
    this.clock = sinon.useFakeTimers();
    this.carousel = require('../../src/js/carousel');
  });

  afterEach(function () {
    this.clock.restore();
  });

  it('should have changed the current slide to previous', function () {
    this.dom = $('<div><div class="slide"></div><div class="slide"></div>' +
    '<div class="slide"></div></div>')[0];
    this.carousel.setup(this.dom);
    this.dom.firstChild.className.should.not.contain('previously-on-screen');
    this.clock.tick(this.carousel.interval + 500);
    this.dom.firstChild.className.should.contain('previously-on-screen');
  });

  it('should set the slide interval to any supplied value', function () {
    sinon.stub(this.carousel, 'getQueryString').returns('?interval=10');
    this.dom = $('<div><div class="slide"></div><div class="slide"></div>' +
    '<div class="slide"></div></div>')[0];
    this.carousel.setup(this.dom);
    this.dom.firstChild.className.should.not.contain('previously-on-screen');
    this.clock.tick(9000);
    this.dom.firstChild.className.should.not.contain('previously-on-screen');
    this.clock.tick(this.carousel.interval + 2000);
    this.dom.firstChild.className.should.contain('previously-on-screen');
  });

});
