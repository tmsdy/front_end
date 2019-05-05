
// 问答某个回答的信息发生变化，乐园和列表都需要通知刷新
/**
 * 点赞 回答会触发action
 * 乐园页面问答入口，问答列表，问答详情会接收 reducer
 *  */
import {
  CHANGE_QUESTION_ANSWERITEM
} from '../constants/actionTypes'

export default function answerItemDetail(state = {updateQid: 0, updateTime: Date.now()}, action) {
  if(CHANGE_QUESTION_ANSWERITEM === action.type) {
      return {
        updateQid: action.updateQid,
        updateTime: Date.now(),
      }
  }
  return state
}
