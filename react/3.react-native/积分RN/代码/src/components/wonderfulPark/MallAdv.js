/*
 * 什么值得兑 && 福利乐园入口
 * */
import React, {Component} from 'react'
import {StyleSheet, TouchableHighlight, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'
import {Image, Text, View} from '@iqiyi/rn-ui'
import WebImage from '../WebImage'
import {getMallAdvData} from '../../model/wonderfulPark'
import px2dp from '../../common/px2dp'
import {getAsyncStoragePromise, saveAsyncStoragePromise} from '../../common/asyncStorage'
import {TOUCH_TEXT_ACTIVE} from '../../constants/touchableStyle'
import {sendBlockPingback, sendClickPingback} from '../../common/pingback'
import {CONTENT_PADDING_HORIZONTAL} from './constants'
import {PARK_PAGE, SLOT_BLOCK, getSlotClickPingback} from './pingback'

// 福利乐园入口
export class WelfareEnter extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    url: PropTypes.string,
    openWeb: PropTypes.func,
    onPress: PropTypes.func
  }

  static defaultProps = {
    isVisible: false,
    url: '',
    openWeb: () => null,
    onPress: () => null
  }

  render() {
    return (
      this.props.isVisible && (
        <TouchableHighlight {...TOUCH_TEXT_ACTIVE} style={styles.welfareEnter} onPress={this.gotoWelfare}>
          <WebImage name="welfare_icon" style={styles.welfareEnterImage} />
        </TouchableHighlight>
      )
    )
  }

  gotoWelfare = () => {
    sendClickPingback('paradise', 260000, 'hx_fuchuang2')
    if(this.props.url) {
      saveAsyncStoragePromise(`welfare_enter${global.USER_INFO.userId}`, 'hidden')
      this.props.onPress()
      this.props.openWeb(this.props.url)
    }
  }
}

// 什么值得兑
export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listData: []
    }
  }

  componentDidMount() {
    sendBlockPingback(PARK_PAGE, SLOT_BLOCK)
    this.getData()
  }

  render() {
    const {listData} = this.state
    return !listData.length ? null : (
      <View style={styles.boxWrapper}>
        <View style={styles.contentWrap}>
          <WebImage name="mall-adv-member-v2" style={styles.leftBox}>
            <TouchableOpacity style={styles.leftBox} onPress={() => this.onClick(0)}>
              <Text style={styles.leftText}>{listData[0].name}</Text>
              <Image source={{uri: listData[0].pic}} style={styles.leftImage} />
            </TouchableOpacity>
          </WebImage>
          <View style={[styles.rightWrapper]}>
              {this._renderRightItem(listData, 1)}
              {this._renderRightItem(listData, 2)}
          </View>
        </View>
      </View>
    )
  }

  _renderRightItem(list, k) {
    return (
      <WebImage name={k === 1 ? 'mall-adv-goods' : 'mall-adv-integral'} style={[styles.rightItem]}>
        <TouchableOpacity style={styles.rightItem} onPress={() => this.onClick(k)}>
          <View style={styles.rightTextWrapper}>
            <Text style={styles.rightText}>{list[k].name}</Text>
            <Text style={styles.rightTextDesc}>{list[k].text}</Text>
          </View>
          <Image source={{uri: list[k].pic}} style={styles.rightImage} />
        </TouchableOpacity>
      </WebImage>
    )
  }

  onClick = (index) => {
    sendClickPingback(PARK_PAGE, SLOT_BLOCK, getSlotClickPingback(index + 1))
    this.props.openWeb(this.state.listData[index].url)
  }

  getData = async () => {
    const _value = getAsyncStoragePromise(`welfare_enter${global.USER_INFO.userId}`)
    const _listData = getMallAdvData()
    const value = await _value
    const listData = await _listData

    if(value !== 'hidden' && listData.length >= 4) {
      this.props.showWelfare(listData[3].url)
    }
    this.setState({listData})
  }
}

const styles = StyleSheet.create({
  // 福利乐园入口
  welfareEnter: {
    position: 'absolute',
    bottom: 100,
    right: 15,
    width: 85,
    height: 85
  },
  welfareEnterImage: {
    width: 85,
    height: 85
  },

  // 什么值得买
  boxWrapper: {
    paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
    // marginBottom: 25
  },
  contentWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    height: 155,
  },
  leftBox: {
    width: 155,
    height: 155,
    borderRadius: 5,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  leftText: {
    color: '#FFFFFF',
    fontFamily: 'PingFangSC-Medium'
  },
  leftImage: {
    width: 117,
    height: 117
  },
  rightWrapper: {
    justifyContent: 'space-between',
    height: 155,
    marginLeft: 5
  },
  rightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DEVICE_WIDTH - 185,
    height: 75,
    paddingRight: 10,
    paddingLeft: 15,
    borderRadius: 5,
  },
  rightTextWrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  rightText: {
    marginBottom: 5,
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'PingFangSC-Medium'
  },
  rightTextDesc: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular'
  },
  rightImage: {
    width: px2dp(75),
    height: px2dp(75)
  }
})
