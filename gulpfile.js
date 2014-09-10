var gulp = require('gulp'),
	livereload = require('gulp-livereload'),
	open = require('open'),
	express = require('express'),
	port = 80;

gulp.task('server', function(next){
	var server = express().use(express.static( __dirname + '/public' )).listen(port, next);
	var portStr = port == 80 ? '' : ':' + port;
	open("http://localhost" + portStr, "chrome");
});

gulp.task('default', ['server'], function(){
	var refresh = livereload();

	gulp.watch(['public/*.*', 'public/**/*.*']).on('change', function(file){
		refresh.changed(file.path);
	});

});