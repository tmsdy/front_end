/**
 * Created by liuzhimeng.
 * @date 2018-12-03
 * @description
 */

import Dialog from "Components/dialog"

export const ruleListRender = (list) => {
  let content = ''
  for (const t of list) {
    content += (`
      <li class="rule-item layout-group label-w28">
        <span class="layout-label"><i class="rule-dot"></i></span>${t}
      </li>
  `)
  }
  $('#ruleList').append(content)
}

export const ruleDialog = new Dialog({
  id: 'ruleDialog',
  removeHeader: true,
  content: (`
      <div class="bid-dialog">
          <i class="rule-title"></i>
          <ul id="ruleList" class="rule-list"></ul>
      </div>
  `),
  buttons: [{
    className: 'reminder-button',
    onClick(item, key, $button) {
      $button.close()
    }
  }],
})
