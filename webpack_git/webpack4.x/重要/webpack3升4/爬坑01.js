
// 1.extractTextPlugin 转 miniCssExtractPlugin
const rules = [
  {
    test: /\.css$/,
    // use: extractTextPlugin.extract({
    //     fallback: 'style-loader',
    //     use: [
    //         {
    //             loader: 'css-loader',
    //             options: {
    //                 url: false
    //             }
    //         }
    //     ]
    // })
    use: [
        miniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: {
                url: false
            }
        }
    ]
  }
]
// 2. vue-loader处理：https://vue-loader.vuejs.org/zh/guide/#vue-cli