const path = require('path')
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: './app/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader'
      }
    ]
  },
  devtool: "cheap-module-source-map",
  target: "web",
  devServer: {
    contentBase: path.join(__dirname, "app"),
    host: "127.0.0.1",
    port: 9027, // 默认9090
    inline: true, // 可以监控js变化
    hot: true // 热启动
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './app/main.hbs',
      filename: 'index.html',
      hash: true //打版本戳
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
}