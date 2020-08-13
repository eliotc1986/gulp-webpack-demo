const gulp                  = require('gulp');
const del                   = require('delete');
const webpackStream         = require('webpack-stream');
const webpack2              = require('webpack');
const yargs                 = require('yargs');
const named                 = require('vinyl-named');
const browser               = require('browser-sync');

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);
const PORT = 9999;

gulp.task('build',
 gulp.series(clean, gulp.parallel(css, javascript)));

gulp.task('default',
  gulp.series('build', server, watch));

function clean(cb) {
  del(['dist'], cb);
}

let webpackConfig = {
  mode: (PRODUCTION ? 'production' : 'development'),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ "@babel/preset-env" ],
            compact: false
          }
        }
      }
    ]
  },
  devtool: !PRODUCTION && 'source-map'
}

function javascript(cb) {
  gulp.src('src/app.js')
    .pipe(named())
    .pipe(webpackStream(webpackConfig, webpack2))
    .pipe(gulp.dest('dist'));
  cb();
}

function css(cb) {
  console.log("No css tasks yet...");
  cb();
}

function server(done) {
  browser.init({
    server: './', port: PORT
  }, done);
}

function watch() {
  gulp.watch('./**/*.html').on('all', browser.reload);
  gulp.watch('src/**/*.js').on('all', gulp.series(javascript, browser.reload));
}
