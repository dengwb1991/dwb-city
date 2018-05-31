const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack')

const config = merge(common, {
  // mode: 'production'
})
config.plugins = config.plugins.concat([
  // Set the production environment
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"'
  })
])

module.exports = config