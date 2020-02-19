/*

1.暴露jest默认配置：npx jest --init

2.生成代码测试覆盖率的报告：
npx jest --coverage
或者给scripts配置："coverage": "jest --coverage"

3.node环境运行jest支持CommonJS，不支持ESmodule，需要babel转化
 npm i @babel/core @babel/preset-env -D
jest集成了babel-jest会看有没有装babel-core，装了就去找.babelrc走配置


*/