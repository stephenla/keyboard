module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['lib/js/views/*.js','lib/js/controllers/*.js','lib/js/models/*.js', 'lib/js/apps/*.js','lib/js/routers/*.js'],
        dest: 'lib/js/main.js'
      },
      test: {
        src: ['spec/spec/**/*.js', '!spec/spec/spec.js'],
        dest: 'spec/spec/spec.js'
      }
    },
    watch: {
      scripts: {
        files: ['lib/js/**/*.js', '!lib/js/main.js', 'spec/spec/**/*.js', '!spec/spec/spec.js'],
        tasks: ['concat']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Default task(s).
  grunt.registerTask('default', ['concat']);

};