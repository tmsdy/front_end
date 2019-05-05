const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve("dist"),
    filename: "bundle.js"
  },
  // 配置查找loader的目录
  resolveLoader: {
    modules: ["node_modules", path.resolve(__dirname, "src", "loaders")]
  },
  module:{
    rules:[
      {
        test: /\.js$/,
        use: {
            loader:'log-loader',
            options:{
                content:'===============loading=================='
            }
        }
      },
      {
        test: /\.less$/,
        use: ["style-loader", "less-loader"]
      }
    ]
  }
};
