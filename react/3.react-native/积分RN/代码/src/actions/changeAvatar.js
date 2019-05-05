import {
    CHANGE_USER_AVATAR
} from '../constants/actionTypes'

// 用户头像配饰的变化
export function changeAvatar(dress, avatar) {
    return {
        type: CHANGE_USER_AVATAR,
        dress, // 配饰名称
        avatar, // 配饰图片地址
    }
}
