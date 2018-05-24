const webpack = require('webpack')
const path = require('path')
const webpackDevServer = require('webpack-dev-server')
const webpackDev = require('../build/webpack.dev')
const httpProxyMiddleware = require('http-proxy-middleware')
const openBrowser = require('react-dev-utils/openBrowser')
const compile = webpack(webpackDev)

const port = 3000

const url = 'http://localhost:' + port

const devServer = new webpackDevServer(compile, {
    historyApiFallback: true,
    hot: true,
    stats: { colors: true },
    inline: true
})

httpProxyMiddleware({
    target: url, 
    changeOrigin: true,
    ws: true,
})

devServer.listen(port, function(err, stats){
    if(err) throw err
    if (openBrowser(url)) {
        console.log('The browser tab has been opened!');
    }
})


