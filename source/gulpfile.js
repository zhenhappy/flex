var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var wrap = require('gulp-wrap');
var browserSync = require('browser-sync');

// browser-sync处理任务
gulp.task('browser-sync', ['sass', 'build', 'cp'], function(){ // 在执行browser-sync任务之前先执行sass,build,cp这三个任务
  browserSync({
    server: {
      baseDir: '..'
    }
  });
});

// gulp-wrap处理任务
gulp.task('build', function(){
  gulp.src('pages/*.html')
      .pipe(wrap({src:'layout/default.html'}))
      .pipe(gulp.dest('..'));
});

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
      .pipe(gulp.dest('../styles')) // 输出到目标位置
      .pipe(browserSync.reload({stream: true})); // 将数据流导向browser-sync,让browser-sync监控sass文件的变化
});

// 文件拷贝任务
gulp.task('cp', function(){
  return gulp.src('js/main.js', { base: '.'})
             .pipe(gulp.dest('..')); // 复制到目标位置
});

// rebuild处理任务
gulp.task('rebuild', ['build'], function(){
  browserSync.reload(); // rebuild任务原理就是先执行build,然后在执行reload方法
});

// 文件变化监控
gulp.task('watch', function(){
  // gulp.watch(['*.html'], ['cp']); // 监控所有html文件有变化就执行cp任务
  // gulp.watch(['**/*.html'], ['build']); // 使用gulp-wrap后就不需要上面的文件拷贝了
  gulp.watch(['**/*.html'], ['rebuild']); // 使用browser-sync后就不用build命令了,改用rebuild就可以了
  gulp.watch(['styles/*.scss'], ['sass']); // 监控所有sass文件有变化就执行sass任务
  gulp.watch(['js/main.js'], ['cp']); // 监控js文件变化,并拷贝
});

// 默认任务
// gulp.task('default', ['sass', 'build', 'watch']);
gulp.task('default', ['browser-sync', 'watch']); // 将sass和build两个任务替换成browser-sync
