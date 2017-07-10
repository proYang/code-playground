const path = require('path')
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ENV = process.env.NODE_ENV

let config = {
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
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  resolve: {
    alias: {
      mock: path.resolve(__dirname, './mock/'),
    }
  },
  devtool: "",
  target: "web",
  devServer: {
    proxy: {
      '/graphql': {
        target: 'http://127.0.0.1:8000'
      }
    },
    contentBase: path.join(__dirname, "app"),
    host: "127.0.0.1",
    port: 9090, // 默认9090
    inline: true, // 可以监控js变化
    hot: true // 热启动
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    }),
    new HtmlWebpackPlugin({
      template: './app/main.hbs',
      filename: 'index.html',
      hash: true //打版本戳
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.IgnorePlugin(new RegExp("mock"))
  ]
}

if (ENV == 'production') {
  config.devtool = 'hidden-source-map'
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }))
}
else if (ENV == 'development') {
  config.devtool = 'cheap-module-source-map'
}

module.exports = config