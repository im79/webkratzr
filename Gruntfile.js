module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);


  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
      },
      my_target: {
        files: {
			'public/all.min.js': ['bower_components/jquery/dist/jquery.js', 'bower_components/dist/js/bootstrap.js', 'src/my.js']
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/all.min.css': ['bower_components/bootstrap/dist/css/bootstrap.css', 'src/my.css']
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/my.css', 'src/my.js', 'templates/master.html', 'Gruntfile.js'],
        tasks: ['default'],
        options: {
          livereload: true,
          spawn: false,
        },
      },
    }
  });

  // Run
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // Default tasks
  grunt.registerTask('default', ['uglify', 'cssmin', 'watch']);

};
