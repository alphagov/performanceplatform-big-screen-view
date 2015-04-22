var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var brfs = require('brfs');

var config = require('./config.json');

gulp.task('jscs', function () {
  return gulp.src(config.jsPath + '/*.js')
    .pipe(jscs());
});

gulp.task('jshint', function () {
  return gulp.src(config.jsPath + '/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('sass', function () {
  gulp.src(config.sassPath + '/*.scss')
    .pipe(sass())
    .pipe(gulp.dest(config.destinationPath + '/css'));
  gulp.src(config.sassPath + '/fonts/*.woff')
    .pipe(gulp.dest(config.destinationPath + '/css/fonts/'));
});

gulp.task('browserify', function () {
  var b = browserify();
  b.transform(brfs);
  b.add(config.jsPath + '/app.js');
  return b.bundle()
    .on('error', function (err) {
      console.log(err.message);
      this.end();
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest(config.destinationPath + '/js/'));
});

gulp.task('copy_index', function () {
  gulp.src('./index.html')
    .pipe(gulp.dest(config.destinationPath + '/'));
});

gulp.task('connect', function () {
  connect.server({
    'fallback': 'index.html',
    port: 8080
  });
});

gulp.task('watch', function () {
  gulp.watch(config.sassPath + '/**/*.scss', ['sass']);
  gulp.watch(config.jsPath + '/**/*.js', ['browserify']);
  gulp.watch(config.jsPath + '/**/*.mus', ['browserify']);
});

gulp.task('lint', ['jscs', 'jshint']);
gulp.task('test', ['lint']);
gulp.task('production', ['sass', 'browserify', 'copy_index']);
gulp.task('default', ['sass', 'browserify', 'lint']);
gulp.task('server', ['production', 'connect', 'watch']);
