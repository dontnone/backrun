const path = require('path')
const webpack = require('webpack')
const ora = require('ora')
const webpackProd = require('../build/webpack.prod')

const spinner = ora('Start Build --')

spinner.start()

webpack(webpackProd, function(err, stats){
    spinner.stop()
    if(err) throw err
})
