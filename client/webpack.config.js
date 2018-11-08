const path = require('path');

const CompressionPlugin = require('compression-webpack-plugin'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      MiniCssExtractPlugin = require('mini-css-extract-plugin'),
      processenv = require('processenv'),
      webpack = require('webpack');

const nodeEnv = processenv('NODE_ENV');

const paths = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
};

const getPluginsFor = function (environment) {
  switch (environment) {
    case 'production':
      return [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new CompressionPlugin(),
        new MiniCssExtractPlugin({ filename: 'style.css' }),
        new HtmlWebpackPlugin({
          template: path.join(paths.src, 'index.ejs'),
          nodeEnv,
          minify: {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true
          }
        })
      ];
    default:
      return [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
          template: path.join(paths.src, 'index.ejs'),
          nodeEnv
        })
      ];
  }
};

const configuration = {
  devtool: nodeEnv !== 'production' ? 'cheap-module-source-map' : undefined,
  context: paths.src,
  entry: './index.jsx',
  output: {
    path: paths.build,
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          { loader: 'babel-loader' }
        ]
      },
      {
        test: /\.css$/,
        use: [
          nodeEnv === 'production' ?
            MiniCssExtractPlugin.loader :
            'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: 'wk-[local]--[hash:base64:5]'
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          { loader: 'file-loader', options: { name: '[name].[ext]' }}
        ]
      },
      {
        test: /\.(svg|jpe?g|png|gif|ico)$/i,
        use: [
          { loader: 'file-loader' }
        ]
      },
      {
        test: /\.(wav)$/i,
        use: [
          { loader: 'file-loader' }
        ]
      }
    ]
  },
  plugins: getPluginsFor(nodeEnv),
  devServer: {
    contentBase: paths.src,
    host: 'local.wolkenkit.io',
    port: 8080
  }
};

module.exports = configuration;
