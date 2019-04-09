### Dialog 文档
============
#### 配置 {object}
```javascript
const options = {
    //（可选）组件id，只支持绑定在组件最外层div上
    id: '',
    
    //（可选）自定义组件class，只支持绑定在组件最外层div上
    className: '',
    
    //（可选）自定义组件style，只支持绑定在组件最外层div上
    styleObj: '',
    
    //（可选）组件标题，默认为 '标题',
    // 支持三种写法：
    // 普通字符串；
    // 以'#'、'.'开头的字符串，组件会自动匹配id或class查找dom，找不到则以字符串显示；
    // jQuery调用方法
    title: '标题',
    
    //（可选）组件内容，默认为 '内容',
    // 支持三种写法：
    // 普通字符串；
    // 以'#'、'.'开头的字符串，组件会自动匹配id或class查找dom，找不到则以字符串显示；
    // jQuery调用方法
    content: '内容',
    
    //（可选）dialog可携带数据,
    data: {},
    
    // 是否注销取消按钮的默认关闭事件
    offDefaultCancel: false,
    
    // 是否移除头部
    removeHeader: false,
    
    // 关闭按钮样式，提供两种，默认为dialog-close（dialog-close、dialog-bottom-close）
    closeClass: '',
    
    // 是否移除默认操作，
    // 'all'：（string）移除所有；
    // ['close', 'confirm', 'cancel']：（array）移除关闭图标\移除默认的确定按钮\移除默认的取消按钮；
    removeDefaultOptions: false,
    
    //自定义按钮，
    // 'id'：按钮id，
    // 'className'：按钮样式，
    // 'attrs'：按钮自定义属性，
    // 'text'：按钮文字，
    // 'click'：按钮事件, @param: value：按钮value，key：按钮key，$this: 当前按钮DOM，$dialog：当前弹窗实例
    buttons: [
      {
        id: '',
        className: '',
        attrs: {},
        text: '',
        clickable: false,
        onClick: (value, key, $this, $dialog) => {},
      }
    ],
    
    // 自定义默认按钮文字(可选）
    defaultBtnTextObj: {
      'confirm': '确定',
      'cancel': '取消'
    },
    
    //是否居中，目前只支持header 和footer，默认为true（可选）
    isCenterObj: {
      'header': true,
      'footer': true
    },
    
    // 确认事件触发前事件，返回false则不会触发确认事件
    beforeConfirm: () => {
      //...
      return true
    },
    
    // 取消事件触发前事件，返回false则不会触发取消操作
    beforeCancel: () => {
      //...
      return true
    },
    
    // 弹窗打开前事件，返回false则不会触发打开操作
    beforeOpen: () => {
      //...
      return true
    },
    
    // 弹窗打开后事件
    afterOpen: () => {
      //...
    },
    
    // 弹窗关闭前事件，返回false则不会触发关闭操作
    beforeClose: () => {
      //...
      return true
    },
    
    // 弹窗关闭后事件
    afterClose: () => {
      //...
    }
}

// （可选）点击默认确认按钮回调
const confirm = () => {}

// （可选）点击默认取消按钮回调
const cancel = () => {}
```

#### 调用方法 {function}
============
```javascript
// 调用方法
const dialog = new Dialog(options, () => {}, () => {})

// 获取当前弹窗实例DOM
dialog.getComponent()

// 获取当前弹窗实例内的 data-dialog-name DOM
dialog.getComponentChild()

// 获取弹窗存储的数据（this.options.data）
dialog.getData()

// 更新弹窗存储的数据（this.options.data）
dialog.updateData(data)

// 更新dialog配置，更新会清空原来的内容和按钮（目前只包含buttons和content）
dialog.updateOptions({buttons, content})

// 打开dialog默认窗（支持链式操作）
dialog.open()

// 打开dialog提示框（无底部操作按钮）（支持链式操作）
dialog.openPrompt()

// 关闭dialog窗口（支持链式操作）
dialog.close()

// 移除dialog窗口（删除dom，绑定的事件也会一并删除）（支持链式操作）
dialog.destroy()

// 默认成功提示（支持链式操作）
dialog.success()

// 弹框底部是否显示：'hide' 或者 'show'，默认为隐藏（支持链式操作）
dialog.handleFooter('hide')

//绑定打开dialog窗口的点击事件（支持链式操作）
// @param
// selector（string）：默认采用jQuery方法调用；
// type：打开窗口类型，默认为dialog默认窗
dialog.bindOpen({
    selector: null,
    type: 'default',
})
```
