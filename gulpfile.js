var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
gulp.task('handlebars', function() { //根据模板生成html
  var templateData = {},
    options = {
      ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false 
      partials: {
        header: './template/header.handlebars',
        footer: './template/footer.handlebars'
      },
      batch: ['./template'],
      helpers: {
        capitals: function(str) {
          return str.toUpperCase();
        }
      }
    }

  return gulp.src('./template/**/*.html')
    .pipe(handlebars(templateData, options))
    .pipe(gulp.dest('./html'));

});

gulp.task('watchHandlebars', function() { //监听模板变化
  gulp.watch('./template/**/*', ['handlebars']);
});


gulp.task('watch', ['watchHandlebars']);