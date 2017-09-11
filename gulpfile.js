// 引入 gulp
var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat'); // 文件合并
var uglify = require('gulp-uglify'); // 压缩js代码
var rename = require('gulp-rename'); // 修改名字
var css = require('gulp-minify-css'); // css文件压缩
var html = require('gulp-minify-html'); // html文件压缩
var img = require('gulp-imagemin'); // 压缩png、jpg、gif、svg
// var smushit = require('gulp-smushit'); // 图片压缩，只能压缩png和jpg
var pngquant = require('imagemin-pngquant'); // 压缩png、jpg、gif、svg
var autoprefixer = require('gulp-autoprefixer'); // 自动添加css样式兼容 浏览器前缀
var browserSync = require("browser-sync").create();
var del = require('del');
// var clean = require('gulp-clean');
var revCollector = require('gulp-rev-collector');
var reload = browserSync.reload;
// var rev = require('gulp-rev');
var rev = require('gulp-md5-assets');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');


gulp.task('html',function(){
  gulp.src('./src/*.html')
  .pipe(changed('./src'))
  .pipe(gulp.dest('./src'));
});
gulp.task('css',function(){
  gulp.src('./src/css/*.css')
  .pipe(changed('./src/css'))
  .pipe(gulp.dest('./src/css'))
});
gulp.task('minify-html', ['html'], function() {
  gulp.src('./src/*.html')
  .pipe(gulp.dest('./build'))
})
gulp.task('minify-css', ['css'], function() {
  gulp.src('./src/css/*.css')
  .pipe(gulp.dest('./build/css'))
  .pipe(css())
  .pipe(rev(10,'./build/*.html'));
})

gulp.task('build', function()  {
  runSequence('minify-html', ['minify-css'])
})

gulp.task('run', function() {
  browserSync.init({
    server: {
      baseDir: './src',
      index: 'index.html'
    },
    open: 'external',
    injectChanges: true
  });
  gulp.watch('./src/css/**/*.css', ['css']).on('change', reload);
  gulp.watch('./src/**/*.html', ['html']).on('change', reload);
});
