import gulp, { dest } from "gulp";
import gpug from "gulp-pug";
import { deleteAsync } from "del";
import ws from "gulp-webserver";
import src from "gulp-webserver";
import image from "gulp-image";
import dartSass from "sass";
import gulpsass from "gulp-sass";
import gulpSass from "gulp-sass";

const sass = gulpSass(dartSass);

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
  img: {
    src: "src/img/*",
    dest: "build/img",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css",
  },
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

function clean() {
  return deleteAsync(["build/"]);
}

const webserver = () =>
  gulp.src("build").pipe(ws({ livereload: true, open: true }));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.src, styles);
};

const img = () =>
  gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(routes.scss.dest));

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles]);

const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
