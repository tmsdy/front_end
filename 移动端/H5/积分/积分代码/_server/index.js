import fs from 'fs'
import express from 'express'
import compression from 'compression'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import shareRoot from './middleware/shareRoot'
import wrapRender from './middleware/wrapRender'
import pkg from '../package'
import config from '../server.config'
import routes from '../routes'

const app = express()

export default app

app.use(shareRoot(config.basename))
app.use(helmet())
app.use(compression())

// view engine setup
app.set('views', path.join(__dirname, '../routes'))
app.set('view engine', 'ejs');

app.use(
  wrapRender({
    defaults: config
  })
)

app.use(logger('dev'))
app.use(bodyParser.json({
  limit: '10MB'
}))
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(cookieParser())

// shareRoot 中间件把 config.basename 裁剪了，所以这里也裁剪一下才可以匹配成功
let staticPublicPath = config.publicPath.replace(config.basename, '');
if (process.env.NODE_ENV === 'development') {
  // 开发模式用 webpack-dev-middleware 代理 js 文件
  var setupDevEnv = require('./build/setup-dev-env');
  app.use(setupDevEnv.setupClient(staticPublicPath));
  // 把静态资源表放到 req.stats 里
  app.use((req, res, next) => {
    res.locals.getStatic = getStatic(getAssets(res.locals.webpackStats.toJson().assetsByChunkName))
    next();
  });

  // 开发模式里，用 src 里的静态资源
  console.log('staticPublicPath', staticPublicPath)
  app.use(staticPublicPath, express.static(path.join(__dirname, '../src')));
} else {
  app.use(staticPublicPath, express.static(config.staticPath));
  var stats = require('../dest/stats');

  // 把静态资源表放到 req.stats 里
  app.use((req, res, next) => {
    res.locals.getStatic = getStatic(stats)
    next();
  });
}

app.use('/mock', (req, res, next) => {
  let {
    url: target
  } = req
  let filePath = path.join(__dirname, '../src', `${target}.json`)
  try {
    let data = fs.readFileSync(filePath, 'utf-8').toString()
    res.send(data)
  } catch (error) {
    next(error)
  }
})

if (routes) {
  Object.keys(routes).forEach(key => {
    routes[key](app, key)
  })
}

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     res.statusCode = 404
//     res.redirect('http://www.iqiyi.com/error')
// })


// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
  app.use(function (err, req, res, next) {
    var message = (err.message + '\n' + err.stack)
      .split('\n')
      .map(item => `<p style="margin:0;padding:0">${item}</p>`)
      .join('')
    res.send(message).status(err.status || 500)
  })
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    if (err) {
      console.error(`[]`)
      console.error('originalUrl:', req.originalUrl)
      res.json(err.message).status(err.status || 500)
    } else {
      next()
    }
  })
}

//var otherStats = {};
//if (process.env.NODE_ENV != 'development' && process.env.BUILD != '1') {
//otherStats = require('../dest/other.stats');
//}

function getStatic(assets) {
  //assets = Object.assign(assets, otherStats);
  return function (path) {
    let asset = path;
    if (process.env.NODE_ENV !== 'development') {
      if (/\.css$/.test(path)) {
        let name = path.replace('.css', '');
        !!assets[name] && (asset = Array.isArray(assets[name]) ? assets[name][0] : assets[name]);
      } else {
        let name = path.replace('.js', '');
        !!assets[name] && (asset = Array.isArray(assets[name]) ? assets[name][1] : assets[name]);
      }
    }
    return config.publicPath + '/' + asset;
  }
}

function getAssets(stats) {
  return Object.keys(stats).reduce((result, assetName) => {
    let value = stats[assetName]
    result[assetName] = Array.isArray(value) ? value[0] : value
    return result
  }, {})
}
