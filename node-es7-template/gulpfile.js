const gulp = require('gulp');
//编译器
const babel = require('gulp-babel');
//sourcemaps  将转换前后代码的位置进行自动对应
//需要在程序起点加上require('source-map-support').install();
// const sourcemaps = require('gulp-sourcemaps');
const SRC = 'src/**/*.js',
	  DEST = 'build',
	  WATCH_LIST = ['src/**/*.js', 'index.js'];

gulp.task('babelify', function () {
	return gulp.src('src/**/*.js')
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
				.pipe(gulp.dest('build/'))
});
gulp.task('watch', function () {
	return gulp.watch(['src/**/*.js'], ['babelify']);
});
gulp.task('default', ['babelify', 'watch']);