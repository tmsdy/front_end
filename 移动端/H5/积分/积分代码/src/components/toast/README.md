### Toast 文档
============
#### 配置 {object}
```javascript
const options = {
    //（可选）组件id，只支持绑定在组件最外层div上
    id: '',
    
    //（可选）选择toast类型，默认为纯文本，可选值：text（纯文本）, loading（加载中），success（成功），fail（失败）
    type: 'text',
    
    //（可选）设置toast持续时长，单位 s，默认为 1s，当设为 0 时，则一直显示
    time: 1,
    
    //（可选）组件内容，默认为 '显示内容',
    content: '内容',
    
    // 页面加载态 默认值为 false，可选值为 {boolean}/{object}，值为 true 则加载默认配置
    pageLoading: {
        wrapper: 'body',            // 加载区域
        height: '100%',             // 加载态高度
        iconName: 'loading-small',  // loading icon
        content: '内容即将呈现…',     // loading text
        maskColor: '#ffffff',       // mask background color
    },
    
    /**
    * 显示toast，显示前触发beforeOpen，若beforeOpen返回false则取消显示toast
    * @param options 可更新options配置
    */
    show: (options = {}) => {
      //...
    },
    
    // 隐藏toast，未销毁toast实例，隐藏后触发afterOpen
    hide: () => {
      //...
    },
    
    // 销毁toast
    destroy: () => {
      //...
    },
    
    // toast显示前事件，返回false则不会触发打开操作
    beforeOpen: () => {
      //...
      return true
    },

    // 弹窗关闭后事件
    afterClose: () => {
      //...
    }
}
```

#### 调用方法 {function}
============
```javascript
// 调用方法
const toast = new Toast(options)

// 获取当前实例DOM
toast.getComponent()

// 获取当前实例内的 data-toast-name DOM
toast.getComponentChild()

// 显示toast（支持链式操作）
toast.show()

// 隐藏toast（支持链式操作）
toast.hide()

// 销毁toast
toast.destroy()
```
