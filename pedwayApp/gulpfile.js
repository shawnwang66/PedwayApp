const gulp = require('gulp');
const fs = require('file-system');
const eslint = require('gulp-eslint');

gulp.task('default', function(done) {
  done();
});

gulp.task('lint', () => {
  return gulp
      .src(['**/*.js'])
      // eslint() attaches the lint output to the "eslint" property
      // of the file object so it can be used by other modules.
      .pipe(eslint())
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format())
      .pipe(eslint.format('junit', fs.createWriteStream('style-junit.xml')))
      // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failAfterError last.
      .pipe(eslint.failAfterError());
});
