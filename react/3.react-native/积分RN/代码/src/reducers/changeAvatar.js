
// 同步头像配饰
import {
    CHANGE_USER_AVATAR
}  from '../constants/actionTypes'

export default function getTotalScore(state = { dress: '', avatar: ''}, action) {
    if (CHANGE_USER_AVATAR === action.type) {
        return {
            dress: action.dress,
            avatar: action.avatar,
        }
    }
    return state
}
