let babelrc2 = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": 2,
                "targets": {
                    "browsers": [
                        "> 1%",
                        "last 2 versions",
                        "not ie <= 8"
                    ]
                }
            }
        ]
    ],
    "plugins": [
        "dynamic-import-webpack",
        "@babel/plugin-proposal-object-rest-spread",
        "transform-vue-jsx"
    ]
}