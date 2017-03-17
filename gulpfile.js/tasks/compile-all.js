const gulp = require("gulp");

gulp.task("compile-all", ["webpack-frontend-once", "copy-libs"]);