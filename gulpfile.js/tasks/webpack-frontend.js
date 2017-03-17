"use strict";

var gulp = require("gulp");
var notify = require("gulp-notify");
var webpack = require("gulp-webpack");

function webpackFrontend(watch)
{
    var webpackOptions =
    {
        bail: false,
        watch: watch,
        module:
        {
            loaders:
            [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                    query:
                    {
                        presets: ["react", "es2015"]
                    }
                },
                {
                    test: /\.jsx$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                    query:
                    {
                        presets: ["react", "es2015"]
                    }
                }
            ]
        },
        output:
        {
            filename: "application.js"
        }
    };

    return gulp.src("src/main.jsx")
        .pipe(webpack(webpackOptions))
        .pipe(gulp.dest("public/js"));
}

gulp.task("webpack-frontend", function ()
{
    return webpackFrontend(true)
        .pipe(notify(
        {
            title: "Frontend compilation",
            message: "Done.",
            icon: null
        }));
});

gulp.task("webpack-frontend-once", function ()
{
    return webpackFrontend(false);
});