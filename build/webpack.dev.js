const webpack = require('webpack')
const merge = require('webpack-merge')
const htmlWebpackPlugin = require('html-webpack-plugin')
const extractTextPlugin = require('extract-text-webpack-plugin')

const webpackBase = require('./webpack.common')
webpackBase.entry.index.unshift('webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:3000')
module.exports = merge(webpackBase, {
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },{
                test: /\.(scss|sass)$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },{
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('development')
            }
        }),
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: './template/index.html',
            inject: true,
            chunks: ['index'],
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
        new extractTextPlugin('css/[name].css'),
        new webpack.HotModuleReplacementPlugin()
    ]
})