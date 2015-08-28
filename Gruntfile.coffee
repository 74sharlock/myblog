module.exports = (grunt)->

	grunt.initConfig
		cssmin:{
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
				files: {
#					'./www/resource/dist/lib.min.css':[
#						'./www/resource/bower_components/semantic-ui/dist/semantic.min.css'
#						'./www/resource/bower_components/font-awesome/css/font-awesome.min.css'
#					    './www/resource/bower_components/animate.css/animate.min.css'
#					    './www/resource/bower_components/google-code-prettify/bin/prettify.min.css'
#					    './www/resource/bower_components/google-code-prettify/styles/sons-of-obsidian.css'
#					]
					'./www/resource/dist/vendor.min.css':[
						'./www/resource/stylesheet/common.css'
						'./www/resource/stylesheet/style.css'
					]
				}
			}
		}

	grunt.loadNpmTasks('grunt-contrib-cssmin')

	grunt.registerTask('default', ['cssmin']);
