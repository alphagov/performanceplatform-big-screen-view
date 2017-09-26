module.exports = function (container) {
  var timer,
    setTimer;

  setTimer = function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      container.className += ' is-inactive';
    }, 5000);
  };

  setTimer();
  container.addEventListener && container.addEventListener('mousemove', function () {
    container.className = container.className.replace(' is-inactive', '');
    setTimer();
  });

};
