#! /usr/bin/env node
const path = require('path')
const Compiler = require('../lib/Compiler')

const rootPath = process.cwd() // 当前的工作目录
let configPath = path.join(rootPath, 'webpack.config.js')
let config = require(configPath)

let compiler = new Compiler(config)
compiler.hooks.entryOption.call(config) // 触发entryOptions事件，说明解析配置文件完毕
compiler.run()