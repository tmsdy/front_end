/**
 * Created by kerwinliu on 2018/8/11.
 * 夺宝列表
 */

import React, {PureComponent} from 'react'
import {DeviceEventEmitter, TouchableHighlight, TouchableOpacity} from 'react-native'

import {Text, View} from '@iqiyi/rn-ui'
import LinearGradient from '@iqiyi/rn-gradient-view'

import ReduxUtil from '../../common/ReduxUtil'

import WebImage from '../WebImage'
import TabTitle from './TabTitle'
import DefaultImage from '../home/DefaultImage'
import BaseConfirmModal from '../BaseConfirmModal'
import CommonButton from '../CommonButton'

import {filterPic, getStorage, goToLogin, setStorage} from '../../common/util'
import {showToast} from '../../common/QYNativeBridge'
import {GET_ENV, TREASURE_DETAIL_URL, TREASURE_URL} from '../../constants/configs'
import {askSubscribeSnatch, askUnsubscribeSnatch, getOrderState, getSnatchData, getSnatchNotice} from '../../model/wonderfulPark'
import {getSnatchOptions, participate} from '../../model/wonderfulPark/options'
import {TOUCH_LIGHT_MASK} from '../../constants/touchableStyle'
import {sendClickPingback} from '../../common/pingback'
import {
  getCancelOrderClickPingback,
  getOrderClickPingback,
  getSnatchClickPingback,
  getSnatchDetailClickPingback,
  PARK_PAGE,
  SNATCH_BLOCK,
  SNATCH_FIRST_MODAL_CLICK,
  SNATCH_FIRST_TIME_BLOCK,
  SNATCH_LOOK_MORE_CLICK,
  SNATCH_LOOK_MORE_WITH_NOTICE_CLICK,
} from './pingback'

const HAS_PARTICIPATED_SNATCH = `HAS_PARTICIPATED_SNATCH_${global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId}`

