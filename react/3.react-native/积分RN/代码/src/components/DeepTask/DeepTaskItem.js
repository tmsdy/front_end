/**
 * Created by kerwinliu on 2018/9/13.
 */
/*
 * 深度任务子项
 * */
import React, {Component} from 'react'
import {
  View,
  Text,
  Image
} from '@iqiyi/rn-ui'
import {
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import WebImage from '../WebImage'
import PageTurn from './PageTurn'
import GradientView from '../GradientView'
import GradientBtn from '../GradientBtn'
import {isCompleted, isDone} from '../TaskItem'
import {
  getReward,
  getVipRewards
} from '../../api'
import {
  formatExts
} from '../../common/util'
import {showToast} from '../../common/QYNativeBridge'
import {changeTotalScore} from '../../actions/TotalScoreActions'
import {sendClickPingback} from '../../common/pingback'
import {TOUCH_LIGHT_MASK} from '../../constants/touchableStyle';

const VIP_TASK_MAP = {
  vip_sixcharge: '8a2186bb5f7bedd4',
  vip_wechatmp: '843376c6b3e2bf00',
  vip_autocharge: 'acf8adbb5870eb29',
  vip_memberclub: 'b6e688905d4e7184',
}

const getFilterState = (data) => {
  const task = data
  const exts = task.exts && task.exts.length ? task.exts : []
  const {tomorrowTask} = task
  const extMap = formatExts(exts)
  const isGift = !!extMap.gift
  return {
    task,
    button: task.button,
    icon: task.icon,
    notes: isGift && tomorrowTask ? extMap.notes_gift : extMap.notes, // 规则
    isGift: isGift && tomorrowTask, // 礼包和明日任务绑定在一起
    extMap,
  }
}


@connect(null, dispatch => bindActionCreators({changeTotalScore}, dispatch), null, {withRef: true})

export default class extends Component {
  static defaultProps = {
    onTurnPage: () => null
  }
  // 处理item数据
  static getDerivedStateFromProps(nextProps) {
    const originData = nextProps.data[0]
    const taskData = getFilterState(originData)
    // console.log(taskData)
    return {
      taskData
    }
  }
  constructor(props) {
    super(props)
    const originData = this.props.data[0]
    this.state = {
      originData, // 只返回一条信息，默认取第一条任务
      taskData: getFilterState(originData),
      type: 0, // 背面展示  0 介绍 1 领取成功
    }
  }
  render() {
    return (
      <View style={[styles.container, styles.outer]}>
        <PageTurn
          ref={(pagetrunref) => { this.pagetrunref = pagetrunref }}
          renderFront={this._renderFront}
          renderBehind={this._renderBehind}
          size={{
            width: CONTAINER_WIDTH,
            height: CONTAINER_HEIGHT
          }}
        />
      </View>
    )
  }

  // 任务信息
  _renderFront = () => {
    const {icon, task, notes, button, isGift} = this.state.taskData
    return (
      <View style={[styles.taskinner, {backgroundColor: '#FFF9F2'}]} >
        <Image
          source={{uri: icon}}
          style={{
            marginTop: 18,
            width: 40,
            height: 40
          }}
        />
        <Text style={styles.task_title} numberOfLines={1}>{task.channelName}</Text>
        <CustomButton {...this.props} task={task} getRewardFn={this.getReward} button={button}/>
        {(isGift || !!notes) && (
          <TouchableWithoutFeedback onPress={this.showNote}>
            {this._renderIcon(isGift, task.tomorrowTask)}
          </TouchableWithoutFeedback>
        )}
      </View>
    )
  }

  // 背面
  _renderBehind = () => {
    const {type} = this.state
    return (
      <GradientView style={[styles.taskinner, {paddingTop: 0}]} startColor="#FF8978" endColor="#FF7282">
        {type === 0 ? this._renderNote() : this._renderSuccess()}
      </GradientView>
      // <WebImage style={[styles.taskinner, {paddingTop: 0}]} name='995_card_bg_behind'>
      //   {0 === type ? this._renderNote() : this._renderSuccess()}
      // </WebImage>
    )
  }

  _renderIcon = (isGift = false, tomorrowTask = false) => {
    if(isGift && tomorrowTask) {
      return (
        <View style={styles.giftWrapper}>
          <WebImage name="deeptask-gift-front" style={styles.giftIcon}/>
        </View>
      )
    }
    return (
      <View style={styles.wenhao}>
        <WebImage name="ic_wenhao_995" style={styles.questionIcon}/>
      </View>
    )
  }

  _renderNoteButton = (isGift) => {
    if(isGift) {
      return (
        <TouchableHighlight {...TOUCH_LIGHT_MASK} style={styles.backButtonTouch} onPress={() => this._goToGoodsDetail()}>
          <View style={styles.backButtonWrapper}>
            <WebImage style={styles.backButtonIcon} name="912_ic_gift"/>
            <Text style={styles.backButtonText}>去兑换</Text>
          </View>
        </TouchableHighlight>
      )
    }
    return null
  }

  // 背面介绍
  _renderNote = () => {
    const {notes, isGift} = this.state.taskData
    const defaultNoteHeight = CONTAINER_HEIGHT - TITLE_HEIGHT
    const giftNoteHeight = CONTAINER_HEIGHT - TITLE_HEIGHT - BOTTOM_HEIGHT
    return (
      <React.Fragment>
        <TouchableWithoutFeedback onPress={() => this.turnPage({toShowBehind: false})}>
          <View>
            <View style={styles.backTitle}>
              <Text style={styles.backTitleText}>规则</Text>
              <WebImage style={styles.backCloseIcon} name="deeptask-close"/>
            </View>
            <View style={[styles.note, {height: isGift ? giftNoteHeight : defaultNoteHeight}]}>
              <Text style={styles.notestext} numberOfLines={isGift ? 3 : 4}>{notes}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {this._renderNoteButton(isGift)}
      </React.Fragment>
    )
  }
  // 领取成功
  _renderSuccess = () => {
    const {task} = this.state.taskData
    return (
      <React.Fragment>
        <WebImage
          name="995_score_success"
          style={{
            width: CONTAINER_WIDTH,
            height: CONTAINER_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={styles.taskscore}>{task.score}</Text>
        </WebImage>
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            position: 'absolute',
            bottom: 16
          }}
        >领取成功
        </Text>
      </React.Fragment>
    )
  }

  // 翻页
  turnPage = ({cb} = {}) => {
    this.pagetrunref && this.pagetrunref.start(cb)
    // this.props.onTurnPage({toShowBehind})
  }
  // 获取最新的任务列表
  getNextTask = () => {
    const {getList} = this.props
    getList && getList()
  }

  // 获取奖励
  getReward = (task) => {
    const {
      from,
      getData
    } = this.props
    const {channelCode, score} = task

    if(channelCode && VIP_TASK_MAP[channelCode]) {
      getVipRewards({taskCode: VIP_TASK_MAP[channelCode]})
        .catch(err => showToast(err.message))
    }

    getReward({channelCode})
      .then(() => {
        this.showNext()
        if(from === 'home') {
          this.props.changeTotalScore(score)
        } else {
          setTimeout(() => {
            getData && getData()
          }, 700)
        }
      })
      .catch(() => showToast('系统繁忙，请稍后再试'))
  }

  // 展示下一条任务
  showNext = () => {
    this.setState({type: 1}, () => {
      this.turnPage({
        cb: () => {
          // 一秒内接口没返回，说明接口性能有问题
          // this.getNextTask()
          setTimeout(() => {
            // this._getNext()
            // 直接翻页，然后刷新列表数据
            this.turnPage()
            this.getNextTask()
          }, 1000)
        }
      })
    })
  }

  // 积分领取成功后展示下一条数据并且翻转动画
  _getNext = () => {
    const data = getFilterState(this.state.originData)
    this.turnPage()
    setTimeout(() => {
      this.setState({
        taskData: data
      })
    }, 500)
  }

  // 去兑换
  _goToGoodsDetail() {
    const {extMap} = this.state.taskData
    this.props.goTo('GoodsDetail', {
      name: '',
      itemId: extMap.gift,
      type: 'exchangeList',
    })
  }
  // 展示介绍
  showNote = () => {
    this.setState({type: 0}, () => this.turnPage({toShowBehind: true}))
  }
}

// 按钮文字
class CustomButton extends Component {

  render() {
    const {
      task,
      getRewardFn
    } = this.props
    if(task.tomorrowTask) {
      return (
        <View style={styles.getscore}>
          <Text style={[styles.task_desc, {color: '#999999'}]} numberOfLines={1}>
            积分值+{task.score} 明日再来
          </Text>
        </View>
      )
    }
    if(isCompleted(task)) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.taskPingback()
            getRewardFn(task)
          }}
          activeOpacity={1}
          style={styles.getscorebutton}
        >
          <GradientView style={styles.button} startColor="#FF7E00" endColor="#FFA400">
            <Text style={{
              color: '#fff',
              fontSize: 12
            }}
            >
            领取{task.score}积分
            </Text>
          </GradientView>
        </TouchableOpacity>
      )
    }
    if(isDone(task)) {
      return (
        <View style={styles.getscore}>
          <Text style={[styles.task_desc, {color: '#999999'}]} numberOfLines={1}>明日再来，积分值+{task.score}</Text>
        </View>
      )
    }
    return (
      <GradientBtn
        startColor="#FF7E00"
        endColor="#FFA400"
        btnStyle={{height: 22, borderRadius: 11, paddingHorizontal: 14}}
        wrapStyle={{marginTop: 5}}
        press={this.onHandleClick}
      >
        <Text style={{color: '#ffffff', fontSize: 12}} numberOfLines={1}>积分值+{task.score}</Text>
      </GradientBtn>
    )
  }

  taskPingback = () => {
    const {task} = this.props
    const {channelCode} = task
    let reseat = ''
    switch (channelCode) {
      case 'downddz':
        reseat = 'ddz_1';
        break
      case 'playcard':
        reseat = 'ddz_2';
        break
      case 'playcard_ios':
        reseat = 'ddz_2';
        break
      case 'fulisai':
        reseat = 'ddz_3';
        break
      case 'jdchang':
        reseat = 'ddz_4';
        break
      case 'cm_down':
        reseat = 'cm_1';
        break
      case 'cm_collect':
        reseat = 'cm_2';
        break
      case 'cm_sub':
        reseat = 'cm_3';
        break
      case 'cm_read10':
        reseat = 'cm_4';
        break
      case 'jq_visist':
        reseat = 'jq_1';
        break
      case 'jq_detail':
        reseat = 'jq_2';
        break
      case 'card_visit':
        reseat = 'card_1';
        break
      case 'card_rcmend':
        reseat = 'card_2';
        break
      case 'card_filter':
        reseat = 'card_3';
        break
      case 'card_test':
        reseat = 'card_4';
        break
      case 'mj_down':
        reseat = 'mj_1';
        break
      case 'mj_blood':
        reseat = 'mj_2';
        break
      case 'mj_play':
        reseat = 'mj_3';
        break
      default:
    }
    sendClickPingback('homeRN', 200400, reseat);
  }

  onHandleClick = () => {
    this.taskPingback()
    // if (!this.state.isLogin) {
    //   return goToLogin()
    // }
    this.props.handleTaskClick(this.props.task)
  }
}

