'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt, {config: 'package.json'});
    grunt.loadNpmTasks('assemble');
    require('time-grunt')(grunt);

    var socaConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        soca: socaConfig,
        watch: {
            options: {
                nospawn: true
            },
            compass: {
                files: ['app/src/sass/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            },
            assemble: {
                files: ['app/layouts/*.hbs', 'app/pages/*.hbs'],
                tasks: ['assemble']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'app/layouts/*.hbs',
                    'app/pages/*.hbs',
                    'app/css/{,*/}*.css',
                    'app/src/sass/{,*/}*.{scss,sass}',
                    'app/js/{,*/}*.js',
                    'app/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'app'),
                            lrSnippet
                        ];
                    }
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= soca.app %>/css',
                        '<%= soca.app %>/js/application.js',
                        '<%= soca.app %>/js/application.js.map',
                        '<%= soca.dist %>/*',
                        '!<%= soca.dist %>/.git*'
                    ]
                }]
            },
            server: {
                files: [{
                    src: [
                        '<%= soca.app %>/css',
                        '<%= soca.app %>/js/application.js',
                        '<%= soca.app %>/js/application.js.map',
                        '<%= soca.dist %>/*'
                    ]
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= soca.app %>',
                    dest: '<%= soca.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'components/**/*',
                        '*.html'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= soca.app %>/css',
                dest: 'dist/css/',
                src: '{,*/}*.css'
            },
            javascripts: {
                expand: true,
                cwd: '<%= soca.app %>/js',
                dest: 'dist/js/',
                src: '{,*/}*.js'
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        compass: {
            options: {
                sassDir: 'app/src/sass',
                cssDir: 'app/css',
                outputStyle: 'compressed'
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        uglify: {
            options: {
              mangle: true
            },
            server: {
                files: {
                    'app/js/application.js': [
                        'app/js/application.js'
                    ]
                }
            }
        },
        assemble: {
            options: {
                layout: "app/layouts/default.hbs",
                flatten: true
            },
            pages: {
                files: {
                    'app/': ['app/pages/*.hbs']
                }
            }
        }
    });

    grunt.registerTask('server', function (target) {
        grunt.task.run([
            'clean:server',
            'compass:server',
            'assemble',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });
    grunt.registerTask('build', [
        'clean:dist',
        'compass:server',
        'uglify:server',
        'copy:styles',
        'copy:javascripts',
        'copy:dist'
    ]);
};