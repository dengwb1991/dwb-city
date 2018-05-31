'use strict'

const path = require('path')

module.exports = {
  dev: {
    cacheBusting: true,
    cssSourceMap: true,
    assetsSubDirectory: 'static',
    host: 'localhost',
    port: 8088
  },
  build: {
    productionSourceMap: true,
    assetsSubDirectory: 'static'
  }
}