var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var config = {
  sassPath: './assets/sass',
  browserifyPath: './assets/javascripts'
};

gulp.task('sass', function () {
  gulp.src(config.sassPath + '/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'));
  gulp.src(config.sassPath + '/fonts/*.woff')
    .pipe(gulp.dest('./css/fonts/'))
});

gulp.task('browserify', function() {
  return browserify(config.browserifyPath + '/app.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./js/'));
});

gulp.task('watch', function() {
  gulp.watch(config.sassPath + '/**/*.scss', ['sass']);
  gulp.watch(config.browserifyPath + '/**/*.js', ['browserify']);
});

gulp.task('default', ['sass', 'browserify']);
