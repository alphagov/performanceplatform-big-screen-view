var gulp = require('gulp');
var connect = require('gulp-connect')
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var mocha = require('gulp-mocha');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');

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
  return browserify(config.jsPath + '/app.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./js/'));
});

gulp.task('test', function () {
  return gulp.src(config.testPath + '/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('connect', function() {
  connect.server({
    'fallback': 'index.html',
    port: 8080
  });
});

gulp.task('watch', function () {
  gulp.watch(config.sassPath + '/**/*.scss', ['sass']);
  gulp.watch(config.jsPath + '/**/*.js', ['browserify']);
});

gulp.task('lint', ['jscs', 'jshint']);
gulp.task('production', ['sass', 'browserify']);
gulp.task('default', ['sass', 'browserify', 'lint']);
