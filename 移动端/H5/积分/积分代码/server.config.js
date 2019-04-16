const path = require('path')
const pkg = require('./package')

const port = process.env.NODE_PORT || pkg.config.port || 3000
const basename = pkg.config.vd

const development = {
  port: port,
  publicPath: basename + '/static',
  staticPath: path.join(__dirname, 'src'),
}

const fat = {
  port: port,
  publicPath: basename + '/dest',
  staticPath: path.join(__dirname, 'dest'),
}

const production = {
  port: port,
  publicPath: '//statics-web.iqiyi.com/h5/integralh5',
  staticPath: path.join(__dirname, 'dest'),
}

const env = process.env.NODE_ENV || pkg.config.env.toLowerCase()
const envConfigMap = { development, fat, production }
const envConfig = envConfigMap[env] || envConfigMap.production

const config = Object.assign({
  appName: basename.substring(1),
  instances: 4,
  maxMemory: '1024M',
  errorLog: 'error.log',
  normalLog: 'info.log',
  logDateFormat: 'YYYY-MM-DD HH:mm:ss',
  env: env,
  title: '',
  description: '',
  keywords: '',
  basename: basename,
}, envConfig)

module.exports = config;
