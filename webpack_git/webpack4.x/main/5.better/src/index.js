import jq from 'jquery'
import moment from 'moment'
import React from 'react'
import {render} from 'react-dom'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')// 设置语言
let r = moment().endOf('day').fromNow()
console.log(r)

render(<h1>jsx</h1>,window.root)



