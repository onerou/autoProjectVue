const argv = require('yargs-parser')(process.argv.slice(2))
const _mode = argv.mode || 'development'
const _modeflag = _mode == 'production' ? true : false
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = [{
    test: /\.(sa|sc|c)ss$/,
    use: [
        _modeflag ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'sass-loader',
        'less-loader',
    ],
}, {
    test: /\.vue$/,
    use: [{
            loader: 'vue-loader',
            options: {

            }
        },
        {
            loader: 'iview-loader',
            options: {
                prefix: false
            }
        }
    ]
}]