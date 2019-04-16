const webpack = require('webpack');
const merge = require('webpack-merge');
const defaultConfig = require('./default.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = require('../../config');

const prodConfig = merge.smart(defaultConfig, {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: false,     // 生产环境devtools如果开启sourceMap，则UglifyJsPlugin的此项必须为true
        uglifyOptions: {
          compress: {
            unused: true,
            drop_console: true,
            drop_debugger: true,
            dead_code: true,
            collapse_vars: true,
            reduce_vars: true,
          },
          output: {
            comments: false,
          },
          mangle: false,
          warnings: false,
        },
      }),

      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          discardComments: {
            removeAll: true
          }
        },
        canPrint: true,
      })
    ]
  }
});

module.exports = merge(prodConfig, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.test.env,
      'TEST': JSON.stringify(true),
    }),

    new CopyWebpackPlugin([
      {from: 'src/res', to: 'res'},
    ]),
  ],
})
