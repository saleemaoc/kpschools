module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'public/js/main.js',
        dest: 'site/dist/m.js'
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'node_modules/bootstrap/dist/css/',
          src: ['bootstrap.css'],
          dest: 'site/dist/css',
          ext: '.min.css'
        }]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cssmin']);
};