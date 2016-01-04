var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');

// sass语法防错函数
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// sass处理任务
gulp.task('sass', function(){
  gulp.src('styles/main.scss')
      .pipe(sass()).on('error', handleError) // 编译sass,并添加防错函数,防止sass语法出错后退出
      .pipe(prefix()) // 添加厂商前缀
      .pipe(gulp.dest('../styles')); // 输出到目标位置
});

// 文件拷贝任务
gulp.task('cp', function(){
  gulp.src('index.html')
      .pipe(gulp.dest('..')); // 复制到目标位置
});

// 文件变化监控
gulp.task('watch', function(){
  gulp.watch(['*.html'], ['cp']); // 监控所有html文件有变化就执行cp任务
  gulp.watch(['styles/*.scss'], ['sass']); // 监控所有sass文件有变化就执行sass任务
});

// 默认任务
gulp.task('default', ['sass', 'cp', 'watch']);
