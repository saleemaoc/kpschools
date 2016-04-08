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
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/stylesheets/',
          src: ['style.css'],
          dest: 'site/dist/css',
          ext: '.min.css'
        }]
      }
    },
    jshint: {
      lint: ['Gruntfile.js', 'public/js/main.js']
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {
            expand: true,
            flatten: true,
            cwd: 'node_modules/',
            src: [
            'bootstrap-select/dist/css/bootstrap-select.min.css',
            'bootstrap/dist/css/bootstrap.min.css',
            'ladda/dist/ladda.min.css',
            'mfb/src/mfb.min.css'
            ],
            dest: 'site/dist/css'
          },
          {
            expand: true,
            cwd: 'node_modules/',
            src: [
              'bootstrap-select/dist/js/bootstrap-select.min.js',
              'jquery/dist/jquery.min.js', 
              'bootstrap/dist/js/bootstrap.min.js', 
              'ladda/dist/spin.min.js', 
              'ladda/dist/ladda.min.js',
              'mfb/src/mfb.min.js',
              ],
            dest: 'site/dist/js',
            flatten: true
          },
        ],
      },
    },
    jadeUsemin: {
        scripts: {
            options: {
                tasks: {
                    js: ['concat', 'uglify'],
                    css: ['concat', 'cssmin']
                }
            },
            files: [{
                dest: './views/indexmin.jade',
                src: './views/index.jade'
            }]
        }
    },
    watch: {
      options: {
        livereload: true,
      },
      scripts: {
        files: ['public/js/main.js', 'app.js', 'routes/index.js', 'public/stylesheets/style.css'],
        tasks: ['buildall'],
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
  // grunt.loadNpmTasks('grunt-jade-usemin');


  // Default task(s).
  grunt.registerTask('default', ['uglify:build_main', 'jshint']);
  grunt.registerTask('buildall', ['uglify', 'cssmin','copy']);

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });
};