/**
 * Created by liuzhimeng.
 * @date 2018/10/15
 * @description 积分勋章重构优化版
 */

import React from 'react'
import {DeviceEventEmitter, FlatList, TouchableHighlight} from 'react-native'
import {connect} from 'react-redux';
import {Text, View} from '@iqiyi/rn-ui'
import {isIOS, Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'
import {QYRNBridge} from '@iqiyi/rn-base-modules';
import NavBar from '../components/DefaultNavBar'
import Top from '../components/integralMedalv2/Top'
import {MedalGroup, MedalItem} from '../components/integralMedalv2/Medal'
import {CustomEmptyPage} from '../components/EmptyPage'
import {hideLoading, showToast} from '../common/QYNativeBridge'
import CommonButton from '../components/CommonButton'
import ConfirmModal from '../components/ConfirmModal'
import NewMedalModal from '../components/integralMedalv2/NewMedalModal'
import {RuleContent} from '../components/integralMedalv2/ModalSnippets'
import {getAsyncStoragePromise, saveAsyncStoragePromise} from '../components/integralMedalv2/helpers'
import {addPlaceholderToMedalLists, addUserMedalEmptyList, addWearedMedalState} from '../components/integralMedalv2/src/medalOptions'
import {goToLogin, updateArrayState, roundFun, isURL} from '../common/util'
import {onWearedMedal, onWillWearMedal} from '../components/integralMedalv2/src/editMedal'
import {getMedalList, getMedalReward, getWearedMedalList} from '../model/integralMedalv2'
import {
  DETAIL_MODAL_BLOCK,
  GET_MEDAL_MODAL_BLOCK,
  getMedalPingbackById,
  LOCK_CLICK,
  MEDAL_LIST_BLOCK,
  RULE_MODAL_CLICK,
  sendMainBlockPingback,
  sendMainClickPingback,
  sendMainPagePingback,
  TOP_MEDAL_GROUP_BLOCK,
  UNLOCK_CLICK,
  WEAR_MEDAL_BLOCK,
  SHOPPING_RECOMMEND_MEDAL_MODAL_BLOCK,
  GO_SHOPPING_CLICK
} from '../components/integralMedalv2/pingback'

import {TOUCH_TEXT_ACTIVE} from '../constants/touchableStyle'
import {TEXT_COLOR_TIPS} from '../constants/baseStyles'
import {sendGeoInfo, getMedalRank} from '../api'
import RecommendMedalModal from '../components/integralMedalv2/RecommendMedalModal'
import BasePage from '../components/BasePage'

import {IPArea} from '../typings/apis/integralMedalv2'
import {MedalRank} from '../typings/apis/index'

// 本地缓存无勋章提示
const MEDAL_TIP_VISIBLE = `MEDAL_TIP_VISIBLE_${global.USER_INFO.userId}`
// 本地缓存勋章页更新提示弹窗
const UPDATE_MEDAL_MODAL_VISIBLE = `UPDATE_MEDAL_MODAL_VISIBLE_${global.USER_INFO.userId}`

interface IntegralMedalv2State {
  isLogin: boolean;
  emptyShowName: string;
  tipVisible: boolean;
  wearedList: any[]; // 用户已佩戴勋章列表
  medalList: any[]; // 用户勋章列表
  ruleModalVisible: boolean; // 规则弹窗
  updateModalVisible: boolean; // 更新提示弹窗
  wearVisible: boolean; // 显示佩戴勋章编辑态
  willWearMedalIds: any[]; // 可佩戴勋章id列表
  medalInitialPage: number;
  medalDetails: any[];
  hasOwnMedal: number;
  newMedalVisible: false;
  newMedalTitle: string;
  level: number;
  showRecommendMedalModal: boolean;
  medalTotal: number;
  hasGeo: string;
  rank: string | number;
}

@(connect(({scoreInfo}) => ({
  totalScore: scoreInfo.totalScore,
}), null) as any)
export default class IntegralMedalv2 extends BasePage<{}, IntegralMedalv2State> {
  public pageName = 'medalRN'
  private newMedalList = []
  private newMedalModalRef = null
  private province = ''
  private city = ''

  public constructor(props) {
    super(props)

    this.state = {
      isLogin: global.USER_INFO.isLogin, // 用户登录状态
      emptyShowName: 'loading',

      tipVisible: false,

      wearedList: [], // 用户已佩戴勋章列表
      medalList: [], // 用户勋章列表

      ruleModalVisible: false, // 规则弹窗
      updateModalVisible: false, // 更新提示弹窗
      wearVisible: false, // 显示佩戴勋章编辑态
      willWearMedalIds: [], // 可佩戴勋章id列表
      medalInitialPage: 0,
      medalDetails: [],
      hasOwnMedal: 0,

      newMedalVisible: false,
      newMedalTitle: '',
      level: 0,
      showRecommendMedalModal: false, // 未获得勋章时推荐弹框是否展示
      medalTotal: 0,
      hasGeo: '',
      rank: '',
    }
  }

  componentDidMount() {
    // TODO 优化
    sendMainPagePingback({score: this.props.totalScore})
    this.listenLogin()
    this.init()
  }

  render() {
    return (
      <View style={styles.container}>
        <Top.UnlockTips
          isVisible={this.state.tipVisible}
          style={styles.unlockTips}
          onPress={() => this.onCloseUnlockTips()}
        />
        <View style={styles.topContainer}>
          <Top.Background>
            <NavBar
              style={styles.navBar}
              type="black"
              title="我的勋章"
              titleColor="#333333"
              backgroundColor="transparent"
              rightViewWidth={55}
              backPress={this.back}
              renderRightView={() => this._renderRightView()}
            />
            <View style={styles.topWrapper}>
              <Top.MedalCount count={this.state.hasOwnMedal} medalRankInfo={{province: this.province, city: this.city, hasGeo: this.state.hasGeo, rank: this.state.rank}} />
              <MedalGroup
                list={this.state.wearedList}
                medalSize={61}
                spacing={7}
                showBackground={true}
                bgName="add"
                onMedalPress={this.onWearedMedalPress}
              />
            </View>
          </Top.Background>
        </View>
        <View style={styles.wearButtonContainer}>
          {this.state.wearVisible ? this._renderWearButton() : null}
        </View>
        <FlatList
          style={styles.flatListContainer}
          numColumns={3}
          data={this.state.medalList}
          keyExtractor={(item) => item.id}
          renderItem={(params) => this._renderItem(params)}
          ListEmptyComponent={() => this._listEmptyComponent()}
        />
        <ConfirmModal modalVisible={this.state.ruleModalVisible}>
          <RuleContent onButtonPress={() => this.setState({ruleModalVisible: false})}/>
        </ConfirmModal>
        <NewMedalModal
          ref={(child) => {
            this.newMedalModalRef = child
          }}
          modalVisible={this.state.newMedalVisible}
          title={this.state.newMedalTitle}
          level={this.state.level}
          onClose={() => this.onNewMedalClose()}
        />
        <RecommendMedalModal
          {...{
            btnOnPress: () => this._handleRecommendBtn(),
            recommendModalVisible: this.state.showRecommendMedalModal,
            closeRecommendModal: () => this.setState({showRecommendMedalModal: false}),
            ...this.getReccomendPopUp()
          }}
        />
      </View>
    )
  }

  // 推荐弹框的popup
  // title medalImg 是图片链接
  getReccomendPopUp() {
    const medalList = this.state.medalList || [];
    let {
      _detail: {
        popup: {
          title = 'medal/medal-title',
          medalImg = 'medal/master-shopper',
          btnText = '去商城薅羊毛',
          rule = '【获取条件】过往1个月积分商城完成3订单',
          medalText = '特权：满25元减5元代金券1张'
        } = {}
      } = {}
    } = medalList[0] || {};
    if(!isURL(title)) {
      title = 'medal/medal-title';
    }
    if(!isURL(medalImg)) {
      medalImg = 'medal/master-shopper';
    }
    return {
      title,
      medalImg,
      btnText,
      rule,
      medalText
    };
  }

  _handleRecommendBtn() {
    sendMainClickPingback(SHOPPING_RECOMMEND_MEDAL_MODAL_BLOCK, GO_SHOPPING_CLICK)
    this.goTo('ShoppingMall')
    this.setState({
      showRecommendMedalModal: false
    })
  }

  // 根据IP获取地理信息
  getIPArea() {
    QYRNBridge.getIPArea().then((data = {}) => {
      const {city = '', province = ''} = data
      this.province = province
      this.city = city
      this._sendGeo(data)
    }).catch(() => {
      this._sendGeo({})
    })
  }

  // 发送地理位置信息
  _sendGeo(data) {
    const query = this.getGeoSendQuery(data)
    sendGeoInfo(query).then(() => {
      this._getMedalRank()
    })
  }

  // 获取发送地理位置请求参数
  getGeoSendQuery = (data: IPArea): any => {
    const {city = '', province = ''} = data
    const verticalCode = 'iQIYI'
    const requestHeader = {
      task_code: 'growth_user_geo_send',
      timestamp: Date.now()
    }
    const requestBody = {
      growth_user_geo_send: {
        verticalCode,
        province,
        city,
        userId: global.USER_INFO.userId,
        agentversion: global.CLIENT_INFO.appVersion,
        typeCode: 'Point_EXP'
      }
    }
    return {
      requestHeader,
      requestBody
    }
  }

  // 调勋章接口
  _getMedalRank() {
    const query = this.getMedalRankQuery()
    getMedalRank(query).then((data: any = {}) => {
      const rank = this.handleMedalRankRes(data)
      this.setState({
        rank: `${rank}%`,
        hasGeo: this.province || this.city,
        medalTotal: data.data && data.data.data && data.data.data.total
      })
    }).catch(() => {
      // showToast('获取勋章排名失败')
    })
  }

  handleMedalRankRes = (data: MedalRank) => {
    const {total, your} = data.data.data
    if(your < 0) return 99
    const isFinite = Number.isFinite(your / total)
    if(!isFinite) return 0.1
    if(isFinite) {
      const curVal = your / total
      if(curVal < 0.1 && curVal >= 0) return 0.1
      if(curVal < 1 && curVal >= 0.1) return roundFun(curVal, 1)
      if(curVal < 99 && curVal >= 1) return roundFun(curVal, 0)
      if(curVal <= 100 && curVal >= 99) return 99
    }
  }

   // 获取获取勋章排名请求参数
   getMedalRankQuery = () => {
    const verticalCode = 'iQIYI'
    const requestHeader = {
      task_code: 'growth_medal2_rank',
      timestamp: Date.now()
    }
    const requestBody = {
      growth_medal2_rank: {
        verticalCode,
        userId: global.USER_INFO.userId,
        agentversion: global.CLIENT_INFO.appVersion,
        typeCode: 'Point_EXP',
        srcplatform: isIOS ? '20' : '21',
        agenttype: isIOS ? '20' : '21',
        appver: global.CLIENT_INFO.appVersion,
      }
    }
    return {
      requestHeader,
      requestBody
    }
  }

  _renderRightView = () => (
    <View style={styles.navRightWrapper}>
      <TouchableHighlight {...TOUCH_TEXT_ACTIVE} onPress={() => this.showRuleModal()}>
        <Text style={styles.navText}>规则</Text>
      </TouchableHighlight>
    </View>
  )

  _renderWearButton = () => (
    <View style={styles.wearButtonWrapper}>
      <CommonButton
        mode="gradient"
        text="完成"
        onPress={() => this.onWearComplete()}
        containerStyle={{
          width: 70,
          height: 30,
        }}
        buttonStyle={styles.completeButton}
      />
    </View>
  )

  _renderItem({item, index}) {
    const {wearVisible, willWearMedalIds, hasOwnMedal} = this.state
    return (
      <MedalItem
        data={item}
        size={90}
        isPlaceholder={!!item.isPlaceholder}
        withStar={item.withStar}
        showEditMode={wearVisible && willWearMedalIds.includes(item.id)}
        onPress={(showEditMode) => this.onItemPress(item, index, showEditMode)}
        hasOwnMedal={hasOwnMedal}
      />
    )
  }

  _listEmptyComponent = () => (
    <View style={styles.emptyWrapper}>
      <CustomEmptyPage
        emptyTip="还没有获得勋章哦"
        showName={this.state.emptyShowName}
        retry={() => this.onRefresh()}
      />
    </View>
  )

  init() {
    if(!this.state.isLogin) {
      this.setState({emptyShowName: 'login'})
      return goToLogin()
    }
    hideLoading()
    this._showUpdateModal()
    this.onRefresh()
  }

  listenLogin() {
    this.listener = DeviceEventEmitter.addListener('loginChange', this._loginChange)
  }

  _loginChange = (isLogin) => {
    this.setState({isLogin}, () => {
      this.init()
    })
  }

  // 获取用户已佩戴勋章列表
  _getWearedMedalList() {
    return getWearedMedalList()
      .then((wearedList) => {
        this.setState({wearedList})
        return wearedList
      })
      .catch((err) => {
        showToast('获取用户佩戴勋章失败')
        throw err
      })
  }

  // 获取用户勋章列表
  _getMedalList = () => {
    return getMedalList()
      .then(({hasOwnMedal, medalList, willWearMedalIds, newMedalList}) => {
        // 用户没有任何可佩戴勋章，显示一次性佩戴提示
        if(hasOwnMedal === 0) {
          setTimeout(() => {
            this.showRecommendMedalModal()
          }, 500)
          // to do 是否去掉该逻辑
          // this._showMedalTips()
        }

        // 显示新勋章
        if(newMedalList.length) {
          // 领取勋章奖励
          const ids = newMedalList.reduce((total, current) => `${total},${current.id}`, '')
            .slice(1)
          getMedalReward(ids)
            .catch((err) => {
              throw err
            })
          //
          const newMedal = newMedalList.shift()
          sendMainBlockPingback(GET_MEDAL_MODAL_BLOCK, {
            rseat: getMedalPingbackById(newMedal.id, 'getNew'),
          })
          this.setState({
            newMedalVisible: true,
            newMedalTitle: `获得${newMedal.title}勋章`,
            level: newMedal.star,
          }, () => {
            if(this.newMedalModalRef) {
              this.newMedalModalRef.play()
            }
          })
          this.newMedalList = newMedalList
        }

        this.setState({
          emptyShowName: 'empty',
          hasOwnMedal,
          willWearMedalIds,
          medalList: addPlaceholderToMedalLists(medalList),
        })

        return {
          medalList,
          canBeWearedCount: willWearMedalIds.length,
        }
      })
      .catch((err) => {
        showToast('获取勋章失败')
        this.setState({emptyShowName: 'networkError'})
        throw err
      })
  }

  // 未获得勋章时展示推荐弹框
  showRecommendMedalModal() {
    sendMainBlockPingback(SHOPPING_RECOMMEND_MEDAL_MODAL_BLOCK)
    this.setState({
      showRecommendMedalModal: true
    })
  }

  _getData() {
    return Promise
      .all([this._getWearedMedalList(), this._getMedalList()])
      .then(([wearedList, {medalList, canBeWearedCount}]) => {
        this.setState({
          medalList: addWearedMedalState(medalList, wearedList.map((i) => i.id)),
          wearedList: addUserMedalEmptyList(wearedList, canBeWearedCount), // 显示未解锁勋章空槽&&计算可佩戴勋章空槽
        })
      })
  }

  // 显示未解锁提示，先检查缓存中是否记录已展示过提示
  // _showMedalTips = () => {
  //   getAsyncStoragePromise(MEDAL_TIP_VISIBLE)
  //     .then(({result}) => {
  //       this.setState({tipVisible: result !== 'hidden'}, () => {
  //         // 5s后自动隐藏
  //         setTimeout(() => {
  //           if(this.state.tipVisible) {
  //             this.onCloseUnlockTips()
  //           }
  //         }, 5000)
  //       })
  //     })
  // }

  // 显示未解锁提示，先检查缓存中是否记录已展示过提示
  _showUpdateModal() {
    getAsyncStoragePromise(UPDATE_MEDAL_MODAL_VISIBLE)
      .then(({result}) => {
        //
        this.setState({updateModalVisible: result !== 'hidden'})
      })
  }

  showRuleModal() {
    sendMainClickPingback(TOP_MEDAL_GROUP_BLOCK, RULE_MODAL_CLICK)
    this.setState({ruleModalVisible: true})
  }

  onRefresh() {
    this.getIPArea()
    this._getData()
  }

  // 列表内勋章点击事件 TODO
  async onItemPress(item, index, showEditMode) {
    // 进入勋章编辑态
    if(showEditMode) {
      const {medalList, wearedList, willWearMedalIds} = this.state
      const {
        operateSuccess,
        wearedList: newWearedList,
      } = await onWillWearMedal(item, index, wearedList, willWearMedalIds)
      if(operateSuccess) {
        const newMedalList = updateArrayState(medalList, index, {
          ...item,
          isWeared: !item.isWeared,
        })
        this.setState({
          wearedList: newWearedList,
          medalList: newMedalList,
        })
      }
    } else {
      // 查看勋章详情
      sendMainClickPingback(MEDAL_LIST_BLOCK, getMedalPingbackById(item.id, 'list'))
      sendMainBlockPingback(DETAIL_MODAL_BLOCK, {
        rseat: getMedalPingbackById(item.id, 'detail'),
      })
      // this.setState({medalModalVisible: true})
      this.goTo('MedalDetail', {
        channelCode: item.id,
        medalRank: this.state.medalTotal,
        hasGeo: this.state.hasGeo,
        province: this.province,
        city: this.city
      })
    }
  }

  // 顶部已佩戴勋章点击事件
  onWearedMedalPress = async (item, index) => {
    if(this.state.wearVisible) {
      if(item.url) {
        const {medalList} = this.state
        const {wearedList} = await onWearedMedal(item, index, this.state.wearedList)
        const listIndex = medalList.findIndex((i) => i.id === item.id)
        const value = medalList[listIndex]
        const newValue = !value ? {} : {...value, isWeared: !value.isWeared}
        const newMedalList = updateArrayState(medalList, listIndex, newValue)
        this.setState({
          wearedList,
          medalList: newMedalList,
        })
      }
    } else {
      if(item.id === '_lock') {
        sendMainClickPingback(TOP_MEDAL_GROUP_BLOCK, LOCK_CLICK)
      } else if(!item.url && item.bgName === 'add') {
        sendMainClickPingback(TOP_MEDAL_GROUP_BLOCK, UNLOCK_CLICK)
      }

      if(item.url || item.bgName === 'add') {
        sendMainBlockPingback(WEAR_MEDAL_BLOCK)
        this.setState({wearVisible: true})
      }
    }
  }

  onNewMedalClose() {
    this.setState({newMedalVisible: false}, () => {
      // 如果还有新勋章，则继续弹窗提示
      if(this.newMedalList.length) {
        const newMedal = this.newMedalList.shift()
        sendMainBlockPingback(GET_MEDAL_MODAL_BLOCK, {
          rseat: getMedalPingbackById(newMedal.id, 'getNew'),
        })
        requestAnimationFrame(() => {
          this.setState({
            newMedalVisible: true,
            newMedalTitle: `获得${newMedal.title}勋章`,
            level: newMedal.star,
          }, () => {
            if(this.newMedalModalRef) {
              this.newMedalModalRef.play()
            }
          })
        })
      }
    })
  }

  // 关闭无解锁勋章提示
  onCloseUnlockTips() {
    saveAsyncStoragePromise(MEDAL_TIP_VISIBLE, 'hidden')
    this.setState({tipVisible: false})
  }

  onWearComplete() {
    this.setState({wearVisible: false})
  }
}

const styles = BaseStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  unlockTips: {
    position: 'absolute',
    top: 160,
    right: 13,
    zIndex: 1,
  },

  navBar: {
    position: 'relative',
    zIndex: 0,
  },
  navRightWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 25,
  },
  navText: {
    color: TEXT_COLOR_TIPS,
  },

  wearButtonContainer: {
    paddingBottom: 20,
  },
  wearButtonWrapper: {
    alignItems: 'flex-end',
    paddingTop: 20,
    paddingRight: 30,
  },
  completeButton: {
    height: 30,
    lineHeight: 30,
    paddingVertical: 0,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
  },

  flatListContainer: {
    position: 'relative',
    zIndex: 0,
    width: DEVICE_WIDTH,
  },
  topContainer: {
    paddingBottom: 7,
    backgroundColor: '#F8F8F8',
  },
  topWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 25,
    // paddingTop: 57 / 2
  },
  emptyWrapper: {
    width: DEVICE_WIDTH,
    height: 400,
  },
})
