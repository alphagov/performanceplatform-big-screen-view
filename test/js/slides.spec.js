describe('slides', function () {

  var Dashboard = require('performanceplatform-client.js');
  var Q = require('q');
  var slides = require('../../src/js/slides.js');
  var container = document.createElement('div');

  beforeEach(function (done) {
    var deferred = Q.defer();

    sinon.stub(Dashboard.prototype, 'getConfig').returns(deferred.promise);

    slides('example-slug', container).then(function () {
      done();
    });
    deferred.resolve({
      'title': '"Dashboard title"'
    });
  });

  it('should retrieve dashboard config', function () {
    container.innerHTML.should.contain('Performance data for "Dashboard title"');
  });

});

