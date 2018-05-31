const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../config');

const configuration = merge(common, {
  // mode: 'development',
  entry: {
    app: './src/main.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    host: config.dev.host,
    port: config.dev.port,
    contentBase: '../dist'
  }
})
configuration.plugins = configuration.plugins.concat([
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true
  })
])


module.exports = configuration
