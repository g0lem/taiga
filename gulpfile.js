var gulp          = require('gulp'),
    uglify        = require('gulp-uglify'),
    concat        = require('gulp-concat'),
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    watch         = require('gulp-watch');



//The list of task names used in the default gulp task

var defaultTaskList = ['buildSass',
                       'minifyPackages'];



//List of glob paths to SOURCE files for piping

var angularFilesPath = ['./scripts/*.app.js',        //This doesn't contain user-panel.js
                    './scripts/*.factory.js',    //Please correct in case of error
                    './scripts/*.controller.js',
                    './scripts/*.directive.js'];

var sassFilesPath    = ['./css/chatpage.scss',
                    './css/loginpage.scss'];

var packageFilesPath = ['./packages/*.js'];
 


//List of glob paths to DESTINATION files for piping

var productionPackagePath = {
    name : 'packages.min.js',
    dest : './packages/'
}

var productionAngularPath = {
    name : 'angular.app.min.js',
    dest : './scripts/'
}

var developmentAngularPath = {
    name : 'angular.app.dev.js',
    dest : './scripts/'
}

var productionSassPath = {
    dest: './css/'
}



//Gulp tasks for Production Only

gulp.task('buildSass', function () {
  gulp.src(sassFilesPath)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['> 5%'],cascade: false}))
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(productionSassPath.dest));
});

gulp.task('minifyPackages', function() {
  gulp.src(packageFilesPath)
    .pipe(concat(productionPackagePath.name))
    .pipe(uglify())
    .pipe(gulp.dest(productionPackagePath.dest));
});

gulp.task('minifyAngular', function() {  //The uglify might make angular unusable, NOT TESTED YET
  gulp.src(angularFilesPath)
    .pipe(concat(productionAngularPath.name))
    .pipe(uglify())
    .pipe(gulp.dest(productionAngularPath.dest));
});



//Gulp tasks for Development Only

gulp.task('minifyAngularWatch', function() {

  watch(angularFilesPath, function(){  

    gulp.src(angularFilesPath)
    .pipe(concat(developmentAngularPath.name))
    .pipe(gulp.dest(developmentAngularPath.dest));

  });

});



//The gulp default task

gulp.task('default', defaultTaskList);