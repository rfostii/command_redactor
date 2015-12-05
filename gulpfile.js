var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');


gulp.task('build', function() {
  return gulp.src([
        './client/libs/*.js',  
        './client/core.js',        
        './client/utils/*.js',
        './client/services/**/*.js',
        './client/components/**/*.js',
        './client/app.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build-styles', function() {
  return gulp.src('./client/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('dev', ['build', 'build-styles'], function() {
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./client/**/*.js', ['build']).on("change", browserSync.reload);
    gulp.watch('./client/**/*.css', ['build-styles']).on("change", browserSync.reload);
});
