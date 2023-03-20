module.exports = function (grunt) {
    grunt.initConfig({
        shell: {
            build: {
                command: 'yarn run build'
            }
        },
        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['shell:build'],
                options: {
                    spawn: false,
                },
            },
        },
    })
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-shell')
    grunt.registerTask('default', ['watch'])
}