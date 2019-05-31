// _modeflag 区别开发环境与生产环境
const argv = require('yargs-parser')(process.argv.slice(2))
var webpack = require('webpack')
const _mode = argv.mode || 'development'
const _modeflag = _mode == 'production' ? true : false
const _mergeConfig = require(`./config/webpack.${_mode}.js`)
const merge = require('webpack-merge') // webpack的分类打包插件
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')
const setTitle = require('node-bash-title')
setTitle('    🍻  物流实时监控系统')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const os = require('os')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({
	size: os.cpus().length
})
const { join } = require('path')

function resolves(dir) {
	return join(__dirname, '.', dir)
}
baseConfig = {
	entry: './src/main.js',
	module: {
		noParse: /jquery|lodash/,
		rules: [
			{
				test: /\.(sa|sc|c|le)ss$/,
				use: [
					_modeflag
						? {
								loader: MiniCssExtractPlugin.loader,
								options: {
									publicPath: '../'
								}
							}
						: 'style-loader',
					'css-loader',
					{
						loader: 'less-loader',
						options: {
							javascriptEnabled: true
						}
					}
				]
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'happypack/loader?id=happyBabel'
				}
			},
			{
				test: /\.vue$/,
				use: [
					{
						loader: 'vue-loader'
					},
					{
						loader: 'iview-loader',
						options: {
							prefix: false
						}
					}
				]
			},
			{
				test: /\.svg$/,
				loader: 'svg-sprite-loader',
				include: [ resolves('src/icons') ],
				options: {
					symbolId: 'icon-[name]'
				}
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				exclude: [ resolves('src/icons') ],
				options: {
					limit: 10000,
					name: 'img/[name].[hash:7].[ext]'
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'media/[name].[hash:7].[ext]'
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'fonts/[name].[hash:7].[ext]'
				}
			}
		]
	},
	resolve: {
		extensions: [ '.js', '.vue', '.json' ],
		alias: {
			'@': resolves('src'),
			_c: resolves('src/components')
		}
	},
	plugins: [
		new ProgressBarPlugin({
			format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
			clear: true
		}),
		new HappyPack({
			id: 'happyBabel',
			threadPool: happyThreadPool,
			loaders: [
				{
					loader: 'babel-loader',
					options: {
						babelrc: false,
						cacheDirectory: true,
						presets: [
							[
								'@babel/preset-env',
								{
									debug: false,
									modules: false,
									useBuiltIns: false
								}
							]
						],
						plugins: [ 'dynamic-import-webpack', '@babel/plugin-transform-runtime' ]
					}
				}
			]
		}),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		// new WebpackDeepScopeAnalysisPlugin(),
		new MiniCssExtractPlugin({
			filename: _modeflag ? 'css/[name].css' : 'css/[name].[chunkhash:8].css',
			chunkFilename: _modeflag ? 'css/[name].css' : "css/[name].[chunkhash:8].css'"
		}),
		new HtmlWebpackPlugin({
			title: '物流实时监控系统',
			filename: 'index.html',
			template: './public/index.html'
		}),
		new WebpackBuildNotifierPlugin({
			title: '物流实时监控系统',
			logo: './public/favicon.png',
			suppressSuccess: true,
			sound: true
		}),
		new CopyWebpackPlugin([
			{
				from: 'public/favicon.ico'
			},
			{
				from: 'static/',
				to: 'static/'
			}
		]),
		new VueLoaderPlugin()
	]
}
module.exports = _modeflag ? smp.wrap(merge(_mergeConfig, baseConfig)) : merge(_mergeConfig, baseConfig)
