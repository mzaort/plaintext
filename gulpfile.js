'use strict';

var argv = require('yargs').argv;
var debug = require('gulp-debug');
var del = require('del');
var download = require('gulp-download');
var exec = require('child_process').exec;
var filter = require('gulp-filter');
var fs = require('fs.extra');
var git = require('gulp-git');
var gjslint = require('gulp-gjslint');
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var unzip = require('gulp-unzip');
var util = require('util');
var zip = require('gulp-zip');
var fixclosure = require('fixclosure');

var main = path.join(__dirname, 'src', 'main');
var resources = path.join(main, 'resources');
var webapp = path.join(main, 'webapp');

var config = {
  path: {
    src: {
      less: path.join(resources, 'less'),
      javascript: {
        base: path.join(webapp, 'js'),
        entryPoint: path.join(webapp, 'js', 'entry-point', 'bootstrap.js')
      }
    },
    dest: {
      css: path.join(webapp, 'css'),
      javascript: {
        compressed: path.join(webapp, 'js', 'compressed', 'bootstrap-zip.js'),
        sourceMap: path.join(webapp, 'js', 'compressed', 'bootstrap-zip.js.map')
      }
    },
    lib: {
      base: path.join(webapp, 'lib'),
      closureLibrary: path.join(webapp, 'lib', 'closure-library'),
      closureCompiler: path.join(webapp, 'lib', 'closure-compiler', 'closure-compiler-v20180204.jar')
    },
    package: 'component.zip'
  },
  revision: {
    closureLibrary: 'npm-v20171203.0.0'
  }
};

gulp.task('init', ['init:download-gcl', 'init:download-gcc']);

gulp.task('init:download-gcl', function(callback) {
  if (fs.existsSync(config.path.lib.closureLibrary)) {
    callback();
    return;
  }
  fs.mkdirp(config.path.lib.base, function() {
    git.clone(
      'https://github.com/google/closure-library.git',
      {cwd: config.path.lib.base},
      function(err) {
        if (err) throw err;
        process.chdir(config.path.lib.closureLibrary);
        git.checkout(config.revision.closureLibrary, function(err2) {
          if (err2) throw err2;
          callback();
        });
      });
  });
});

gulp.task('init:download-gcc', function(callback) {
  fs.exists(config.path.lib.closureCompiler, function(exists) {
    if (exists) {
      callback();
      return;
    }
    fs.mkdirp(path.dirname(config.path.lib.closureCompiler), function() {
      download('http://dl.google.com/closure-compiler/compiler-latest.zip')
        .pipe(unzip())
        .pipe(debug({title: 'init:download-gcc:'}))
        .pipe(gulp.dest(path.dirname(config.path.lib.closureCompiler)))
        .on('end', callback);
    });
  });
});

gulp.task('check', ['check:lint', 'check:build']);

gulp.task('check:lint', ['build:clean'], function() {
  return gulp.src([path.join(config.path.src.javascript.base, '**', '*.js'),
      '!' + path.basename(config.path.dest.javascript.compressed)])
    .pipe(debug({title: 'check:lint:'}))
    .pipe(gjslint({
      flags: [
        '--max_line_length 120'
      ]
    }))
    .pipe(gjslint.reporter('console'), {fail: true})
});

gulp.task('check:build', ['build']);

gulp.task('check:individual', ['check:individual:lint', 'check:individual:build']);

gulp.task('check:individual:lint', function() {
  return gulp.src(path.join(config.path.src.javascript.base, argv.js))
    .pipe(debug({title: 'check:individual:lint:'}))
    .pipe(gjslint({
      flags: [
        '--max_line_length 120'
      ]
    }))
    .pipe(gjslint.reporter('console'), {fail: true})
});


gulp.task('build', ['build:build']);

gulp.task('build:clean', function(callback) {
  del([
    path.join(config.path.dest.javascript.compressed, '*.js'),
    path.join(config.path.dest.javascript.sourceMap, '*.map')
  ], callback);
});

