module.exports = grunt => {
    grunt.initConfig({
        watch: {
            scripts: {
                files: ['js/public/src/index.js'],
                tasks: ['exec:yarn run build'],
                options: { spawn: false }
            }
        }
    })
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-exec')
    grunt.registerTask('default', ['watch'])
}