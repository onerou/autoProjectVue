const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const os = require('os')
const interfaces = os.networkInterfaces()
var IPAdress = ''
for (var devName in interfaces) {
	var iface = interfaces[devName]
	for (var i = 0; i < iface.length; i++) {
		var alias = iface[i]
		if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
			IPAdress = alias.address
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
		host: IPAdress,
		proxy: {
			'/oceanview/*': {
				target: 'http://1.119.5.8:20002',
				changeOrigin: true,
				secure: false,
			}
		}
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