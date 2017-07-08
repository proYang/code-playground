var gulp = require('gulp');
    connect = require('gulp-connect'),
    open = require('open')


gulp.task('html', function () {
  gulp.src('./example/**/*.html')
    .pipe(connect.reload());
});
gulp.task('js', function () {
    gulp.src('./example/**/*.js')
        .pipe(connect.reload());
});
gulp.task('css', function () {
    gulp.src('./example/**/*.css')
        .pipe(connect.reload());
});

gulp.task('watch', function (event) {
    gulp.watch(['./example/**/*.html'], ['html']);
    gulp.watch('./example/**/*.js', ['js']);
    gulp.watch('./example/**/*.css', ['css']);
});

gulp.task('connect', function() {
    var port = 8008
    connect.server({
        name: 'testWork',
        root: './example/',
        port: port,
        livereload: true,
        middleware: function(connect, opt) {
            return [ ]
        }
    });
    open("http://localhost:" + port)
});

gulp.task('default', ['connect', 'watch'], function () {
    console.log("gulp default");
});