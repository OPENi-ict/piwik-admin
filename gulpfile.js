var gulp = require('gulp');
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");

gulp.task('default', function() {
   gulp.src("./lib/*.js")
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
});