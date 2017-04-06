var gulp    = require('gulp');
    connect = require('gulp-connect'),
    open    = require('open'),
    babel   = require('gulp-babel');
//sourcemaps  将转换前后代码的位置进行自动对应
//需要在程序起点加上require('source-map-support').install();
// const sourcemaps = require('gulp-sourcemaps');

gulp.task('html', function () {
  gulp.src('./example/**/*.html')
    .pipe(connect.reload());
});
gulp.task('js', function () {
    gulp.src('./example/**/*.js')
        .pipe(connect.reload());
});
gulp.task('babelify', function () {
	return gulp.src('./lib/**/*.js')
				//初始化source map
				// .pipe(sourcemaps.init())
				.pipe(babel({
					presets: ['es2015', 'es2016', 'es2017'],
					plugins: [
						["transform-runtime", {
							"polyfill": false,
							"regenerator": true
						}]
					]
				}))
				.on('error', function (err) {
					console.log(err.stack);
					this.emit('end');
				})
				// .pipe(sourcemaps.write({
				// 	includeContent: false,
				// 	sourceRoot: 'src'
				// }))
				.pipe(gulp.dest('./example/scripts/'))
});

gulp.task('watch', function (event) {
    gulp.watch(['./example/**/*.html'], ['html']);
    gulp.watch(['./lib/**/*.js'], ['babelify']);
    gulp.watch('./example/**/*.js', ['js']);
});

gulp.task('connect', function() {
    var port = 8008
    connect.server({
        name: 'mobile-lock',
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