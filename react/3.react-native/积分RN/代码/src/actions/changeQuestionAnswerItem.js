import {
  CHANGE_QUESTION_ANSWERITEM
} from '../constants/actionTypes'

// 用户头像配饰的变化
export function changeAnswerItem({updateQid}) {
  return {
      type: CHANGE_QUESTION_ANSWERITEM,
      updateQid // 回答的问题id
  }
}
