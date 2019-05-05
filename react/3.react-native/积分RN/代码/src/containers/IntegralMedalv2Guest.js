/**
 * Created by liuzhimeng.
 * @date 2018/10/19
 * @description 积分勋章重构优化版客态页
 */

import React from 'react'
import {FlatList, TouchableHighlight} from 'react-native'
import {View, Text} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH, isIOS} from '@iqiyi/rn-utils'
import {QYRNBridge} from '@iqiyi/rn-base-modules'
import NavBar from '../components/DefaultNavBar'
import Medal, {MedalGroup} from '../components/integralMedalv2/Medal'
import WebImage from '../components/WebImage'
import Top from '../components/integralMedalv2/Top'
import {CustomEmptyPage} from '../components/EmptyPage'
import {withPagination} from '../components/mixins/withPagination'
import {getUserInfoFromPassport, getMedalList, getWearedMedalList} from '../model/integralMedalv2'
import {hideLoading, showToast} from '../common/QYNativeBridge'
import {addWearedMedalState} from '../components/integralMedalv2/src/medalOptions'

import {TOUCH_TEXT_ACTIVE} from '../constants/touchableStyle'
import {TEXT_COLOR_DEFAULT, TEXT_COLOR_TIPS} from '../components/integralMedalv2/src/constants'
import {
  GUEST_MY_MEDAL_BLOCK,
  GUEST_MY_MEDAL_CLICK,
  sendGuestClickPingback,
  sendGuestPagePingback,
} from '../components/integralMedalv2/pingback'
import {roundFun} from '../common/util'
import {sendGeoInfo, getMedalRank} from '../api/index'
import BasePage from '../components/BasePage';

const PAGE_STATE = {
  offset: 0,
  limit: 10,
}

const WithFlatList = withPagination(FlatList, {pageState: PAGE_STATE})
export default class IntegralMedalv2 extends BasePage {
  pageName = 'medalRN_guest'

  constructor(props) {
    super(props)

    // 注册制参数 biz_params
    const {userId = null} = this.props.screenProps

    this.state = {
      emptyShowName: 'loading', // 页面状态 loading/empty/content
      total: 0,
      userId: userId || global.USER_INFO.userId,
      userInfo: {
        name: '',
        protrait: 'http://www.iqiyipic.com/common/fix/headicons/male-130.png',
      },
      wearMedalList: [], // 用户已佩戴勋章列表
      medalList: [], // 用户勋章列表
    }
  }

