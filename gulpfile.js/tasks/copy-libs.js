var gulp = require("gulp");

gulp.task("copy-libs", function ()
{
    gulp.src(["bootstrap/css/*"])
        .pipe(gulp.dest("public/libs/bootstrap/css"));

    gulp.src(["bootstrap/js/*"])
        .pipe(gulp.dest("public/libs/bootstrap/js"));

    gulp.src(["node_modules/bootstrap/dist/fonts/*"])
        .pipe(gulp.dest("public/libs/bootstrap/fonts"));

    gulp.src(["node_modules/c3/c3.css", "node_modules/c3/c3.js"])
        .pipe(gulp.dest("public/libs/c3"));

    gulp.src("node_modules/d3/d3.js")
        .pipe(gulp.dest("public/libs/d3"));

    gulp.src("node_modules/react/dist/react.js")
        .pipe(gulp.dest("public/libs/react"));
});