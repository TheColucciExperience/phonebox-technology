
/* Gulpfile containing all necessary tasks. These will be called by a default
 * whenever we need to update something (or we can just watch anyway)
 */

// Getting gulp and plugins

const gulp = require( 'gulp' ),
	/* Here we use gulp-load-plugins to get all plugins at once,
	 * and we instatiate it right away
	 */
	plugins = require( 'gulp-load-plugins' )(),
	del = require( 'del' ),
	// Browser-sync to keep things synchronized
	browserSync = require( 'browser-sync' ).create();



// This task will clean the whole build after something changes

gulp.task( 'clean', function delFiles() {
	return del( './dist/**/*', '!./dist' );
} );

// Tasks to clean scripts, styles and images individually

gulp.task( 'clean-styles', function delStyles() {
	return del( [ './dist/css', './dist/maps/css' ] );
} );

gulp.task( 'clean-scripts', function delScripts() {
	return del( [ './dist/js', './dist/maps/js' ] );
} );

gulp.task( 'clean-images', function delStyles() {
	return del( './dist/images' );
} );

// Task to copy necessary files. For now only JSON data.

gulp.task( 'copy', function copyFiles() {
	return gulp.src( './src/json/*.json' )
		.pipe( gulp.dest( './dist/json' ) );
} )

// Task to compile and minify less files

gulp.task( 'less', function compileLess() {

	return gulp.src( './src/less/*.less' )
		.pipe( plugins.sourcemaps.init() )
		.pipe( plugins.less() )
		.pipe( plugins.cssnano( {

			reduceIdents: {
				keyframes: false
			},
			discardUnused: {
				keyframes: false
			}

		 } ) )
		.pipe( plugins.concat( 'app.min.css' ) )
		.pipe( plugins.sourcemaps.write( './' ) )		
		.pipe( gulp.dest( './dist/css' ) )
		.pipe( browserSync.stream() );

} );

// Task to lint, minify and concatenate all scripts

gulp.task( 'scripts', function prepareScripts() {

	return gulp.src( './src/js/*.js' )
		.pipe( plugins.sourcemaps.init() )		
		.pipe( plugins.babel() )
		.pipe( plugins.uglify() )
		.pipe( plugins.concat( 'app.min.js' ) )
		.pipe( plugins.sourcemaps.write( './' ) )
		.pipe( gulp.dest( './dist/js' ) );

} );

// Task to optimize images

gulp.task( 'images', function optimizeImages() {

	return gulp.src( './src/images/*' )
		.pipe( plugins.imagemin() )
		.pipe( gulp.dest( './dist/images' ) );

} );

// This task will create a server for browser-sync and watch for changes

gulp.task(
	'serve',
	gulp.series(
		'clean',
		gulp.parallel( 'copy', 'less', 'scripts', 'images' ),
		function initSyncServer() {

			// Initiating server

			browserSync.init( {
				server: './'
			} );

			gulp.watch(
				'./src/less/*.less',
				gulp.series( 'clean-styles', 'less' )
			);
			gulp.watch( 'index.html' ).on( 'change', browserSync.reload );
			gulp.watch(
				'./src/js/*.js',
				gulp.series( 'clean-scripts', 'scripts', reload)				
			);
			// Just so we pass images to dist
			gulp.watch( './src/images/*', gulp.series( 'images' ) );

		}
	)
);

// Default task

gulp.task( 'default', gulp.series( 'serve' ) );

// Function to reload te browser (sync)

function reload(done) {
	browserSync.reload();
	done();
}
