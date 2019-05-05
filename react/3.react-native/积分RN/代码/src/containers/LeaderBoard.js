/**
 * 排行榜页面
 */
// TODO 重构代码

import React from 'react'
import PropTypes from 'prop-types'
import {Animated, DeviceEventEmitter, Easing, StatusBar, StyleSheet, TouchableOpacity} from 'react-native'
import QYNewList from '@iqiyi/rn-new-list'
import {ActivityIndicator, Image, Text, View} from '@iqiyi/rn-ui'
import {Height as DEVICE_HEIGHT, isIOS, Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'
import NavBar from '../components/DefaultNavBar'
import WebImage from '../components/WebImage'
import {executeTask, getUserInfo, getUserInfoByPasspost, unLoginExecuteTask} from '../api'
import {hideLoading} from '../common/QYNativeBridge'
import {sendClickPingback, sendPagePingback} from '../common/pingback'
import {LeaderBoardRuleModal} from '../components/MedalModalBox'
import {goToLogin} from '../common/util'
import BasePage from '../components/BasePage';

export default class IntegralPark extends BasePage {

  static propTypes = {
    uniqueID: PropTypes.string,
  }

  pageName = 'rankpage'

  constructor(props) {
    super(props)
    this.state = {
      todayScore: 0, // 用户当天的积分
      level: 0,
      instructionVisible: false, // 榜单规则弹窗
      userIcon: global.USER_INFO.userIcon,
      opacity: new Animated.Value(0),
      showUserInfo: true,
      totalScore: 0, // 用户总积分
      statusBar: 'dark-content',
      loading: true, // 页面初始化状态
      loadFail: false, //
      introList: [], // vip天卡规则文案
      levelList: [], // 排行榜数据
      dayRank: 0, // 用户天榜的排名
      pageNo: 1, // 分页参数
      pageSize: 20, // 每页请求数量
      rankTotalSize: 0, // 总得排行榜数据
      height: new Animated.Value(0),
      isLogin: global.USER_INFO.isLogin, // 用户登录状态
    }
  }

  onRequesting = false

  componentDidMount() {
    this.changeOpacity(true)
    this.listenLogin()
    this._getData()
    hideLoading()
    sendPagePingback(this.pageName)
  }

  componentWillUnmount() {
    this.listener.remove() // 解除绑定的事件
  }

  onShow() {
    this._getData()
  }

  _getData = () => {
    if(this.onRequesting) return false
    this.onRequesting = true
    const {isLogin} = this.state
    const requestArray = isLogin ? [
      this._getUserInfo(),
      this._getLevelRankList(),
      this._getQiPuData(),
    ] : [
      this._getLevelRankList(),
      this._getQiPuData(),
    ]
    Promise.all(requestArray)
      .then(() => {
        hideLoading()
      })
      .catch(() => {
        this.onRequesting = false
      })
      .finally(() => {
        this.onRequesting = false
      })
  }
  listenLogin = () => {
    const _this = this
    this.listener = DeviceEventEmitter.addListener('loginChange', (isLogin) => {
      _this.setState({
        isLogin,
        userIcon: global.USER_INFO.userIcon
      }, () => {
        _this._getData()
      })
    })
  }
  _getUserInfo = () => {
    const params = {
      typeCode: 'paradise',
      needExpire: 1
    }
    return getUserInfo(params)
      .then((data) => {
        const {todayScore, totalScore, level} = data[0]
        this.setState({
          todayScore,
          totalScore,
          level,
        })
      }, () => {
      })
      .catch(err => Promise.reject(err))
  }
  _getQiPuData = () => {
    const requestHeader = {
      task_code: 'qipu_leaderboard_rules',
      timestamp: Date.now(),
    }

    return executeTask(requestHeader)
      .then((data) => {
        if(data.elements_summary && data.elementsSummary.length) {
          const tempList = []
          data.elementsSummary.forEach((item) => {
            if(item.title && item.title.proper_title && item.title.proper_title !== '竞拍开关') {
              tempList.push(item.title.proper_title)
            }
          })
          this.setState({introList: tempList})
        }
      }, () => {
      })
      .catch(err => Promise.reject(err))
  }

  _getUserInfoByGroup = (userIds) => {
    const param = {
      uidAdd: userIds
    }
    return getUserInfoByPasspost(param)
  }
  _getLevelRankList = () => {
    let {pageNo} = this.state
    const {pageSize, isLogin} = this.state
    const requestBody = {
      growthRankList: {
        timeStamp: Date.now(),
        agentversion: global.CLIENT_INFO.appVersion,
        srcplatform: isIOS ? '20' : '21',
        agenttype: isIOS ? '20' : '21',
        appver: global.CLIENT_INFO.appVersion,
        pageSize,
        page: pageNo++,
        verticalCode: 'iQIYI',
        durationType: 1,
        typeCode: 'paradise',
      }
    }
    isLogin ? requestBody.growthRankList.userId = global.USER_INFO.userId : requestBody.growthRankList.qyid = (global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId)
    const requestHeader = {
      task_code: 'growthRankList',
      timestamp: Date.now(),
    }

    const fetchRequest = isLogin ? executeTask : unLoginExecuteTask
    return fetchRequest(requestHeader, requestBody)
      .then((data) => {
        this.formatData(data, pageNo)
      })
      .catch((err) => {
        this.setState({loading: false, loadFail: true})
        Promise.reject(err)
      })
  }

  formatData = (data, pageNo) => {
    const {levelList} = this.state
    if(data.code === 'A0000') {
      const {rankDetailList} = data.data;
      if(!rankDetailList.length && !levelList.length) { // 排行榜没有数据
        this.setState({
          loading: false,
          loadFail: true
        })
        return
      }
      const dayRank = data.data && data.data.rank
      let userIds = [];
      rankDetailList.forEach((item) => {
        userIds.push(item.userId)
      })
      this.setState({
        rankTotalSize: data.data.rankSize
      })
      userIds = userIds.join(',')
      this._getUserInfoByGroup(userIds)
        .then((result) => {
          rankDetailList.forEach((item, key) => {
            rankDetailList[key].userIcon = (result[item.userId] && result[item.userId].icon) || ''
            rankDetailList[key].userName = (result[item.userId] && result[item.userId].uname) || ''
          })
          const newLevelList = rankDetailList.length ? [...levelList, ...rankDetailList] : levelList
          const renderList = newLevelList.splice(0, 50)
          this.setState({
            loading: false,
            levelList: renderList,
            dayRank,
            pageNo,
          })
        })
      this._getUserLevelByGroup(userIds)
        .then((params) => {
          if(params.code === 'A0000') {
            const groupList = params.data
            rankDetailList.forEach((item, index) => {
              rankDetailList[index].level = groupList[index].level
            })
            const newList = rankDetailList.length ? [...levelList, ...rankDetailList] : levelList
            const renderList = newList.splice(0, 50)
            this.setState({
              levelList: renderList,
            })
          }
        })
    } else {
      this.setState({
        loading: false,
        loadFail: true
      })
    }
  }
  _getUserLevelByGroup = (userIds) => {
    const requestBody = {
      user_batch_levels: {
        agentversion: global.CLIENT_INFO.appVersion,
        srcplatform: isIOS ? '20' : '21',
        agenttype: isIOS ? '20' : '21',
        appver: global.CLIENT_INFO.appVersion,
        verticalCode: 'iQIYI',
        typeCode: 'paradise',
        userIds
      }
    }
    const requestHeader = {
      task_code: 'growth_user_batch_levels',
      timestamp: Date.now(),
    }
    return executeTask(requestHeader, requestBody)
  }
  _renderLoading = () => {
    if(this.state.loading) {
      return (
        <View style={styles.unLinkBox}>
          <ActivityIndicator text="内容即将呈现..."/>
        </View>
      )
    }
  }
  _renderOffLine = () => {
    if(!this.state.loading && this.state.loadFail) {
      return (
        <View style={styles.unLinkBox}>
          <Image source={{uri: isIOS ? 'click_reload' : 'phone_empty_data_img'}} style={styles.unlinkPic}/>
          <Text style={styles.tipText}>排行榜目前还没有数据哦~</Text>
        </View>
      )
    }
    return null
  }
  _renderTitleBar = () => {
    return (
      <View style={styles.titleBox}>
        <View style={styles.tabBtn}>
          <Text style={{fontSize: 16, color: '#FF7E00'}}>天榜</Text>
          <View style={styles.selected}/>
        </View>
        <View style={styles.tabBtn}>
          <Text style={{fontSize: 16, color: '#333333'}}>总榜</Text>
          <View style={styles.selected}/>
        </View>
      </View>
    )
  }

  showIntructionBox = () => {
    this.setState({
      instructionVisible: true
    })
    sendClickPingback('rankpage', '', 'gorule')
  }

  _renderNoticeTitle = () => {
    return (
      <TouchableOpacity onPress={this.showIntructionBox} activeOpacity={1}>
        <View style={{alignItems: 'center', marginTop: 5}}>
          <WebImage name="how_to_get_vip" style={styles.howToGetVipBox}>
            <Text style={styles.noticeText}>每天<Text style={{color: '#FFEB31', fontSize: 12}}>TOP20</Text>活跃玩家可获得VIP天卡</Text>
          </WebImage>
        </View>
      </TouchableOpacity>
    )
  }

  _hideRuleModal = () => {
    this.setState({
      instructionVisible: false
    })
  }
  _renderLeaderTule = () => {
    return (
      <LeaderBoardRuleModal
        instructionVisible={this.state.instructionVisible}
        _hideRuleModal={this._hideRuleModal}
        introList={this.state.introList}
      />
    )
  }
  _renderRow = (item) => {
    const {rank, level} = item
    let isShowRank = false
    let rankTextColor = {
      color: '#999999'
    }
    let rankColor = ''
    if(rank === 1) { // 第一名红色头像
      isShowRank = true
      rankColor = 'red_circle'
      rankTextColor = {
        color: '#FF2C73'
      }
    } else if(rank === 2) { // 第二名黄色头像
      isShowRank = true
      rankColor = 'yellow_circle'
      rankTextColor = {
        color: '#FEC201'
      }
    } else if(rank === 3) { // 第三名蓝色头像
      isShowRank = true
      rankColor = 'blue_circle'
      rankTextColor = {
        color: '#359DF7'
      }
    }
    return (
      <View style={styles.levelItemBox}>
        <Text style={[styles.levelNum, rankTextColor]}>{rank}</Text>
        <View style={styles.userIconBox}>
          {isShowRank && <WebImage name={rankColor} style={styles.circleIcon}/>}
          <Image source={{uri: item.userIcon}} style={styles.itemIcon}/>
        </View>
        <View style={styles.userNameBox}>
          <Text style={styles.userNameText} numberOfLines={1}>{item.userName}</Text>
          <WebImage name={`LV${level}`} style={styles.levelIcon}/>
        </View>
        <Text style={styles.levelScore}>{item.score}</Text>
      </View>
    )
  }
  _onEndReached = () => {
    const {levelList, rankTotalSize} = this.state;
    if(levelList.length >= 50 || levelList.length === rankTotalSize) {
      return
    }
    this._getLevelRankList()
  }
  _renderFooter = () => {
    const {levelList} = this.state
    if(levelList.length >= 50) {
      return (
        <View style={styles.footerBox}>
          <View style={styles.footerLine}/>
          <Text style={styles.footerText}>仅显示50名用户</Text>
          <View style={styles.footerLine}/>
        </View>
      )
    }
    return <View style={styles.footerBox}/>
  }
  _renderLeaderList = () => {
    const {levelList} = this.state
    if(levelList.length) {
      return (
        <View style={{flex: 1}}>
          <QYNewList
            style={{flex: 1}}
            dataList={levelList}
            cellHeight={60}
            renderRow={this._renderRow}
            onEndReached={this._onEndReached}
            onEndReachedThreshold={10}
            showsVerticalScrollIndicator={false}
            renderHeader={this._renderNoticeTitle}
            renderFooter={this._renderFooter}
            onScroll={this.scrollBeginEvent}
          />
        </View>
      )
    }
  }
  _renderMyLevelInfo = () => {
    const {todayScore, totalScore, level, dayRank, opacity, height, isLogin} = this.state
    if(isLogin) {
      return (
        <Animated.View style={[{opacity, height}, styles.userInfoBox]}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.greyText}>{todayScore}</Text>
            <Text style={{fontSize: 12, color: '#333333', marginTop: 5}}>今日经验值</Text>
            <Text style={{fontSize: 12, color: '#999999', marginTop: 5}}>{dayRank === null ? '暂未上榜' : `第${dayRank}名`}</Text>
          </View>
          <View style={{width: 60, height: 80, alignItems: 'center'}}>
            <Image source={{uri: this.state.userIcon}} style={{width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#FFD1C7', marginTop: 10}}/>
            <View style={{width: 60, position: 'absolute', bottom: 10, alignItems: 'center', height: 17}}>
              <WebImage name={`LV${level}`} style={{width: 46, height: 17}}/>
            </View>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.greyText}>{totalScore}</Text>
            <Text style={{fontSize: 12, color: '#333333', marginTop: 5}}>累计经验值</Text>
            <Text style={{fontSize: 12, color: '#999999', marginTop: 5}}/>
          </View>
        </Animated.View>
      )
    }
    return (
      <Animated.View style={[{opacity, height}, styles.userInfoBox]}>
        <View style={{width: DEVICE_WIDTH, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 12, color: '#333333'}}>登录后了解更多哦</Text>
          <TouchableOpacity activeOpacity={1} onPress={goToLogin} style={styles.unloginBtn}>
            <Text style={{color: '#FFFFFF', fontSize: 14, textAlign: 'center'}}>立即登录</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }
  changeOpacity = (state) => {
    if(state) {
      Animated.parallel([
        Animated.timing(
          this.state.opacity,
          {
            toValue: 1,
            duration: 50,
          }
        ),
        Animated.timing(
          this.state.height,
          {
            toValue: 80,
            easing: Easing.spring,
            duration: 50,
          }
        )
      ])
        .start()
    } else {
      Animated.parallel([
        Animated.timing(
          this.state.opacity,
          {
            toValue: 0,
            duration: 50,
          }
        ),
        Animated.timing(
          this.state.height,
          {
            toValue: 0,
            easing: Easing.linear,
            duration: 50,
          }
        )
      ])
        .start()
    }
  }
  timer = null
  scrollBeginEvent = () => {
    this.timer && this.changeOpacity(false)
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.changeOpacity(true)
    }, 300)
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#FFFFFF"
          barStyle={this.state.statusBar || 'dark-content'}
        />
        <NavBar
          title="乐园排行榜"
          type="black"
          titleColor="#333333"
          backgroundColor="#FFFFFF"
          backPress={this.back}
        />
        <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
          {/* {this._renderTitleBar()} */}
          {this._renderLeaderList()}
          {this._renderMyLevelInfo()}
          {this._renderLeaderTule()}
          {this._renderLoading()}
          {this._renderOffLine()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  unLinkBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80
  },
  unlinkPic: {
    width: 164,
    height: 120,
  },
  titleBox: {
    width: DEVICE_WIDTH,
    height: 50,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E3E3E3'
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selected: {
    width: 12,
    height: 3,
    backgroundColor: '#FF7E00',
    position: 'absolute',
    bottom: 5
  },
  howToGetVipBox: {
    width: 277,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  noticeText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 15
  },
  instructionBoxBtn: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 14
  },
  levelItemBox: {
    width: DEVICE_WIDTH,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  levelNum: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 35,
    textAlign: 'center'
  },
  userIconBox: {
    width: 47,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  circleIcon: {
    width: 47,
    height: 53,
    position: 'absolute',
    top: 0
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  userNameBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  userNameText: {
    color: '#333333',
    fontSize: 14,
    maxWidth: 170
  },
  levelIcon: {
    width: 46,
    height: 17,
    marginLeft: 5
  },
  levelScore: {
    fontSize: 14,
    color: '#333333',
    marginRight: 15
  },
  footerBox: {
    height: 35,
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerLine: {
    width: 35,
    height: 1,
    backgroundColor: '#E6E6E6'
  },
  footerText: {
    color: '#666666',
    fontSize: 10,
    marginHorizontal: 5
  },
  tipText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 45
  },
  userInfoBox: {
    width: DEVICE_WIDTH,
    backgroundColor: '#FFF4F2',
    borderTopWidth: 1,
    borderTopColor: '#FFD1C7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  greyText: {
    fontSize: 16,
    color: '#333333'
  },
  unloginBtn: {
    width: 80,
    height: 30,
    backgroundColor: '#FF7E00',
    justifyContent: 'center',
    borderRadius: 30,
    marginTop: 10
  }
})
