var autoprefixer = require('autoprefixer');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var imagemin = require('gulp-imagemin');
var notify = require('gulp-notify');
var minify = require('gulp-minify');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var pngquant = require('imagemin-pngquant');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var transform = require('vinyl-transform');
var util = require('gulp-util');
var watch = require('gulp-watch');
var wpPot = require('gulp-wp-pot');


function swallowError(error){
  this.emit('end');
}

var config = {
  production: true
};

// dir paths
var paths = {
  srcPath: '.',
  distPath: '../dist',
  npmPath : './node_modules',
  vendorPath: './js/vendor',
  htmlSrc: './handlebars',
};
paths.scssGlob = paths.srcPath + '/scss/**/*.scss';
paths.jsGlob = paths.srcPath + '/js/**/*.js';
paths.imgGlob = paths.srcPath + '/img/**/*';
paths.fontsGlob = paths.bowerPath + '/font-awesome/fonts/**.*';
paths.htmlGlob  = paths.htmlSrc + '/**/*.handlebars';

/**
 * Build the JS
 */
gulp.task('js',['clean:js'], function(){

  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src([
    paths.srcPath + '/js/_manifest.js',
  ] )
  .pipe(plumber({ errorHandler: handleErrors }))
  .pipe(browserified)
  .pipe(minify())
  .pipe(rename({
    basename: 'site', 
    suffix: '.min'
  }))
  .pipe(gulp.dest( paths.distPath + '/assets/js' ))
  .pipe(notify({message: 'JS complete'}));

});

/**
 * Clean the JS
 */
gulp.task('clean:js', function() {
  return del(
    [ paths.distPath + '/assets/js' ],
    {read:false, force: true});
});



/**
 * Move the fonts
 */
gulp.task('fonts',['clean:fonts'], function(){
  return gulp.src(paths.npmPath + '/font-awesome/fonts/**.*')
    .pipe(gulp.dest(paths.distPath + '/assets/fonts'));
});

gulp.task('clean:fonts', function() {
   return del(
     [ paths.distPath + '/assets/fonts' ],
     {read:false, force: true});
 });


/**
 * Optimize and move images
 */
gulp.task('img', ['clean:img'], function(){

  return gulp.src( paths.imgGlob)
    .pipe(imagemin({
      progressive: true,
    }))
    .pipe( gulp.dest( paths.distPath + '/assets/img' ) );
});

gulp.task('clean:img', function(){
  return del(
    [ paths.distPath + '/assets/img' ],
    {read:false, force: true});
});


/**
 * Handle errors.
 * plays a noise and display notification
 */
function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Task Failed [<%= error.message %>',
    message: 'See console.',
    sound: 'Sosumi'
  }).apply(this, args);
  util.beep();
  this.emit('end');
}




/**
 * Minify and optimize style.css.
 */
gulp.task('css', ['scss'], function() {

  return gulp.src( paths.distPath + '/assets/css/*.css')
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(cssnano({ safe: true }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest( paths.distPath + '/assets/css'))
    .pipe(notify({message: 'CSS complete'}));
});


/**
 * Compile Sass and run stylesheet through PostCSS.
 */
gulp.task('scss', ['clean:css'], function() {

  return gulp.src(paths.srcPath + '/scss/manifest.scss')
    .pipe(plumber({ errorHandler: handleErrors }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [ 
        paths.scssGlob,
        paths.npmPath + '/font-awesome/scss',
        paths.npmPath + '/normalize.css',
        paths.npmPath + '/bootstrap'
      ],
      errLogToConsole: true,
      outputStyle: 'expanded'
    }))
    .pipe(postcss([
      autoprefixer({ browsers: ['last 2 version'] })
    ]))
    .pipe(sourcemaps.write())
    .pipe(rename({basename: 'site'}))
    .pipe(gulp.dest( paths.distPath + '/assets/css' ));
});


/**
 * Clean css dist folder
 */

gulp.task('clean:css', function() {
  return del(
    [ paths.distPath + '/assets/css' ],
    {read:false, force: true});
});


/**
 * Build the html
 */
gulp.task('html',['clean:html'], function(){

  var context = require('./handlebars.json');
  var options = {
      ignorePartials: true, 
      batch : [paths.htmlSrc + '/partials']
  };

  return gulp.src(paths.htmlGlob)
      .pipe(handlebars(context, options))
      .pipe(rename({
        extname: '.html'
      }))
      .pipe(gulp.dest(paths.distPath));


});

/**
 * Clean css dist folder
 */

gulp.task('clean:html', function() {
  return del(
    [ paths.distPath + '/*.html' ],
    {read:false, force: true});
});

/**
 * Serve page and synch with browser
 */
gulp.task('serve', ['watch'], function(){
  browserSync.init({
    browser: ["google chrome"],
    notify: false,
    files: ['../dist/index.html', '../dist/assets/**/*'],
    port: 4000,
    server: {
      baseDir: '../dist'
    },
    open: false

  });
});


/**
 * Builds the JS and SASS
 * @return {[type]} [description]
 */
gulp.task('build', function(){
  gulp.start('fonts');
  gulp.start('img');
  gulp.start('css');
  gulp.start('js');
  gulp.start('html');
});

/**
 * Default Task, runs build and then watch
 * @return {[type]} [description]
 */
gulp.task('default', function(){ 
  gulp.start('serve'); 
});


/**
 * Process tasks and reload browsers.
 */
gulp.task('watch', ['build'], function() {
  gulp.watch(paths.imgGlob, ['img']);
  gulp.watch(paths.fontsGlob, ['fonts']);
  gulp.watch(paths.jsGlob, ['js']);
  gulp.watch(paths.scssGlob, ['css']);
  gulp.watch(paths.htmlGlob, ['html']);

  return true;
});