var gulp = require('gulp');
var concat = require("gulp-concat");
var sass = require('gulp-sass');
var watch = require('gulp-watch');

/*
	JavaScript
*/ 
gulp.task('concatJs', function () {
    gulp.src('app/**/*.js')
    .pipe(concat('compiled-app.js'))
    .pipe(gulp.dest('assets/js/'));
});

gulp.task('watchJs', function(){
	gulp.watch('app/**/*.js', ['concatJs']);
});



/*
	Sass
*/ 
gulp.task('styles', function() {
	gulp.src('assets/css/sass/styles.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('assets/css/'))
});

gulp.task('watchScss', function(){
	gulp.watch('assets/css/sass/**/*.scss', ['styles']);
});


gulp.task('default', ['concatJs', 'watchJs', 'styles', 'watchScss'], function(){});