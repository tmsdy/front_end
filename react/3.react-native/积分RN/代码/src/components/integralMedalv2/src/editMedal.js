/**
 * Created by liuzhimeng.
 * @date 2018-12-04
 * @description
 */
import {getMedalPingbackById, sendMainClickPingback, WEAR_MEDAL_BLOCK} from '../pingback'
import {wearMedalOff, wearMedalOn} from '../../../model/integralMedalv2'
import {updateArrayState} from '../../../common/util'
import {showToast} from '../../../common/QYNativeBridge'

const getWearedOptions = (list, medalIds) => {
  const wearedMedalMap = {}
  const emptySlots = []
  let totalWearMedal = 0
  list.forEach(({id, url, bgName}, index) => {
    if (url) {
      wearedMedalMap[id] = {
        wearedIndex: index,
        medalIndex: medalIds.includes(id),
      }
    }
    emptySlots[index] = bgName === 'add' && !url
    if (url || bgName === 'add') {
      ++totalWearMedal
    }
  })
  return {
    wearedMedalMap,
    emptySlots,
    totalWearMedal
  }
}

// 已佩戴列表勋章点击事件
export async function onWearedMedal({id, url}, index, wearedList) {
  let newWearedList = wearedList
  try {
    if (url) {
      sendMainClickPingback(WEAR_MEDAL_BLOCK, getMedalPingbackById(id, 'unwear'))
      // 卸载勋章
      await wearMedalOff(id)
      // 卸载勋章
      newWearedList = updateArrayState(wearedList, index, {
        url: '',
        bgName: 'add',
      })
    }
  } catch (e) {
    showToast('卸载勋章失败，请稍后重试')
  }

  return {wearedList: newWearedList}
}

// 可佩戴勋章点击事件
export async function onWillWearMedal({id, isWeared = false, ...left}, index, wearedList, medalIds) {
  const {wearedMedalMap, emptySlots, totalWearMedal} = getWearedOptions(wearedList, medalIds)
  let newWearedList = wearedList
  let operateSuccess = false
  if (isWeared) {
    try {
      sendMainClickPingback(WEAR_MEDAL_BLOCK, getMedalPingbackById(id, 'unwear'))
      // 卸载勋章
      await wearMedalOff(id)
      const {wearedIndex} = wearedMedalMap[id]
      // 卸载勋章
      newWearedList = updateArrayState(wearedList, wearedIndex, {
        url: '',
        bgName: 'add',
      })
      operateSuccess = true
    } catch (e) {
      showToast('卸载勋章失败，请稍后重试')
    }
  } else {
    sendMainClickPingback(WEAR_MEDAL_BLOCK, getMedalPingbackById(id, 'wear'))
    const emptyIndex = emptySlots.findIndex(isEmpty => isEmpty)
    // 勋章插槽已满
    if (emptyIndex === -1) {
      showToast(`最多可佩戴${totalWearMedal}枚勋章`)
    } else {
      try {
        // 佩戴勋章
        await wearMedalOn(id, emptyIndex)
        newWearedList = updateArrayState(wearedList, emptyIndex, {
          ...left,
          id,
          bgName: 'add',
        })
        operateSuccess = true
      } catch (e) {
        showToast('佩戴勋章失败，请稍后重试')
      }
    }
  }

  return {
    operateSuccess,
    wearedList: newWearedList,
  }
}
