module.exports = function (grunt) {
	grunt.initConfig({
		compress: {
			main: {
			  options: {
				archive: 'post-type-archive-mapping.zip'
			  },
			  files: [
				{src: ['post-type-archive-mapping.php'], dest: '/', filter: 'isFile'}, // includes files in path
				{src: ['autoloader.php'], dest: '/', filter: 'isFile'}, // includes files in path
				{src: ['readme.txt'], dest: '/', filter: 'isFile'}, // includes files in path
				{src: ['uninstall.php'], dest: '/', filter: 'isFile'}, // includes files in path
				{src: ['fonts/**'], dest: '/'}, // includes files in path and its subdirs
				{src: ['dist/**'], dest: '/'}, // includes files in path and its subdirs
				{src: ['build/**'], dest: '/'}, // includes files in path and its subdirs
				{src: ['img/**'], dest: '/'}, // includes files in path and its subdirs
				{src: ['includes/**'], dest: '/'}, // includes files in path and its subdirs
				{src: ['languages/**'], dest: '/'}, // includes files in path and its subdirs
			  ]
			}
		  }
	  });
	  grunt.registerTask('default', ["compress"]);



	grunt.loadNpmTasks( 'grunt-contrib-compress' );

 };
