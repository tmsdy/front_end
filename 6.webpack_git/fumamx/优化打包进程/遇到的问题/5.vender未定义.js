
/*


2. HtmlWebpackPlugin，AddAssetHtmlPlugin要按顺序放
new HtmlWebpackPlugin() ,
new AddAssetHtmlPlugin({ //给生成的html加入script引用venders.dll.js
    filepath: path.resolve(__dirname, './dll/venders.dll.js')
}),

*/