import gulp from 'gulp';
import plumber from 'gulp-plumber';
// import sourcemap from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'gulp-csso';
import fileinclude from 'gulp-file-include';
import htmlmin from 'gulp-htmlmin';
import babel from 'gulp-babel';
import terser from 'gulp-terser'; // jsmin compressed es6+
import rename from 'gulp-rename';
import imagemin, {
  gifsicle, mozjpeg, optipng, svgo,
} from 'gulp-imagemin';
import webp from 'gulp-webp';
import svgstore from 'gulp-svgstore';
import del from 'del';
import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';

const sass = gulpSass(dartSass);

// Styles

const styles = () => gulp.src('source/sass/style.scss')
  .pipe(plumber())
  // .pipe(sourcemap.init())
  .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
  .pipe(postcss([
    autoprefixer(),
  ]))
  // .pipe(gulp.dest('build/css'))
  .pipe(browserSync.stream())
  .pipe(csso({ restructure: false }))
  .pipe(rename('styles.min.css'))
  // .pipe(sourcemap.write('.'))
  .pipe(gulp.dest('build/css'))
  .pipe(browserSync.stream());

export { styles };

// Delete files from build

const clean = () => del('build');

export { clean };

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

export { copy };

// JS min and copy to build

const jsmin = () => gulp.src('source/js/*.js')
  .pipe(babel({
    presets: ['@babel/preset-env'],
  }))
  .pipe(terser())
  .pipe(rename((path) => {
    const thisPath = path;
    thisPath.basename += '.min';
  }))
  .pipe(gulp.dest('build/js'));

export { jsmin };

// HTML min and copy to build

const html = () => gulp.src('source/*.html')
  .pipe(fileinclude({
    prefix: '@@',
    basepath: '@file',
  }))
  .pipe(htmlmin({
    collapseWhitespace: true,
    ignoreCustomFragments: [/<br(\s+\w+="\w+(-?\w+)+")?(\s?\/)?>\s/gi],
  }))
  .pipe(gulp.dest('build'));

export { html };

// Images

const images = () => gulp.src('build/img/**/*.{jpg,png,svg}')
  .pipe(imagemin([
    gifsicle({ interlaced: true }),
    optipng({ optimizationLevel: 3 }),
    mozjpeg({ quality: 75, progressive: true }),
    svgo({
      plugins: [
        {
          name: 'removeViewBox',
          // Disable a plugin by setting active to false.
          active: false,
        },
        {
          name: 'removeUselessStrokeAndFill',
          active: false,
        },
        {
          name: 'cleanupIDs',
          active: false,
        },
      ],
    }),
  ]))
  .pipe(gulp.dest('build/img'));

export { images };

// WebP

const createWebp = () => gulp.src(['build/img/**/*.{png,jpg}', '!build/img/favicons/**/*'])
  .pipe(webp({ quality: 90 }))
  .pipe(gulp.dest('build/img'));

export { createWebp };

// SVG Sprite

const sprite = () => gulp.src('source/img/**/icon-*.svg')
  .pipe(svgstore({
    inlineSvg: true,
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));

export { sprite };

// Reload

const reload = (done) => {
  browserSync.reload();
  done();
};

export { reload };

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series('styles'));
  gulp.watch('source/js/*.js', gulp.series('jsmin', 'reload'));
  gulp.watch(['source/*.html', 'source/components/**/*.html'], gulp.series('html', 'reload'));
};

export { watcher };

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

export { server };

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

export { build };

// Default (npm run gulp)

export default gulp.series(
  gulp.parallel(
    styles,
    html,
    jsmin,
  ),
  gulp.series(
    server,
  ),
);
