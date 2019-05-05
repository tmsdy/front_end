/**
 * Mock 服务器
 * Created by xushichao on 2017/5/24.
 */
const app = require('express')(),
  cors = require('cors'),
  bodyParser = require('body-parser');
  path = require('path'),
  glob = require('glob'),
  colors = require('colors'),
  _ = require('lodash'),
  mockFileNames = glob.sync(path.join(path.resolve(), 'mocks', '*.js')).map((path) => {
    return path.substr(path.lastIndexOf('/') + 1);
  });

console.log(mockFileNames)

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function process(req, res, next, params, matchedFileName) {
  if(matchedFileName) {
    let {delay, pipe, response} = require(path.join(path.resolve(), 'mocks', matchedFileName)),
      clonedResponse = _.cloneDeep(response || {}),
      result = _.isFunction(pipe) ? pipe(params, clonedResponse) : clonedResponse;

    console.log('Mock Fetch:'.cyan.bold, req.url.grey);

    setTimeout(() => {
      res.header("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(result));
    }, delay || 0);
  } else {
    next();
  }
}

app.all('/mock/openApi/task/execute', (req, res, next) => {
  let params = {...req.params, ...req.query, ...req.body};
  if(params.task_code) {
    let matchedFileName = mockFileNames.find((fileName) => (params.task_code === fileName.replace('.js', '')));
    process(req, res, next, params, matchedFileName);
  } else {
    next();
  }
});

app.all('/mock/*', (req, res, next) => {
  let pathname = req.pathname || req.path,
    params = {...req.params, ...req.query},
    mockStr = pathname.replace(/\//g, '_') + '.js',
    matchedFileName = mockFileNames.find((fileName) => (mockStr.indexOf(fileName) >= 0));
  process(req, res, next, params, matchedFileName);
});

app.all('*', (req, res, next) => {
  res.end(JSON.stringify({code: '-1'}));
});


let server = app.listen(3001, () => {
  console.log('Listening at http://localhost:' + server.address().port);
});