  componentDidMount() {
    sendGuestPagePingback()
    hideLoading()
    this._getUserInfo()
    this._getData()
    this._getMedalRankInfo()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Top.Background>
            <NavBar
              type="black"
              backgroundColor="transparent"
              rightViewWidth={88}
              backPress={this.back}
              renderRightView={() => this._renderRightView()}
            />
            <View style={styles.topWrapper}>
              <Top.UserInfo
                name={this.state.userInfo.name}
                protrait={this.state.userInfo.protrait}
                renderMedal={<MedalGroup medalSize={20} spacing={7} list={this.state.wearMedalList} />}
              />
              <Top.MedalCount count={this.state.total} medalRankInfo={{province: this.province, city: this.city, hasGeo: this.state.hasGeo, rank: this.state.rank}} />
            </View>
          </Top.Background>
        </View>
        <WithFlatList
          style={styles.flatListContainer}
          total={this.state.total}
          data={this.state.medalList}
          keyExtractor={(item) => item.id}
          renderItem={(params) => this._renderItem(params)}
          ListEmptyComponent={() => this._listEmptyComponent()}
        />
      </View>
    )
  }

  _getMedalRankInfo() {
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
  getGeoSendQuery(data = {}) {
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
        userId: this.state.userId,
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
    getMedalRank(query).then((data = {}) => {
      const rank = this._handleMedalRankRes(data)
      this.setState({
        rank: `${rank}%`,
        hasGeo: this.province || this.city
      })
    }).catch()
  }

  _handleMedalRankRes({data = {}}) {
    const {total, your} = data.data
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
   getMedalRankQuery() {
    const verticalCode = 'iQIYI'
    const requestHeader = {
      task_code: 'growth_medal2_rank',
      timestamp: Date.now()
    }
    const requestBody = {
      growth_medal2_rank: {
        verticalCode,
        userId: this.state.userId,
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

  _getUserInfo() {
    return getUserInfoFromPassport(this.state.userId)
      .then((data) => {
        this.setState({
          userInfo: {
            name: data.nickname || '一个懒得起名字的同学~',
            protrait: data.icon,
          }
        })
      })
      // eslint-disable-next-line no-unused-vars
      .catch()
  }

  // 获取用户已佩戴勋章列表
  _getWearedMedalList() {
    return getWearedMedalList(this.state.userId, 'guest')
      .then((wearMedalList) => {
        this.setState({wearMedalList})
        return wearMedalList
      })
      .catch((err) => {
        showToast('获取用户佩戴勋章失败')
        this.setState({emptyShowName: 'networkError'})
        throw err
      })
  }

  // 获取用户勋章列表
  _getMedalList() {
    return getMedalList('guest', this.state.userId)
      .then(({medalList}) => {
        this.setState({
          emptyShowName: 'empty',
          total: medalList.length,
          medalList,
        })
        return medalList
      })
      .catch((err) => {
        showToast('获取用户勋章失败')
        this.setState({emptyShowName: 'networkError'})
        throw err
      })
  }

  // 获取各接口数据，并增加已佩戴勋章状态判断
  _getData() {
    return Promise.all([
      this._getWearedMedalList(),
      this._getMedalList(),
    ])
      .then(([wearMedalList, medalList]) => {
        if(wearMedalList.length) {
          const idList = wearMedalList.map((i) => i.id)
          this.setState({
            medalList: addWearedMedalState(medalList, idList)
          })
        }
      })
  }

  onRefresh() {
    this._getData()
  }

  goToIntegralMedalv2() {
    sendGuestClickPingback(GUEST_MY_MEDAL_BLOCK, GUEST_MY_MEDAL_CLICK)
    this.goTo('IntegralMedalv2')
  }

  _renderRightView() {
    return (
      <View style={styles.navRightWrapper}>
        <TouchableHighlight {...TOUCH_TEXT_ACTIVE} onPress={() => this.goToIntegralMedalv2()}>
          <Text style={styles.navText}>我的勋章</Text>
        </TouchableHighlight>
      </View>
    )
  }

  _renderItem({item}) {
    return (
      <View key={item.id} style={styles.listItem}>
        <View style={styles.itemLeft}>
          <Medal size={69} url={item.url}/>
        </View>
        <View style={styles.itemRight}>
          <View style={styles.itemTitleWrapper}>
            <Text numberOfLines={1} style={styles.itemTitle}>{item.title}</Text>
            {item.isWeared && <WebImage style={styles.itemOwnedImage} name="integralmedal/is_owned"/>}
          </View>
          <Text numberOfLines={2} style={styles.itemDesc}>{item.description}</Text>
        </View>
      </View>
    )
  }

  _listEmptyComponent() {
    return (
      <View style={styles.emptyWrapper}>
        <CustomEmptyPage
          emptyTip="用户还没有获得勋章"
          showName={this.state.emptyShowName}
          retry={() => this.onRefresh()}
        />
      </View>
    )
  }
}

const styles = BaseStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navRightWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    color: TEXT_COLOR_TIPS,
  },
  flatListContainer: {
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
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 19,
  },
  emptyWrapper: {
    width: DEVICE_WIDTH,
    height: 400,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12.5,
  },
  itemLeft: {
    paddingVertical: 15,
    paddingHorizontal: 17,
  },
  itemRight: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 11,
    paddingTop: 17,
  },
  itemTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  itemTitle: {
    height: 24,
    lineHeight: 24,
    marginRight: 5,
    color: TEXT_COLOR_DEFAULT,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'PingFangSC-Semibold',
  },
  itemOwnedImage: {
    width: 46,
    height: 22,
  },
  itemDesc: {
    lineHeight: 20,
    color: TEXT_COLOR_TIPS,
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
  }
})
