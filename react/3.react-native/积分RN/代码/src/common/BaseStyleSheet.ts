/**
 * 样式工厂基类
 * Created by xushichao on 2017/5/15.
 */
import {StyleSheet, ViewStyle as RNViewStyle, TextStyle as RNTextSTyle, ImageStyle as RNImageStyle} from 'react-native'
import {isIOS, isLikeX} from '@iqiyi/rn-utils'

type RegisteredStyle<T> = number & {__registeredStyleBrand: T};

type ExtendedStyle<T> = {
  [P in keyof T]: any;
}

// eslint-disable-next-line @typescript-eslint/prefer-interface
type ExtraStyle<T> = {
  'ios'?: ExtendedStyle<T>;
  'iosx'?: ExtendedStyle<T>;
  'android'?: ExtendedStyle<T>;
}

export type ElementStyle<T> = ExtendedStyle<T> & ExtraStyle<T>

export type ViewStyle = ExtendedStyle<RNViewStyle>
export type TextStyle = ExtendedStyle<RNTextSTyle>
export type ImageStyle = ExtendedStyle<RNImageStyle>

export default {
  create<T extends StyleSheet.NamedStyles<T>>(
    styles: {[P in keyof T]: ElementStyle<T[P]>}
  ): {[P in keyof T]: RegisteredStyle<T[P]>} {
    // 对不同平台的样式做兼容性处理
    const platformStyles: any = {}

    Object.keys(styles).forEach((name) => {
      let {ios, iosx, android, ...style} = styles[name];

      if(ios && isIOS) {
        style = {...style, ...ios};
        if(isLikeX() && iosx) {
          style = {...style, ...iosx};
        }
      } else if(android && !isIOS) {
        style = {...style, ...android};
      }

      // 默认去除文本上的背景
      if(style.color || style.fontSize) {
        style = {backgroundColor: 'transparent', ...style};
      }

      // 设置默认字体
      if(style.color || style.fontSize) {
        style = {
          fontFamily: isIOS ? 'PingFangSC-Regular' : 'DroidSansFallback',
          ...style,
        };
      }

      platformStyles[name] = style;
    })

    return StyleSheet.create(platformStyles)
  },

  flatten(styles) {
    return StyleSheet.flatten(styles)
  },

  FontWeight: {
    Medium: '500',
    Bold: '700',
  },

  /**
   * Example:
   * ```
   *   {
   *     borderBottomColor: '#bbb',
   *     borderBottomWidth: StyleSheet.hairlineWidth,
   *   }
   * ```
   */
  hairlineWidth: StyleSheet.hairlineWidth,
  /**
   * Example:
   *   const styles = StyleSheet.create({
   *      wrapper: {
   *        ...StyleSheet.absoluteFillObject,
   *        top: 10,
   *        backgroundColor: 'transparent',
   *      },
   *    });
   */
  absoluteFillObject: StyleSheet.absoluteFillObject,

}
