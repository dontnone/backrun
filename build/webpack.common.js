const webpack = require('webpack')
const path = require('path')
const extractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: {
        'index': ['./src/entries/main.js']
    },
    output: {
        filename: 'js/[name].[hash].js',
        publicPath: '/',
        path: path.resolve(__dirname, '../dist/'),
        chunkFilename: '[id].[hash:8].chunk.js'
    },
    externals: {
        // "echarts": 'echarts-for-react'
    },
    module: {
        rules:[{
            test: /\.(js|jsx)$/,
            exclude: /(node_modules)/,
            use: ['babel-loader']
        },{
            test: /\.html$/,
            exclude:/(node_modules)/,
            loader: 'html-loader?attrs=img:src img:data-src'
        },{
            test: /\.(jpg|gif|png)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    publicPath: '/',
                    limit: 8192,
                    name: 'img/[name].[hash].[ext]',
                }
            }]
        },{
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            exclude: /(node_modules)/,
            use: 'file-loader'
        }]
    }
}