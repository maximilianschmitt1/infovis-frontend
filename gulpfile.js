'use strict';

const gulp = require('gulp');
const browserify = require('browserify');
const watchify = require('watchify');
const jade = require('gulp-jade');
const stylus = require('gulp-stylus');
const rename = require('gulp-rename');
const stylusVars = require('stylus-vars');
const vars = require('./src/vars');
const fs = require('fs');

gulp.task('templates', function() {
  return gulp
    .src(['src/**/*.jade', '!**/_*.jade'])
    .pipe(jade())
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp
    .src('src/images/**/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
  return gulp
    .src('src/main.styl')
    .pipe(stylus({ 'include css': true, use: [stylusVars(vars, { delimiter: '-' })] }))
    .pipe(rename('app.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watchify', function() {
  const w = watchify(b(watchify.args));
  w.on('update', () => bundle(w));
  bundle(w);
});

gulp.task('default', ['templates', 'styles', 'watchify', 'images'], function() {
  gulp.watch('src/**/*.jade', ['templates']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch('src/**/*.styl', ['styles']);
});

function b(args) {
  args = args || {};
  args.debug = true;

  return browserify('./src/main', args)
    .transform('babelify')
    .transform('envify');
}

function bundle(b) {
  b.bundle().pipe(fs.createWriteStream('dist/app.js'));
}
