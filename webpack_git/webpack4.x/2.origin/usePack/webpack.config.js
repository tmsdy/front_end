const path = require('path')
const entryOptionPlugin = require('./plugins/entry-option-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve('dist'),
        filename: 'bundle.js'
    },
    resolveLoader: {
        modules: './loaders'
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                loader: ['style-loader', 'less-loader']
            }
        ]
    },
    plugins: [
        new entryOptionPlugin()
    ]

}