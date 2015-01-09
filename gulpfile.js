var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var karma = require('gulp-karma');
var brfs = require('brfs');

var config = {
  sassPath: './src/sass',
  jsPath: './src/js',
  testPath: './test/js'
};

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
    .pipe(gulp.dest('./css'));
  gulp.src(config.sassPath + '/fonts/*.woff')
    .pipe(gulp.dest('./css/fonts/'));
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
    .pipe(gulp.dest('./js/'));
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
gulp.task('test', ['lint', 'karma']);
gulp.task('production', ['sass', 'browserify']);
gulp.task('default', ['sass', 'browserify', 'lint']);
gulp.task('server', ['production', 'connect', 'watch']);
