const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const os = require('os')
const interfaces = os.networkInterfaces()
var ipAddress = ''
for (var devName in interfaces) {
	var iFace = interfaces[devName]
	for (var i = 0; i < iFace.length; i++) {
		var alias = iFace[i]
		if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
			ipAddress = alias.address
		}
	}
}
module.exports = {
	output: {
		filename: 'js/[name].js',
		publicPath: '/'
	},
	devServer: {
		stats: 'errors-only',
		open: 'Chrome',
		hot: true,
		host: ipAddress
		// proxy: {
		// 	'/oceanview/*': {
		// 		target: 'http://1.119.5.8:20002',
		// 		changeOrigin: true,
		// 		secure: false
		// 	}
		// }
	},
	plugins: [],
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				parallel: os.cpus().length
			})
		]
	}
}
