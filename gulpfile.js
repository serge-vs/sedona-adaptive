const gulp = require('gulp');
const plumber = require('gulp-plumber');
// const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const del = require('del');

// Styles

const styles = () => gulp.src('source/sass/style.scss')
  .pipe(plumber())
  // .pipe(sourcemap.init())
  .pipe(sass({ outputStyle: 'expanded' }))
  .pipe(postcss([
    autoprefixer(),
  ]))
  // .pipe(gulp.dest('build/css'))
  // .pipe(browserSync.stream())
  .pipe(csso({ restructure: false }))
  .pipe(rename('styles.min.css'))
  // .pipe(sourcemap.write('.'))
  .pipe(gulp.dest('build/css'))
  .pipe(browserSync.stream());

exports.styles = styles;

// Delete files from build

const clean = () => del('build');

exports.clean = clean;

// Copy files from source to build

const copy = () => gulp.src([
  'source/fonts/**/*.{woff,woff2}',
  'source/img/**',
  'source/video/**',
  'source/*.ico',
  'source/*.webmanifest',
  // 'source/js/**',
], {
  base: 'source',
})
  .pipe(gulp.dest('build'));

exports.copy = copy;

// JS min and copy to build

const jsmin = () => gulp.src('source/js/*.js')
  .pipe(uglify())
  .pipe(rename((path) => {
    const thisPath = path;
    thisPath.basename += '.min';
  }))
  .pipe(gulp.dest('build/js'));

exports.jsmin = jsmin;

// HTML min and copy to build

const html = () => gulp.src('source/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true,
  }))
  .pipe(gulp.dest('build'));

exports.html = html;

// Images

const images = () => gulp.src('build/img/**/*.{jpg,png,svg}')
  .pipe(imagemin([
    imagemin.optipng({ optimizationLevel: 3 }),
    imagemin.mozjpeg({ progressive: true }),
    imagemin.svgo({
      plugins: [
        { removeViewBox: false },
        { removeUselessStrokeAndFill: false },
        { cleanupIDs: false },
      ],
    }),
  ]))
  .pipe(gulp.dest('build/img'));

exports.images = images;

// WebP

const createWebp = () => gulp.src(['build/img/**/*.{png,jpg}', '!build/img/favicons/**/*'])
  .pipe(webp({ quality: 90 }))
  .pipe(gulp.dest('build/img'));

exports.webp = createWebp;

// SVG Sprite

const sprite = () => gulp.src('source/img/**/icon-*.svg')
  .pipe(svgstore({
    inlineSvg: true,
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));

exports.sprite = sprite;

// Reload

const reload = (done) => {
  browserSync.reload();
  done();
};

exports.reload = reload;

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series('styles'));
  gulp.watch('source/js/*.js', gulp.series('jsmin', 'reload'));
  gulp.watch('source/*.html', gulp.series('html', 'reload'));
};

exports.watcher = watcher;

// Server

const server = (done) => {
  browserSync.init({
    server: {
      baseDir: 'build',
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();

  watcher();
};

exports.server = server;

// Build

const build = gulp.series(
  clean,
  copy,
  images,
  gulp.parallel(
    createWebp,
    styles,
    sprite,
    html,
    jsmin,
  ),
);

exports.build = build;

// Default (npm run gulp)

exports.default = gulp.series(
  gulp.parallel(
    styles,
    html,
    jsmin,
  ),
  gulp.series(
    server,
  ),
);

// exports.default = gulp.series(
//   styles, server, watcher,
// );