gulp.task('fixclosure', function(callback) {
  var root = 'src/main/webapp/js/plaintext';
  var provideRoots = 'plaintext,goog';
  var namespaceMethods = ["goog.async.nextTick","goog.async.throwException",
    "goog.async.run","goog.async.AnimationDelay","goog.async.Delay",
    "goog.async.ConditionalDelay","goog.async.Throttle"].join(',');

  var source = 'src/main/webapp/js/plaintext/*.js';
  var cmd = util.format('find . -name "*.js" | xargs fixclosure -f' +
      ' --provideRoots %s' +
      ' --namespaceMethods %s', provideRoots, namespaceMethods);
  exec(cmd, {cwd: root}, function(error, stdout, stderr) {
      console.log(stdout);
      console.error(stderr);
      if (error) {
        console.error(error);
      }
      callback();
    });
});

gulp.task('build:build', ['build:clean'], function(callback) {
  var root = config.path.src.javascript.base;
  var cmd = util.format('python %s/closure/bin/calcdeps.py' +
      ' -i %s' +
      ' -p %s' +
      ' -p %s/closure/' +
      ' -p %s/third_party/' +
      ' -c %s' +
      ' -o compiled' +
      ' -f "--compilation_level=ADVANCED_OPTIMIZATIONS"' +
      ' -f "--warning_level=VERBOSE"' +
      ' -f "--js_output_file=%s"' +
      ' -f "--create_source_map=%s"' +
      ' -f "--output_wrapper=\'%%output%%//@ sourceMappingURL=%s\'"',
    path.relative(root, config.path.lib.closureLibrary),
    path.relative(root, config.path.src.javascript.entryPoint) || '.',
    path.relative(root, config.path.src.javascript.base) || '.',
    path.relative(root, config.path.lib.closureLibrary),
    path.relative(root, config.path.lib.closureLibrary),
    path.relative(root, config.path.lib.closureCompiler),
    path.relative(root, config.path.dest.javascript.compressed),
    path.relative(root, config.path.dest.javascript.sourceMap),
    path.relative(path.dirname(config.path.dest.javascript.compressed),
      config.path.dest.javascript.sourceMap));
  exec(cmd, {cwd: root},
    function(error, stdout, stderr) {
      console.log(stdout);
      console.error(stderr);
      if (error) {
        console.error(error);
      }
      callback();
    });
});

gulp.task('check:individual:build', function(callback) {
  var root = config.path.src.javascript.base;
  var cmd = util.format('python %s/closure/bin/calcdeps.py' +
      ' -i %s/%s' +
      ' -p %s' +
      ' -p %s/closure/' +
      ' -p %s/third_party/' +
      ' -c %s' +
      ' -o compiled' +
      ' -f "--compilation_level=ADVANCED_OPTIMIZATIONS"' +
      ' -f "--warning_level=VERBOSE"',
    path.relative(root, config.path.lib.closureLibrary),
    path.relative(root, config.path.src.javascript.base) || '.', argv.js,
    path.relative(root, config.path.src.javascript.base) || '.',
    path.relative(root, config.path.lib.closureLibrary),
    path.relative(root, config.path.lib.closureLibrary),
    path.relative(root, config.path.lib.closureCompiler));
  exec(cmd, {cwd: root},
    function(error, stdout, stderr) {
      console.error(stderr);
      if (error) {
        console.error(error);
      }
      callback();
    });
});

gulp.task('package:clean', function(callback) {
  del([config.path.package], callback);
});

gulp.task('package', ['package:clean', 'check'], function() {
  return gulp.src([path.join(webapp, '**', '*')])
    .pipe(debug({title: 'package:'}))
    .pipe(zip(config.path.package))
    .pipe(gulp.dest('.'));
});

gulp.task('clean', ['build:clean', 'package:clean']);
gulp.task('clean:all', ['build:clean', 'package:clean', 'clean:lib']);

gulp.task('clean:lib', function(callback) {
  del([config.path.lib.base], callback);
});

gulp.task('default', ['build']);

gulp.task('build:css', ['build:css:clean'], function() {
  return gulp.src([path.join(config.path.src.less, '**', '*.less'), '!./**/_*.less'])
    .pipe(debug({title: 'build:css:'}))
    .pipe(less())
    .pipe(gulp.dest(config.path.dest.css));
});

gulp.task('build:css:clean', function(done) {
  del([config.path.dest.css], done);
});
