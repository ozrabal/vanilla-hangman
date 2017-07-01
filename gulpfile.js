var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    preprocess = require('gulp-preprocess'),
    order = require("gulp-order"),
    concat = require('gulp-concat');

gulp.task('start', function () {
    nodemon({
        script: 'server.js',
        ext: 'html, js, scss',
        env: {
            'NODE_ENV': 'development'
        },
        tasks: ['styles']
    })
});

gulp.task('styles', function(){
   var stream = gulp.src( 'assets/css/src/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compact'}))
        .pipe(preprocess({
            context: global.contextVarsDevelopment
        }))
        .pipe(autoprefixer({browsers: ['> 1%']}))
        .pipe(sourcemaps.write('.'))
        .pipe(rename({basename: 'style'}))
        .pipe(gulp.dest( 'assets/css'))
        .on('error', gutil.log);
    return stream
})