const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/index.tsx',
  mode: 'production',
  devtool: process.NODE_ENV === 'development' ? 'eval-source-map' : false,
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'public'),
  },
  
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.jsx' ],
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve('crypto-browserify'),
      "os": require.resolve("os-browserify/browser"),
    } 
  },
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 500,
    ignored: ["bundle/**", "public/**", "node_modules/**", "**/*.test.*"]
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          // '@teamsupercell/typings-for-css-modules-loader', 
          { loader: 'css-loader', options: {
            modules: {
              localIdentName: '[local]--[hash:base64:5]'
            },
          } },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: (c) => /node_modules|test./.test(c),
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          }
        ],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        test: /\.js$/,
        enforce: 'pre',
        use: [{
          loader: 'source-map-loader',
          options: {
            filterSourceMappingUrl: (url, resourcePath) => /.*\/node_modules\/.*/.test(resourcePath) ? false : true
          }
        }]
      },
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 9000,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "bundle", to: "", filter: (resPath) => resPath.indexOf('index.template.html') === -1 },
      ],
      options: {
        concurrency: 100,
      },
    }),
    new HtmlWebpackPlugin({
      template : __dirname + '/bundle/index.template.html',
      inject: 'body',
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],

  externals: {
  },
};
