module.exports = function (container) {
  var timer,
    setTimer;

  setTimer = function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      container.classList.add('is-inactive');
    }, 5000);
  };

  setTimer();
  container.addEventListener && container.addEventListener('mousemove', function () {
    container.classList.remove('is-inactive');
    setTimer();
  });

};
