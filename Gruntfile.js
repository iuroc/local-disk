module.exports = grunt => {
    grunt.initConfig({
        watch: {
            scripts: {
                files: ['js/public/src/index.js'],
                tasks: ['exec'],
                options: { spawn: false }
            }
        },
        exec: {
            build: 'yarn run build'
        }
    })
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-exec')
    grunt.registerTask('default', ['watch'])
}