// 即将开始的文案
export class Future extends Component {
  render() {
    return (
      <View style={[styles.container, styles.outer]}>
        <View style={[styles.taskinner, {backgroundColor: '#FFF9F2'}]}>
          <WebImage
            name="995_icon_coming"
            style={{
              width: 36.5,
              height: 34.5,
              marginBottom: 5.5
            }}
          />
          <Text style={styles.task_title} numberOfLines={1}>敬请期待</Text>
          <Text style={styles.future} numberOfLines={1}>
            建设中
          </Text>
        </View>
      </View>
    )
  }
}

const CONTAINER_WIDTH = 140
const CONTAINER_HEIGHT = 140
const TITLE_HEIGHT = 30
const BUTTON_HEIGHT = 25
const BUTTON_BOTTOM = 15
const BOTTOM_HEIGHT = BUTTON_HEIGHT + BUTTON_BOTTOM

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    justifyContent: 'center',
  },
  outer: {
    marginHorizontal: 4
  },
  getscorebutton: {
    position: 'absolute',
    bottom: 15,
  },
  taskinner: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    alignItems: 'center',
    borderRadius: 4
  },
  task_title: {
    marginTop: 10,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333'
  },
  task_desc: {
    fontSize: 12,
    color: '#FF5900'
  },
  giftWrapper: {
    position: 'absolute',
    top: 0,
    right: 4,
    width: 35,
    height: 35,
  },
  giftIcon: {
    width: 35,
    height: 35,
  },
  wenhao: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  questionIcon: {
    width: 15,
    height: 15,
  },
  note: {
    width: CONTAINER_WIDTH,
    paddingHorizontal: 12,
  },
  notestext: {
    fontSize: 14,
    color: '#FFF7F7',
    lineHeight: 20,
  },
  taskscore: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 25,
    color: '#fff',
    position: 'absolute',
    top: 40.5
  },
  button: {
    width: 80,
    height: 25,
    borderRadius: 24
  },
  getscore: {
    flexDirection: 'row',
    height: 19,
    alignItems: 'center',
    marginTop: 5,
  },
  future: {
    color: '#999999',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5
  },
  backTitle: {
    position: 'relative',
    width: CONTAINER_WIDTH,
  },
  backTitleText: {
    height: TITLE_HEIGHT,
    lineHeight: TITLE_HEIGHT,
    textAlign: 'center',
    fontSize: 15,
    color: '#ffffff',
  },
  backCloseIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 30,
    width: 30,
    backgroundColor: 'transparent',
  },
  backButtonTouch: {
    position: 'absolute',
    bottom: BUTTON_BOTTOM,
    left: 32.5,
    width: 75,
  },
  backButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 22,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 11,
  },
  backButtonIcon: {
    width: 12,
    height: 12,
    marginRight: 2
  },
  backButtonText: {
    color: '#FF6600',
    fontSize: 12,
    textAlign: 'center',
  },
})
