import {CHANGE_AVAILABLE_SCORE} from '../constants/actionTypes'

// 用户头像配饰的变化
export function changeAvailableScore(availableScore, time) {
    return {
        type: CHANGE_AVAILABLE_SCORE,
        availableScore,
        time,
    }
}
