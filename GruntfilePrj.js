(function() {
  module.exports.extendGrantTask = function(grunt) {

    var config = grunt.config();

    grunt.registerTask('lessc', ['clean', 'less']);

    // Temporal setting to redirect eslint:all into eslint:ci, to avoid eslint.ignore failure in Windows.
    grunt.registerTask('eslint:all', ['eslint:ci']);

    grunt.registerTask('eslint:ci', function() {
      var checkFileList = [];
      var ignoreList = require('fs').readFileSync('eslint.ignore', 'utf8')
          .replace(/\r\n/g, '\n').trim().split('\n');
      var jsRootPath = grunt.config.get('meta').jsRootPath;
      grunt.file.recurse(jsRootPath, function(abspath, rootdir, subdir, filename) {
        if (!isMinJs(filename) && !require('underscore').contains(ignoreList, abspath)) {
          checkFileList.push(abspath);
        }
      });
      grunt.extendConfig({eslint: {check: checkFileList}});
      grunt.task.run('eslint:check');
    });

    grunt.extendConfig({
      clean : {
        deleteComponentCss : {
          src:['src/main/webapp/css/components/*']
        }
      }
    });
  };

  function isMinJs(filename) {
    if (filename.length <= 7) {
      return false;
    }
    return filename.indexOf('.min.js', filename.length - 7) !== -1;
  }
})();
