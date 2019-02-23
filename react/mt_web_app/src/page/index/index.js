import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-rudux' //为什么报错找不到这个

import store from './store.js'
import Main from './Main/Main.jsx'

ReactDom.render(
  // <Provider store={store}>
    <Main></Main>,
  // </Provider>,
  document.getElementById('root')
)