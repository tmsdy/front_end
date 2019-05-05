
// 同步话题PK待领取积分数
import {
    CHANGE_AVAILABLE_SCORE
}  from '../constants/actionTypes'

export default function getTotalScore(state = { availableScore: 0, time: Date.now()}, action) {
    if (CHANGE_AVAILABLE_SCORE === action.type) {
        return {
            availableScore: parseInt(action.availableScore),
            time: Date.now(),
        }
    }
    return state
}
