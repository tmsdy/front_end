
/**
 * Created by liuzhimeng.
 * @date 2019-04-06
 * @description 养花公共方法
 */

import {findNodeHandle} from 'react-native'
import {filterExts} from '../../common/util'

export const showModalTaskBubble = async ({refModal, targetTaskList, index, tip}) => {
  if(tip) {
    const _refTaskList = await targetTaskList.getInstance()
    const refItemIcon = await _refTaskList.getItemIconRefAsync(index)
    if(refItemIcon) {
      const refHalfScreen = await refModal.getInstance()
      const itemIconNode = await refItemIcon.getInstance()
      refHalfScreen.showTipBubble({
        target: findNodeHandle(itemIconNode),
        tip,
        tipColor: 'black',
        duration: 3000,
        opacityAnimConfig: {from: 0, to: 1, duration: 300, loop: true},
      })
    }
  }
}

export const getTaskItemOptions = (task) => {
  const {icon: image, channelName: title, exts = []} = task
  const tip = filterExts(exts, 'notes')
  const iconName = tip ? 'flower/icon-question' : ''
  return {task, image, title, iconName, tip}
}