export default class extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: global.USER_INFO.isLogin,
      snatchList: [],
      notice: false,
    }

    this.orderedMaps = {} // 夺宝开启提醒状态
    this.listener = null
    this.refConfirmModal = ReduxUtil.createRef()
  }

  componentDidMount() {
    this.getData()
    this.listenLogin()
  }

  componentWillUnmount() {
    this.listener && this.listener.remove()
  }

  render() {
    const {notice} = this.state
    return (
      <View>
        {!!this.state.snatchList.length && (
          <React.Fragment>
            <View style={styles.containerTitle}>
              <TabTitle title="积分夺宝" showLookMore={true} showNotice={notice} onPress={() => this._lookMore(notice)}/>
            </View>
            {this.state.snatchList.map(this._renderItem)}
          </React.Fragment>
        )}
        <BaseConfirmModal ref={this.refConfirmModal}/>
      </View>
    )
  }

  _renderItem = (item, key) => {
    if(!item.item) return null
    const {code, price, _options} = item
    const {title, photos, period, showProgress, desc, currentUserNum, currentNum, totalNum, disabledButton, buttonOptions} = _options

    return (
      <TouchableHighlight {...TOUCH_LIGHT_MASK} style={styles.itemWrapper} key={code} onPress={() => this._goDetail(code, key)}>
        <View style={styles.itemInner}>
          <View style={styles.leftImage}>
            <DefaultImage style={styles.image} errorImageStyle={styles.image} source={filterPic(photos, 'movepic')}/>
          </View>
          <View style={styles.contentWrapper}>
            <View style={styles.titleWrapper}>
              <Text numberOfLines={1} style={styles.itemTitle}>{title}</Text>
            </View>
            {showProgress && (
              <View style={styles.progressWrapper}>
                <View style={{height: 5, backgroundColor: '#EEEEEE', width: '100%', borderRadius: 3}}>
                  <View style={[styles.percent, {width: `${(currentNum * 100) / totalNum}%`}]}>
                    <LinearGradient
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      colors={['#FF7E00', '#FFA400']}
                      style={[styles.percent, {width: '100%'}]}
                    />
                  </View>
                </View>
              </View>
            )}
            {period !== 'before' && (
              <View style={styles.progressBottomWrapper}>
                <Text numberOfLines={1} style={styles.progressDesc}>{desc}</Text>
                <Text style={styles.progressDesc} numberOfLines={1}>已夺宝{currentUserNum}次</Text>
              </View>
            )}
            {period === 'before' && (
              <View style={styles.progressBottomWrapper}>
                <Text numberOfLines={1} style={[styles.progressDesc, {marginTop: 8}]}>{desc}</Text>
              </View>
            )}
            <View style={styles.itemBottomWrapper}>
              <Text numberOfLines={1} style={{fontSize: 12, color: '#666'}}>{price}积分/次</Text>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor="#d8d8d8"
                style={[styles.radiusContent, {backgroundColor: disabledButton && period !== 'after' ? '#D8D8D8' : '#eeeeee'}]}
                onPress={() => this.onButtonClick(item, key)}
              >
                {disabledButton
                  ? (
                    <Text style={{fontSize: 14, color: period === 'after' ? '#333333' : '#ffffff'}} numberOfLines={1}>
                      {buttonOptions.text}
                    </Text>
                  )
                  : (
                    <LinearGradient
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      colors={['#FFA400', '#FF7E00']}
                      style={[styles.radiusContent, {borderRadius: 0}]}
                    >
                      <Text style={{fontSize: 14, color: '#ffffff'}} numberOfLines={1}>{buttonOptions.text}</Text>
                    </LinearGradient>
                  )}
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  updateSnatchList = (list, newMaps) => {
    this.orderedMaps = {
      ...this.orderedMaps,
      ...newMaps,
    }
    const snatchList = list.map(i => ({
      ...i,
      _options: getSnatchOptions(i, {
        isOrdered: this.orderedMaps[i.code] || false
      })
    }))

    this.setState({snatchList})
  }

  getData = async () => {
    const snatchData = getSnatchData()
    const _noticeData = getSnatchNotice()

    const {list} = await snatchData
    const notice = await _noticeData
    const orderedMaps = await getOrderState(list)
    this.updateSnatchList(list, orderedMaps)
    this.setState({notice})
  }

  listenLogin() {
    this.listener = DeviceEventEmitter.addListener(
      'loginChange',
      this._loginChange
    )
  }

  _loginChange = (isLogin) => {
    if(isLogin) {
      this.setState({isLogin}, () => {
        this.getData()
      })
    }
  }

  _lookMore = (status) => {
    sendClickPingback(PARK_PAGE, SNATCH_BLOCK, status ? SNATCH_LOOK_MORE_WITH_NOTICE_CLICK : SNATCH_LOOK_MORE_CLICK)
    // 积分夺宝url
    this.props.openWeb(TREASURE_URL[GET_ENV()])
  }

  onButtonClick = async (item, key) => {
    const {
      code,
      _options: {price, period, permitStatus, isOrdered}
    } = item
    if(permitStatus) {
      return showToast('给别人留点夺宝机会吧')
    }

    if(period === 'after') {
      this._goDetail(code, key)
      return
    }

    if(!this.state.isLogin) {
      return goToLogin()
    }

    if(period === 'before') {
      if(isOrdered) {
        // 取消预约提醒
        sendClickPingback(PARK_PAGE, SNATCH_BLOCK, getCancelOrderClickPingback(key + 1))
        askUnsubscribeSnatch([code])
          .then(({result}) => {
            if(result) {
              this.updateSnatchList(this.state.snatchList, {[code]: false})
              showToast('已取消夺宝提醒')
            }
          })
          .catch(() => {
            showToast('网络异常，稍后再试')
          })
      } else {
        // 预约提醒
        sendClickPingback(PARK_PAGE, SNATCH_BLOCK, getOrderClickPingback(key + 1))
        askSubscribeSnatch([code])
          .then(({result}) => {
            if(result) {
              this.updateSnatchList(this.state.snatchList, {[code]: true})
              showToast('预约成功，请注意打开APP提示')
            }
          })
          .catch(() => {
            showToast('网络异常，稍后再试')
          })
      }
      return
    }

    sendClickPingback(PARK_PAGE, SNATCH_BLOCK, getSnatchClickPingback(key + 1))

    // 参与夺宝
    const {totalScore} = this.props
    if(totalScore < price) {
      return showToast(`还差${price - totalScore}积分，快去赚积分吧`)
    }

    const params = {code, price, totalScore}
    const hasParticipatedSnatch = await getStorage(HAS_PARTICIPATED_SNATCH)
    if(!hasParticipatedSnatch) {
      this._participateSnatch(params)
      setStorage(HAS_PARTICIPATED_SNATCH, true)
      this.showParticipateModal(item, key)
      return
    }

    this._participateSnatch(params)
  }

  _participateSnatch = async (params = {}) => {
    const {totalScore} = await participate(params)
    this.props.setTotalScore(totalScore)
    this.getData()
  }

  _goDetail = (code, key) => {
    // 积分夺宝详情url
    sendClickPingback(PARK_PAGE, SNATCH_BLOCK, getSnatchDetailClickPingback(key + 1))
    this.props.openWeb(`${TREASURE_DETAIL_URL[GET_ENV()]}?id=${code}`)
  }

  showParticipateModal = (item, key) => {
    sendClickPingback(PARK_PAGE, SNATCH_FIRST_TIME_BLOCK)
    this.showConfirmModal({
      showCloseButton: false,
      content: (
        <View style={styles.partContainer}>
          <TouchableOpacity activeOpacity={1} style={styles.partIcon} onPress={this.hideConfirmModal}>
            <WebImage name="popup-close" style={{width: 44, height: 44}}/>
          </TouchableOpacity>
          <Text style={styles.partTitle}>已夺宝1次</Text>
          <Text style={[styles.partTitle, {marginBottom: 30}]}>多次参与中奖几率加倍哦</Text>
          <CommonButton
            width={220}
            mode="gradient"
            text="再来一次"
            containerStyle={{borderRadius: 7.5}}
            onPress={() => {
              sendClickPingback(PARK_PAGE, SNATCH_FIRST_TIME_BLOCK, SNATCH_FIRST_MODAL_CLICK)
              this.onButtonClick(item, key)
              this.hideConfirmModal()
            }}
          />
        </View>
      )
    })
  }

  showConfirmModal = (config) => {
    return this.refConfirmModal.getInstance().then(ref => ref.queueToShow(config, true))
  }

  hideConfirmModal = () => {
    return this.refConfirmModal.getInstance().then(ref => ref.positiveHide())
  }
}

const styles = BaseStyleSheet.create({
  containerTitle: {
    paddingHorizontal: 15,
  },
  itemWrapper: {
    flex: 1,
    paddingHorizontal: 15,
  },
  itemInner: {
    flexDirection: 'row',
    minHeight: 110,
    paddingVertical: 10,
  },
  leftImage: {
    width: 113,
    height: 105,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 5,
  },
  image: {
    width: 90,
    height: 90,
  },
  priceWrapper: {
    height: 18,
    paddingHorizontal: 12.5,
    borderRadius: 50,
    backgroundColor: '#FFEBDD',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
  price: {
    color: '#FF6600',
    fontSize: 14,
  },
  contentWrapper: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 2,
  },
  titleWrapper: {
    height: 19,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 13,
  },
  progressWrapper: {
    height: 5,
    marginBottom: 3,
    overflow: 'hidden'
  },
  itemTitle: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  progressBottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
    height: 16,
  },
  progressDesc: {
    height: 16,
    fontSize: 12,
    color: '#999999',
  },
  itemBottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
    marginTop: 6,
    overflow: 'hidden'
  },
  radiusContent: {
    height: 30,
    width: 90,
    borderRadius: 5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  percent: {
    height: 5,
    backgroundColor: '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  moreButton: {
    backgroundColor: '#F9F9F9',
    width: 150,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 5,
  },
  winner: {
    marginTop: 20,
    width: 199,
    height: 30,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#FFF8F2',
    borderColor: 'rgba(255,102,0,0.23)',
    borderWidth: BaseStyleSheet.hairlineWidth,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  winnerAvatar: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    marginRight: 5,
  },
  winnerInfo: {
    fontSize: 12,
    color: '#333333',
    flex: 1,
  },
  resultBox: {
    height: 18,
    paddingHorizontal: 4,
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 2.5,
    borderColor: '#FF5864',
  },
  resultBoxFail: {
    borderColor: '#CCCCCC',
  },
  resultText: {
    color: '#FF5864',
    fontSize: 12,
  },
  resultTextFail: {
    color: '#ccc',
  },

  partContainer: {
    alignItems: 'center',
    width: 270,
    borderRadius: 10,
    paddingTop: 45,
    paddingHorizontal: 25,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  partIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 44,
    height: 44,
  },
  partTitle: {
    fontSize: 16,
    lineHeight: 25,
    color: '#333333',
  }
})
