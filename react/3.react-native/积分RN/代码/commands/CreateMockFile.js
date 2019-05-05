const fs = require('fs'),
  path = require('path'),
  cp = require('child_process'),
  colors = require('colors'),
  {Util} = require('./Utility'),
  currPath = path.resolve(),
  mockPath = path.join(currPath, 'mocks'),
  author = cp.execSync('git config --get user.name').toString().trim(),
  url = process.argv[2] || '';

const TEMPLATE = `/**
 * 
 * @ref 
 * @origin ${url}
 * Created by ${author} on ${Util.formatDate(Date.now(), 'YYYY/MM/DD')}.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    code: 'A00000',
  },
};
`;

let pathName = url.split('?')[0],
  splits = pathName.split('/'),
  shortPathName = '',
  mockFileName, mockFilePath;

for(let i = splits.length - 1; i >= 0; i--) {
  let pointStr = splits[i];
  if(pointStr && !/^http|\.com$/.test(pointStr) && pointStr.indexOf('.iqiyi') === -1) {
    shortPathName = '_' + splits[i] + shortPathName;
  }
}

if(!shortPathName) {
  console.log('Fail: could not find url parameter'.red + '\n');
  return;
}
shortPathName = shortPathName.substr(1);

mockFileName = shortPathName + '.js';
mockFilePath = path.join(mockPath, mockFileName);

if(fs.existsSync(mockFilePath)) {
  console.log('Fail: file has existed: '.red, mockFileName.grey + '\n');
  return;
}

fs.writeFileSync(mockFilePath, TEMPLATE, 'utf8');
console.log(`Success to create mock file: ${mockFileName}`.cyan + '\n');
