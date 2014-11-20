module.exports = function (fsEl) {
  return function () {
    if (!document.mozFullScreen && !document.webkitFullScreen) {
      if (fsEl.mozRequestFullScreen) {
        fsEl.mozRequestFullScreen();
      } else {
        fsEl.webkitRequestFullScreen();
      }
    } else {
      if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else {
        document.webkitExitFullscreen();
      }
    }
  };
};
