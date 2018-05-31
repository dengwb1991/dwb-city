const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const config = require('../config');

module.exports = merge(common, {
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
