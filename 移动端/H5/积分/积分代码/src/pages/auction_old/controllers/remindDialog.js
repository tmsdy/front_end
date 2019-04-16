/**
 * Created by liuzhimeng.
 * @date 2018/8/29
 * @description
 */

import Dialog from "Components/dialog"
import {
  setLocalStorage,
  getUserId,
} from "Common/utils"

// 缓存成功提醒弹窗是否打开
export const LOCAL_REMINDER_NAME = `reminedMeOnbid_${getUserId()}`

export const reminedDialog = new Dialog({
  removeHeader: true,
  removeDefaultOptions: ['close'],
  content: (
    `<div class="dialog-reminder">
        <div class="reminder-title">提醒</div>
        <div data-reminder-content class="reminder-content">抢拍过程中请保证积分充足<br/>否则视为放弃本轮抢拍哦</div>
        <div class="reminder-operate"><input data-dialog-remider type="checkbox">下次不再提醒</div>
    </div>`
  ),
  buttons: [{
    text: '我知道了',
    className: 'btn-primary w420',
    onClick: () => {
      reminedDialog.close()
    }
  }],
  afterOpen() {
    // 重置复选框
    $('input').iCheck({
      checkboxClass: 'icheckCheckbox',
      insert: '<span class="icheckCheckbox-inner"></span>'
    })
    $('input').iCheck('check')
    setLocalStorage(LOCAL_REMINDER_NAME, 1)

    // 本地缓存提示框状态
    const $input = $('*[data-dialog-remider]')
    $input.on('ifChecked', () => {
      setLocalStorage(LOCAL_REMINDER_NAME, 1)
    })
    $input.on('ifUnchecked', () => {
      setLocalStorage(LOCAL_REMINDER_NAME, 0)
    })
  },
})
