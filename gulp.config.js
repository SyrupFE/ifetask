import gulp from 'gulp'
import del from 'del'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import flexibility from 'postcss-flexibility'
import atImport from 'postcss-import'
import cssNested from 'postcss-nested'
import cssVar from 'postcss-css-variables'
import livereload from 'gulp-livereload'
import concat from 'gulp-concat'
import sequence from 'gulp-sequence'
import imagemin from 'gulp-imagemin'
import cssMinify from 'gulp-minify-css'
import uglify from 'gulp-uglify'

const paths = {
  css: ['src/styles/*.css'],
  images: ['src/images/**'],
  bowerJs: ['./bower_components/flexibility/dist/flexibility.js']
}

const staticPaths = {
  css: ['static/css/*.css'],
  images: ['static/images/**'],
  js: ['static/js/*.js']
}

// dev
gulp.task('del', () => {
  return del(['static/', 'build/'])
})

gulp.task('css', () => {
  const processors = [
    atImport,
    cssNested,
    cssVar,
    flexibility,
    autoprefixer({ browsers: ['last 2 versions', 'not ie <= 8'] })
  ]

  return gulp.src(paths.css)
    .pipe(postcss(processors))
    .pipe(gulp.dest('static/css'))
    .pipe(livereload())
})

gulp.task('css:build', () => {
  return gulp.src(staticPaths.css)
    .pipe(cssMinify())
    .pipe(gulp.dest('build/css'))
})

gulp.task('js', () => {
  return gulp.src(paths.bowerJs)
    .pipe(concat('asset.js'))
    .pipe(gulp.dest('static/js'))
    .pipe(livereload())
})

gulp.task('js:build', () => {
  return gulp.src(staticPaths.js)
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
})

gulp.task('images', () => {
  return gulp.src(paths.images)
    .pipe(gulp.dest('static/images'))
    .pipe(livereload())
})

gulp.task('images:build', () => {
  return gulp.src(staticPaths.images)
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'))
})

gulp.task('dev', sequence('css', 'js', 'images'))
gulp.task('default', sequence('del', 'dev'))
gulp.task('build', sequence('del', 'dev', 'css:build', 'js:build', 'images:build'))

gulp.task('watch', () => {
  livereload.listen({ port: 12306 })
  gulp.watch(paths.css, ['css'])
  gulp.watch(paths.bowerJs, ['js'])
  gulp.watch(paths.images, ['images'])
})
