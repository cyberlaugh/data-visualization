'use strict'
const path = require('path')
// const express = require('express')
// const app = express()

// var mock = require('./data/house-price-area2')  //本地json文件数据
// console.log('mock',mock)
// var apiRoutes = express.Router();
// app.use('/api', apiRoutes)
// function resolve(dir) {
//   return path.resolve(__dirname, './'+ dir)
// }
// module.exports = {
//   configureWebpack: {
//     module: {
//       rules: [
//         {
//           test: /\.svg$/,
//           loader: 'svg-sprite-loader',
//           include: [resolve('src/assets/icons')],
//           options: {
//             symbolId: 'icon-[name]'
//           }
//         },
//         {
//           test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
//           loader: 'url-loader',
//           exclude: [resolve('src/assets/icons')],
//           options: {
//             limit: 10000
//           }
//         }
//       ]
//     }
//   }
// }

module.exports = {
  // devServer: {
  //   before(app) {
  //       app.get('/api/mock', (req, res) => {
  //           res.json({
  //               errno: 0,   // 这里是你的json内容
  //               data: mock
  //           })
  //       })
  //     },
  //     open: true,
  //     host: '0.0.0.0',
  //     port: 8080,
  //     https: false,
  //     hotOnly: false,
  //     proxy: null      //设置跨域，即将本文件内任何没有匹配到的静态文件，都指向跨域地址
  // },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include
      .add(path.resolve(__dirname, './src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .tap(options => {
          // 修改它的选项...
          options = {symbolId : 'icon-[name]'}
          return options
        })
  }
}
