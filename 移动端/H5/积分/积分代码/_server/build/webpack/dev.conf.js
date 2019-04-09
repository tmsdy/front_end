const webpack = require('webpack');
const merge = require('webpack-merge');
const defaultConfig = require('./default.conf');
const SourceMapDevToolPlugin = require('webpack').SourceMapDevToolPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(defaultConfig, {
  mode: 'development',
  watch: true,
  plugins: [
    // new BundleAnalyzerPlugin(),  // 打包分析

    new webpack.DefinePlugin({
      'DEVELOPMENT': JSON.stringify(true),
    }),

    new SourceMapDevToolPlugin({
      module: true,
      columns: true,
      filename: '[file].map',
      exclude: ['manifest.js', 'vendor.js'],
    })
  ],
});
