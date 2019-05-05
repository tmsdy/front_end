/**
 * 任务列表页面
 */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import {DeviceEventEmitter, ScrollView, StyleSheet} from 'react-native'
import {ActivityIndicator, Image, Text, View} from '@iqiyi/rn-ui'
import {Height as height, isIOS, Width as width} from '@iqiyi/rn-utils'
import {isCompleted, isDone, TaskItem} from '../components/TaskItem'
import NavBar from '../components/DefaultNavBar'
import QRBox from '../components/QRBox'
import {executeTask, getReward, getUserInfo, getVipRewards} from '../api'
import {blockDownload, filterCorrectTaskList, filterNotes, goToLogin} from '../common/util'
import {hideLoading, showToast} from '../common/QYNativeBridge'
import {sendPagePingback, sendClickPingback} from '../common/pingback'
import {HomePageRuleModal, HomePageRuleSignModal} from '../components/MedalModalBox'
import Sign from '../components/home/Sign'
import DeepTaskList from '../components/DeepTask/DeepTaskList'
import {handleTaskItemClick} from '../common/handleTaskClick'
import ScoreCountdown, {SCORE_COUNTDOWN_RULE_TASK} from '../components/TaskList/ScoreCountdown'
import BasePage from '../components/BasePage';


const VIP_TASK_MAP = {
  vip_sixcharge: '8a2186bb5f7bedd4',
  vip_wechatmp: '843376c6b3e2bf00',
  vip_autocharge: 'acf8adbb5870eb29',
  vip_memberclub: 'b6e688905d4e7184',
}


function filterBlockData(data) {
  const completed = data.filter(t => isCompleted(t) && !isDone(t))
  const todo = data.filter(t => !isCompleted(t) && !isDone(t))
  const done = data.filter(t => isDone(t))

  return [...completed, ...todo, ...done]
}

function getSortedTask(data) {
  return filterBlockData(blockDownload(data))
}

@connect(({scoreInfo}) => ({totalScore: scoreInfo.totalScore}), null)
export default class TaskList extends BasePage {


  static propTypes = {
    uniqueID: PropTypes.string,
  }

  pageName = 'tasklist'

  constructor(props) {
    super(props)
    this.state = {
      isLogin: global.USER_INFO.isLogin, // 用户登录状态
      userIcon: global.USER_INFO.userIcon,
      isVIP: global.USER_INFO.isVIP,
      totalScore: props.totalScore, // 用户总积分
      loading: true, // 页面初始化状态
      loadFail: false,
      undailyTasks: [], // 每日任务 未登录
      unchallengeTasks: [], // 挑战任务 未登录
      dailyTasks: [], // 每日任务
      challengeTasks: [], // 挑战任务
      homePageRuleVisble: false,
      ruleTask: {},
      loadingModalVisible: false,
      completedTasks: [],
      expireTime: 0,
      showDoubleCard: false,
    }
    this.onRequesting = false
  }

  componentDidMount() {
    sendPagePingback(this.pageName, {score: this.props.totalScore})
    this._getData()
    this.listenLogin()
    global.from = (this.props.navigation.state.params && this.props.navigation.state.params.from) || global.from
  }

  componentWillUnmount() {
    this.listener.remove() // 解除绑定的事件
  }

