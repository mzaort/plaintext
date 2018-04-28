module.exports = function(grunt) {
  var _ = require('underscore');

  require('jit-grunt')(grunt, {
    fixclosure : 'grunt-fixclosure',
    eslint : 'grunt-eslint',
    closureCompiler : 'grunt-closure-tools',
    closureDepsWriter : 'grunt-closure-tools',
    closureBuilder : 'grunt-closure-tools'
  });

  grunt.initConfig({
    meta: {
      jsRootPath: 'src/main/webapp/js', 
      testJsRootPath: 'src/main/webapp/test', 
      jsDir: 'js',      
      webappRoot: 'src/main/webapp',
      closureLibraryPath: 'src/main/webapp/lib/closure-library',
      jsLibraryPath: 'src/main/webapp/lib/js',
      depjsFilePath: 'src/main/webapp/js/deps.js',
      lessRootPath : 'src/main/less/components',
      lessLibRootPath : 'src/main/less/common/components',
      lessPagesPath : 'src/main/less/pages',
      cssDestRootPath : 'src/main/webapp/css/components',
      cssDestPagesRootPath : 'src/main/webapp/css/pages'
    },
    karma: {
      options: {
        frameworks: [
          'jasmine-jquery', 'jasmine'
        ],
        files: [
          '<%= meta.closureLibraryPath %>/closure/goog/base.js',
          '<%= meta.depjsFilePath %>',
          '<%= meta.webappRoot %>/test/**/*_spec.js',
          { pattern: '<%= meta.webappRoot %>/**/*.js', included: false, served: true }
        ]
      },
      ci: {
        singleRun: true,
        colors: false,
        browsers: ['PhantomJS'],
        reporters: ['progress'],
        client: {
          useIframe: false //to avoid phantomjs detect failure
        }
      },
      dev: {
        reporters: 'dots',
        browsers: ['Chrome']
      },
      coverage: {
        singleRun: true,
        colors: false,
        browserNoActivityTimeout: 100000,
        browsers: ['PhantomJS'],
        reporters: ['coverage', 'progress'],
        client: {
          useIframe: false
        },
        preprocessors: {
          'src/main/webapp/js/**/*.js': 'coverage'
        },
        coverageReporter: {
          dir : 'target/coverage/',
          reporters: [
            {type: 'html', subdir: 'html'},
            {type: 'cobertura', subdir: 'cobertura'}
          ]
        }
      }
    },
    // Watch dir
    watch : {
      livereload : {
        files : [
          '<%= meta.jsRootPath %>/**/*.js',
          '<%= meta.webappRoot %>/css/**/*.css'
        ],
        options : {
          livereload : true
        }
      }
    },
    jsbeautifier: {
      all: {
        src : [
          '<%= meta.jsRootPath %>/**/*.js',
          '<%= meta.testJsRootPath %>/**/*.js',
          '!<%= meta.jsRootPath %>/**/*.min.js',
          '!<%= meta.jsRootPath %>/externs/**/*.js',
          '!<%= meta.depjsFilePath %>'
        ]
      },
      options: {
        js: {
          braceStyle: "collapse",
          breakChainedMethods: false,
          e4x: false,
          evalCode: false,
          indentChar: " ",
          indentLevel: 0,
          indentSize: 2,
          indentWithTabs: false,
          jslintHappy: false,
          keepArrayIndentation: false,
          keepFunctionIndentation: false,
          maxPreserveNewlines: 10,
          preserveNewlines: true,
          spaceBeforeConditional: true,
          spaceInParen: false,
          unescapeStrings: false,
          wrapLineLength: 120
        }
      }
    },
    closureDepsWriter : {
      options : {
        closureLibraryPath : '<%= meta.closureLibraryPath %>',
      },
      all : {
        options : {
          root_with_prefix : [
            '"<%= meta.jsRootPath %> ../../../../js"',
            '"<%= meta.jsLibraryPath %> ../../../../lib/js"',
            '"<%= meta.closureLibraryPath %> ../../../../lib/closure-library"'
          ]
        },
        dest : '<%= meta.depjsFilePath %>'
      }
    },
    fixclosure : {
      options : {
        roots : ['plaintext']
      },
      all : {
        src : [
          '<%= meta.jsRootPath %>',
          '<%= meta.jsLibraryPath %>'
        ]
      },
      own : {
        src : [
          '<%= meta.jsRootPath %>/**/*.js',
          '<%= meta.jsRootPath %>'
        ]
      }
    },
    // JSHint
    jshint : {
      all: {
        src: ['<%= meta.jsRootPath %>/**/*.js']
      },
      newer: {
        src: ['<%= meta.jsRootPath %>/**/*.js']
      },
      options : {
        jshintrc : '.jshintrc',
        reporter : 'jslint',
        reporterOutput : 'target/jshint-result.xml',
        force : true
      }
    },
    jsonlint : {
      all : {
        src : ['<%= meta.jsRootPath %>/**/*.json']
      },
      newer: {
        src: ['<%= meta.jsRootPath %>/**/*.json']
      }
    },
    eslint: {
      options: {
        config: 'eslint.json'
      },
      all: {
        src: ['<%= meta.jsRootPath %>/**/*.js', '!<%= meta.jsRootPath %>/**/*.min.js']
      },
      newer: {
        src: ['<%= meta.jsRootPath %>/**/*.js', '!<%= meta.jsRootPath %>/**/*.min.js']
      }
    },
    gjslint : {
      options : {
        reporter : {
          name : 'console'
        },
        flags : [
          '--disable 0001,0002', '--custom_jsdoc_tags abstract,public,since,namespace,example', '--max_line_length 140'
        ]
      },
      all: {
        src: ['<%= meta.jsRootPath %>/**/*.js', '!<%= meta.jsRootPath %>/**/*.min.js']
      },
      newer: {
        src: ['<%= meta.jsRootPath %>/**/*.js', '!<%= meta.jsRootPath %>/**/*.min.js']
      },
      part: { // vohu-manah
        src: [ require('path').join(grunt.cli.options.folder || '', grunt.cli.options.file || '') ],
        options: {
          reporter: {
            name: 'gjslint_xml',
            dest: grunt.cli.options.outxml
          }
        }
      }
    },    
    less : {
      own : {
        expand : true,
        cwd : '<%= meta.lessRootPath %>',
        src : [
          '*.less'
        ],
        dest : '<%= meta.cssDestRootPath %>',
        ext : '.css'
      },
      ownClean : {
        expand : true,
        cwd : '<%= meta.lessRootPath %>-clean',
        src : [
          '*.less'
        ],
        dest : '<%= meta.cssDestRootPath %>',
        ext : '.css'
      },
      components : {
        expand : true,
        cwd : '<%= meta.lessLibRootPath %>',
        src : [
          '*.less'
        ],
        dest : '<%= meta.cssDestRootPath %>',
        ext : '.css'
      },
      pages : {
        options : {
          compress : true
        },
        expand : true,
        cwd : '<%= meta.lessPagesPath %>',
        src : [
          '**/*.less'
        ],
        dest : '<%= meta.cssDestPagesRootPath %>',
        ext : '.css'
      }
    }
  });

  grunt.registerTask('less:all', [
    'less:own', 'less:components', 'less:pages'
  ]);

  grunt.registerTask('less:buildOwn', [
    'less:own', 'less:ownClean', 'less:pages'
  ]);

  grunt.event.on('watch', function(action, filepath) {
    grunt.log.writeln(action + ': ' + filepath);
  });

  grunt.registerTask('default', [
    'closureDepsWriter:all'
  ]);

  grunt.registerTask('live', [
    'watch:livereload'
  ]);
  
  grunt.registerTask('pre-commit', [
    'fixclosure:own', 'newer:jsbeautifier:all', 'gjslint:newer', 'eslint:newer'
  ]);

  grunt.registerTask('deploy:client', [
    'fixclosure:all', 'closureDepsWriter:all', 'less:all'
  ]);

  grunt.registerTask('format', [
    'newer:jsbeautifier:all'
  ]);

  grunt.registerTask('fixdeps', [
    'fixclosure:own', 'closureDepsWriter:all'
  ]);

  grunt.registerTask('fixdepsAll', [
    'fixclosure:all', 'closureDepsWriter:all'
  ]);

  grunt.registerTask('build:process-sources', [
    'fixclosure:own'
  ]);

  grunt.registerTask('build:generate-resources', [
    'closureDepsWriter:all'
  ]);
  
  grunt.registerTask('closureDepsWriter:mvn', function(){
    var depsJsPath = grunt.config.process('<%= meta.depjsFilePath %>');
    if (!grunt.file.exists(depsJsPath)) {
      grunt.task.run('closureDepsWriter:all');
    } else {
      console.log('deps.js is already created.');
      console.log('If you want to recreate it, Please execute grunt closureDepsWriter.');
    }
  });

  grunt.extendConfig = function(additionalConfig) {

    var config = grunt.config();

    for (prop in additionalConfig) {
      if (additionalConfig.hasOwnProperty(prop)) {
        if (config[prop]) {
          config[prop] = _.extend(config[prop], additionalConfig[prop]);

        } else {
          var tmpConfig = {};
          tmpConfig[prop] = additionalConfig[prop]
          config = _.extend(config, tmpConfig);
        }
      }
    }

    grunt.initConfig(config);
  };

  var fs = require('fs');

  if (fs.existsSync("./GruntfilePrj.js")) {
    var project = require('./GruntfilePrj.js');
    project.extendGrantTask(grunt);

    if (project.extendGjslintConfig) {
      project.extendGjslintConfig(grunt);
    }
  }

  if (fs.existsSync("./GruntfileInd.js")) {
    var individual = require('./GruntfileInd.js');
    individual.extendGrantTask(grunt);
  }

};
