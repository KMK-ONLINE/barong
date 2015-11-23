'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var cssmodule = require('css-modulesify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');

var opts = {
  entries: "./js/app.js",
  debug: true
};
var b;

function bundle() {
  b.transform("babelify", {presets: ["es2015", "react"]})
  b.plugin(require('css-modulesify'), {
    rootDir: __dirname,
    output: '.barong_assets/app.css'
  });  
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest("./.barong_assets"));
}

gulp.task('js', function(){
  b = browserify(opts);
  b.on('log', gutil.log);
  return bundle();
});

gulp.task('js:watch', function(){
  b = watchify(browserify(opts));
  b.on('log', gutil.log);
  b.on('update', bundle);
  return bundle();
});