  render() {
    const {isLogin} = this.state
    return (
      <View style={styles.container}>
        <NavBar
          title="任务列表"
          type="black"
          titleColor="#333333"
          backgroundColor="#ffffff"
          backPress={this.back}
        />
        <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{width}}>
              {isLogin
                ? <DeepTaskList handleTaskClick={this.handleTaskClick} getData={this._getData} goTo={this.goTo}/>
                : <DeepTaskList handleTaskClick={this.unLoginHandleTaskClick} goTo={this.goTo}/>
              }
              <View>
                {this._renderDaily()}
                {this._renderChallenges()}
              </View>
            </View>
          </ScrollView>
          {this._renderRuleModal()}
          {this._renderSignBox()}
          {this._renderLoading()}
          {this._renderOffLine()}
          {this._renderQRBox()}
        </View>
      </View>
    )
  }

  onShow() {
    this._getData()
  }

  onHide() { // 回到native  修改statusbar颜色为白色。
    // StatusBar.setBarStyle('light-content', true);
  }

  listenLogin = () => {
    const _this = this
    this.listener = DeviceEventEmitter.addListener('loginChange', (isLogin) => {
      _this.setState({
        isLogin,
        userIcon: global.USER_INFO.userIcon,
        isVIP: global.USER_INFO.isVIP
      }, () => {
        _this._getData()
      })
    })
  }

  _getData = () => {
    if(this.onRequesting) return false
    this.onRequesting = true
    const taskParams = {
      typeCode: 'point'
    }
    Promise.all([
      this._getUserInfo(),
      this._getTasks(taskParams)
    ])
      .then(() => {
        hideLoading()
      })
      .catch(() => {
        this.onRequesting = false
      })
      .finally(() => {
        this.setState({loading: false})
        hideLoading()
        this.onRequesting = false
      })
  }

  _getTasks = () => {
    const {isLogin} = this.state
    const requestHeader = {
      task_code: 'task_center_list',
      timestamp: Date.now()
    }
    const requestBody = {
      growth_task_list: {
        agentversion: global.CLIENT_INFO.appVersion,
        appver: global.CLIENT_INFO.appVersion,
        srcplatform: isIOS ? '20' : '21',
        agenttype: isIOS ? '20' : '21',
        verticalCode: 'iQIYI',
        typeCode: 'point',
        need_ext: true,
        channelGroup: '20,21'
      },
      daoju_double_card: {
        vertical_code: 'iQIYI'
      }
    }
    if(isLogin) {
      requestBody.growth_task_list.userId = global.USER_INFO.userId
      requestBody.daoju_double_card.user_id = global.USER_INFO.userId
    } else {
      requestBody.growth_task_list.qyid = global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId
      requestBody.daoju_double_card.qyid = global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId
    }
    return executeTask(requestHeader, requestBody)
      .then((data) => {
        const tasks = data.taskList[0];
        const dailyTasks = filterCorrectTaskList(tasks).filter(t => t.channelGroup === 20)
        const challengeTasks = blockDownload(filterCorrectTaskList(tasks).filter(t => t.channelGroup === 21))
        this.setState({
          dailyTasks: getSortedTask(dailyTasks),
          challengeTasks,
          showDoubleCard: data.hasDoubleCard,
          expireTime: data.expireTime,
          undailyTasks: dailyTasks,
        })
        // 回调刷新首页，TODO 方式需优化
        if(this.firstGetData) {
          try {
            const {refreshDailyTask} = this.props.navigation.state && this.props.navigation.state.params;
            refreshDailyTask && refreshDailyTask(data)
          } catch(e) {
            return false;
          }
        } else {
          this.firstGetData = true
        }
      })
      .catch(() => {
        this.setState({loadFail: true})
      })
  }
  _getUserInfo = () => {
    if(!this.state.isLogin) {
      return
    }
    const params = {
      typeCode: 'paradise,point',
      needExpire: 1
    }
    return getUserInfo(params)
      .then((data) => {
        const {totalScore} = data[1]
        this.setState({totalScore})
      })
      .catch(err => Promise.reject(err))
  }

  touchRuleBtnClick = (task) => {
    this.setState({
      homePageRuleVisble: true,
      ruleTask: task
    })
  }

  unLoginHandleTaskClick = () => {
    goToLogin()
  }
  // 领取奖励
  _getTaskReward = ({channelCode}) => {
    this.setState({
      loadingModalVisible: true
    })
    let temp = channelCode
    if(!channelCode) {
      const {completedTasks} = this.state
      temp = completedTasks.map(t => t.channelCode).join(',')
    }

    const params = {
      channelCode: temp
    }

    if(channelCode && VIP_TASK_MAP[channelCode]) {
      getVipRewards({taskCode: VIP_TASK_MAP[channelCode]}).catch((err) => {
        showToast(err.message)
      })
    }

    getReward(params)
      .then(() => {
        this.setState({loadingModalVisible: false})
        this._getData()
        if(channelCode) {
          showToast('领取奖励成功~')
        } else {
          showToast('一键领取成功~')
        }
      })
      .catch(() => {
        this.setState({loadingModalVisible: false})
        showToast('系统繁忙，请稍后再试')
      })
  }

  handleTaskClick = (task) => {
    handleTaskItemClick(task, this.state.isLogin, this.openWeb, this.props.screenProps.uniqueID, {rpage: 'tasklist', popCallBack: this.showQRBox})
  }

  _renderDaily = () => {
    const {dailyTasks, undailyTasks, isLogin, showDoubleCard, expireTime} = this.state
    if(!isLogin) {
      return (
        !!undailyTasks.length &&
        <View style={styles.taskContainer}>
          <Text style={styles.subtitle}>每日任务</Text>
          {undailyTasks.map(task => (
            <TaskItem
              key={task.channelCode}
              task={task}
              touchClick={() => this.touchRuleBtnClick(task)}
              handleClick={() => this.unLoginHandleTaskClick(task)}
            />
          ))}
        </View>
      )
    }
    return (
      !!dailyTasks.length &&
      <View style={styles.taskContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={styles.subtitle}>每日任务</Text>
          {!!showDoubleCard && <ScoreCountdown time={expireTime} onPress={this._showDoubleRuleModal}/>}
        </View>
        {this.state.dailyTasks.map(task => (
          <TaskItem
            key={task.channelCode}
            task={task}
            touchClick={() => this.touchRuleBtnClick(task)}
            handleClick={() => this.handleTaskClick(task)}
            getData={this._getData}
            showDoubleCard={this.state.showDoubleCard}
          />
        ))}
      </View>
    )
  }

  _hideRuleModal = () => {
    this.setState({homePageRuleVisble: false})
  }

  _renderRuleModal = () => {
    if(!this.state.homePageRuleVisble) return
    if(filterNotes(this.state.ruleTask) !== '1' && filterNotes(this.state.ruleTask) !== 1) {
      return (
        <HomePageRuleModal
          homePageRuleVisble={this.state.homePageRuleVisble}
          _hideRuleModal={this._hideRuleModal}
          ruleTask={this.state.ruleTask}
        />
      )
    }
    // 签到弹窗特殊处理
    return <HomePageRuleSignModal homePageRuleVisble={this.state.homePageRuleVisble} _hideRuleModal={this._hideRuleModal}/>
  }

  _renderChallenges = () => {
    const {challengeTasks, isVIP, isLogin, showDoubleCard} = this.state
    const temp = challengeTasks.filter(t => !isDone(t))
    if(isLogin) {
      return (
        !!temp.length && (
          <View style={styles.taskContainer}>
            <Text style={styles.subtitle}>挑战任务</Text>
            {
              temp.map((task) => {
                const isvip = task.exts.filter(e => e.name === 'isvip')[0]
                if(isvip) {
                  if(isVIP && isvip.value === '1') {
                    return (<TaskItem
                      key={task.channelCode}
                      task={task}
                      viplabel={true}
                      showDoubleCard={showDoubleCard}
                      touchClick={() => this.touchRuleBtnClick(task)}
                      handleClick={() => this.handleTaskClick(task)}
                      getData={this._getData}
                    />)
                  } else if(!isVIP && isvip.value === '0') {
                    return (
                      <TaskItem
                        key={task.channelCode}
                        task={task}
                        handleClick={() => this.handleTaskClick(task)}
                        showDoubleCard={showDoubleCard}
                        touchClick={() => this.touchRuleBtnClick(task)}
                        getData={this._getData}
                      />
                    )
                  } else if(isVIP && isvip.value === '0' && isCompleted(task)) {
                    return (
                      <TaskItem
                        key={task.channelCode}
                        task={task}
                        handleClick={() => this.handleTaskClick(task)}
                        showDoubleCard={showDoubleCard}
                        touchClick={() => this.touchRuleBtnClick(task)}
                        getData={this._getData}
                      />
                    )
                  }
                  return null
                }
                return (
                  <TaskItem
                    key={task.channelCode}
                    task={task}
                    showDoubleCard={showDoubleCard}
                    handleClick={() => this.handleTaskClick(task)}
                    touchClick={() => this.touchRuleBtnClick(task)}
                    getData={this._getData}
                  />
                )
              })
            }
          </View>
        ))
    }
    return (
      !!temp.length && (
        <View style={styles.taskContainer}>
          <Text style={styles.subtitle}>挑战任务</Text>
          {temp.map((task) => {
              return (
                <TaskItem
                  key={task.channelCode}
                  task={task}
                  handleClick={() => this.unLoginHandleTaskClick(task)}
                  touchClick={() => this.touchRuleBtnClick(task)}
                  getData={this._getData}
                />
              )
            })}
        </View>
      ))
  }

  _renderSignBox = () => {
    const {dailyTasks, isLogin} = this.state
    const task = dailyTasks.filter(fv => fv.channelCode === 'Sign')
    if(task && task[0]) {
      return (
        <Sign
          signData={{...task[0], isSigned: true}}
          isLogin={isLogin}
          signCb={this._getData}
          showRuleSignModal={() => this.touchRuleBtnClick(task[0])}
        />
      )
    }
    return null
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
          <Text style={styles.tipText}>服务器忙，请稍候再试...</Text>
        </View>
      )
    }
    return null
  }

  _renderQRBox = () => {
    return <QRBox ref={(qrBoxRef) => { this.qrBoxRef = qrBoxRef }}/>
  }
  // 展示二维码弹框
  showQRBox = () => {
    this.qrBoxRef && this.qrBoxRef.showQRBox()
  }

  _showDoubleRuleModal = () => {
    sendClickPingback('tasklist', '', 'double_ex')
    this.touchRuleBtnClick(SCORE_COUNTDOWN_RULE_TASK)
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBox: {
    width,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  taskContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    lineHeight: 30
  },
  unLinkBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width,
    height,
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
  tipText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 45
  },
  dailytaskTitle: {
    width: 151.5,
    height: 29,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -12,
    flexDirection: 'row',
  },
})
