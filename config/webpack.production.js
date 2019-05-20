const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const os = require('os')
const DashboardPlugin = require('webpack-dashboard/plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
	output: {
		filename: 'js/[name].[hash:5].bundles.js',
		publicPath: './'
	},
	plugins: [
		new ManifestPlugin(),
		new CleanWebpackPlugin(['dist']),
		new DashboardPlugin(),
		new ParallelUglifyPlugin({
			exclude: /\.min\.js$/,
			workerCount: os.cpus().length,
			uglifyES: {
				output: {
					beautify: false,
					comments: false
				},
				compress: {
					warnings: false,
					drop_console: true,
					collapse_vars: true
				}
			}
		})
	]
}