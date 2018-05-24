const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const extractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

const webpackBase = require('./webpack.common')

module.exports = merge(webpackBase, {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader?importLoaders=1',
                    },{
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require('autoprefixer')({})]
                        }
                    }]
                })
            },{
                test: /\.(sass|scss)$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader : 'css-loader?importLoaders=1',
                        options: {
                            sourceMap:true
                        }
                    },{
                        loader : 'postcss-loader',
                        options: {
                            sourceMap:true,
                            plugins: [require('autoprefixer')({})]
                        }
                    },{
                        loader: "sass-loader",
                        options: {
                            sourceMap:true,
                            outputStyle : 'compact'
                        }
                    },{
                        loader: "less-loader"
                    }]
                })
            },{
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader : 'css-loader?importLoaders=1',
                        options: {
                            sourceMap:true
                        }
                    },{
                        loader : 'postcss-loader',
                        options: {
                            sourceMap:true,
                            plugins: [require('autoprefixer')({})]
                        }
                    },{
                        loader: "less-loader"
                    }]
                })
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'],{
            root: path.resolve(__dirname, '../'),
            verbose: true,
            dry: false
        }),
        new extractTextPlugin('css/[name].[hash].css'),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new htmlWebpackPlugin({
            template: './template/index.html',
            filename: 'index.html',
            minify: {
                "removeAttributeQuotes": true,
                "removeComments": true,
                "removeEmptyAttributes": true,
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true,
                warnings: false,  
                drop_debugger: true,  
                drop_console: true 
            },
            comments: false
        })
    ]
})