var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var mocha = require('gulp-mocha');

var config = {
  sassPath: './src/sass',
  browserifyPath: './src/js',
  testPath: './test/js'
};

gulp.task('sass', function () {
  gulp.src(config.sassPath + '/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'));
  gulp.src(config.sassPath + '/fonts/*.woff')
    .pipe(gulp.dest('./css/fonts/'));
});

gulp.task('browserify', function() {
  return browserify(config.browserifyPath + '/app.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./js/'));
});

gulp.task('test', function () {
  return gulp.src(config.testPath + '/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('watch', function() {
  gulp.watch(config.sassPath + '/**/*.scss', ['sass']);
  gulp.watch(config.browserifyPath + '/**/*.js', ['browserify']);
});

gulp.task('default', ['sass', 'browserify']);
