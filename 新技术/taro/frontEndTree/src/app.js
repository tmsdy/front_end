import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/my/my',
      'pages/videoDetail/videoDetail',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    "tabBar": {
      "selectedColor": "#16E124",
      "borderStyle": "white",
      "backgroundColor": "#F5F5F5",
      "list": [
        {
          "pagePath": "pages/index/index",
          "text": "精选视频",
          "iconPath": "./assets/images/video_normal.png",
          "selectedIconPath": "./assets/images/video_active.png"
        },
        {
          "pagePath": "pages/my/my",
          "text": "我的",
          "iconPath": "./assets/images/my_normal.png",
          "selectedIconPath": "./assets/images/my_active.png"
        }
      ]
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
