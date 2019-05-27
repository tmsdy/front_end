import Vue from 'vue'
import * as config from './config'
import api from './api'
import fileUpload from './fileUpload'
/**
 * 全局配置
 */
Vue.prototype.Global = Object.assign(config, {
  'api': api,
  'fileUpload': fileUpload,
  'IP': IP
})
