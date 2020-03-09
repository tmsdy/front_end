module.exports = {
    "collectCoverageFrom": [ // 代码覆盖率是根据哪些文件的生成的
        "src/**/*.{js,jsx,ts,tsx}", // 统计这些文件
        "!src/**/*.d.ts" // 不去统计这些文件
    ],
    "resolver": "jest-pnp-resolver",
    "setupFiles": [ // 运行测试之前需要额外准备的东西
        "react-app-polyfill/jsdom"
    ],
    "setupFilesAfterEnv": ['./node_modules/jest-enzyme/lib/index.js'],
    "testMatch": [ // 匹配上了就当作测试文件执行
        "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
        "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}"
    ],
    "testEnvironment": "jsdom",
    "testURL": "http://localhost",
    "transform": { // 引入的文件会被相关工具转换
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
        "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
        "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
    },
    "transformIgnorePatterns": [ // 配置忽略转换的文件
        "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
        "^.+\\.module\\.(css|sass|scss)$"
    ],
    "moduleNameMapper": {
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy" // 对引入的样式简化
    },
    "moduleFileExtensions": [ // 省略后缀写法的查找规则
        "js",
        "ts",
        "tsx",
        "json",
        "jsx",
    ],
    "watchPlugins": [ // 插件功能扩展
        "/Users/fei_han/Desktop/learn/front_end/5.react/1.learn/1.todolist/node_modules/jest-watch-typeahead/filename.js",
        "/Users/fei_han/Desktop/learn/front_end/5.react/1.learn/1.todolist/node_modules/jest-watch-typeahead/testname.js"
    ]
}
