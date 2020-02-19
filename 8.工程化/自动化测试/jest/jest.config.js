module.exports = {
  moduleFileExtensions: [// 引入模块后缀的自动查找
    'js',
    'jsx',
    'json',
    'vue'
  ],
  transform: {
    // 引入vue文件时帮助转换vue文件
    '^.+\\.vue$': 'vue-jest',
    // 遇到静态资源把转成字符串，因为不用对样式做测试
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    // 解析jsx
    '^.+\\.jsx?$': 'babel-jest'
  },
  // 那些文件夹下的文件不需要转化
  transformIgnorePatterns: [
    '/node_modules/'
  ],
  // 对别名目录的查找
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // 对vue组件做snapshot测试做快照格式化
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  // 跑测试会找__tests__找匹配的文件来测试
  testMatch: [
    '**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  testPathIgnorePatterns: [
    // eslint-disable-next-line no-useless-escape
    '\.eslintrc\.js'
  ],
  testURL: 'http://localhost/',
  // watchPlugins: [ // 方便运行各种测试文件
  //   'jest-watch-typeahead/filename',
  //   'jest-watch-typeahead/testname'
  // ]
}
