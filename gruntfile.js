module.exports = function (grunt) {
    grunt.initConfig({
        watch: {
            js: {
                files: 'js/*.js',
                tasks: ['concat']
            }
        },
        concat: {
            dist: {
                src: ['./js/*.js'],
                dest: './app.js',
            },
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'css/*.css',
                        '*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: '.'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');

    grunt.registerTask('default', ['browserSync', 'watch']);
};