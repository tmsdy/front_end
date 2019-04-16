import 'Components/toast/index'
import {
  goToUse,
} from "Common/utils"

export function initClipToboard(extMap, goto = true) {
  const clipboard = new ClipboardJS('#copyButton')
  clipboard.on('success', function (e) {
    $.fn.toast({
      content: '复制成功',
      afterClose() {
        if (goto) {
          goToUse(extMap)
        }
      }
    })
    e.clearSelection()
  })
  clipboard.on('error', function (e) {
    $.fn.toast({content: '复制失败，请重新操作'})
  })
  return clipboard
}
