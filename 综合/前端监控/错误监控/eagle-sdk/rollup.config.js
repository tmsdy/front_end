import babel from 'rollup-plugin-babel'

let isDev = process.env.NODE_ENV === 'develop'

let babelConfig = {
    "presets": [
        [
            'env',{
                "modules": false,
                "target": {
                    "browsers": ["chrome > 40"]
                }
            }
        ]
    ],
    "plugins":[]
}

export default {
    input: 'index.js',
    watch: {
        exclude: 'node_modules/**'
    },
    output: {
        file: isDev ? '../website/client/js/eagle-monitor/bundle.umd.js' : '../dist/bundle.umd.js',
        // file: '../dist/bundle.umd.js',
        name: 'EagleMonitor',
        format: 'umd', //umd模式支持AMD,CMD和window上挂的全局变量
        sourcemap: true
    },
    plugin: [
        babel({
            babelrc: false,
            presets: babelConfig.presets,
            plugins: babelConfig.plugins,
            exclude: 'node_modules/**'
        })
    ]
}