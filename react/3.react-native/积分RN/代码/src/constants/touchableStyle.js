/**
 * Created by liuzhimeng.
 * @date 2018/8/31
 * @description
 */

export const TOUCH_NONE = {
  activeOpacity: 1,
  underlayColor: 'transparent',
}

// #000000 5% 覆盖
export const TOUCH_LIGHT_MASK = {
  activeOpacity: 1,
  underlayColor: 'rgba(0, 0, 0, .05)',
}

// #000000 10% 覆盖
export const TOUCH_COLORFUL_MASK = {
  activeOpacity: 0.9,
  underlayColor: '#000000',
}

// 模拟 #ffffff 5% 覆盖
export const TOUCH_CIRCLE_MASK = {
  activeOpacity: 0.26,
  underlayColor: 'rgba(255, 255, 255, .2)',
}

// 30% opacity
export const TOUCH_TEXT_ACTIVE = {
  activeOpacity: 0.3,
  underlayColor: 'transparent',
}
