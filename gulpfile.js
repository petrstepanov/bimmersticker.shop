var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer');
    // replace = require('gulp-replace');
//    imageResize = require('gulp-image-resize');

var paths = {
  styles: {
    src: './sass/bimmersticker.scss',
    srcWatch: './sass/**/*.scss',
    dest: './css'
  },
  scripts: {
    src: ['./node_modules/jquery/dist/jquery.js',
          './node_modules/bootstrap/dist/js/bootstrap.bundle.js',
          './node_modules/shufflejs/dist/shuffle.js',
          './js/modules/background-gallery.js',
          './js/main.js'],
    srcWatch: './js/**/*.js',
    dest: './js'
  }
};

// Scripts Task

gulp.task('scripts', function() {
  return gulp
    .src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(concat('bimmersticker.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scripts.dest));
});

gulp.task('scripts-prod', function() {
  return gulp
    .src(paths.scripts.src)
    .pipe(concat('bimmersticker.js'))
    .pipe(uglify()).on('error', function(err) {
      console.log(err.toString());
    })
    .pipe(gulp.dest(paths.scripts.dest));
});

// Styles Task

gulp.task('styles', function () {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.styles.dest));
});

gulp.task('styles-prod', function () {
  return gulp.src(paths.styles.src)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.styles.dest));
});

gulp.task('watch', function() {
    gulp.watch('./js/*.js', ['scripts']);
    gulp.watch('./sass/**/*.scss', ['styles']);
});

gulp.task('production', ['scripts-prod', 'styles-prod']);
gulp.task('development', ['scripts', 'styles']);
gulp.task('default', ['development', 'watch']);
