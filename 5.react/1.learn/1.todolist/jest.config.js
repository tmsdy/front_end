module.exports = {
    "collectCoverageFrom": [
        "src/**/*.{js,jsx,ts,tsx}",
        "!src/**/*.d.ts"
    ],
    "resolver": "jest-pnp-resolver",
    "setupFiles": [
        "react-app-polyfill/jsdom"
    ],
    // "setupFilesAfterEnv": [
    //     "./node_modules/jest-enzyme/lib/index.js"
    // ],
    "setupFilesAfterEnv": ["jest-enzyme"],
    "testEnvironment": "enzyme",
    "testMatch": [
        "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
        "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}"
    ],
    // "testEnvironment": "jsdom",
    "testURL": "http://localhost",
    "transform": {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
        "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
        "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
    },
    "transformIgnorePatterns": [
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
