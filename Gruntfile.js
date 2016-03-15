module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build_main: {
        files: {
         'site/dist/js/app.js': 'public/js/main.js',
        }
      },
      build_lib: {
        files: {
         'site/dist/js/leaflet.min.js': 'node_modules/leaflet/dist/leaflet.js',
         'site/dist/js/markercluster.min.js': 'node_modules/leaflet.markercluster/dist/leaflet.markercluster.js',
        }
      }
    },
/*    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'node_modules/bootstrap/dist/css/',
          src: ['bootstrap.css'],
          dest: 'site/dist/css',
          ext: '.min.css'
        }]
      }
    },*/
    jshint: {
      lint: ['Gruntfile.js', 'public/js/main.js']
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, cwd: 'node_modules/bootstrap/dist/css', src: 'bootstrap.min.css', dest: 'site/dist/css'},
          {expand: true, cwd: 'node_modules/jquery/dist', src: 'jquery.min.js', dest: 'site/dist/js'},
        ],
      },
    },
    watch: {
      options: {
        livereload: true,
      },
      scripts: {
        files: ['public/js/main.js', 'app.js', 'routes/index.js'],
        tasks: ['default'],
        options: {
          spawn: false,
        },
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-reload');


  // Default task(s).
  grunt.registerTask('default', ['uglify:build_main', 'jshint']);
  grunt.registerTask('buildall', ['uglify', 'jshint', 'copy'])

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });
};