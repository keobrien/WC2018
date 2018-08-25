const argv = require('yargs').argv;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const CleanWebpackPlugin = require('clean-webpack-plugin');

let config = {
	// https://webpack.github.io/docs/configuration.html#entry
	// https://docs.npmjs.com/files/package.json#config - Used for process.env.npm_package_X
	entry : './' + process.env.npm_package_config_paths_source + '/index.js',
	// https://webpack.github.io/docs/configuration.html#output
	output: {
		filename: 'index.js',
		// https://docs.npmjs.com/files/package.json#config
		path: __dirname + '/' + process.env.npm_package_config_paths_output
	},
	// https://webpack.js.org/configuration/stats/
	stats: {
		// overall build time
		timings: true
	},
	// https://webpack.github.io/docs/configuration.html#profile - timing for individual includes
	profile: true,
	// https://webpack.github.io/docs/configuration.html#watch - pass `--watch` to have webpack watch files.
	// Example: webpack --watch
	watch : !!argv.watch,
	module: {
		rules: [
			// Javascript processing
			// https://www.npmjs.com/package/babel-loader
			// https://babeljs.io/
			// Enables ES6 javascript for all browsers
			{
				test   : /\.js$/,
				exclude: '/node_modules/',
				use : {
					loader: 'babel-loader',
					options: {
						"presets": ["env"],
						"comments": false
					}
				}
			},
			// CSS processing
			// http://sass-lang.com/
			{
				test: /\.scss$/,
				// https://www.npmjs.com/package/extract-text-webpack-plugin
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						// https://www.npmjs.com/package/css-loader
						{
							loader: 'css-loader',
							options: {
								// Minimize only if building for production to optimize build times
								// Example: export NODE_ENV=production && webpack
								minimize: (process.env.NODE_ENV === 'production'),
								sourceMap: true
							}
						},
						// Auto-prefix css to automatically add vendor prefixes.
						// https://www.npmjs.com/package/postcss-loader
						{
							loader: 'postcss-loader',
							options: {
								ident: 'postcss',
								sourceMap: true,
								plugins: function(loader)  {
									return [
										// https://github.com/postcss/autoprefixer
										require('autoprefixer')({
											browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
										})
									];
								}
							}
						},
						// https://www.npmjs.com/package/sass-loader
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}
					]
				})
			},
			// Copy any additional files used in production but not required a specific loader.
			// Needed to copy over fonts, images, etc from npm packages.
			// https://www.npmjs.com/package/file-loader
			{
				test: /\.(eot|ttf|woff|woff2|svg|png|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
                        options: {
                            name: '[name].[hash].[ext]',
							context: './' + process.env.npm_package_config_paths_source
                        }
					}
				]
			}
		]
	},
	plugins: [
		// https://www.npmjs.com/package/clean-webpack-plugin - Delete build folder when starting a new build
		// https://webpack.js.org/guides/output-management/#cleaning-up-the-dist-folder
		new CleanWebpackPlugin([process.env.npm_package_config_paths_output]),
		// https://www.npmjs.com/package/extract-text-webpack-plugin - Extracts CSS to prevent rendering before styles are loaded
		// https://webpack.github.io/docs/stylesheets.html#separate-css-bundle
		new ExtractTextPlugin("index.css"),
		// https://www.npmjs.com/package/webpack-notifier - Use native desktop notifications when a build finishes
		new WebpackNotifierPlugin({alwaysNotify: true}),
	],
	// https://webpack.js.org/configuration/devtool/
	// Fastest source map that works with text extract but not production ready. Production uses a different slower version.
	devtool: "#cheap-module-source-map"
};

// Production override settings.
// See build-prod script in package.json
// export NODE_ENV=production && ./node_modules/.bin/webpack
if (process.env.NODE_ENV === 'production') {

	config.plugins.push(
		// https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
		new webpack.optimize.UglifyJsPlugin({
				sourceMap: true,
				compress: {
					warnings: false
				}
			}
		));

	// https://webpack.js.org/configuration/devtool/
	// Different from dev. This version is slower but intended for production only.
	config.devtool = "#source-map";

}

module.exports = config;
