import {isLikeX} from '@iqiyi/rn-utils'

/**
 * Created by liuzhimeng.
 * @date 2018/10/24
 * @description
 */

const NAV_BAR_HEIGHT_IOSX = 95
const NAV_BAR_HEIGHT_ANDROID = 65
const NAV_BAR_HEIGHT = isLikeX() ? NAV_BAR_HEIGHT_IOSX : NAV_BAR_HEIGHT_ANDROID

// 顶部容器高度
export const TOP_CONTAINER_HEIGHT = 133 + NAV_BAR_HEIGHT
// 勋章数量容器宽度
export const MEDAL_COUNT_WIDTH = 58
// 用户头像尺寸
export const USER_PROTRAIT_SIZE = 60
