/**
 * Created by liuzhimeng.
 * @date 2018/10/17
 * @description 勋章图标
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, TouchableHighlight, TouchableOpacity} from 'react-native'
import {Text, View} from '@iqiyi/rn-ui'
import WebImage from '../WebImage'
import {TEXT_COLOR_GREY, TEXT_COLOR_TITLE} from '../../constants/baseStyles'
import {TOUCH_LIGHT_MASK, TOUCH_NONE} from '../../constants/touchableStyle'
import MdealHotLottie from './MedalHotLottie'

/**
 * 单个勋章
 */
export default class Medal extends Component {
  static propTypes = {
    url: PropTypes.string, // 勋章地址
    bgName: PropTypes.string, // 背景图地址
    size: PropTypes.number, // 勋章大小
    showClickState: PropTypes.bool, // 是否显示点击态
    showEditMode: PropTypes.bool, // 显示佩戴编辑状态
    isWeared: PropTypes.bool, // 是否已佩戴
    showBackground: PropTypes.bool, // 是否带有背景色
    renderSlot: PropTypes.func, // 勋章插槽
    containerStyle: PropTypes.object,
    medalWrapperStyle: PropTypes.object,
  }

  static defaultProps = {
    url: '',
    bgName: '',
    size: 60,
    showClickState: false,
    showEditMode: false,
    isWeared: false,
    showBackground: false,
    renderSlot: () => null,
    containerStyle: {},
    medalWrapperStyle: {},
  }

  render() {
    const {size, showClickState, renderSlot, containerStyle, medalWrapperStyle, onPress} = this.props
    const sizeStyle = {width: size, height: size}
    const clickState = showClickState ? TOUCH_LIGHT_MASK : TOUCH_NONE
    const _style = [styles.medalWrapper, sizeStyle, medalWrapperStyle]

    return (
      <View style={[styles.medalContainer, containerStyle]}>
        {renderSlot()}
        {!onPress
          ? <View style={_style}>{this._renderChildren(sizeStyle)}</View>
          : (
            <TouchableHighlight {...clickState} style={_style} onPress={onPress}>
              {this._renderChildren(sizeStyle)}
            </TouchableHighlight>
          )
        }
      </View>
    )
  }

  _renderChildren = (sizeStyle) => {
    const {url, bgName, showEditMode, isWeared, showBackground} = this.props
    return (
      <View style={sizeStyle}>
        {showBackground && <WebImage style={[styles.medalBackground, sizeStyle]} name={this._getFullBgName(bgName)}/>}
        {!!url && <WebImage style={sizeStyle} name={url}/>}
        {showEditMode && (
          <View style={styles.medalOwnedWrapper}>
            <WebImage style={styles.medalOwned} name={`integralmedal/wear_${isWeared ? 'on' : 'off'}`}/>
          </View>
        )}
      </View>
    )
  }

  _getFullBgName(name) {
    return `integralmedal/medal_${name}`
  }
}

/**
 * 勋章组列表
 */
export class MedalGroup extends Component {
  static propTypes = {
    list: PropTypes.array,
    medalSize: PropTypes.number,
    spacing: PropTypes.number,
    showBackground: PropTypes.bool,
    bgName: PropTypes.string,
    onMedalPress: PropTypes.func,
  }

  static defaultProps = {
    list: [],
    medalSize: 60,
    spacing: 7,
    showBackground: false,
    bgName: '',
    onMedalPress: () => null,
  }

  render() {
    const {list, medalSize, spacing, bgName, showBackground, onMedalPress} = this.props
    return (
      <View
        style={[styles.groupContainer, {
          width: ((medalSize + spacing) * list.length) - spacing,
          height: medalSize,
        }]}
      >
        {list.map((m, k) => (
          <Medal
            key={m.id}
            {...m}
            size={medalSize}
            bgName={bgName}
            showBackground={showBackground}
            onPress={() => onMedalPress(m, k)}
          />
        ))}
      </View>
    )
  }
}

/**
 * 勋章等级
 * @param star {0, 1, 2, 3} // 等级，值为0不显示，值为1显示1颗星，值为2显示2颗星，值为3显示3颗星
 * @param size {number} // ✨尺寸
 * @param spacing {number} // ✨间距
 * @returns {null|React.Component}
 */
export const MedalStar = ({star, size, spacing}) => {
  return !star ? null
    : (
      <View style={[styles.starContainer, {width: (star * (size + spacing)) - spacing}]}>
        {[...Array(star)].map((_, k) => (
          // eslint-disable-next-line react/no-array-index-key
          <WebImage key={k} name={`integralmedal/star_${k + 1}`} style={{width: size, height: size}}/>
        ))}
      </View>
    )
}
MedalStar.propTypes = {
  star: PropTypes.number,
  size: PropTypes.number,
  spacing: PropTypes.number,
}
MedalStar.defaultProps = {
  star: 0,
  size: 12.5,
  spacing: 10,
}

/**
 * 列表内单个勋章
 * @param data            // 勋章数据
 * @param size            // 勋章尺寸
 * @param isPlaceholder   // 是否显示为空白占位符
 * @param withStar        // 是否显示✨等级
 * @param showClickState  // 是否显示点击态
 * @returns {React.Component}
 */
export const MedalItem = ({data, size, isPlaceholder, withStar, showEditMode, showClickState, containerStyle, onPress, hasOwnMedal}) => {
  const clickState = showClickState ? TOUCH_LIGHT_MASK : TOUCH_NONE
  const titleStyle = data.star === 0 ? {color: TEXT_COLOR_GREY} : {}

  return isPlaceholder
    ? <View key={data.id} style={[styles.listItem, containerStyle]}/>
    : (
      <TouchableOpacity {...clickState} key={data.id} style={[styles.listItem, containerStyle]} onPress={() => onPress(showEditMode)}>
        <View style={{flex: 1}}>
          {
            (hasOwnMedal && data.id.includes('dianshang_dingdan') && data.star === 0) ? (<MdealHotLottie />) : null
          }
          <Medal size={size} url={data.url} showEditMode={showEditMode} isWeared={!!data.isWeared} />
          <Text numberOfLines={1} style={[styles.itemTitle, titleStyle]}>{data.title}</Text>
          {withStar && (
            <View style={styles.starWrapper}>
              <MedalStar star={data.star} size={12} spacing={4}/>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
}

MedalItem.propTypes = {
  data: PropTypes.object,
  size: PropTypes.number,
  isPlaceholder: PropTypes.bool,
  withStar: PropTypes.bool,
  showClickState: PropTypes.bool,
  showEditMode: PropTypes.bool,
  containerStyle: PropTypes.object,
  onPress: PropTypes.func,
}
MedalItem.defaultProps = {
  data: {
    id: '0',
    url: '',
    title: '',
    star: 0,
    isWeared: false,
  },
  size: 70,
  isPlaceholder: true,
  withStar: true,
  showClickState: false,
  showEditMode: false,
  containerStyle: {},
  onPress: () => null,
}

const styles = StyleSheet.create({
  // 勋章组列表
  groupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // 单个勋章
  medalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  medalWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  medalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  medalOwnedWrapper: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    zIndex: 9,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  medalOwned: {
    width: 20,
    height: 20,
  },

  // 勋章等级
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },

  // 单个勋章展示样式
  listItem: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 23,
    paddingHorizontal: 5,
  },
  itemTitle: {
    lineHeight: 21,
    marginTop: 7,
    marginBottom: 3,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
    color: TEXT_COLOR_TITLE,
  },
  starWrapper: {
    alignItems: 'center',
    height: 10,
  },
})
