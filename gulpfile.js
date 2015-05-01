var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var brfs = require('brfs');
var developServer = require( 'gulp-develop-server' );
var runSequence = require('run-sequence');
var spawn = require('child_process').spawn;
var nightwatch;

gulp.task('nightwatch', function (cb) {
  nightwatch = spawn('node_modules/nightwatch/bin/nightwatch', ['--env=phantomjs']);

  nightwatch.stdout.on('data', function (data) {
    process.stdout.write(data);
  });

  nightwatch.stderr.on('data', function (data) {
    process.stdout.write(data);
  });

  nightwatch.on('close', function (code) {
    if (code !== 0) {
      console.log('ps process exited with code ' + code);
    }
    cb();
  });
});

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

gulp.task('stop:test:server', function (cb) {
  connect.serverClose();
  cb();
});

gulp.task('start:mock', function (cb) {
  developServer.listen( { path: './test/tools/mockStagecraftBackdrop.js' } );
  cb();
});

gulp.task('stop:mock', function (cb) {
  developServer.kill();
  cb();
});

gulp.task('watch', function () {
  gulp.watch(config.sassPath + '/**/*.scss', ['sass']);
  gulp.watch(config.jsPath + '/**/*.js', ['browserify']);
  gulp.watch(config.jsPath + '/**/*.mus', ['browserify']);
});

gulp.task('mock-configs', function (cb) {
  var config = require('./config.json');
  var mockEndpoint = 'http://localhost:1337/';

  config.stagecraft.url = mockEndpoint;
  config.backdrop.url = mockEndpoint;

  require('fs').writeFileSync('./config.json', JSON.stringify(config));

  cb();
});

gulp.task('default', ['sass', 'browserify', 'lint']);

gulp.task('test:functional', function (cb) {
  runSequence('start:mock', 'test:server', 'nightwatch', 'stop:mock', 'stop:test:server', cb);
});

gulp.task('test:functional:ci', function () {
  runSequence('mock-configs', 'test:functional');
});

gulp.task('server-and-mock', function (cb) {
  runSequence('start:mock', 'test:server', cb);
});

gulp.task('production', ['sass', 'browserify', 'copy_index']);
gulp.task('server', ['production', 'connect', 'watch']);
gulp.task('test:server', ['production', 'connect']);
gulp.task('lint', ['jscs', 'jshint']);
