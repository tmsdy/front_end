/**
 * Created by liuzhimeng.
 * @date 2018/8/29
 * @description
 */

import Dialog from "Components/dialog"
import {setLocalStorage, getUserId} from "Common/utils"

// 缓存成功提醒弹窗是否打开
export const LOCAL_REMINDER_NAME = `reminedMeOnbid_${getUserId()}`

export const reminedDialog = new Dialog({
  id: 'reminderDialog',
  removeHeader: true,
  removeDefaultOptions: ['close'],
  content: (`
      <div class="bid-dialog">
          <i class="reminder-title"></i>
          <p data-reminder-content class="reminder-content">抢拍过程中请保证积分充足<br/>否则视为放弃本轮抢拍哦</p>
          <span class="reminder-operate">
              <input data-dialog-remider type="checkbox">
              <span class="reminder-text">下次不再提醒</span>
          </span>
      </div>
  `),
  buttons: [{
    className: 'reminder-button',
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
