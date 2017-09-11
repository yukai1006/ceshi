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
// var reload = browserSync.reload;
var rev = require('gulp-rev');
var rev_replace = require('gulp-rev-replace');


//删除dist下的所有文件
// gulp.task('delete',function(cb){
//     return del(['dist/*','!dist/images'],cb);
// })

gulp.task('connect', function() {
  connect.server({
    root: 'src',
    livereload: true
  });
});

// html文件压缩
gulp.task('html',function(){
  gulp.src('./src/*.html')
  .pipe(html())
  .pipe(gulp.dest('./dist'))
  .pipe(browserSync.reload({stream:true}));
})

// css文件压缩
gulp.task('css',function(){
  gulp.src('./src/css/*.css')
  .pipe(autoprefixer({
      browsers: ['last 2 versions', 'Android >= 4.0'],
      cascade: true, //是否美化属性值 默认：true 像这样：
      remove:true //是否去掉不必要的前缀 默认：true
  }))
  .pipe(css())
  .pipe(rev())
  .pipe(gulp.dest('./dist/css'))
  .pipe(rev.manifest())
  .pipe(gulp.dest('rev/css'))
  .pipe(browserSync.reload({stream:true}));
});


// 压缩,合并js代码
gulp.task('js',function(){
  gulp.src('./src/js/*.js')//路径
  // .pipe(concat('all.js'))//合并 js
  .pipe(connect.reload())
  .pipe(uglify())//压缩 js 插件
  .pipe(rev()) //添加 md5
  .pipe(gulp.dest('./dist/js'))//输出文件夹
  .pipe(rev.manifest())                       //给添加哈希值的文件添加到清单中
  .pipe(gulp.dest('rev/js'))
  .pipe(browserSync.reload({stream:true}));
});





// 压缩png、jpg、gif、svg
gulp.task('img',function(){
  gulp.src('./src/images/*')
  .pipe(connect.reload())
  .pipe(img({
    progressive: true,
    use: [pngquant()]
  }))
  .pipe(rev())
  .pipe(gulp.dest('./dist/images'))
  .pipe(browserSync.reload({stream:true}));
})

gulp.task('rev', function () {
    return gulp.src(['rev/**/*.json', 'src/**/*.html'])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                '/css/': './dist/css/',
                '/js/': './dist/js/',
                'cdn/': function(manifest_value) {
                    return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
                }
            }
        }) )
        .pipe( html({
                empty:true,
                spare:true
            }) )
        .pipe( gulp.dest('dist') );
});



gulp.task('serve', ['delete'], function() {
    gulp.start('js','css','html','img');
    browserSync.init({
        port: 2017
    });
    gulp.watch('src/js/*.js', ['js']);         //监控文件变化，自动更新
    gulp.watch('src/css/*.css', ['css']);
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/images/*.*', ['img']);
});

// gulp.task('build', ['serve']);

// gulp.task('default',['rev']);
