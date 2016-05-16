//使用方法:命令行,执行 gulp，就可以完成sass文件监听并编译
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');

gulp.task('sass', function () {
    console.log("sass work");
    return sass('styles/sass/*.scss')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(gulp.dest('styles/css'));
});

gulp.task('watch', function(event) {
    gulp.watch('styles/sass/*.scss', ['sass']); 
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});